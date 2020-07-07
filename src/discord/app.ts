import Discord, {Client} from 'discord.js'

const client: Client = new Discord.Client();
import { TOKEN } from "./conf";


client.once('ready', (): void => {
	console.log('Ready!');
});


client.login(TOKEN);

export default client;