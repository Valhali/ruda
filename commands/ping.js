// init require
const Discord = require('discord.js');

const db = process.env.db; 

// export module
module.exports = {
	name : "ping",
	description : "check transmit and server runtime!",
	aliases : ["p","test"],
	ussage : "",
	hidden : false,
	admin : true,
	mod : true,
	nsfw : false,
	srv : false,
	async execute(client,message,args){
		const dt = new Date(message.createdTimestamp);
		return client.util.send(client, message, this.name, `pong \`\`${new Date() - dt}ms\`\` | ws : \`\`${client.ws.ping}ms\`\``);
	}
}