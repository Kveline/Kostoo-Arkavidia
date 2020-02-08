const pool = require("./pool");
const bcrypt = require("bcryptjs");

function User() {};

User.prototype = {
    find: function(email, type, callback) {
        let sql = "";
        if (type === "desa") {
            sql = "SELECT * FROM desa WHERE email = ?";
        } else {
            sql = "SELECT * FROM investor WHERE email = ?";
        }
        pool.query(sql, email, (err, result) => {
            if (err) throw err;
            if (result.length) {
                callback(result[0]);
            } else {
                callback(null);
            }
        });
    },
    findById(id, type, callback) {
        let sql = "";
        if(type === "desa"){
            sql = "SELECT * FROM desa WHERE id_desa = ?";
        }
        else{
            sql = "SELECT * FROM investor WHERE id_investor = ?";
        }
        pool.query(sql, id, (err, result) => {
            if(err) throw err;
            if(result.length){
                callback(result[0]);
            }
            else{
                callback(null);
            }
        })
    },
    login: function(email, password, type, callback) {
        this.find(email, type, (result) => {
            if (result) {
                if (bcrypt.compareSync(password, result.password)) {
                    callback(result);
                } else {
                    callback(null);
                }
            } else {
                callback(null);
            }
        })
    },
    create: function(email, pass, nama, lokasi, foto, deskripsi, portofolio, bidang, type, callback) {
        this.find(email, type, (result) => {
            if (result) {
                callback(null);
            } else {
                let password = bcrypt.hashSync(pass, 10);
                let bind = [];
                let sql = "";
                if (type === "desa") {
                    sql = "INSERT INTO desa(email, password, nama_desa, lokasi, portofolio, foto, deskripsi, bidang_dikuasai) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                    bind.push(email);
                    bind.push(password);
                    bind.push(nama);
                    bind.push(lokasi);
                    bind.push(portofolio);
                    bind.push(foto);
                    bind.push(deskripsi);
                    bind.push(bidang);
                } else {
                    sql = "INSERT INTO investor(email, password, nama_perusahaan, lokasi, foto_perusahaan, deskripsi_perusahaan) VALUES (?, ?, ?, ?, ?, ?)";
                    bind.push(email);
                    bind.push(password);
                    bind.push(nama);
                    bind.push(lokasi);
                    bind.push(foto);
                    bind.push(deskripsi);
                }

                pool.query(sql, bind, (err, result) => {
                    if (err) throw err;
                    if (result) {
                        callback(result);
                    } else {
                        callback(null);
                    }
                })
            }
        });
    },
    getListDesa: function(callback) {
        let sql = "SELECT * FROM desa";
        pool.query(sql, (err, result) => {
            if (err) throw err;
            console.log(result);
            callback(result);
        })
    },
    getListDesaByKeyword: function(keyword, callback) {
        let sql = "SELECT * FROM desa WHERE nama_desa LIKE ?";
        keyword = "%" + keyword + "%";
        pool.query(sql, keyword, (err, result) => {
            if (err) throw err;
            callback(result);
        });
    },
    addProject: function(idInvestor, idDesa, nama, desc, start, end, price, callback){
        let sql = "INSERT INTO proyek(id_investor, id_desa, nama_proyek, status, waktu_proyek_mulai, waktu_target_selesai, mou_kerjasama, selesai, nilai_proyek, deskripsi_proyek) VALUES (?, ?, ?, ?, ?, ?, null, null, ?, ?)";
        let bind = [];
        let status = "menunggu";
        bind.push(idInvestor);
        bind.push(idDesa);
        bind.push(nama);
        bind.push(status);
        bind.push(start);
        bind.push(end);
        bind.push(price);
        bind.push(desc);

        pool.query(sql, bind, (err, result) => {
            if(err) throw err;
            if(result) {
                callback(result);
            }
            else{
                callback(null);
            }
        })
    },
    getProject: function (idInvestor, callback){
        let sql = "SELECT * FROM proyek NATURAL JOIN investor WHERE id_investor = ?";
        pool.query(sql, idInvestor, (err, result) => {
            if(err) throw err;
            callback(result);
        });
    },
    getProjectById: function(idProyek, callback){
        let sql = "SELECT * FROM investor NATURAL JOIN proyek INNER JOIN desa ON proyek.id_desa = desa.id_desa WHERE id_proyek = ?";
        pool.query(sql, idProyek, (err, result) => {
            console.log(result);
            if(err) throw err;
            if(result.length){
                callback(result[0]);
            }
            else{
                callback(null);
            }
        });
    },
    getProgress: function(idProyek, callback){
        let sql = "SELECT * FROM progress_proyek WHERE id_proyek = ?";
        pool.query(sql, idProyek, (err, result) => {
            console.log(result);
            if(err) throw err;
            callback(result);
        });
    }
}

module.exports = User;