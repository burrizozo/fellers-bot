const Discord = require('discord.js');
const logger = require('./../logger');
const textToSpeech = require('@google-cloud/text-to-speech');
const ytdl = require('ytdl-core');
const streamBuffers = require('stream-buffers');

module.exports = {
	tts : {
		name : 'tts',
		args : false,
		description : 'Command to call for help from the Discord bot',
		execute: async (message, data, mongo) => {
			logger.info(data);
			const voiceChannel = message.member.voiceChannel;
			const ttsClient = new textToSpeech.TextToSpeechClient();
			const ssml = `<speak>
			Here are <say-as interpret-as="characters">SSML</say-as> samples.
			I can pause <break time="3s"/>.
			I can play a sound
			<audio src="https://www.example.com/MY_MP3_FILE.mp3">didn't get your MP3 audio file</audio>.
			I can speak in cardinals. Your number is <say-as interpret-as="cardinal">10</say-as>.
			Or I can speak in ordinals. You are <say-as interpret-as="ordinal">10</say-as> in line.
			Or I can even speak in digits. The digits for ten are <say-as interpret-as="characters">10</say-as>.
			I can also substitute phrases, like the <sub alias="World Wide Web Consortium">W3C</sub>.
			Finally, I can speak a paragraph with two sentences.
			<p><s>This is sentence one.</s><s>This is sentence two.</s></p>
		  </speak>`;
			const req = {
				input: {ssml: ssml},
				voice: {languageCode: 'en-US', ssmlGender: 'FEMALE'},
				audioConfig: {audioEncoding: 'OGG_OPUS'},
			};
			
			if (voiceChannel) {
				try {
					let voiceConnection = await voiceChannel.join();
					if (voiceConnection) {
						logger.info('connected');
					}
					const id = setInterval(async () => {
						if (voiceConnection && voiceConnection.channel.members.size < 2) {
							voiceConnection.disconnect();
							clearInterval(id);
						}
					}, 10000);
					
					try {
						const [ttsResponse] = await ttsClient.synthesizeSpeech(req);
						const readableStreamBuffer = new streamBuffers.ReadableStreamBuffer({
							frequency: 10, 	 // in milliseconds
							chunkSize: 2048, // in bytes
						});
						readableStreamBuffer.put(ttsResponse.audioContent);
						console.log(readableStreamBuffer);

						voiceConnection.playStream(
							// ytdl('https://www.youtube.com/watch?v=_AzeUSL9lZc', { filter : 'audioonly' })
							readableStreamBuffer
						);
					} catch (error) {
						logger.error(error);
					}

				} catch (error) {
					logger.error(error);
				}
			}
		}
	},
};
