import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

const clientId = process.env.DISCORD_CLIENT_ID || '';
const BOT_INVITE_URL = clientId
  ? `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=8&scope=bot%20applications.commands`
  : 'https://discord.com/invite/vaadiyan';

function buildInviteComponents() {
  return [
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Invite Bot')
        .setStyle(ButtonStyle.Link)
        .setURL(BOT_INVITE_URL),
    ),
  ];
}

export default {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Invite the bot to your server'),
  prefix: 'invite',

  async execute(interaction) {
    await interaction.reply({
      content: 'Use the button below to invite the bot to your server.',
      components: buildInviteComponents(),
    });
  },

  async prefixExecute(message, _a, client) {
    await message.reply({
      content: 'Use the button below to invite the bot to your server.',
      components: buildInviteComponents(),
    });
  },
};
