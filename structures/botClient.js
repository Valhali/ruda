// init
const {
	Client,
	Permissions
} = require("discord.js");

// Extend class
class botClient extends Client {
	constructor(opt) {
		super(opt);

		// define constructor
		this.db = require("../utils/db");
		this.util = require("../utils/util");
		this.setting = require("../bot_setting.json");
		this.getPrefix;
	}

	downl(url) {
		var axios = require('axios');
		//url = `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_KEY}`;
		return axios.get(url);

	}

	msg(message) {
		let client = this;
		if (message.content && !message.author.bot) console.log(message.content);
		// if user message by DM
		if (message.guild == null && !message.author.bot) {
			return;
		}
		let p = client.getPrefix(message.guild.id);

		// if people mention us, tell them about our prefix
		if (message.mentions.users.size) {
			if (message.mentions.users.first().id == client.user.id && message.content.length < 23) {
				return message.reply(`Mój prefix na tym serwerze to \`\`${p}\`\`\nWpisz \`\`${p}ruda\`\` aby zobaczyć listę komend.`)
			}
		}


		// check message with prefix|| message.author.bot
		if (!message.content.startsWith(p)) return;

		const args = message.content.slice(p.length).split(/ +/);
		const command = args.shift().toLowerCase();


		// if no command like this do nothing
		if (!client.commands.has(command)) return;
		var comid = client.commands.get(command);

		if (comid.mod && !message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
			return client.util.send(client, message, command, `${message.author} Tylko serwerowe władze mogą tego używać!`);
		}

		//  only owner
		if (comid.admin && message.author.id !== process.env.Owner && !comid.mod) {
			return client.util.send(client, message, command, `${message.author} Tylko tfuuurca bota może tego używać!`);
		}

		// only on nsfw channel
		if (comid.nsfw && !message.channel.nsfw) {
			return client.util.send(client, message, command, `${message.author} Ta komenda wymaga użycia na kanale NSFW!`);
		}

		if (comid.srv && comid.srv !== message.channel.id) {
			return client.util.send(client, message, command, `${message.author} Komenda nie może być użyta na tym serwerze!`) ;				
		}


		try {
			comid.execute(client, message, args);
			message.delete();
		} catch (error) {
			console.error(error);
			message.reply(`${message.author} Coś się popimpało i komenda nie zadziałała ;( `);
		}


	}

}




module.exports = botClient;