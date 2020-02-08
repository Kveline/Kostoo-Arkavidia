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
            user.getProjectDesa(req.session.user.id_desa, (result) => {
                res.render("dashboardDesa", { user: req.session.user, result: result });
            });
        } else {
            user.getProject(req.session.user.id_investor, (result) => {
                res.render("dashboardInvestor", { user: req.session.user, result: result });
            });
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

    user.addProject(req.session.user.id_investor, req.body.desa, req.body.nama, req.body.description, dateStart, dateEnd, req.body.price, (result) => {
        if(result) {
            res.redirect("/dashboard");
        }
        else{
            res.redirect("/search");
        }
    })
});

router.post("/tambahProgress", (req, res, next) => {
    let date = req.body.progress.split("/").reverse().join("-");
    user.addProgress(req.body.id, date, req.body.description, (result) => {
        if(result) {
            res.redirect(req.get('referer'));
        }
        else{
            res.redirect("/dashboard");
        }
    });
})

router.get("/project", (req, res, next) => {
    if(req.session.user){
        if(req.session.type === "desa"){
            res.redirect("/dashboard");
        }
        else{
            let id = req.query.id;
            user.getProjectById(id, (result) => {
                if(result.id_investor == req.session.user.id_investor){
                    if(result.status == "menunggu"){
                        res.render("detailProyekInvestorMenunggu", {user: req.session.user, result: result});
                    }
                    else if(result.status == "dikerjakan"){
                        user.getProgress(id, (progress) => {
                            res.render("detailProyekInvestorDikerjakan", {user: req.session.user, result: result, progress: progress});
                        });
                    }
                    else if(result.status == "selesai"){
                        user.getProgress(id, (progress) => {
                            res.render("detailProyekInvestorSelesai", {user: req.session.user, result: result, progress: progress});
                        });
                    }
                }
                else{
                    res.redirect("/dashboard");
                }
            })
        }
    }
    else{
        res.redirect("/login");
    }
});

router.get("/project-list", (req, res, next) => {
    if(req.session.user){
        if(req.session.type === "investor"){
            res.redirect("/dashboard");
        }
        else{
            let id = req.query.id;
            user.getProjectById(id, (result) => {
                if(result.id_desa == req.session.user.id_desa){
                    if(result.status == "menunggu"){
                        res.render("detailProyekDesaMenunggu", {user: req.session.user, result: result});
                    }
                    else if(result.status == "dikerjakan"){
                        user.getProgress(id, (progress) => {
                            console.log(progress);
                            res.render("detailProyekDesaDikerjakan", {user: req.session.user, result: result, progress: progress});
                        });
                    }
                    else if(result.status == "selesai"){
                        user.getProgress(id, (progress) => {
                            res.render("detailProyekDesaSelesai", {user: req.session.user, result: result, progress: progress});
                        });
                    }
                }
                else{
                    res.redirect("/dashboard");
                }
            })
        }
    }
    else{
        res.redirect("/login");
    }
});

router.post("/setujuiProyek", (req, res, next) => {
    let file = req.files.mou;
    if(file){
        if(file.mimetype.split("/")[1] == "pdf"){
            let mouPath = randomstring.generate(84);
            file.mv(path.join(__dirname, "../public/user-uploads/pdf/mou/" + mouPath + ".pdf"), (err) => {
                user.setujuiProyek(req.body.id, mouPath + ".pdf", (result) => {
                    if(result){
                        res.redirect("/dashboard");
                    }
                    else{
                        res.redirect("/dashboard");
                    }
                })
            });
        }
        else{
            res.redirect("/dashboard");
        }
    }
    else{
        res.redirect("/dashboard");
    }
})

router.all("/logout", (req, res, next) => {
    if (req.session.user) {
        req.session.destroy();
        res.redirect("/login");
    } else {
        res.redirect("/");
    }
});

module.exports = router;