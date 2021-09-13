const { MessageReaction, ReactionCollector, User } = require("discord.js");
const Formation = require("../../core/formation.js");
const AutoEmbedMessage = require("../Utils/AutoEmbedMessage.js");
const fs = require('fs')
const Support = require("../../core/support.js")
var support = new Support()
var formation = new Formation()
    /**
     * @param {Client} bot
     * @param {MessageReaction} react
     * @param {User} author
     */
module.exports = async(bot, react, author) => {
    if (author.bot) return;

    //check if reaction is in post-formation channel
    if (react.message.channel == global.config.support_server.post_formation) {
        react.users.remove(author)
        formation.joinReactionMessage(author.id, react.message.id, function(result) {
            author.createDM().then(channel => AutoEmbedMessage.Embed(channel, "Formation 📑", result, "", "#9cd083"))
        })
        return
    }
    if (react.message.channel.parentID == config.support_server.support_category && react.emoji.name == "🔒") {
        return support.closeTicket(react.message.channel.id)
    }
    var ReactionJSON = fs.readdirSync('./database/ReactionJSON').find(filename => filename.replace('.json', '') == react.message.channel)
    if (ReactionJSON != undefined) {
        var ReactionJSON = fs.readFileSync('./database/ReactionJSON/' + ReactionJSON)
        ReactionJSON = JSON.parse(ReactionJSON)
        ReactionJSON = ReactionJSON[react.message.id]
        if (ReactionJSON != undefined) {
            react.users.remove(author)
            var ReactionJSON = ReactionJSON.reactions[react.emoji.name]
            if (ReactionJSON != undefined) {
                var Member = await react.message.guild.members.fetch(author)
                var Guild = react.message.guild
                if (ReactionJSON.roles != undefined) {
                    ReactionJSON.roles.forEach(async role => {
                        var Role = await react.message.guild.roles.fetch(role)
                        if (await Member.roles.cache.has(Role.id)) {
                            await Member.roles.remove(Role)
                            if (ReactionJSON.dm) {
                                Member.createDM().then(chan => { chan.send("Nous t'avons supprimé le role **" + Role.name + "** sur le serveur: **" + Guild.name + "**.") })
                            }
                        } else {
                            await Member.roles.add(Role)
                            if (ReactionJSON.dm) {
                                Member.createDM().then(chan => { chan.send("Nous t'avons ajouté le role **" + Role.name + "** sur le serveur: **" + Guild.name + "**.") })
                            }
                        }
                    });
                }
                if (ReactionJSON.SendDM != undefined) {
                    Member.createDM().then(chan => { chan.send(ReactionJSON.SendDM) })
                }
                if (ReactionJSON.Function != undefined) {

                    var fn = new Function("Member", "Guild", "support", ReactionJSON.Function);
                    fn(Member, Guild, support);

                }
            } else {
                author.createDM().then(channel => {
                    channel.send("Tu n'as pas le droit d'ajouter des émojis a un message reaction géré par moi-même.")

                })
            }
        } else {
            console.log("Le message n'a pas été trouvé.")
        }
    }

}