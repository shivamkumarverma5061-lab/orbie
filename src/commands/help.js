import {
    SlashCommandBuilder,
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    SectionBuilder,
    ThumbnailBuilder,
    MediaGalleryBuilder,
    MediaGalleryItemBuilder,
    MessageFlags,
} from 'discord.js';
import { PREFIX } from '../utils/config.js';

const SUPPORT_SERVER_INVITE = 'https://discord.gg/vaadiyan';
const PREMIUM_BANNER_URL = 'https://cdn.discordapp.com/attachments/1517476247410835498/1529030642518724709/ezgif.com-crop.gif?ex=6a6da341&is=6a6c51c1&hm=7d5bbd066c156936f876245b0b774f8ca39c505260cef4a98e45d83ea75cea9c';
const HELP_HEADER = '# <:icon_15:1532686173460365382> Vaadiyan Orbie claim';

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('See all available commands'),
    prefix: 'help',

    async execute(interaction) {
        await interaction.reply(buildHelp(interaction.user, interaction.client));
    },

    async prefixExecute(message, _a, client) {
        await message.reply(buildHelp(message.author, client));
    },
};

function buildHelp(user, client) {
    const avatar = user.displayAvatarURL({ size: 128, extension: 'png' });
    const botAvatar = client.user.displayAvatarURL({ size: 128, extension: 'png' });
    const c = new ContainerBuilder().setAccentColor(0xFFFFFF);

    c.addSectionComponents(
        new SectionBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    `${HELP_HEADER}\n-# Hey **${user.username}** — pick a category below`,
                ),
            )
            .setThumbnailAccessory(new ThumbnailBuilder().setURL(botAvatar)),
    );

    c.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));

    c.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
            `✨ **Bot Overview**\n` +
            `• Prefix: \`${PREFIX}\`\n` +
            `• Guilds: **${client.guilds.cache.size}**\n` +
            `• Support: [Join Support Server](${SUPPORT_SERVER_INVITE})`,
        ),
    );

    c.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));

    c.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
            `🔗 **Token & Access**\n` +
            `\`/link\`  \`${PREFIX}link\` — Save your Discord token\n` +
            `\`/unlink\`  \`${PREFIX}unlink\` — Remove saved token\n` +
            `\`/tokencheck\`  \`${PREFIX}tokencheck\` — Verify token health`,
        ),
    );

    c.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));

    c.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
            `🎮 **Quest Suite**\n` +
            `\`/quest\`  \`${PREFIX}quest\` — Pick one quest\n` +
            `\`/questall\`  \`${PREFIX}questall\` — Finish all quests\n` +
            `\`/questlist\`  \`${PREFIX}questlist\` — View quest status\n` +
            `\`/autoquest\`  \`${PREFIX}autoquest\` — Background auto-run`,
        ),
    );

    c.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));

    c.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
            `⚙️ **Utility**\n` +
            `\`/ping\`  \`${PREFIX}ping\` — Check latency\n` +
            `\`/help\`  \`${PREFIX}help\` — Open this dashboard\n` +
            `\`/support\`  \`${PREFIX}support\` — Join support server\n` +
            `\`/invite\`  \`${PREFIX}invite\` — Invite the bot`,
        ),
    );

    c.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));

    c.addMediaGalleryComponents(
        new MediaGalleryBuilder().addItems(
            new MediaGalleryItemBuilder({
                media: {
                    url: PREMIUM_BANNER_URL,
                },
                description: 'Premium help banner',
            }),
        ),
    );

    c.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));

    c.addSectionComponents(
        new SectionBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    `-# 🌐 Serving **${client.guilds.cache.size}** server(s)  ·  Prefix: \`${PREFIX}\``,
                ),
            )
            .setThumbnailAccessory(new ThumbnailBuilder().setURL(avatar)),
    );

    return { components: [c], flags: MessageFlags.IsComponentsV2 };
}
