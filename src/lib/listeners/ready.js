const { Listener } = require("@sapphire/framework");


module.exports = class Ready extends Listener {
    constructor(context) {
        super(context, { name: "ready" });
    }

    async run(/* RUN OPTIONS WILL BE HERE */) {
        console.log(`[Client]: Ready!`);
    }
}