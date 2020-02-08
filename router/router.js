const express = require("express");
const validator = require("validator");
const User = require("../core/user");
const user = new User();
const randomstring = require("randomstring");
const path = require("path");

const router = express.Router();

router.get("/", (req, res, next) => {
    if (req.session.user) {
        res.render("home", { user: req.session.user });
    } else {
        res.render("home", { user: null });
    }
});

router.get("/login", (req, res, next) => {
    if (req.session.user) {
        res.redirect("/dashboard");
    } else {
        res.render("login");
    }
});

router.get("/register", (req, res, next) => {
    if (req.session.user) {
        res.redirect("/dashboard");
    } else {
        res.render("register");
    }
});

router.post("/loginDesa", (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;

    if (validator.isEmail(email)) {
        user.login(email, password, "desa", (result) => {
            if (result) {
                req.session.user = result;
                req.session.type = "desa";
                res.redirect("/dashboard");
            } else {
                res.redirect("/login");
            }
        });
    } else {
        res.redirect("login");
    }
});

router.post("/loginInvestor", (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;

    if (validator.isEmail(email)) {
        user.login(email, password, "investor", (result) => {
            if (result) {
                req.session.user = result;
                req.session.type = "investor";
                res.redirect("/dashboard");
            } else {
                res.redirect("/login")
            }
        });
    } else {
        res.redirect("login");
    }
});

router.get("/dashboard", (req, res, next) => {
    if (req.session.user) {
        if (req.session.type === "desa") {
            res.render("dashboardDesa", { user: req.session.user });
        } else {
            res.render("dashboardInvestor", { user: req.session.user });
        }
    } else {
        res.redirect("login");
    }
});

router.get("/search", (req, res, next) => {
    if (req.session.type == "desa") {
        res.redirect("/dashboard");
    } else {
        if (req.query.keyword) {
            user.getListDesaByKeyword(req.query.keyword, (result) => {
                res.render("jelajahTarget", {result: result, user: req.session.user});
            });
        } else {
            user.getListDesa((result) => {
                res.render("jelajahTarget", {result: result, user: req.session.user});
            });
        }
    }
});

router.get("/desa", (req, res, next) => {
    if(req.session.user){
        if(req.session.type === "desa"){
            res.redirect("/dashboard");
        }
        else{
            let id = req.query.id;
            user.findById(id, "desa", (result) => {
                if(result) {
                    res.render("aboutDesa", {user: req.session.user, result: result});
                }
                else{
                    res.redirect("/dashboard");
                }
            });
        }
    }
    else{
        res.redirect("/login");
    }
});

router.post("/registerDesa", (req, res, next) => {
    let photo = req.files.photo;
    let portofolio = req.files.portofolio;
    if (photo.mimetype.split("/")[1] == "jpeg" && portofolio.mimetype.split("/")[1] == "pdf") {
        if (validator.isEmail(req.body.email)) {
            let category = "";
            if (req.body.cat1) {
                category = category + "Pertanian" + " - ";
            }
            if (req.body.cat2) {
                category = category + "Peternakan" + " - ";
            }
            if (req.body.cat3) {
                category = category + "Kerajinan";
            }
            let photoPath = randomstring.generate(84);
            let portofolioPath = randomstring.generate(84);
            photo.mv(path.join(__dirname, "../public/user-uploads/img/" + photoPath + ".jpg"), (err) => {
                if (err) throw err;
                portofolio.mv(path.join(__dirname, "../public/user-uploads/pdf/" + portofolioPath + ".pdf"), (err) => {
                    if (err) throw err;
                    user.create(req.body.email, req.body.password, req.body.nama, req.body.location, photoPath + ".jpg", req.body.description, portofolioPath + ".pdf", category, "desa", (result) => {
                        if (result) {
                            user.find(req.body.email, "desa", (result) => {
                                req.session.user = result;
                                req.session.type = "desa";
                                res.redirect("/dashboard");
                            })
                        } else {
                            res.redirect("/register");
                        }
                    })
                });
            });
        } else {
            res.redirect("/register");
        }
    } else {
        res.redirect("/register");
    }
});

router.post("/registerInvestor", (req, res, next) => {
    let photo = req.files.photo;
    if (photo.mimetype.split("/")[1] == "jpeg") {
        if (validator.isEmail(req.body.email)) {
            let photoPath = randomstring.generate(84);
            photo.mv(path.join(__dirname, "../public/user-uploads/img/" + photoPath + ".jpg"), (err) => {
                user.create(req.body.email, req.body.password, req.body.nama, req.body.lokasi, req.body.photo, req.body.description, null, null, "investor", (result) => {
                    if (result) {
                        user.find(req.body.email, "investor", (result) => {
                            req.session.user = result;
                            req.session.type = "investor";
                            res.redirect("/dashboard");
                        })
                    } else {
                        res.redirect("/register");
                    }
                })
            });
        } else {
            res.redirect("/register");
        }
    } else {

    }
});

router.post("/ajukanProyek", (req, res, next) => {
    let dateStart = req.body.projectStart.split("/").reverse().join("-");
    let dateEnd = req.body.projectEnd.split("/").reverse().join("-");

    user.addProject(req.body.nama, req.body.description)
});

router.all("/logout", (req, res, next) => {
    if (req.session.user) {
        req.session.destroy();
        res.redirect("/login");
    } else {
        res.redirect("/");
    }
});

module.exports = router;