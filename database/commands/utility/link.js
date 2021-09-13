const { Message } = require("discord.js");
const DiscordLink = require("../../../core/discordlink");
const User = require("../../../core/user");
const AutoEmbedMessage = require("../../../discord/Utils/AutoEmbedMessage");
const discordlink = new DiscordLink();
const user = new User()

module.exports = {
    name: 'link',
    description: 'link!',
    guildOnly: true,
    only: ["828017698457780255"],
    /**
     * @param {Message} msg 
     */
    async execute(msg, args) {
        if (msg.author.dmChannel != msg.channel) {
            AutoEmbedMessage.Embed(msg.channel, "Liaison avec le site", "Une message privé avec les informations nécessaire va vous être envoyé.")
        }
        var account = await user.findDiscordID(msg.author.id)
        var channel = await msg.author.createDM()
        if (account != null) {
            return AutoEmbedMessage.Embed(channel, "Liaison avec le site", "Ce compte discord est déja liée avec le compte qui a pour pseudo: **" + account.username + "**")
        } else {
            var result = await discordlink.create(msg.author.id)
            return AutoEmbedMessage.Embed(channel, "Liaison avec le site", "Pour lier votre compte discord au site, merci d'aller sur la rubrique Mon compte dans votre panel (http://ether.sipixer.tk/panel/compte) et de mettre ce code: **" + result + '**')
        }
    },
};