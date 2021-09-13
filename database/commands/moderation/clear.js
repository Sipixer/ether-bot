const { Message } = require("discord.js");

module.exports = {
    name: 'clear',
    description: 'Supprime les messages!',
    guildOnly: true,
    aliases: ['cl'],
    /**
     * @param {Message} msg 
     */
    execute(msg, args) {
        var args = msg.content.split(" ")
        if (args[1] == undefined) {
            args[1] = 10
        }
        const embed = new Discord.MessageEmbed()
            .setDescription("✅ **" + args[1] + "** messages ont été supprimés")
            .setColor("#ffa60e")
            .setAuthor("Suppression de message 🗑️", null, null)
        return msg.channel.bulkDelete(args[1]).then(() => msg.channel.send(embed).then(msg => setTimeout(() => { if (!msg.deleted) { msg.delete() } }, 10000)))
    },
};