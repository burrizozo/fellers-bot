const Discord = require('discord.js');
const logger = require('./../logger');

module.exports = {
	tts : {
		name : 'volume',
		args : false,
		description : 'Command to call for help from the Discord bot',
		execute: async (message, data, mongo) => {
			logger.info("dab");
		}
	},
};
