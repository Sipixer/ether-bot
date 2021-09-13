module.exports = {
    name: 'args-info',
    description: 'Information about the arguments provided.',
    args: true,
    usage: '<user> <role>',
    execute(message, args) {
        return message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
    },
};