require('dotenv').config()
const {
	Collection,
	Intents,
	Util
} = require('discord.js');
const botClient = require("./structures/botClient");
const client = new botClient({
	intents: [Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_BANS,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		Intents.FLAGS.GUILD_INTEGRATIONS,
		Intents.FLAGS.GUILD_WEBHOOKS,
		Intents.FLAGS.GUILD_INVITES,
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILD_PRESENCES,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_MESSAGE_TYPING,
		Intents.FLAGS.DIRECT_MESSAGES,
		Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
		Intents.FLAGS.DIRECT_MESSAGE_TYPING
	]
});


const owner = process.env.Owner;
const prefix = process.env.Prefix;
const Token = process.env.Token;

const fs = require('fs');
const cmdir = './commands';
client.commands = new Collection;




// commands init
const commandFiles = fs.readdirSync(cmdir).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`${cmdir}/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
	//console.log(`Loading: ${file} as ${command.name}`)
	// set if there aliase !== null
	// // with the key as the each of command aliases and the value as the exported module
	command.aliases.map(e => {
		//console.log(e);
		client.commands.set(e, command);
		//console.log(`Loading: ${file} as ${e}`)
	})
}


// event Handler
client.on('messageCreate', message => {
	if (typeof (message) != "undefined") client.cc(message);
	if (typeof (message) != "undefined") client.scc(message);
	if (typeof (message) != "undefined") client.msg(message);
});

client.on('messageUpdate', (oldmsg, message) => {
	//console.log(oldmsg.content);
	if (typeof (message) != "undefined") client.cc(message);
	if (typeof (message) != "undefined") client.scc(message);
	if (typeof (message) != "undefined") client.msg(message);
});


client.on("error", (e) => console.error(e));
//client.on("warn", (e) => console.warn(e));
//client.on("debug", (e) => console.info(e));

client.once('ready', () => {
	console.log(client.user.username + ' is Ready!');

	console.log(`on ${client.guilds.cache.size} servers, for ${client.users.cache.size} users.`);

	client.user.setActivity('Instrukcja przejmowania w??adzy nad ??wiatem', {
		type: 'WATCHING'
	});

	client.getPrefix = (id) => {
		let p = client.db.prepare("SELECT conf FROM config WHERE serwer=? and id='prefix';").get(id);
		if (p) return p.conf;
		return process.env.Prefix;
	}
	client.response = client.db.prepare("SELECT conf FROM config WHERE serwer=? and id='response';");
	client.logChanel = client.db.prepare("SELECT conf FROM config WHERE serwer=? and id='log';");
	client.impset = client.downl(`${process.env.IMPORT_SET}${encodeURI(new Date().toString() ) }`);

	client.setPrefix = (p) => {
		let i = [p["1"], p["3"]];
		if (p["4"] == p["2"]) {
			return client.db.prepare("DELETE FROM config WHERE id=? AND serwer=?;").run(i);
		}

		if (client.db.prepare("SELECT * FROM config WHERE id=? AND serwer=?;").get(i)) {
			return client.db.prepare("UPDATE OR IGNORE config SET conf=?2 WHERE id=?1 AND serwer=?3;").run(p)
		} else {
			return client.db.prepare("INSERT OR IGNORE INTO config(id, conf, serwer) VALUES( ?1,?2,?3) ;").run(p);
		}
	}


	client.impset.then(i => {
		let js = i.data;
		for (i in js) {
			let k = Array();
			for (j of js[i][0].keys()) {
				k.push("?")
			}
			let col = k.join(",")
			if (js[i][1]) {
				if (!client.db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='${i}';`).get()) {
					continue;
				}
				try {
					client.db.prepare(`DELETE FROM ${i}`).run();
				} catch (error) {
					console.log(error);
				}
			}

			for (l in js[i][1]) {
				client.db.prepare(`INSERT OR IGNORE INTO ${i} VALUES (${col})`).run(js[i][1][l]);
			}

		}

	})


	client.setDelCmd = (d, id) => {
		if (process.env.DELCMD == d) {
			return client.db.prepare("DELETE FROM config WHERE id='delcmd' AND serwer=?;").run(id);
		}
		if (client.db.prepare("SELECT * FROM config WHERE id='delcmd' AND serwer=?;").get(id)) {
			return client.db.prepare("UPDATE OR IGNORE config SET conf=? WHERE id='delcmd' AND serwer=?;").run([d, id])
		} else {
			return client.db.prepare("INSERT OR IGNORE INTO config(id, conf, serwer) VALUES( 'delcmd',?,?) ;").run([d, id]);
		}
	}



	client.getDelCmd = (id) => {
		let d = client.db.prepare("SELECT conf FROM config WHERE serwer=? and id='delcmd';").get(id);
		if (d) return false;
		return process.env.DELCMD;
	}

	client.setCmdDisabled = (cmd, id, val) => {
		let js = client.db.prepare("SELECT conf FROM config WHERE id='cmdoff' AND serwer=?;").get(id);
		if (js) {
			js = JSON.parse(js.conf);
		} else {
			js = {};
		}
		let c = '';
		for (i of client.commands) {
			if (i.includes(cmd)) {
				c = i[1].name;
				break;
			}
		}
		if (val == 1) {
			js[c] = undefined;
		} else {
			js[c] = val;
		}

		if (client.db.prepare("SELECT * FROM config WHERE id='cmdoff' AND serwer=?;").get(id)) {
			return client.db.prepare("UPDATE OR IGNORE config SET conf=? WHERE id='cmdoff' AND serwer=?;").run([JSON.stringify(js), id])
		} else {
			return client.db.prepare("INSERT OR IGNORE INTO config(id, conf, serwer) VALUES( 'cmdoff',?,?) ;").run([JSON.stringify(js), id]);
		}

	}


	client.getCmdDisabled = (cmd, id) => {
		let d = client.db.prepare("SELECT conf FROM config WHERE serwer=? and id='cmdoff';").get(id);
		if (typeof (d) == "undefined") return false;
		let js = JSON.parse(d.conf);
		if (typeof (js[cmd]) != "undefined") {
			if (js[cmd] == 0) return true;
		}
		return false;
	}



	client.setCmdHidden = (cmd, id, val) => {
		let js = client.db.prepare("SELECT conf FROM config WHERE id='cmdhide' AND serwer=?;").get(id);
		if (js) {
			js = JSON.parse(js.conf);
		} else {
			js = {};
		}
		let c = '';
		for (i of client.commands) {
			if (i.includes(cmd)) {
				c = i[1].name;
				break;
			}
		}
		if (val == 1) {
			js[c] = undefined;
		} else {
			js[c] = val;
		}

		if (client.db.prepare("SELECT * FROM config WHERE id='cmdhide' AND serwer=?;").get(id)) {
			return client.db.prepare("UPDATE OR IGNORE config SET conf=? WHERE id='cmdhided' AND serwer=?;").run([JSON.stringify(js), id])
		} else {
			return client.db.prepare("INSERT OR IGNORE INTO config(id, conf, serwer) VALUES( 'cmdhide',?,?) ;").run([JSON.stringify(js), id]);
		}

	}



	client.getCmdHidden = (cmd, id) => {
		let d = client.db.prepare("SELECT conf FROM config WHERE serwer=? and id='cmdhide';").get(id);
		if (typeof (d) == "undefined") return false;
		let js = JSON.parse(d.conf);
		if (typeof (js[cmd]) != "undefined") {
			if (js[cmd] == 0) return true;
		}
		return false;
	}


	client.getAuto = (h, m) => {
		let d = client.db.prepare("SELECT * FROM auto WHERE hour=? and minute=? ORDER BY srv ASC;").all([h, m]);
		if (typeof (d) == "undefined") return false;
		return d;
	}


	client.setAuto = (hh, mm, msg, ch, c) => {
		let i = [hh, mm, c[2], msg.guild.id, ch, c[3], c[5], c[4], msg.author.id]
		return client.db.prepare("INSERT OR IGNORE INTO auto(hour,minute,content,srv,chan,title,thumb,img,author) VALUES( ?,?,?,?,?,?,?,?,?) ;").run(i);
	}


	client.getCcNames = (id) => {
		let cmd = [],
			j = '';
		let d = client.db.prepare("SELECT cmd FROM command WHERE srv=?;").all([id]);
		if (typeof (d) != "undefined") {
			for (let i in d) {
				if (!cmd.includes(d[i]["cmd"])) {
					cmd.push(d[i]["cmd"]);
				};
			}
		}


		d = client.db.prepare("SELECT conf FROM config WHERE serwer=? and id LIKE ?;").all([id, "cmd_%"]);
		if (typeof (d) != "undefined") {
			for (let i in d) {
				let js = JSON.parse(d[i].conf);
				if (typeof (js["cnfid"]) == "undefined") continue;
				j = js["cnfid"].replace("cmd_", "");
				if (!cmd.includes(j)) {
					cmd.push(j);
				};
			}
		}


		d = client.db.prepare("SELECT conf FROM config WHERE serwer=? and id LIKE ?;").all([id, "scmd_%"]);
		if (typeof (d) != "undefined") {
			for (let i in d) {
				let js = JSON.parse(d[i].conf);
				if (typeof (js["cnfid"]) == "undefined") continue;
				j = js["cnfid"].replace("scmd_", "");
				if (!cmd.includes(j)) {
					cmd.push(j);
				};
			}
		}

		return cmd.sort();
	}



	client.userLeave = (usr, srv) => {
		let js = {
			count: 0,
			date: []
		};
		let ins = true;
		let d = client.db.prepare("SELECT val FROM leave WHERE srv=? and usr=?;").get([srv, usr]);
		if (typeof (d) != "undefined") {
			js = JSON.parse(d.val);
			ins = false;
		}
		js.count++;
		js.date.push(Date.now())
		console.log(js);
		js = JSON.stringify(js);
		if (ins) {
			client.db.prepare("INSERT OR IGNORE INTO leave(val, usr, srv) VALUES (?, ?, ?);").run([js, usr, srv]);
		} else {
			client.db.prepare("UPDATE OR IGNORE leave SET val=? WHERE id=? AND srv=?;").run([js, usr, srv]);
		}

	}


	client.userNickHistory = (old, now) => {
		let js = {
			history: []
		};
		let ins = true;
		let d = client.db.prepare("SELECT val FROM nickHistory WHERE srv=? and usr=?;").get([now.guild.id, now.id]);
		if (typeof (d) != "undefined") {
			js = JSON.parse(d.val);
			ins = false;
		}
		js.history.push([Date.now(), `${now.user.username}#${now.user.discriminator}`, now.displayName]);
		console.log(js);
		js = JSON.stringify(js);
		if (ins) {
			client.db.prepare("INSERT OR IGNORE INTO nickHistory(val, usr, srv) VALUES (?, ?, ?);").run([js, now.id, now.guild.id]);
		} else {
			client.db.prepare("UPDATE OR IGNORE nickHistory SET val=? WHERE usr=? AND srv=?;").run([js, now.id, now.guild.id]);
		}

	}
	//client.api.applications(client.user.id).commands.get().then((result) => {
	//console.log(result[0].name, " ??? ", result[0].id);
	//client.api.applications(client.user.id).commands(result[0].id).delete();
	//});
	// test              spiochy                faza
	let g = ["518828593741299717"] //, "620518612024819713", "710537384617312318"]

	for (i of g) {
		try {
			client.api.applications(client.user.id).guilds(i).commands.get().then((result) => {
				for (j of result) {
					if (typeof (result[0].name) != "undefined") {
						console.log(j.name, " ??? ", j.id);
						//client.api.applications(client.user.id).guilds(i).commands(j.id).delete();
					}
				}
			});
		} catch {}
	}
	for (i of g) {
		try {
			/*client.api.applications(client.user.id).guilds(i).commands.post({
				data: {
					name: 'test',
					type: 3,
					//description: 'Lista rudych komend!'
				}
			})*/
		} catch {}
	}
	//console.log(client);*/


	const slashFiles = fs.readdirSync('./slash').filter(file => file.endsWith('.json'));
	var cm = slashFiles.map((e, i) => {
		/*client.api.applications(client.user.id).guilds("518828593741299717").commands.post({
			data: require(`./slash/${e}`)
		})*/
	})


	client.Event = require("./utils/event");
	console.log(client.Event.run);

	var interval = setInterval(function () {
		client.Event.run(client);
	}, 60 * 1000);



	//console.log(client.channels.cache);
});


client.on("interactionCreate", async interaction => {
	console.log(interaction);
	if (interaction.isCommand()) {
		const command = client.commands.get(interaction.commandName);
		if (!command) return;
		try {
			await command.execute(interaction.client);
			interaction.channel.send("Wpisz ${prefix}ruda aby wy??wietli?? list?? komend.")
		} catch (error) {
			if (error) console.error(error);
			await interaction.reply({
				content: 'Co?? si?? popimpa??o i nie wysz??o z komend?? ;( ',
				ephemeral: true
			});
		}
	}
	if (interaction.isContextMenu()) {
		interaction.reply(`[TEST] ${interaction.member} Chyba dzia??a ale nic nie robi... `);
	}


});

client.on('guildMemberRemove', async member => {
	client.userLeave(member.id, member.guild.id);
});

client.on('guildMemberUpdate', async (old, now) => {
	if (old.user.username != now.user.username || old.displayName != now.displayName) {
		return client.userNickHistory(old, now);
		console.log(old.displayName, now.displayName);
	}
});

client.on('guildMemberAdd', async member => {
	console.log(member.user.username)
});

client.login(Token)
	.then(e => {
		require("./webserver.js").execute(client);
	})
	.catch(err => console.log(err));