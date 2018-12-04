const express = require("express");
const app = express();
const compression = require("compression");
const bodyParser = require("body-parser");
const { hash, compare } = require("./bcrypt");
const db = require("./db");
var cookieSession = require("cookie-session");

//////////////////////////////////////////////////
app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "DENY");
    next();
});
//////////////////////////////////////////////////

//// do not touch!
var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");
const s3 = require("./s3");
const config = require("./config.json");

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 4097152
    }
});

///=======do not touch

app.use(compression());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.use(require("cookie-parser")());

app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

app.use(express.static("./public"));

//
//

app.post("/bio", function(req, res) {
    // var cUrl = config.s3Url + req.file.filename;
    // console.log("cUrl:", cUrl);
    console.log("conslo log body: ", req.body);
    db.updateBio(req.session.userId, req.body.bio)
        .then(results => {
            console.log("Results from server: ", results);
            res.json(results);
        })
        .catch(err => {
            console.log("ERROR in post /bio:", err);
            res.json({
                success: false
            });
        });
});

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    if (req.file) {
        var cUrl = config.s3Url + req.file.filename;
        console.log("cUrl:", cUrl);
        db.addImages(req.session.userId, cUrl)
            .then(results => {
                res.json(results);
            })
            .catch(err => {
                console.log("error in post /upload:", err);
            });
    } else {
        res.json({
            success: false
        });
    }
});

app.get("/user", (req, res) => {
    console.log("get request in user");
    db.getUserData(req.session.userId).then(results => {
        res.json(results.rows[0]);
    });
});

app.get("/welcome", function(req, res) {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/registration", (req, res) => {
    console.log("req body in SERVER /registration: ", req.body);
    const { first, last, email, password } = req.body;
    hash(password)
        .then(hash => {
            return db.createUser(first, last, email, hash);
        })
        .then(results => {
            req.session.userId = results.rows[0].id;
            req.session.first = results.rows[0].first;
            req.session.last = results.rows[0].last;
            req.session.email = results.rows[0].email;
            res.json({ success: true }); //res.json(result);
        })
        .catch(err => {
            console.log("Error in POST /registration: ", err);
            res.json({ success: false });
        });
});

app.post("/login", (req, res) => {
    db.getUser(req.body.email)
        .then(result => {
            compare(req.body.password, result.rows[0].password)
                .then(doesMatch => {
                    if (doesMatch === true) {
                        req.session.userId = result.rows[0].userId;
                        res.json({ success: true });
                    } else {
                        console.log("Wrong password, please try again");
                        res.json({ success: false });
                        // alert("Wrong password, please try again");
                    }
                })
                .catch(err => {
                    res.json({ success: false });
                    console.log("error in password: ", err);
                });
        })
        .catch(err => {
            res.json({ success: false });
            console.log("error in email: ", err);
        });
});
app.get("/user/:id/info", function(req, res) {
    // console.log("user/id/json: ", req.pareams);
    db.otherPersonProfiles(req.params.id)
        .then(data => res.json({ userId: req.session.userId, data: data }))
        .catch(err => {
            res.json(err);
        });
    console.log("my data log: ", req);
});

app.get("/logout", function(req, res) {
    req.session = null;
    res.redirect("/login");
});

app.get("*", function(req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.listen(8080, function() {
    console.log("I'm listening.");
});
