const { Message } = require("discord.js");
var Jimp = require('jimp');
module.exports = {
    name: 'img',
    description: 'Fait une image a ton image !',
    aliases: ['image'],
    /**
     * @param {Message} msg 
     */
    async execute(msg, args) {
        var start = new Date()
        if (args[1] == undefined) {
            var pseudo = msg.author.username
        } else {
            args.shift()
            var pseudo = args.join(' ')
        }

        var string = pseudo.replace(/[^a-zA-Z0-9 |_€$]/g, ' ');
        var image = await Jimp.read('fond.png')
        var font = await Jimp.loadFont("test.fnt")
        await image.print(
            font,
            0,
            990, {
                text: string,
                alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
            },
            2800
        );


        var buffer = await image.getBufferAsync(Jimp.MIME_PNG)
        const attachment = new Discord.MessageAttachment(buffer, 'welcome-image.png');
        return msg.channel.send(attachment).then(msgs => {
            var end = new Date() - start
            console.info('Execution time: %dms', end)
        })

    },
};