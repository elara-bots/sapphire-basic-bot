const { model, Schema, connect } = require("mongoose");

module.exports = class Database {
    constructor() {
        // This will be our example collection / database
        this.cookies = model("cookies", new Schema({
            id: { type: String, default: "" }, // This will be the key we'll use to search for the entry in the database
            // For our example the id will be the Discord user ID for the user

            cookies: { type: Number, default: 0 }, // This will be the value we'll set for the user
            // cookies will be the number of cookies the user has
        }));
    };

    /**
     * @param {import("discord.js").User|string} user  - Can be the User class or a string (the user's ID)
     * @param {boolean} create - If you want it to create the user's database entry (default: true)
     * @returns {Promise<import("mongoose").Model|null>} - This returns a database entry for the user or null (if there wasn't one found or not created)
     */
    async getCookies(user, create = true) {
        let db = await this.cookies.findOne({ id: user?.id ?? user });
        if (!db) {
            if (create) db = await new this.cookies({ id: user?.id ?? user }).save().catch(() => null);
            if (!db) return null;
        };
        return db;
    };

    async connect(url, options) {
        return new Promise((res, rej) => {
            return connect(url, options)
            .then(res)
            .catch(rej)
        })
    };
};