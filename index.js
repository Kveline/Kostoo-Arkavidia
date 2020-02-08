const express = require("express");
const path = require("path");
const router = require("./router/router");
const session = require("express-session");
const upload = require("express-fileupload");

const User = require("./core/user");
const user = new User();    

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));

app.use(upload());

app.use(session({
    secret: "This is a secret message",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 30 * 24
    }
}));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", router);

app.listen(3000, () => {
    console.log("success");
});