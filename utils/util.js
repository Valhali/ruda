const {
	CommandInteractionOptionResolver
} = require("discord.js");

class Util {

	static getRandInt(int) {
		return Math.floor(Math.random() * int);
	}

	static getRandomInt(min, max) {		
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	  }

	static chunk(array, chunkSize) {
		const temp = [];
		for (let i = 0; i < array.length; i += chunkSize) {
			temp.push(array.slice(i, i + chunkSize));
		}
		return temp;
	}

	static tn(a, n = 1) {
		var i = ("     ").repeat(n);
		return a + i.slice(0, i.length - a.length);
	}

	static addZero(a, n = 1) {
		var i = ("0").repeat(n);
		return i.slice(0, i.length - String(a).length) + String(a);
	}

	static delay(time) {
		return new Promise(function (resolve) {
			setTimeout(resolve, time)
		});
	}

	static usefulLnk(client) {
		const {
			usefulLink
		} = require("../bot_setting.json");
		return usefulLink.map(e => {
			// console.log(e);
			var uri = e.url.includes("{{botId}}") ? e.url.replace(/{{botId}}/g, client.user.id) : e.url;
			return `🔹[${e.name}](${uri})`;
		})
	}

	/////////////////////////////////////////////////////////////////////

	static send(client, message, cmd, msg = null, embed = null, file = null) {
		var ch = null;
		let m = {};
		if (msg) m.content = msg;
		if (embed) m.embeds = [embed];
		if (file) m.files = file;

		if (client.user.id !== message.author.id) {
			let id = null;
			let js = client.response.get(message.guild.id);
			if (js) {
				js = JSON.parse(js.conf);
				if (cmd in js["cmd"]) {
					id = js["cmd"][cmd];
				} else {
					id = js["def"];
				}
				client.channels.fetch(id)
					.then((ch) => {
						return ch.send(m);
					})
					.catch(() => {
						//console.log("catch-send");
						return message.channel.send(m);
					});
			} else {
				return message.channel.send(m);
			}
		} else {
			return message.channel.send(m);
		}


	}


	static repl(txt, srv, client, ad={}) {
		if (txt == "" || txt == null || typeof (txt) == "undefined") return txt;
		let t = txt;
		let d = new Date();
		let re = {
			"{Y}": d.getFullYear(),//rok
			"{M}": d.getMonth()+1,//miesiąc
			"{D}": d.getDate(), //dzien
			"{HH}": d.getHours(),//godzina
			"{MM}": d.getMinutes(),//minuty
			"{prefix}": client.getPrefix(srv),//prefix

		}
		re = Object.assign(re, ad);
		//console.log(re);
		for (let k in re) {
			t = t.replace(k, re[k]);
		}
		return t;
	}

	static del(msg){
		console.log(typeof(msg));
		if (typeof(msg)=="undefined") return;
		let d2 = client.getDelCmd(msg.guild.id);
		if (d2) {
			try {
				msg.delete();
			} catch (err) {
				console.log(err);
			};
		};
	}

}
/////////////////////////////////////////////////////////






module.exports = Util;