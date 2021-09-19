// init require
const Discord = require('discord.js');

const db = process.env.db;

// export module
module.exports = {
	name: "sett",
	description: "Ustawienia bota",
	aliases: ["ustaw"],
	ussage: "",
	hidden: false,
	admin: true,
	mod: true,
	nsfw: false,
	srv: false,
	async execute(client, message, args) {
		console.log(args);
		let prefix = client.getPrefix(message.guild.id);
		let cmd = args[0].toLowerCase();

		if (cmd === "prefix") {
			if (args.length < 2) return client.util.send(client, message, this.name, `${message.author} Musisz podać prefix`);
			client.setPrefix({
				1: "prefix",
				2: args[1],
				3: message.guild.id,
				4: process.env.Prefix
			});
			client.util.send(client, message, this.name, `Prefix ustawiony na \`${client.getPrefix(message.guild.id)}\``);
		}

		if (cmd === "delcmd") {
			if (args.length < 2) return client.util.send(client, message, this.name, `${message.author} Musisz podać wartość.`);
			let de = false;
			let d = args[1].toLowerCase();
			if (d == "0" || d == "off") {
				client.setDelCmd(0, message.guild.id);
				de = true;
			}
			if (d == "1" || d == "on") {
				client.setDelCmd(1, message.guild.id);
				de = true;
			}
			if (!de) client.util.send(client, message, this.name, `${message.author} Nie rozumiem co chcesz zrobić :(`);
		}


		//return client.util.send(client, message, this.name, `???`);
	}
}