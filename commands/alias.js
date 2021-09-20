// init require
const Discord = require('discord.js');
const fs = require("fs");
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const owner = process.env.Owner;
const prefix = process.env.Prefix;


// export module
module.exports = {
	name: "alias",
	description: "Aliasy (alternatywne nazwy) komend",
	aliases: ["aliases", "aliasy"],
	ussage: "",
	hidden: false,
	admin: false,
	mod : false,
	nsfw: false,
	srv: false,
	async execute(client, message, args) {
		const {
			description,
			color
		} = client.setting;
		const own = client.users.resolve(owner);

		var util = client.util;
		const embed = new Discord.MessageEmbed();

		var cm = commandFiles.map((e, i) => {
			const cmd = require(`../commands/${e}`)
			let disable = false;
			let hidden = false;

			disable = client.getCmdDisabled(cmd.name, message.guild.id);
			hidden = client.getCmdHidden(cmd.name, message.guild.id);
			if (!cmd.hidden && !disable && !hidden) {
				return ` **${util.tn(cmd.name,2)}** → ${util.tn(cmd.aliases.join(", "),4)}`
			}
			return null;
		});

		embed
			.setColor(color.warning)
			.setTitle("Lista aliasów")
			.setDescription(
				`${cm.filter(e => {return e !== null} ).join("\n")}\n`
			)
			.setImage("https://cdn.glitch.com/5f7d51b1-406e-43aa-9be8-293ff08f0543%2Fgiff.gif?v=1579915986916")
			.setThumbnail("https://upload.wikimedia.org/wikipedia/commons/8/88/Radar2.gif");


		return client.util.send(client, message, this.name, null, embed);

	}
}