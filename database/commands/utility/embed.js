const { Message } = require("discord.js");
const request = require('request');
module.exports = {
    name: 'embed',
    description: 'Crée des embeds via un fichier JSON !',
    permissions: "ADMINISTRATOR",
    /**
     * @param {Message} msg 
     */
    async execute(msg, args) {
        var body = ""
        await request.get(msg.attachments.first().url, function(err, res, resbody) {

            body = resbody
        })
        if (msg.deletable) {
            msg.delete()
        }
        var embed = JSON.parse(body)
        return msg.channel.send(embed)


    },
};