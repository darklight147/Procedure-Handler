import GphApiClient from 'giphy-js-sdk-core';
import { giphyToken } from './conf';
import {Client, ChannelManager} from 'discord.js'

const SEND = (client: Client, link: string) => {
	interface IChannel extends ChannelManager {
		cache: any
	}
	const Channel: IChannel = client.channels;
	const giphy = GphApiClient(giphyToken);
	try {
		giphy
			.search('gifs', { q: 'gaming' })
			.then((response: any) => {
				const ttl = response.data.length;
				const responsIndex = Math.floor(Math.random() * 10 + 1) % ttl;
				const responseGiph = response.data[responsIndex];
				Channel.cache
					.get('CHANNEL_ID')
					.send(
						`@everyone , Hey Gamers, the owner of game-linter.com just added a New game!, check it out\n ${link} HAVE FUN <3`,
						{
							files: [responseGiph.images.fixed_height.url],
						}
					);
			})
			.catch((err: Error) => {
				Channel.cache
					.get('CHANNEL_ID')
					.send(
						`@everyone , Hey Gamers, the owner of game-linter.com just added a New game!, check it out\n ${link} HAVE FUN <3`
					);
			});
	} catch (error) {
		console.log(error);
	}
};

export default SEND;