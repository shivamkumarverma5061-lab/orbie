import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

const SUPPORT_SERVER_INVITE = 'https://discord.gg/vaadiyan';

function buildSupportComponents() {
  return [
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Join Support Server')
        .setStyle(ButtonStyle.Link)
        .setURL(SUPPORT_SERVER_INVITE),
    ),
  ];
}

function buildSupportMessage(client) {
  const botName = client?.user?.username || 'Quest Bot';
  return `Need help with ${botName}?`;
}

export default {
  data: new SlashCommandBuilder()
    .setName('support')
    .setDescription('Get the support server link'),
  prefix: 'support',

  async execute(interaction) {
    await interaction.reply({
      content: buildSupportMessage(interaction.client),
      components: buildSupportComponents(),
    });
  },

  async prefixExecute(message, _a, client) {
    await message.reply({
      content: buildSupportMessage(client),
      components: buildSupportComponents(),
    });
  },
};
