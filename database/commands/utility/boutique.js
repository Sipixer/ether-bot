const { Message } = require("discord.js");

module.exports = {
    name: 'boutique',
    description: 'Affiche les articles disponible dans la boutique!',
    aliases: ['shop', 'maillot'],
    /**
     * @param {Message} msg 
     */
    async execute(msg, args) {
        var embed1 = {
            "embed": {
                "title": "Boutique",
                "description": "Les maillots officiels d'Ether Esport sont disponibles grace a notre collaboration avec **[LMN8](https://eliminate.fr/)**",
                "thumbnail": {
                    "url": "https://eliminate.fr/wp-content/uploads/2021/04/LMN8_LOGO_white_100.png"
                },
                "color": 15284794
            }
        }
        var embed2 = {
            "embed": {
                "title": "Ether eSport – Jersey",
                "description": "**Les maillots officiels Ether eSport sont disponible [ici](https://eliminate.fr/produit/ether-esport-jersey/).**",
                "url": "https://eliminate.fr/produit/ether-esport-jersey/",
                "color": 2462960,
                "image": {
                    "url": "https://eliminate.fr/wp-content/uploads/2021/04/Maillot-ether-2021-01-746x770.jpg"
                },
                "fields": [{
                        "name": "Prix",
                        "value": "35,00€",
                        "inline": true
                    },
                    {
                        "name": "Taille",
                        "value": "XS, M, L, XL, XXL, XXXL",
                        "inline": true
                    },
                    {
                        "name": "Personalisable:",
                        "value": "**- Pseudonyme \n- Numéro**",
                        "inline": false
                    }
                ]
            }
        }
        var embed3 = {
            "embed": {
                "title": "Ether eSport – Hoodie",
                "description": "**Les hoodies officiels Ether eSport sont disponible [ici](https://eliminate.fr/produit/ether-esport-hoodie/).**",
                "url": "https://eliminate.fr/produit/ether-esport-hoodie/",
                "color": 2462960,
                "image": {
                    "url": "https://cdn.discordapp.com/attachments/535813715665354752/842714754791636993/ether-hoodie-746x770.png"
                },
                "fields": [{
                        "name": "Prix",
                        "value": "37,90€",
                        "inline": true
                    },
                    {
                        "name": "Taille",
                        "value": "XS, M, L, XL, XXL, XXXL",
                        "inline": true
                    },
                    {
                        "name": "Personalisable:",
                        "value": "**- Pseudonyme**",
                        "inline": false
                    }
                ]
            }
        }

        await msg.channel.send(embed1)
        await msg.channel.send(embed2)
        return await msg.channel.send(embed3)

    },
};