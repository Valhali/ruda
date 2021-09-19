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
	nooff: true,
	async execute(client, message, args) {
		console.log(args);
		let prefix = client.getPrefix(message.guild.id);

		if (args.length < 1) return client.util.send(client, message, this.name, `${message.author} Składnia: \`${prefix}sett subkomenda opcje...\``);

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

		if (cmd === "delcmd") { // usuwnaie komend?
			if (args.length < 2) return client.util.send(client, message, this.name, `${message.author} Musisz podać wartość.`);
			let de = false;
			let d = args[1].toLowerCase();
			if (d == "0" || d == "off") {
				client.setDelCmd(0, message.guild.id);
				de = true;
				client.util.send(client, message, this.name, `Zapisane!`);
			}
			if (d == "1" || d == "on") {
				client.setDelCmd(1, message.guild.id);
				de = true;
				client.util.send(client, message, this.name, `Zapisane!`);
			}
			if (!de) client.util.send(client, message, this.name, `${message.author} Nie rozumiem co chcesz zrobić :(`);
		}

		if (cmd === "enable") { // włącz/wyłacz komende
			if (args.length < 3) return client.util.send(client, message, this.name, `${message.author} Składnia: \`${prefix}sett enable nazwa_komendy włącz_wyłącz.\``);
			let en = false;
			let com = args[1].toLowerCase();
			let d = args[2].toLowerCase();
			if (d == "0" || d == "off") {
				for (i of client.commands) {
					if (i.includes(com)) {						
						if (typeof (i[1].nooff) != "undefined" && i[1].nooff == true) {
							return client.util.send(client, message, this.name, `${message.author} Komenda \`${i[1].name}\` Nie może być wyłączona.`);
						}
						break;
					}
				}
				client.setCmdDisabled(com, message.guild.id, 0);
				en = true;
				client.util.send(client, message, this.name, `Zapisane!`);
			}
			if (d == "1" || d == "on") {
				client.setCmdDisabled(com, message.guild.id, 1);
				en = true;
				client.util.send(client, message, this.name, `Zapisane!`);
			}
			if (!en) client.util.send(client, message, this.name, `${message.author} Składnia: \`${prefix}sett enable nazwa_komendy włącz_wyłącz.\``);
		}

		
		//return client.util.send(client, message, this.name, `???`);
	}
}