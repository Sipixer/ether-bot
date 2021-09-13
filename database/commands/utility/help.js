module.exports = {
    name: 'help',
    description: 'Liste toutes mes commandes ou informations sur une commande spécifique.',
    aliases: ['aide', 'commands'],
    usage: '[nom de la commande]',
    async execute(message, args) {
        const data = [];
        const { commands } = message.client;
        if (!args.length) {
            data.push('Voici une liste de toutes mes commandes :');
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\nVous pouvez envoyer \`${prefix}help [nom de la commande]\` pour obtenir des informations sur une commande spécifique !`);

            return message.channel.send(data, { split: true })
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('Cette commande n\'est pas valide!');
        }

        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Alias:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Utilisation:** ${prefix}${command.name} ${command.usage}`);
        if (command.only) {
            var serversonly = []
            await command.only.forEach(async server => {
                serversonly.push((await bot.guilds.fetch(server)).name)
            });
            data.push("**Fonctionne sur :** " + serversonly.join(", "))
        }
        return message.channel.send(data, { split: true });
    },
};