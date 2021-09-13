const pool = require('./pool');
const bcrypt = require('bcrypt');
const DiscordLink = require('./discordlink');
const discordlink = new DiscordLink();
/**
 * @param {string} username 
 * @param {string} mail 
 * @param {string} password 
 * @param {string} discordID
 */

function User(username, mail, password, DiscordID, BattleTag, Formateur, GTournois, Admin) {};

User.prototype = {
    // Find the user data by id or username.
    find: function(user = null, callback) {
        // if the user variable is defind
        if (user) {
            // if user = number return field = id, if user = string return field = username.
            var field = Number.isInteger(user) ? 'id' : 'username';
        }
        // prepare the sql query
        let sql = `SELECT * FROM users WHERE ${field} = ?`;


        pool.query(sql, user, function(err, result) {
            if (err) throw err

            if (result.length) {
                callback(result[0]);
            } else {
                callback(null);
            }
        });
    },
    findDiscordID: async function(DiscordID, callback) {

        let sql = `SELECT * FROM users WHERE DiscordID = ?`;


        var result = await pool.query(sql, DiscordID)

        if (result.length) {
            return result[0]
        } else {
            return null
        }

    },

    // This function will insert data into the database. (create a new user)
    // body is an object 
    create: function(body, callback) {

        var pwd = body.password;
        // Hash the password before insert it into the database.
        body.password = bcrypt.hashSync(pwd, 10);

        // this array will contain the values of the fields.
        var bind = [];
        // loop in the attributes of the object and push the values into the bind array.
        for (prop in body) {
            bind.push(body[prop]);
        }
        // prepare the sql query
        let sql = `INSERT INTO users(username, mail, password) VALUES (?, ?, ?)`;
        // call the query give it the sql string and the values (bind array)
        pool.query(sql, bind, function(err, result) {
            if (err) throw err;
            // return the last inserted id. if there is no error
            callback(result.insertId);
        });
    },

    login: function(username, password, callback) {
        // find the user data by his username.
        this.find(username, function(user) {
            // if there is a user by this username.
            if (user) {
                // now we check his password.
                if (bcrypt.compareSync(password, user.password)) {
                    // return his data.
                    callback(user);
                    return;
                }
            }
            // if the username/password is wrong then return null.
            callback(null);
        });

    },

    setBattleTag: function(id, battletag) {
        let sql = `UPDATE users SET BattleTag='` + battletag + `' WHERE id = ?;`;
        // call the query give it the sql string and the values (bind array)
        pool.query(sql, id, function(err, result) {
            if (err) throw err;
            console.log(id + " changment de battle tag -> " + battletag)
        });
    },
    setDiscordID: function(userid, uuid, callback) {
        discordlink.checkcodelink(uuid, function(checkresult) {
            if (checkresult == null) {
                callback('Erreur code introuvable.')
                return
            } else {
                let sql = `UPDATE users SET DiscordID='` + checkresult.DiscordID + `' WHERE id = ?;`;
                pool.query(sql, userid, function(err, result) {
                    if (err) throw err;
                    callback("Liaison avec Discord effectué: " + checkresult.DiscordID)


                    let sql = `DELETE FROM discordlink WHERE id = ?;`;
                    pool.query(sql, checkresult.id, function(err, result) {
                        if (err) throw err;
                    });
                });
            }
        })
    },
    getAll: function(callback) {
        let sql = "SELECT * FROM `users`;";
        pool.query(sql, '', function(err, result) {
            if (err) throw err;
            callback(result)
        });
    }

}

module.exports = User;