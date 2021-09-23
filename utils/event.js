const Discord = require('discord.js');
class Events {
    constructor() {
        //this.ev=[];
        //const ef = fs.readdirSync('./event').filter(file => file.endsWith('.js'));
        //var cm = ef.map((e, i) => {
        //     this.ev.append(require(`./event/${e}`));            
        //})
    }

    static run(client) {
        let d = new Date();
        let r = client.getAuto(d.getHours(), d.getMinutes());
        if (typeof (r) == "undefined") return;

        for (i of r) {
            let ch = client.channels.cache.get(i["chan"]);

            i.content = client.util.repl(i.content, i["srv"], client);
            i.title = client.util.repl(i.title, i["srv"], client);
            i.img = client.util.repl(i.img, i["srv"], client);
            i.thumb = client.util.repl(i.thumb, i["srv"], client);
            //console.log(i);

            if (typeof (ch) == "undefined") continue;
            let m = {};
            if (i.title || i.thumb || i.img) {
                const embed = new Discord.MessageEmbed();
                embed.setColor(client.setting.color.warning)
                    .setTitle(i.title)
                    .setDescription(i.content)
                    .setImage(i.img)
                    .setThumbnail(i.thumb);
                m.embeds = [embed];
            } else {
                m.content = i.content;
            }

            ch.send(m)
        }

    }

}

module.exports = Events;