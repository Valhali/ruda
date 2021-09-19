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
	console.log(`Loading: ${file} as ${command.name}`)
	// set if there aliase !== null
	// // with the key as the each of command aliases and the value as the exported module
	command.aliases.map(e => {
		console.log(e);
		client.commands.set(e, command);
		console.log(`Loading: ${file} as ${e}`)
	})
}


// event Handler
client.on('messageCreate', message => {
	client.msg(message);
});

client.on('messageUpdate', (oldmmsg, message) => {
	console.log(oldmmsg.content);
	client.msg(message);
});




client.once('ready', () => {
	console.log(client.user.username + ' is Ready!');
	client.user.setActivity('Instrukcja przejmowania władzy nad światem', {
		type: 'WATCHING'
	});

	client.getPrefix = (id)=>{
		let p = client.db.prepare("SELECT conf FROM config WHERE serwer=? and id='prefix';").get(id);
		if (p) return p.conf;
		return process.env.Prefix;
	}
	client.response = client.db.prepare("SELECT conf FROM config WHERE serwer=? and id='response';");
	client.getCmdOff = client.db.prepare("SELECT conf FROM config WHERE serwer=? and id='disabled';");
	client.getCmdHidden = client.db.prepare("SELECT conf FROM config WHERE serwer=? and id='hidden';");
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

	/*//client.api.applications(client.user.id).commands("887638188791840769").delete(); 
	/*
		client.api.applications(client.user.id).commands.get().then((result) => {
			console.log(result[0].name," → ",result[0].id);
		});
	*/
	/*
		client.api.applications(client.user.id).commands.post({data: {
			name: 'help',
			type: 1,
			description: 'Lista rudych komend!'
		}})
	*/
	//console.log(client);*/
});


client.on("interactionCreate", async interaction => {
	console.log(interaction);
	if (!interaction.isCommand()) return;
	const command = client.commands.get(interaction.commandName);
	if (!command) return;
	try {
		await command.execute(interaction.client);
		interaction.channel.send("Wpisz ${prefix}ruda aby wyświetlić listę komend.")
	} catch (error) {
		if (error) console.error(error);
		await interaction.reply({
			content: 'Coś się popimpało i nie wyszło z komendą ;( ',
			ephemeral: true
		});
	}
});



client.login(Token)
	.then(e => {
		require("./webserver.js").execute(client);
	})
	.catch(err => console.log(err));