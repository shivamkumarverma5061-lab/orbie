import { getEmoji } from '../handlers/emoji.js';
import { PREFIX } from '../utils/config.js';

export default {
  name: 'messageCreate',
  once: false,
  async execute(message, client) {
    if (message.author.bot) return;

    const map = client.globalUsers ?? new Map();
    const existing = map.get(message.author.id) ?? {
      id: message.author.id,
      username: message.author.username,
      tag: message.author.tag,
      uses: 0,
      guildIds: new Set(),
      lastSeenAt: Date.now(),
    };
    existing.username = message.author.username;
    existing.tag = message.author.tag;
    existing.uses += 1;
    existing.lastSeenAt = Date.now();
    existing.guildIds.add(message.guildId ?? 'dm');
    map.set(message.author.id, existing);
    client.globalUsers = map;
    client.saveGlobalUsers?.();

    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();

    const command = client.prefixCommands.get(commandName);
    if (!command) return;

    try {
      await command.prefixExecute(message, args, client);
    } catch (err) {
      console.error(err);
      await message.reply(`${getEmoji('error')} Something went wrong.`).catch(() => {});
    }
  },
};
