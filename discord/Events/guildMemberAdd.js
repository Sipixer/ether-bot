const { Client, GuildMember } = require("discord.js");

/**
 * @param {Client} client 
 * @param {GuildMember} member
 */
module.exports = (client, member) => {
    if (member.guild.id == config.main_server.id) {
        member.createDM().then(channel => channel.send("Bienvenue sur le serveur principal d'Ether Esport: **" + member.guild.name + "**"))
    }
    if (member.guild.id == config.support_server.id) {
        member.createDM().then(channel => channel.send("Bienvenue sur le serveur support d'Ether Esport: **" + member.guild.name + "** "))
    }
}