const { Message } = require("discord.js");

module.exports = {
    name: 'ping',
    description: 'Ping!',
    guildOnly: true,
    only: ["820354551386341377"],
    /**
     * @param {Message} msg 
     */
    execute(msg, args) {
        return msg.channel.send('Pong.');
    },
};