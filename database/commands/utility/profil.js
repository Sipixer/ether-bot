const { Message } = require("discord.js");
const User = require("../../../core/user");
var user = new User()
module.exports = {
    name: 'profil',
    description: 'Affiche ton profil!',
    guildOnly: true,
    aliases: ['profile'],
    /**
     * @param {Message} msg 
     */
    async execute(msg, args) {
        var author = msg.author
        var member = msg.member

        if (msg.mentions.users.first() != undefined) {
            var author = await bot.users.fetch(msg.mentions.users.first().id)
            var member = await msg.guild.members.fetch(msg.mentions.users.first().id)

        }

        var result = await user.findDiscordID(author.id)
        var battletag = "❓"
        var link = "Compte non lié ❌"
        if (result != null || result != undefined) {
            link = "Compte lié ✅"
            if (result.BattleTag != undefined || result.BattleTag != "") {
                battletag = result.BattleTag.replace('-', "#")
            }
        }
        var embed = {
            "embed": {
                "title": "📋 Profil",
                "color": 11645439,
                "thumbnail": {
                    "url": author.avatarURL()
                },
                "author": {
                    "name": author.username,
                    "icon_url": author.avatarURL()
                },
                "fields": [{
                        "name": "► Pseudo :",
                        "value": author.tag,
                        "inline": false
                    },
                    {
                        "name": "► Compte discord créé",
                        "value": "le " + DateToString(author.createdAt.toISOString()),
                        "inline": true
                    },
                    {
                        "name": "► A rejoint le discord",
                        "value": "le " + DateToString(member.joinedAt.toISOString()),
                        "inline": true
                    },
                    {
                        "name": "📑 BattleTag",
                        "value": battletag,
                        "inline": false
                    },
                    {
                        "name": "🖥️ Liée au site:",
                        "value": link,
                        "inline": true
                    }
                ]
            }
        }
        return msg.channel.send(embed)
    },
};


function DateToString(date) {
    var joindate = date.split('T')[0]
    joindate = joindate.split('-')
    joindate = joindate[2] + "/" + joindate[1] + "/" + joindate[0]
    return (joindate)
}