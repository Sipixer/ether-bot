const Discord = require('discord.js');
module.exports = {
    /**
     * @param {Discord.Channel} channel
     * @param {string} Title
     * @param {string} Description
     * @param {string} footer
     * @param {int} timedelete
     * @param {import('discord.js').ColorResolvable} color
     */
    Embed: function(channel, Title, Description, footer = "", color = "#ffa60e", timedelete = 0) {
        const embed = new Discord.MessageEmbed()
        embed.setColor(color)
        if (Description != null) {
            embed.setDescription(Description)
        }
        if (footer != "") {
            embed.setFooter(footer)
        }
        if (Title != null) {
            embed.setAuthor(Title, null, null)
        }
        channel.send(embed).then(msg => {
            if (timedelete > 0) {
                setTimeout(() => { if (!msg.deleted) { msg.delete() } }, timedelete)
            }
        })
    }
}