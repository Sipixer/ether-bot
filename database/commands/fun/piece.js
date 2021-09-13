const { Message } = require("discord.js");

module.exports = {
    name: 'piece',
    description: 'Permet de faire un pile ou face.',
    /**
     * @param {Message} msg 
     */
    execute(msg, args) {
        var min = 0
        var max = 1
        var result = Math.floor(Math.random() * (max - min + 1)) + min;
        if (result == 1) {
            return msg.channel.send('🪙 La pièce a fait pile.')
        } else {
            return msg.channel.send('🪙 La pièce a fait face.')
        }
    },
};