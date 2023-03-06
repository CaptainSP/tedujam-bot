
import { CommandInteraction, ActionRowBuilder, SlashCommandBuilder, ButtonBuilder } from "discord.js";

export default class MangaciX {
  public static init(commands: any) {
    const mangacix = new SlashCommandBuilder()
      .setName("mangacix")
      .setDescription("MangaciX Başvuru Formu Alın!");
    commands.create(mangacix);
  }

  public static async message(interaction: CommandInteraction) {
    const userName = interaction.user.username;
    const userID = interaction.user.id;
    let formURL =
      "https://docs.google.com/forms/d/e/1FAIpQLSdkKp5UxtbZXa9FRGAGNy6-T69XoWlX-WOqE7ElZyYEqIPGaA/viewform?usp=pp_url&entry.1166974658=" +
      encodeURIComponent(userName) +
      "+-+" +
      userID;

    const button = new ButtonBuilder()
      .setLabel("Formu aç")
      .setStyle(5) // link
      .setURL(formURL);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
    await interaction.reply({
      content:
        "Başvurduğun için teşekkürler. Aşağıdaki buton araclılığıyla forma erişip doldurabilirsin. Formu doldurduktan sonra ekipte açık oluşursa seninle iletişime geçeceğiz. Lütfen bu süreçte sunucuda kalmayı ve özel mesajlara izin vermeyi unutma. Sorun olursa yetkilileri etkietleyip sorabilirsin.",
      components: [row],
      ephemeral: true
    });
  }
}
