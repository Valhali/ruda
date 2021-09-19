// init require
const Discord = require('discord.js');
const fs = require("fs");
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const owner = process.env.Owner;
const prefix = process.env.Prefix;


// export module
module.exports = {
	name: "ruda",
	description: "Lista komend",
	aliases: ["?", "??", "???", "h", "help"],
	ussage: "",
	hidden: false,
	admin: false,
	mod: false,
	nsfw: false,
	srv: false,
	nooff: true,
	async execute(client, message, args) {
		const {
			description,
			color
		} = client.setting;
		const own = client.users.resolve(owner);

		let p = client.getPrefix(message.guild.id);

		var util = client.util;
		const embed = new Discord.MessageEmbed();

		let js = client.getCmdOff.get(message.guild.id);
		let js3 = client.getCmdHidden.get(message.guild.id);
		var cm = commandFiles.map((e, i) => {
			const cmd = require(`../commands/${e}`)
			let disable = false;
			let hidden = false;
			let js2 = {};
			if (typeof (js) != "undefined") { // komendy wyłaczone
				js2 = JSON.parse(js.conf);
				if (js2["disable"].includes(cmd.name)) {
					disable = true;
				} else {
					disable = false;
				}
			}
			if (typeof (js3) != "undefined") { //komendy ukryte
				js4 = JSON.parse(js3.conf);
				if (js4["hidden"].includes(cmd.name)) {
					hidden = true;
				} else {
					hidden = false;
				}
			}
			let disable2 = client.getCmdDisabled(cmd.name, message.guild.id);
			//console.log("dis2:", disable2, " → ", cmd.name);
			//console.log(cmd.name, cmd.srv != false && cmd.srv == message.guild.id)
			if (!cmd.hidden && !disable && !hidden && !disable2 ) {
				if (cmd.srv == false || cmd.srv == message.guild.id) {
					return ` ${p}**${util.tn(cmd.name,2)}** ${cmd.ussage} → ${cmd.description}`;
				}
			}
			return null;
		});

		embed
			.setColor(color.warning)
			.setTitle("Lista dostępnych komend")
			.setDescription(
				`${cm.filter(e => {return e !== null} ).join("\n")}\n`
			)
			.setImage("https://cdn.glitch.com/5f7d51b1-406e-43aa-9be8-293ff08f0543%2Fgiff.gif?v=1579915986916")
			.setThumbnail("https://upload.wikimedia.org/wikipedia/commons/8/88/Radar2.gif");


		return client.util.send(client, message, this.name, null, embed);

	}
}