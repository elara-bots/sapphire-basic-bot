const { Command } = require("@sapphire/framework");
// NOTE: Anything in the ./commands directory will get loaded!
module.exports = class BasicCommand extends Command {
    constructor(context) {
        super(context, {
            name: "basic",
            description: "The basic command",
            // Remove the "//" if you want to automatically register the slash command
            // chatInputCommand: { register: true }
        })
    }

    /**
     * @param {import("discord.js").CommandInteraction} interaction 
     */
    async chatInputRun(interaction) {
        return interaction.reply(`This is a basic slash command!`)
    }

    /**
     * @param {import("discord.js").Message} message 
     * @param {import("@sapphire/framework").Args} args 
     * @param {import("@sapphire/framework").MessageCommandContext} context 
     */
    async messageRun(message, args, context) {
        return message.channel.send(`This is the basic command!`);
    }
}