const { User, Client } = require("discord.js");
const fetchAll = require('discord-fetch-all');
const fs = require("fs")

function Support() {};

Support.prototype = {
    /**
     * @param {User} User 
     * @param {Client} bot
     */
    newTicket: async function(User) {
        if (fs.readdirSync("./database/support").includes(User.id + ".json")) {
            var readtickets = JSON.parse(fs.readFileSync("./database/support/" + User.id + ".json"))
            var Guild = await bot.guilds.fetch(config.support_server.id)
            var EveryoneRole = await Guild.roles.everyone
            var category = await Guild.channels.cache.get(config.support_server.support_category)
            var permissionchan = [{ id: EveryoneRole, deny: ['VIEW_CHANNEL'] }, { id: User.id, allow: ['VIEW_CHANNEL'] }]
            if (readtickets.open == true) {
                User.createDM().then(chan => {
                    chan.send({
                        "embed": {
                            "title": "Support 🎫",
                            "description": "Vous avez déja un ticket en cours [ici](https://discord.com/channels/828284905888415764/" + readtickets.tickets[readtickets.tickets.length - 1].channel + "). \n Si vous voulez en créer un autre merci de le fermer."

                        }
                    })
                })
            } else {
                var Guild = await bot.guilds.fetch(config.support_server.id)
                var EveryoneRole = await Guild.roles.everyone
                var category = await Guild.channels.cache.get(config.support_server.support_category)
                var permissionchan = [{ id: EveryoneRole, deny: ['VIEW_CHANNEL'] }, { id: User.id, allow: ['VIEW_CHANNEL'] }]
                var chan = await Guild.channels.create(User.username, { type: 'text', parent: category, permissionOverwrites: permissionchan })
                var msg = await chan.send({
                    "embed": {
                        "title": "Support 🎫",
                        "description": "Voici le channel qui vous permettra de communiquer directement avec le staff. \n \n - Pour fermer ce ticket vous pouvez réagir avec 🔒",
                        "color": 3328433

                    }
                })
                msg.react("🔒")
                readtickets.open = true
                readtickets.tickets.push({ channel: chan.id, messages: [] })
                fs.writeFileSync("./database/support/" + User.id + ".json", JSON.stringify(readtickets))
            }

        } else {
            var Guild = await bot.guilds.fetch(config.support_server.id)
            var EveryoneRole = await Guild.roles.everyone
            var category = await Guild.channels.cache.get(config.support_server.support_category)
            var permissionchan = [{ id: EveryoneRole, deny: ['VIEW_CHANNEL'] }, { id: User.id, allow: ['VIEW_CHANNEL'] }]
            var chan = await Guild.channels.create(User.username, { type: 'text', parent: category, permissionOverwrites: permissionchan })
            var msg = await chan.send({
                "embed": {
                    "title": "Support 🎫",
                    "description": "Voici le channel qui vous permettra de communiquer directement avec le staff. \n \n - Pour fermer ce ticket vous pouvez réagir avec 🔒",
                    "color": 3328433

                }
            })
            msg.react("🔒")
            var Tickets = {
                open: true,
                tickets: [{
                    channel: chan.id,
                    messages: []
                }]
            }
            fs.writeFileSync("./database/support/" + User.id + ".json", JSON.stringify(Tickets))
        }


    },
    /**
     * @param {User} User 
     * @param {Client} bot
     */
    closeTicket: async function(User) {
        var cacheuser = User
        if (User.id == undefined) {
            User = await this.getTicketByChanID(User)
        }
        if (User == null || User.id == undefined) {
            console.log(cacheuser)
            var cachechanname = (await bot.channels.fetch(cacheuser)).name
            return (await bot.channels.fetch(config.discord.logchannel)).send("🛑**ERREUR Support**🛑\n Channel: https://discord.com/channels/828284905888415764/" + cacheuser + " \n Erreur: ```" + "Le channel: " + cacheuser + "(" + cachechanname + ") n'a pas de ticket support lié. \nLe resultat est " + User + " ```")
        }
        if (!fs.readdirSync("./database/support").includes(User.id + ".json")) {
            User.createDM().then(chan => {
                    chan.send({
                        "embed": {
                            "title": "Support 🎫",
                            "description": "Erreur lors de la suppression de votre ticket, il n'a pas été trouvé."
                        }
                    })
                })
                (await bot.channels.fetch(config.discord.logchannel)).send("🛑**ERREUR Support**🛑\nUtilisateur: <@" + User + "> \n Erreur: ```Le Ticket de " + User.username + "(" + User.id + ") n'a pas été trouvé lorsqu'il a voulu le supprimer.```")
        } else {
            var readtickets = JSON.parse(fs.readFileSync("./database/support/" + User.id + ".json"))
            var Guild = await bot.guilds.fetch(config.support_server.id)
            var channel = await Guild.channels.cache.get(readtickets.tickets[readtickets.tickets.length - 1].channel)
            const allfetchMessages = await fetchAll.messages(channel, {
                reverseArray: true, // Reverse the returned array
                userOnly: true, // Only return messages by users
                botOnly: false, // Only return messages by bots
                pinnedOnly: false, // Only returned pinned messages
            });
            var messages = []
            allfetchMessages.forEach(element => {
                var message = {}
                if (!element.deleted) {
                    message.authorid = element.author.id
                    message.content = element.content
                    messages.push(message)
                }

            })
            readtickets.open = false
            readtickets.tickets[readtickets.tickets.length - 1].messages = messages
            fs.writeFileSync("./database/support/" + User.id + ".json", JSON.stringify(readtickets))
            channel.delete()
            User.createDM().then(chan => {
                chan.send({
                    "embed": {
                        "title": "Support 🎫",
                        "description": "Votre demande au support a été fermé. Si vous avez de nouveau besoin d'aide vous pouvez faire un nouveau ticket."
                    }
                })
            })

        }
    },

    getTicketByChanID: async function(Channelid) {
        var supportlist = fs.readdirSync("./database/support/").filter(file => file.endsWith('.json'))
        var User = null
        await supportlist.forEach(async support => {
            var data = fs.readFileSync("./database/support/" + support)
            data = JSON.parse(data)
            if (data.tickets[data.tickets.length - 1].channel == Channelid) {
                User = await bot.users.fetch(support.replace(".json", ""))

            }
        });
        return User

    },
    getAllTicketName: async function() {
        var supportlist = fs.readdirSync("./database/support/").filter(file => file.endsWith('.json'))
        var data = []
        await supportlist.forEach(async support => {
            var ticketdata = JSON.parse(fs.readFileSync("./database/support/" + support))
            support = support.replace(".json", "")
            var User = await bot.users.fetch(support)
            var ticket = {}
            ticket.id = support
            ticket.username = User.username
            ticket.open = ticketdata.open
            ticket.length = ticketdata.tickets.length
            data.push(ticket)
        });
        return data
    },

    getAllTicketsByUserID: async function(UserID) {
        if (fs.existsSync("./database/support/" + UserID + ".json")) {
            var ticket = JSON.parse(fs.readFileSync("./database/support/" + UserID + ".json"))
            return ticket
        } else {
            return "Le fichier n'a pas été trouvé."
        }
    }


}

/**
     * 
    
var Tickets = {
    open : true,
    tikets: Ticket
}

var Ticket = {
    Channel = "",
    messages = [{author : "254669972561723392",content: "Salut oui"},{author : "254669972561723392",content: "Salut non"}]
}
 */
module.exports = Support;