const ReloadCMD = require("../../../discord/Functions/ReloadCMD");

module.exports = {
    name: 'reload',
    description: 'Reload Commands!',
    aliases: ['rl'],
    execute(msg, args) {
        const embed = {
            "color": 14255166,
            "author": {
                "name": "Mise a jour des commandes..."
            }
        };
        return msg.channel.send({ embed: embed }).then((msg) => {
            ReloadCMD.reload()
            const embed = {
                "color": 14255166,
                "author": {
                    "name": "Mise a jour des commandes et des réactions effectué. ✅"
                }
            };
            msg.edit({ embed: embed })
        })


    }
};