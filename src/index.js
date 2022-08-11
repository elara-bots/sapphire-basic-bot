require("dotenv").config(); // This loads the .env file for you

const { SapphireClient } = require("@sapphire/framework"),
      { Intents: { FLAGS } } = require("discord.js"),
      { join } = require("node:path"),
        Database = require("./database");

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
        this.dbs = new Database();
        if ("mongodb" in process.env) {
            this.dbs.connect(process.env.mongodb)
            .then(() => console.log(`[MONGODB]: Connected`))
            .catch(e => console.warn(`[MONGODB:ERROR]: `, e));
        };

        this.login(process.env.TOKEN) // Use ".env" or something else, DONT post your tokens into the files!
        .catch(console.error);
    };
};

module.exports = new BasicBot()