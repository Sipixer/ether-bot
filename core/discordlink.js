const pool = require('./pool');

function DiscordLink(DiscordID, UUID) {};

DiscordLink.prototype = {

    create: async function(discordID, ) {
        var linked = await this.checkDiscordIDlink(discordID)
        

        if (linked == null) {
            var uuid = makeid(10)
            let sql = `INSERT INTO discordlink(DiscordID, uuid) VALUES (?, ?)`;

                

                var bind = [discordID, uuid]
                return await pool.query(sql, bind)

        } else {
            return linked.uuid
        }


    },

    checkDiscordIDlink: async function(discordID, callback) {
        let sql = `SELECT * FROM discordlink WHERE DiscordID= ?`;
        var result = await pool.query(sql, discordID)
        if (result.length) {
            return result[0]
        } else {
            return null
        }
    },
    checkcodelink: function(uuid, callback) {
        let sql = `SELECT * FROM discordlink WHERE uuid= ?`;


        pool.query(sql, uuid, function(err, result) {
            if (err) throw err

            if (result.length) {
                callback(result[0]);
            } else {
                callback(null);
            }
        });
    }

}

function CreateUUID(callback) {
    
    callback(uuid)
}




function makeid(length) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() *
            charactersLength)));
    }
    return result.join('');
}

module.exports = DiscordLink;