const express = require("express");
const app = express();

//part 8
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });
///

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

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(express.static("./public"));

//
//

app.post("/bio", function(req, res) {
    // var cUrl = config.s3Url + req.file.filename;
    // console.log("cUrl:", cUrl);
    // console.log("conslo log body: ", req.body);
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
        // console.log("cUrl:", cUrl);
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
    // console.log("get request in user");
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
    // console.log("req body in SERVER /registration: ", req.body);
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
    // console.log("my data log: ", req);
});

app.get("/friendship/:id", (req, res) => {
    // console.log("my data log from friend button: ", req.params.id);
    // console.log("my data log req.session: ", req.session.userId);
    db.friendButton(req.params.id, req.session.userId)
        .then(data => res.json(data))
        .catch(err => {
            res.json({ success: false });
            console.log("Error in GET /api/friend/id: ", err);
        });
});

app.post("/makefriend/:id", (req, res) => {
    db.makeFriends(req.params.id, req.session.userId)
        .then(data => res.json({ success: true }))
        .catch(err => {
            res.json({ success: false });
            console.log("Error in POST /makefriend/id: ", err);
        });
});

app.post("/cancelfriend/:id", (req, res) => {
    db.cancelFriend(req.params.id, req.session.userId)
        .then(() => res.json({ success: true }))
        .catch(err => {
            res.json({ success: false });
            console.log("Error in POST /cancelfriend/id: ", err);
        });
});

app.post("/acceptfriend/:id", (req, res) => {
    db.acceptFriend(req.session.userId, req.params.id)
        .then(() => res.json({ success: true }))
        .catch(err => {
            res.json({ success: false });
            console.log("Error in POST /acceptFriend/id: ", err);
        });
});

app.post("/rejectfriend/:id", (req, res) => {
    db.cancelFriend(req.session.userId, req.params.id)
        .then(() => res.json({ success: true }))
        .catch(err => {
            res.json({ success: false });
            console.log("Error in POST /rejectFriend/id: ", err);
        });
});

app.post("/deleteFriend/:id", (req, res) => {
    db.deleteFriend(req.session.userId, req.params.id)
        .then(() => res.json({ success: true }))
        .catch(err => {
            res.json({ success: false });
            console.log("Error in POST /deleteFriend/id: ", err);
        });
});

//part 7
app.get("/friendslist", (req, res) => {
    db.lists(req.session.userId)
        .then(data => {
            console.log("get lists from user ID is ", req.session.userId);
            res.json(data.rows);
        })
        .catch(err => {
            res.json({
                success: false
            });
            console.log("error indexjs in get / friendslist:", err);
        });
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

//replace app to server
//otherwise you will get CFRF errors
server.listen(8080, function() {
    console.log("I'm listening.");
});

//who is online?
let onlineUsers = {};
//Server socket code here ...
io.on("connection", socket => {
    // console.log(`User with socket id ${socket.id} just connected`);
    // console.log(socket.request.session.userId);
    let socketId = socket.id;
    let userId = socket.request.session.userId;

    onlineUsers[socketId] = userId;

    // console.log(onlineUsers);

    let arrOfIds = Object.values(onlineUsers);
    // console.log(arrOfIds);

    db.getUsersByIds(arrOfIds)
        .then(results => {
            // console.log("results: ", results);

            //person who just connected
            socket.emit("onlineUsers", results.rows);
            // console.log("socket emit results.rows, ", );
        })
        .catch(err => {
            console.log("err in getUsersByIds ", err);
        });

    if (arrOfIds.filter(id => id == userId).length == 1) {
        console.log("this is from DAVID id: ", userId);

        db.getJoinedId(userId).then(result => {
            socket.broadcast.emit("userJoined", result.rows[0]);

            console.log("Joined ID is: ", result.rows[0]);
        });
    }

    //for userJoined we need to infoirm everyone expecting
    //person who just connected
    //and we need to inform those otherPersonProfileple to let them know
    //there is new person

    socket.on("disconnect", function() {
        //this code heppenes whenever user disconnects
        delete onlineUsers[socket.id];
        io.sockets.emit("userLeft", userId);
        console.log(`socket user id ${socket.id} is disconnected`);
    });

    //pass emit 2 arguments
    //1 argument name os the msg we want to sendFile
    //2 argument is data we want to send along with msg
    //data can include: result from db query, result from API call, normal array, object ....

    // db.getUser(userId).then(results => {
    //     socket.emit("catnip", results);
    // });

    // socket.emit("catnip", "socket fun!!!!");
});
