const { Message, Client } = require("discord.js");
const stringSimilarity = require("string-similarity");
const Support = require("../../core/support.js")
var support = new Support()



/**
 * @param {Client} bot
 * @param {Message} msg
 */
module.exports = async(bot, msg) => {
    if (msg.author.bot) { return }
    if (msg.content.startsWith(prefix)) {
        const args = msg.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        //recherche de la commande avec les alias
        const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        //check if command exist
        if (!command) return msg.reply("Commande introuvable.");
        //check enable on dm or guild
        if (command.guildOnly && msg.channel.type === 'dm') {
            return msg.reply('Je ne peux pas executer cette commande en DM!');
        }
        if (msg.guild != null && command.only) {
            if (!command.only.includes(msg.guild.id)) {
                return msg.reply("Cette commande n'est pas disponible sur ce serveur.")
            }
        }


        //check permission
        if (command.permissions) {
            if (msg.channel.type == 'dm') {
                return msg.reply('Tu ne peux pas executer cette commande ici car nous ne pouvons pas verifier vos permissions.')
            }
            const authorPerms = msg.channel.permissionsFor(msg.author);
            if (!authorPerms || !authorPerms.has(command.permissions)) {
                return msg.reply('Tu ne peux pas executer cette commande car tu n\'as pas la permission `' + command.permissions + '` !');
            }
        }

        //check args
        if (command.args && !args.length) {
            let reply = `Vous n'avez fourni aucun argument, ${msg.author}!`;

            if (command.usage) {
                reply += `\nL'utilisation appropriée serait : \`${config.discord.prefix}${command.name} ${command.usage}\``;
            }

            return msg.channel.send(reply);
        }

        try {
            command.execute(msg, args).catch(async(error) => {
                console.error(error);
                msg.reply("Une erreur est survenue lors de l'éxectution de la commande: ```js " + error + "```");
                var location = ""
                if (msg.author.dmChannel == msg.channel.id) {
                    location = "DM channel"
                } else {
                    location = msg.guild.name
                }
                (await bot.channels.fetch(config.discord.logchannel)).send("🛑**ERREUR COMMAND**🛑 \n Serveur: " + location + "\n Command: " + commandName + "\n Autheur: <@" + msg.author + ">\n Erreur: ```" + error.stack + "```")
            });
        } catch (error) {

            console.error(error);
            msg.reply("Une erreur est survenue lors de l'éxectution de la commande: ```js " + error + "```");
            var location = ""
            if (msg.author.dmChannel == msg.channel.id) {
                location = "DM channel"
            } else {
                location = msg.guild.name
            }
            (await bot.channels.fetch(config.discord.logchannel)).send("🛑**ERREUR COMMAND**🛑 \n Serveur: " + location + "\n Command: " + commandName + "\n Autheur: <@" + msg.author + ">\n Erreur: ```" + error.stack + "```")
        }
        return
    }

    if (msg.channel.parentID == config.support_server.support_category) {
        if (msg.content == "close") {
            support.closeTicket(msg.channel.id)
        }
    }

};