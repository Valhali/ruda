// init require
const Discord = require('discord.js');
const fetchAll = require('discord-fetch-all');

// export module
module.exports = {
	name : "m",
	description : "test",
	aliases : ["mu"],
	ussage : "",
	hidden : true,
	admin : true,
	mod : false,
	nsfw : false,
	srv : [], //server
	async execute(client,message,args){
		
		const allMessages = await fetchAll.messages(message.channel, {
			reverseArray: true, // Reverse the returned array
			userOnly: true, // Only return messages by users
			botOnly: false, // Only return messages by bots
			pinnedOnly: false, // Only returned pinned messages
		});
		
		for(m in allMessages){		
				console.log(allMessages[m].content);
		}		
		
	}
}