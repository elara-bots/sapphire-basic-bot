const { Command } = require("@sapphire/framework");

module.exports = class CookiesCommand extends Command {
    constructor(context) {
        super(context, {
            name: "cookie",
            description: "Give someone a cookie!",
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
                        .setRequired(true) // This makes the 'user' option required
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
        const user = interaction.options.getUser("user"); // This gets the user from the used slash command. 
        if (user.id === interaction.user.id) return interaction.editReply({ content: `You can't give yourself a cookie!` }).catch(console.warn);
        const data = await this.handleCookie(interaction.user, user); 
        // interaction.user: The user who ran the command
        // user: The user that was provided by the user who ran the command
        return interaction.editReply(data).catch(console.warn);
    }

    /**
     * @param {import("discord.js").Message} message 
     * @param {import("@sapphire/framework").Args} args 
     */
    async messageRun(message, args) {
        const user = await args.pick("user").catch(() => {}); // This tells sapphire to only get the 'user' from the provided content by the user
        // If the user wasn't provided then tell the user to provide a valid user.
        if (!user) return message.reply({ content: `You didn't provide a valid user!` }).catch(console.warn);
        // If the message author and the user provided is the same then tell them they can't give themselves a cookie.
        if (user.id === message.author.id) return message.reply({ content: `You can't give yourself a cookie!` }).catch(console.warn);
        // ALWAYS HANDLE YOUR ERRORS!
        const data = await this.handleCookie(message.author, user);
        return message.reply(data).catch(console.warn);
    }

    async handleCookie(author, user) {
        if (!user.bot) { // This checks to make sure the user is not a bot. (remove this if you want the cookies amount to be tracked for bots as well)
            let db = await this.container.client.dbs.getCookies(user); // This fetches the user's cookie database entry 
            if (db) { // This checks if the entry is valid (not null)
                db.cookies++; // This adds 1 to the cookies value 
                await db.save().catch(() => null); 
                // This saves the updated database entry and catches the error (if you want the errors then handle them some other way)
            };
        }
        return {
            // This returns the data to return to the user (the message/interaction's content)
            content: `🍪 ${author.toString()} has given ${user.toString()} a cookie! 🍪`,
        }
    };
}