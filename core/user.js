const pool = require("./pool");
const bcrypt = require("bcryptjs");

function User(){};

User.prototype = {
    find: function (email, type, callback) {
        let sql = "";
        if(type === "desa"){
            sql = "SELECT * FROM desa WHERE email = ?";
        }
        else{
            sql = "SELECT * FROM investor WHERE email = ?";
        }
        pool.query(sql, email, (err, result) => {
            if(err) throw err;
            if(result.length){
                callback(result[0]);
            }
            else{
                callback(null);
            }
        });
    },
    login: function (email, password, type, callback) {
        this.find(email, type, (result) => {
            if(result){
                if(bcrypt.compareSync(password, result.password)){
                    callback(result);
                }
                else{
                    callback(null);
                }
            }
            else{
                callback(null);
            }
        })
    },
    create: function(email, pass, type, callback) {
        this.find(email, type, (result) => {
            if(result){
                callback(null);
            }
            else{
                let password = bcrypt.hashSync(pass, 10);
                let bind = [];
                bind.push(email);
                bind.push(password);
                let sql = "";
                if(type === "desa"){
                    sql = "INSERT INTO desa(email, password) VALUES (?, ?)";
                }
                else{
                    sql = "INSERT INTO investor(email, password) VALUES (?, ?)";
                }

                pool.query(sql, bind, (err, result) => {
                    if(err) throw err;
                    if(result){
                        callback(result);
                    }
                    else{
                        callback(null);
                    }
                })
            }
        });
    }
}

module.exports = User;