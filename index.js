const express = require("express");
const app = express();
const compression = require("compression");
const bodyParser = require("body-parser");
const { hash, compare } = require("./bcrypt");
const db = require("./db");
var cookieSession = require("cookie-session");

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

app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

app.use(express.static("./public"));

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
            res.json({ success: true });
        })
        .catch(err => {
            console.log("Error in POST /registration: ", err);
            res.json({ success: false });
        });
});

app.get("*", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.listen(8080, function() {
    console.log("I'm listening.");
});
