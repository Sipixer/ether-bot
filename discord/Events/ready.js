const { Client } = require("discord.js");
const Formation = require("../../core/formation.js");
const Support = require("../../core/support.js");
var formation = new Formation()
const reload = require("../Functions/ReloadCMD.js")
const support = new Support()
    /**
     * @param {Client} bot
     */
module.exports = (bot) => {
    console.log(`Je suis en ligne -> ${bot.user.tag}!`);
    reload.reload()
    support.getTicketByChanID("850998457766641695")
}