Discord = require('discord.js');
bot = new Discord.Client();
prefix = global.config.discord.prefix
const requireAll = require('require-all');


//Chargement de tous les events dans ../discord/Events
const files = requireAll({ dirname: `${__dirname}/discord/Events`, filter: /^(?!-)(.+)\.js$/ });

for (const name in files) {
    const event = files[name];
    bot.on(name, event.bind(null, bot));
    console.log(`Event loaded: ${name}`);
}


bot.on('raw', async packet => {
    // We don't want this to run on unrelated packets
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
    // Grab the channel to check the message from
    const channel = await bot.channels.fetch(packet.d.channel_id);
    // There's no need to emit if the message is cached, because the event will fire anyway for that
    if (channel.messages.cache.has(packet.d.message_id)) return;
    // Since we have confirmed the message is not cached, let's fetch it
    channel.messages.fetch(packet.d.message_id).then(async message => {
        // Emojis can have identifiers of name:id format, so we have to account for that case as well
        const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
        // This gives us the reaction we need to emit the event properly, in top of the message object
        const reaction = await message.reactions.cache.get(emoji);
        var author = await bot.users.fetch(packet.d.user_id)

        // Check which type of event it is before emitting
        if (packet.t === 'MESSAGE_REACTION_ADD') {
            bot.emit('messageReactionAdd', reaction, author);
        }
        if (packet.t === 'MESSAGE_REACTION_REMOVE') {
            bot.emit('messageReactionRemove', reaction, author);
        }
    });
});
bot.login(global.config.discord.token);

module.exports = bot;