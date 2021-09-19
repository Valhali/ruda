class Util {

	static getRandInt(int) {
		return Math.floor(Math.random() * int);
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

}
/////////////////////////////////////////////////////////






module.exports = Util;