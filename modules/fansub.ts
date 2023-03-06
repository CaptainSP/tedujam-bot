import {
  CommandInteraction,
  ActionRowBuilder,
  SlashCommandBuilder,
  ButtonBuilder,
  CommandInteractionOptionResolver,
  Client,
  EmbedBuilder,
} from "discord.js";

export default class AnimeciX {
  public static init(commands: any) {
    const data = new SlashCommandBuilder()
      .setName("duyuru")
      .setDefaultMemberPermissions(8)
      .setDescription("Linkli duyuru komutu")
      .addStringOption((option) =>
        option.setName("metin").setRequired(true).setDescription("Duyuru metni")
      )
      .addStringOption((option) =>
        option.setName("link").setRequired(false).setDescription("Link")
      )
      .addStringOption((option) =>
        option
          .setName("link_metni")
          .setRequired(false)
          .setDescription("Link Metni")
      );

    commands.create(data.toJSON());
  }

  public static async message(interaction: CommandInteraction, client: Client) {
    const userName = interaction.user.username;
    const userID = interaction.user.id;

    const options = interaction.options as CommandInteractionOptionResolver;

    const metin = options.getString("metin");
    const link = options.getString("link");
    const link_metin = options.getString("link_metni");

    let row: any;
    if (link) {
      const button = new ButtonBuilder()
        .setLabel(link_metin || "Bağlantıyı aç")
        .setStyle(5) // link
        .setURL(link);
      row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
    }

    client.channels
      .fetch("920248158762705006")
      .then((channel: any) => {
        if (metin) {
          const embed = new EmbedBuilder() //Ver 11.5.1 of Discord.js
            .setTitle(metin)
            .setDescription(metin)
            .setFooter({
              text: "İzlemek için tıklayın.",
            });
          channel.send({ embeds: [embed], components: [row] });
        }
      })
      .catch((err) => {
        console.log(err);
      });

    await interaction.reply({
      content: "Duyuru yayınlanıyor...",
      components: row ? [row] : [],
      ephemeral: true,
    });
  }
}
