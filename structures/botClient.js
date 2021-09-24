// init
const {
	Client,
	Permissions,
	MessageEmbed

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


		if (message.content == `<@!${client.user.id}>` || message.content == `<@${client.user.id}>`) {
			return message.reply(`Mój prefix na tym serwerze to \`\`${p}\`\`\nWpisz \`\`${p}ruda\`\` aby zobaczyć listę komend.`);
		}

		// check message with prefix|| message.author.bot
		if (!message.content.startsWith(p)) return;

		const args = message.content.slice(p.length).split(/ +/);
		const command = args.shift().toLowerCase();


		// if no command like this do nothing
		if (client.commands.has(command)) {
			var comid = client.commands.get(command);
			if (client.getCmdDisabled(comid.name, message.guild.id)) {
				return;
			}

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

			if (comid.srv.length > 0 && typeof (comid.srv[message.channel.id]) != "undefined") {
				return; //client.util.send(client, message, command, `${message.author} Komenda nie może być użyta na tym serwerze!`) ;				
			}


			try {
				comid.execute(client, message, args);
				if (comid.nodel) return;
				let d = client.getDelCmd(message.guild.id);
				if (d) {
					try {
						message.delete();
					} catch (err) {
						console.log(err);
					};
				};

			} catch (error) {
				console.error(error);
				message.reply(`${message.author} Coś się popimpało i komenda nie zadziałała ;( `);
			}
		}

	}

	cc(message) {
		let client = this;
		let id = message.guild.id;
		let p = client.getPrefix(message.guild.id);
		if (!message.content.startsWith(p)) return;
		const args = message.content.slice(p.length).split(/ +/);
		const command = args.shift().toLowerCase();
		let odp = [],
			odp2 = [],
			cnf = [];
		let d2 = client.getDelCmd(message.guild.id);
		if (d2) {
			try {
				message.delete();
			} catch (err) {
				console.log(err);
			};
		};
		let d = client.db.prepare("SELECT * FROM command WHERE srv=? AND cmd=?;").all([id, command]);
		if (typeof (d) != "undefined") {
			for (let i in d) {
				odp.push(d[i]["txt"]);
			}
		}


		d = client.db.prepare("SELECT conf FROM config WHERE serwer=? and id=?;").all([id, `cmd_${command}`]);
		if (typeof (d) != "undefined") {
			if (typeof (d[0]) != "undefined") {
				let cnf = JSON.parse(d[0].conf);
				if (typeof (cnf["cnfid"]) != "undefined") {
					for (let i in cnf) {
						odp2.push(cnf[i]);
					}
				}
			}
		}

		let v = 0,
			usrav = '',
			usrni = '';
		if (odp.length > 0 && odp2.length > 0) v = client.util.getRandomInt(0, 1)
		if (odp.length == 0 && odp2.length > 0) v = 1
		if (odp.length == 0 && odp2.length == 0) return;
		if (message.mentions.users.size) {
			usrav = message.mentions.users.first().displayAvatarURL({
				format: "png",
				size: 1024
			});
			usrni = message.guild.members.cache.get(message.mentions.users.first().id).displayName;
		}
		let auav = '',
			auni = ''
		auni = message.guild.members.cache.get(message.author.id).displayName;
		auav = message.author.displayAvatarURL({
			format: "png",
			size: 1024
		});
		let re = {
			"{autor.nick}": auni,
			"{autor.avatar}": auav,
			"{param.avatar}": usrav,
			"{param.nick}": usrni,
			"{autor}": message.author,
			"{param}": args.join(" "),
		}
		if (v == 1 && odp2.length > 0) {
			odp2 = odp2[client.util.getRandomInt(1, odp2.length - 1)]


			odp2["odp"] = client.util.repl(odp2["odp"], message.guild.id, client, re);
			odp2["tyt"] = client.util.repl(odp2["tyt"], message.guild.id, client, re);
			odp2["img"] = client.util.repl(odp2["img"], message.guild.id, client, re);
			odp2["th"] = client.util.repl(odp2["th"], message.guild.id, client, re);
			/*
        odp2["img"] = await tgif(odp2["img"])  
        odp2["th"] = await tgif(odp2["th"])  
        
        odp2["img"] = await timg(odp2["img"])  
        odp2["th"] = await timg(odp2["th"])   */


			const embed = new MessageEmbed();
			embed.setColor(client.setting.color.info)
				.setTitle(odp2.tyt)
				.setDescription(odp2.odp)
				.setImage(odp2.img)
				.setThumbnail(odp2.th);

			return client.util.send(client, message, command, null, embed);
		}
		if (v == 0 && odp.length > 0) {
			odp = odp[client.util.getRandomInt(0, odp.length - 1)];
			odp = client.util.repl(odp, message.guild.id, client, re);
			return client.util.send(client, message, command, odp);
		}

	}



}




module.exports = botClient;