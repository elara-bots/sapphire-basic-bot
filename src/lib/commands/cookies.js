const { Command } = require("@sapphire/framework");

module.exports = class CookiesCommand extends Command {
    constructor(context) {
        super(context, {
            name: "cookies",
            description: "View how many cookies you or another user has!",
            runIn: 'GUILD_ANY'
        })
    };

    /**
     * @param {import("@sapphire/framework").ApplicationCommandRegistry} registry 
     */
     async registerApplicationCommands(registry) {
		registry.registerChatInputCommand(builder => {
			builder
				.setName(this.name) // This sets the slash command name to the one you set above
				.setDescription(this.description) // Same as above, just the description
				.addUserOption(option =>
					option // This adds the user option for the slash command
						.setName('user') // The name of the slash command option (i.e: /cookie user:...)
                        .setRequired(false) // This makes the 'user' option NOT required
						.setDescription(`What's the user?`) // The description of the slash command option
				)
		}, {
            behaviorWhenNotIdentical: "OVERWRITE", // When the slash commands don't match (local to Discord) then it will override the Discord one.
            registerCommandIfMissing: true // This will register the command if it's missing from the commands list registered to Discord
        });
	}

    /**
     * @param {import("discord.js").CommandInteraction} interaction 
     */
    async chatInputRun(interaction) {
        await interaction.deferReply().catch(console.warn);
        // Defer interactions if you're using 'await' or if the command might take more than 3s
        const user = interaction.options.getUser("user", false) ?? interaction.user; 
        // This gets the user from the used slash command., or sets it to the slash command user.
        let data = await this.getCookies(user, interaction.user);
        return interaction.editReply(data).catch(console.warn);
    }

    /**
     * @param {import("discord.js").Message} message 
     * @param {import("@sapphire/framework").Args} args 
     */
    async messageRun(message, args) {
        let user = await args.pick("user").catch(() => {}); // This tells sapphire to only get the 'user' from the provided content by the user
        // If there was no user provided, it sets it to the message author.
        if (!user) user = message.author; 
        const data = await this.getCookies(user, message.author);
        return message.reply(data).catch(console.warn);
    }

    async getCookies(user, author) {
        if (user.bot) return { content: `Bots don't get cookies!` };
        let db = await this.container.client.dbs.getCookies(user, false); // This fetches the user's cookie database entry
        if (!db) return { 
            content: user.id === author.id ? `🍪 You have **0** cookies!` : `🍪 ${user.toString()} has **0** cookies!`, 
            allowMentions: { parse: [] } // This removes the ability for the bot to ping the user provided.
        }; 
        return {
            // This returns the data to return to the user (the message/interaction's content)
            content: user.id === author.id ? `🍪 You have **${db.cookies}** cookies!` : `🍪 ${user.toString()} has **${db.cookies}** cookies!`,
            allowMentions: { parse: [] }
        }
    };
}