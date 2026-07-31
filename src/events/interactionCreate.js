import { getEmoji } from '../handlers/emoji.js';
import { handleLinkModal, handleLinkPromptButton, handleLinkInstructionButton } from '../commands/questCommands.js';

export default {
    name: 'interactionCreate',
    once: false,
    async execute(interaction, client) {
        const map = client.globalUsers ?? new Map();
        const existing = map.get(interaction.user.id) ?? {
            id: interaction.user.id,
            username: interaction.user.username,
            tag: interaction.user.tag,
            uses: 0,
            guildIds: new Set(),
            lastSeenAt: Date.now(),
        };
        existing.username = interaction.user.username;
        existing.tag = interaction.user.tag;
        existing.uses += 1;
        existing.lastSeenAt = Date.now();
        existing.guildIds.add(interaction.guildId ?? 'dm');
        map.set(interaction.user.id, existing);
        client.globalUsers = map;
        client.saveGlobalUsers?.();

        // Modal: link token
        if (interaction.isModalSubmit() && interaction.customId === 'link_token_modal') {
            await handleLinkModal(interaction, client);
            return;
        }

        // Buttons: link help instructions + manual token entry
        if (interaction.isButton() && interaction.customId === 'link_prompt') {
            await handleLinkPromptButton(interaction);
            return;
        }

        if (interaction.isButton() && interaction.customId.startsWith('link_instruction_')) {
            const platform = interaction.customId.replace('link_instruction_', '');
            await handleLinkInstructionButton(interaction, platform);
            return;
        }

        // Slash commands
        if (!interaction.isChatInputCommand()) return;
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction, client);
        } catch (err) {
            console.error(err);
            const msg = { content: `${getEmoji('error')} Something went wrong.`, flags: 64 };
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(msg).catch(() => {});
            } else {
                await interaction.reply(msg).catch(() => {});
            }
        }
    },
};
