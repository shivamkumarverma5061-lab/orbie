import {
    SlashCommandBuilder,
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    SectionBuilder,
    ThumbnailBuilder,
    MessageFlags,
} from 'discord.js';
import { OWNER_ID, PREFIX } from '../utils/config.js';

function isOwner(userId) {
    return OWNER_ID && String(userId) === String(OWNER_ID);
}

const SUPPORT_SERVER_INVITE = 'https://discord.gg/vaadiyan';
const OWNER_BANNER_URL = 'https://cdn.discordapp.com/attachments/1517476247410835498/1529030642518724709/ezgif.com-crop.gif?ex=6a6da341&is=6a6c51c1&hm=7d5bbd066c156936f876245b0b774f8ca39c505260cef4a98e45d83ea75cea9c';

function buildOwnerCard(title, lines) {
    const c = new ContainerBuilder().setAccentColor(0xFFFFFF);
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`# 👑 ${title}\n${lines.join('\n')}`));
    return { components: [c], flags: MessageFlags.IsComponentsV2 };
}

function buildOwnerPremiumPanel(user, client) {
    const botAvatar = client.user.displayAvatarURL({ size: 128, extension: 'png' });
    const c = new ContainerBuilder().setAccentColor(0xFFFFFF);

    c.addSectionComponents(
        new SectionBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    `# 👑 Orbie Owner Command Center\n-# Premium control hub for **${user.username}**`,
                ),
            )
            .setThumbnailAccessory(new ThumbnailBuilder().setURL(botAvatar)),
    );

    c.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));

    c.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
            `🌐 **Bot Status**\n` +
            `• Serving **${client.guilds.cache.size}** guild(s)\n` +
            `• Prefix: \`${PREFIX}\`\n` +
            `• Support: [Join Support Server](${SUPPORT_SERVER_INVITE})`,
        ),
    );

    c.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));

    c.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
            `🧰 **Owner Tools**\n` +
            `\`/serverlist\` — Connected servers\n` +
            `\`/userlist\` — Global user usage list`,
        ),
    );

    c.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));

    c.addSectionComponents(
        new SectionBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    '-# Premium banner loaded for the owner dashboard',
                ),
            )
            .setThumbnailAccessory(new ThumbnailBuilder().setURL(OWNER_BANNER_URL)),
    );

    return { components: [c], flags: MessageFlags.IsComponentsV2 };
}

function buildServerList(client) {
    const guilds = client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount);
    const lines = guilds.map((g) => `<:arrow:1532676316413820939> **${g.name}**`);

    const c = new ContainerBuilder().setAccentColor(0xFEE75C);
    c.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
            `# <:community_server_boosted:1532676318095867978> __Server List__\n${lines.length ? lines.join('\n') : 'No servers found.'}`,
        ),
    );

    return { components: [c], flags: MessageFlags.IsComponentsV2 };
}

function buildUserList(client) {
    const users = Array.from(client.globalUsers?.values?.() ?? [])
        .sort((a, b) => (b.uses ?? 0) - (a.uses ?? 0) || (b.lastSeenAt ?? 0) - (a.lastSeenAt ?? 0));

    const lines = users.length
        ? users.slice(0, 40).map((u, i) => `${i + 1}. **${u.tag || u.username || u.id}** — ${u.uses ?? 0} uses • ${u.guildIds?.size ?? 0} guilds`)
        : ['No users found yet.'];

    return buildOwnerCard(`<:user:1532681865675280496> User List (${users.length})`, lines);
}

export default {
    data: new SlashCommandBuilder()
        .setName('owner')
        .setDescription('Owner-only control panel'),
    prefix: 'owner',

    async execute(interaction) {
        if (!isOwner(interaction.user.id)) {
            await interaction.reply({
                content: 'Only the owner can use this command.',
                flags: MessageFlags.Ephemeral,
            });
            return;
        }

        await interaction.reply(buildOwnerPremiumPanel(interaction.user, interaction.client));
    },

    async prefixExecute(message, _args, client) {
        if (!isOwner(message.author.id)) return;
        await message.reply(buildOwnerPremiumPanel(message.author, client));
    },
};

export const serverListCmd = {
    data: new SlashCommandBuilder()
        .setName('serverlist')
        .setDescription('Owner-only server list'),
    prefix: 'serverlist',

    async execute(interaction, client) {
        if (!isOwner(interaction.user.id)) {
            await interaction.reply({ content: 'Only the owner can use this command.', flags: MessageFlags.Ephemeral });
            return;
        }
        await interaction.reply(buildServerList(client));
    },

    async prefixExecute(message, _args, client) {
        if (!isOwner(message.author.id)) return;
        await message.reply(buildServerList(client));
    },
};

export const userListCmd = {
    data: new SlashCommandBuilder()
        .setName('userlist')
        .setDescription('Owner-only user list'),
    prefix: 'userlist',

    async execute(interaction, client) {
        if (!isOwner(interaction.user.id)) {
            await interaction.reply({ content: 'Only the owner can use this command.', flags: MessageFlags.Ephemeral });
            return;
        }
        await interaction.reply(buildUserList(client));
    },

    async prefixExecute(message, _args, client) {
        if (!isOwner(message.author.id)) return;
        await message.reply(buildUserList(client));
    },
};

export const userCmd = {
    prefix: 'user',
    async prefixExecute(message, _args, client) {
        if (!isOwner(message.author.id)) return;
        await message.reply(buildUserList(client));
    },
};
