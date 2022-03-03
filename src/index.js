const { SapphireClient } = require("@sapphire/framework"),
      { Intents: { FLAGS } } = require("discord.js"),
      { join } = require("node:path");

class BasicBot extends SapphireClient {
    constructor() {
        super({
            intents: [
                FLAGS.GUILDS,
                FLAGS.GUILD_MESSAGES
            ],
            caseInsensitivePrefixes: true,
            caseInsensitiveCommands: true,
            loadMessageCommandListeners: true, // This loads the message commands (<prefix>name)
            shards: "auto",
            baseUserDirectory: join(__dirname, "lib"), // This sets the category to ./src/lib, to autoload commands, listeners(events) and other stuff
            defaultPrefix: "!", // This sets the default prefix to !, however you could use `fetchPrefix` function to search in the database for the prefix (useful for per-server prefixes)
        })

        this.login(process.env.TOKEN) // Use "dotenv" or something else, DONT post your tokens into the files!
        .catch(console.error);
    };
};

module.exports = new BasicBot()