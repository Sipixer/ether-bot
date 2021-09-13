const { Client } = require('discord.js');
const AutoEmbedMessage = require('../discord/Utils/AutoEmbedMessage');
const pool = require('./pool');


function Formation() {};

Formation.prototype = {
    /**
     * @param {Client} bot 
     */
    create: function(Formation) {
        bot.guilds.fetch(global.config.support_server.id).then(async(guild) => {



            //Création des grades (Nom de formation) et (Formateur + Nom de formation)
            var EveryoneRole = await guild.roles.everyone
            var Adminrole = await guild.roles.create({ data: { name: "Formateur " + Formation.nom, color: 'D3FF22' } })
            var Studentrole = await guild.roles.create({ data: { name: Formation.nom, color: 'FFCD22', hoist: true } })
            await (await guild.members.fetch(Formation.ADiscordID)).roles.add(Adminrole).catch(console.error);
            await (await guild.members.fetch(Formation.ADiscordID)).roles.add(Studentrole).catch(console.error);
            //Création des channels
            var Categorie = await guild.channels.create(Formation.nom, { type: 'category', permissionOverwrites: [{ id: EveryoneRole, deny: ['VIEW_CHANNEL'] }, { id: Studentrole, allow: ['VIEW_CHANNEL'] }, { id: Adminrole, allow: ['VIEW_CHANNEL', 'STREAM', 'MUTE_MEMBERS', 'MANAGE_CHANNELS', 'MANAGE_MESSAGES', 'CREATE_INSTANT_INVITE', 'MANAGE_ROLES'] }] })
            var chanbotinfo = await guild.channels.create("Formateur BOT", { type: 'text', parent: Categorie, permissionOverwrites: [{ id: EveryoneRole, deny: ['VIEW_CHANNEL'] }, { id: Adminrole, allow: ['VIEW_CHANNEL', 'STREAM', 'MUTE_MEMBERS', 'MANAGE_MESSAGES', 'CREATE_INSTANT_INVITE'] }] })
            await guild.channels.create("Annonces", { type: 'text', parent: Categorie, permissionOverwrites: [{ id: EveryoneRole, deny: ['VIEW_CHANNEL'] }, { id: Studentrole, deny: ['SEND_MESSAGES'], allow: ['VIEW_CHANNEL'] }, { id: Adminrole, allow: ['VIEW_CHANNEL', 'STREAM', 'MUTE_MEMBERS', 'MANAGE_CHANNELS', 'MANAGE_MESSAGES', 'CREATE_INSTANT_INVITE'] }] })
            await guild.channels.create("Général", { type: 'text', parent: Categorie })
            await guild.channels.create("Vocal", { type: 'voice', parent: Categorie })
                //Ajout des données a l'objet Formation
            Formation.id = MakeFormationID()
            Formation.CategorieID = Categorie.id
            Formation.StudentRoleID = Studentrole.id
            Formation.AdminRoleID = Adminrole.id


            AutoEmbedMessage.Embed(chanbotinfo, "Configuration FINI", "Les channels et les roles ( <@&" + Adminrole.id + ">  et <@&" + Studentrole.id + ">) sont mis en place et pret a être utilisé. \n Pour lancer les inscriptions aller sur la page de la formation sur le site.")

            let sql = "INSERT INTO `formations`(`id`, `Nom`, `Langue`, `Description`, `Niveau`, `Prix`, `CategorieID`,`ChannelInfoID`, `Duree`, `ADiscordID`, `StudentRoleID`, `AdminRoleID`) VALUES ('" + Formation.id + "',\"" + Formation.nom + "\",'" + Formation.Langue + "',\"" + Formation.Description + "\",'" + Formation.Niveau + "'," + Formation.Prix + ",'" + Formation.CategorieID + "','" + chanbotinfo + "'," + Formation.Duree + ",'" + Formation.ADiscordID + "','" + Formation.StudentRoleID + "','" + Formation.AdminRoleID + "');"
            pool.query(sql, '', function(err, result) {
                if (err) throw err;

            });








        })
    },

    getAll: function(DiscordID, callback) {
        let sql = "SELECT * FROM `formations` WHERE ADiscordID = ?;";
        pool.query(sql, DiscordID, function(err, result) {
            if (err) throw err;
            callback(result)
        });
    },
    sendInscription: async function(FormationID) {
        this.getFormationByID(FormationID, async function(formation) {
            var FAuthor = await bot.users.fetch(formation.ADiscordID)
            var PlusInfo = "\n \n **Plus d'infos** \n Niveau: " + formation.Niveau + " \n Durée: " + formation.Duree + "h \n Prix: " + formation.Prix + "€"
            const embed = {
                "title": formation.Nom + " par " + FAuthor.username + "",
                "description": formation.Description + PlusInfo,
                "color": 4168184,
                "footer": {
                    "text": "Rejoint avec ☑️ ou " + prefix + "f join " + FormationID
                }
            };
            var MessageInscription = (await (await bot.channels.fetch(global.config.support_server.post_formation)).send({ embed }))
            MessageInscription.react('☑️')
            let sql = "UPDATE `formations` SET `MessageInscriptionID` = ? WHERE `formations`.`id` = ?;";
            pool.query(sql, [MessageInscription.id, FormationID], function(err, result) {
                if (err) throw err;

            });
        })
    },
    getFormationByID: function(FormationID, callback) {
        let sql = "SELECT * FROM `formations` WHERE id = ?;";
        pool.query(sql, FormationID, function(err, result) {
            if (err) throw err;
            callback(result[0])
        });
    },
    getFormationByInscriptionID: function(MessageInscriptionID, callback) {
        let sql = "SELECT * FROM `formations` WHERE `MessageInscriptionID` = ?;";
        pool.query(sql, MessageInscriptionID, function(err, result) {
            if (err) throw err;
            callback(result[0])
        });
    },
    join: function(DiscordID, FormationID, callback) {
        this.getFormationByID(FormationID, function(formation) {
            if (formation == undefined) {
                callback('Erreur, formation introuvable.')
                return
            }
            let sql = "SELECT * FROM `student` WHERE `DiscordID`= ? AND `formationsID` = ?";
            pool.query(sql, [DiscordID, FormationID], function(err, result) {
                if (err) throw err;
                if (result.length >= 1) {
                    callback('Tu es déja inscrit a cette formation. Pour quitter une formation merci de cliquer sur la réaction de la formation.')
                } else {
                    let sql = "INSERT INTO `student`(`formationsID`, `DiscordID`) VALUES (?,?)";
                    pool.query(sql, [FormationID, DiscordID], async function(err, result) {
                        if (err) throw err;
                        var guild = await bot.guilds.fetch(global.config.support_server.id)
                        var student = await guild.members.fetch(DiscordID)
                        await student.roles.add(formation.StudentRoleID).catch(console.error);
                        const embed = { "title": formation.Nom, "description": "<@" + student.user + "> a rejoint la formation.", "color": 8311585 };
                        (await bot.channels.fetch(formation.ChannelInfoID)).send({ embed })
                        callback('Votre inscription à la formation **' + formation.Nom + '**(' + formation.id + ') a bien été pris en compte.')

                    })
                }
            });
        })
    },
    joinReactionMessage: function(DiscordID, MessageInscriptionID, callback) {
        this.getFormationByInscriptionID(MessageInscriptionID, function(formation) {
            if (formation == undefined) {
                callback('Erreur, formation introuvable.')
                return
            }
            let sql = "SELECT * FROM `student` WHERE `DiscordID`= ? AND `formationsID` = ?";
            pool.query(sql, [DiscordID, formation.id], async function(err, result) {
                var guild = await bot.guilds.fetch(global.config.support_server.id);
                var student = await guild.members.fetch(DiscordID)
                if (err) throw err;

                if (DiscordID == formation.ADiscordID) {
                    callback("Tu es le créateur de la formation... Tu ne peux pas la quitter ni la rejoindre.\n Pour toutes question merci de contacter le staff.")
                    return
                }

                if (result.length >= 1) {

                    var Studentrole = (await guild.roles.fetch(formation.StudentRoleID))
                    await (await guild.members.fetch(DiscordID)).roles.remove(Studentrole).catch(console.error);
                    let sql = "DELETE FROM `student` WHERE formationsID = ? AND DiscordID	= ?";
                    pool.query(sql, [formation.id, DiscordID], async function(err, result) {
                        console.log('Étudiant supprimé dans la BDD.')
                    })
                    const embed = { "title": formation.Nom, "description": "<@" + student.user + "> a quitté la formation.", "color": 13632027 };
                    (await bot.channels.fetch(formation.ChannelInfoID)).send({ embed })
                    callback('Tu as bien quitté la formation')
                } else {
                    let sql = "INSERT INTO `student`(`formationsID`, `DiscordID`) VALUES (?,?)";
                    pool.query(sql, [formation.id, DiscordID], async function(err, result) {
                        if (err) throw err;

                        await student.roles.add(formation.StudentRoleID).catch(console.error);
                        const embed = { "title": formation.Nom, "description": "<@" + student.user + "> a rejoint la formation.", "color": 8311585 };
                        (await bot.channels.fetch(formation.ChannelInfoID)).send({ embed })
                        callback('Votre inscription à la formation **' + formation.Nom + '**(' + formation.id + ') a bien été pris en compte.')

                    })
                }
            });
        })
    },
    delete: function(formationID) {
        this.getFormationByID(formationID, async function(formation) {
            console.log('\x1b[33m%s\x1b[0m', 'Début de la suppression de la formation: ' + formation.Nom);
            var guild = await bot.guilds.fetch(global.config.support_server.id);
            var category = await bot.channels.fetch(formation.CategorieID)
            await category.children.forEach(async chan => {
                await chan.delete()
            });
            await category.delete()
            var InscChan = (await bot.channels.fetch(global.config.support_server.post_formation));
            if (await InscChan.messages.fetch(formation.MessageInscriptionID) != undefined) {
                (await InscChan.messages.fetch(formation.MessageInscriptionID)).delete()
            }

            console.log('Channels and Messages delete.');
            (await guild.roles.fetch(formation.StudentRoleID)).delete();
            (await guild.roles.fetch(formation.AdminRoleID)).delete();
            console.log('Roles delete.')
            let sql = "DELETE FROM `formations` WHERE id = ?";
            pool.query(sql, formation.id, async function(err, result) {
                console.log('Formation supprimé dans la BDD.')
            })
            let sql2 = "DELETE FROM `student` WHERE `formationsID` = ?";
            pool.query(sql2, formation.id, async function(err, result) {
                console.log('Etudiants supprimé dans la BDD.')
            })

        })
    }

}


function MakeFormationID() {
    var length = 5
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() *
            charactersLength)));
    }
    return result.join('');
}

module.exports = Formation;