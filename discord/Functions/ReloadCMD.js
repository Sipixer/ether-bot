const Discord = require('discord.js');
const fs = require("fs")
class Command {
    constructor(base = "", help = false, permission = [], definition = "", exemple = "", howTo = "", action = function(msg = Discord.Message) { msg.reply("FONCTION NON DÉFINIE") }) {
        this.c = base
    }
}

module.exports = {
    reload: async function() {
        //reload des commandes
        bot.commands = new Discord.Collection()

        const commandFolders = fs.readdirSync('./database/commands')

        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`./database/commands/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                delete require.cache[require.resolve(`../../database/commands/${folder}/${file}`)];
                try {

                    const command = require(`../../database/commands/${folder}/${file}`);
                    bot.commands.set(command.name, command);
                } catch (error) {

                    (await bot.channels.fetch(config.discord.logchannel)).send("🛑**ERREUR RELOAD**🛑 \n Nom du fichier: " + file + "\n Erreur: ```" + error.stack + "```")
                }

            }
        }


        //reload des messages avec les réactions

        fs.readdirSync("./database/ReactionJSON").forEach(async(f) => {
            var ReactionJSON = JSON.parse(fs.readFileSync('./database/ReactionJSON/' + f))
            var Channel = await bot.channels.fetch(f.replace('.json', ''))

            Object.entries(ReactionJSON).forEach(async([clé, valeur]) => {
                var message = await Channel.messages.fetch(clé)
                message.reactions.removeAll()
                Object.entries(valeur.reactions).forEach(async([clé2, valeur2]) => {
                    await message.react(clé2)
                })
            })
        })
    }
}