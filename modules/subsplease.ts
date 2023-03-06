import axios from "axios";
import {
  CommandInteraction,
  ActionRowBuilder,
  SlashCommandBuilder,
  ButtonBuilder,
  CommandInteractionOptionResolver,
  EmbedBuilder,
} from "discord.js";

import fs from "fs";

export default class SubsPlease {
  public static init(commands: any) {
    const subsplease = new SlashCommandBuilder()
      .setName("subsplease")
      .setDefaultMemberPermissions(8)
      .addStringOption((option) =>
        option
          .setName("klasor")
          .setRequired(true)
          .setDescription("Subsplease klasör adı")
      )
      .setDescription("Subsplease linki ekle");
    const subsplease2 = new SlashCommandBuilder()
      .setName("subsplease_kaldir")
      .setDefaultMemberPermissions(8)
      .addStringOption((option) =>
        option
          .setName("klasor")
          .setRequired(true)
          .setDescription("Subsplease klasör adı")
      )
      .setDescription("Subsplease linki kaldır");
    commands.create(subsplease);
  }

  public static async add(interaction: CommandInteraction) {
    const jsonData = JSON.parse(
      fs.readFileSync("subsplease.json").toString() || "[]"
    );

    const path = (
      interaction.options as CommandInteractionOptionResolver
    ).getString("klasor");

    jsonData.push(path);

    fs.writeFileSync("subsplease.json", JSON.stringify(jsonData));

    interaction.reply({ content: "Kaydedildi", ephemeral: true });
  }

  public static async remove(interaction: CommandInteraction) {
    const jsonData = JSON.parse(
      fs.readFileSync("subsplease.json").toString() || "[]"
    );

    const path = (
      interaction.options as CommandInteractionOptionResolver
    ).getString("klasor");

    jsonData.splice(jsonData.indexOf(path), 1);

    fs.writeFileSync("subsplease.json", JSON.stringify(jsonData));

    interaction.reply({ content: "Kaydedildi", ephemeral: true });
  }

  public static setTimer(client: any) {
    setInterval(() => {
      this.checkEpisodes(client);
    }, 10 * 60 * 1000);
  }

  public static titles: string[] = [];
  public static checkEpisodes(client: any) {
    axios
      .get<{ [key: string]: { image_url: string; page: string } }>(
        "https://subsplease.org/api/?f=latest&tz=Europe/Istanbul"
      )
      .then((response) => {
        const { data } = response;
        const jsonData = JSON.parse(
          fs.readFileSync("subsplease.json").toString() || "[]"
        );

        for (let key of Object.keys(data)) {
          const item = data[key];

          if (jsonData.includes(item.page) && !this.titles.includes(key)) {
            this.sendMessage(client, key, item.image_url, item.page);

            this.titles.push(key);
          }
        }
      });
  }

  public static sendMessage(
    client: any,
    title: string,
    image: string,
    path: string
  ) {
    if (client.isReady()) {
      const url = "https://subsplease.org/shows/" + path;
      client.channels
        .fetch("966325607879290880")
        .then((channel: any) => {
          const button = new ButtonBuilder()
            .setLabel("Aç")
            .setStyle(5)
            .setURL(url);

          const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            button
          );

          const embed = new EmbedBuilder() //Ver 11.5.1 of Discord.js
            .setTitle(title + " SubsPlease'e Eklendi")
            .setURL(url)
            .setFooter({
              text: "Müsait olan uploader ekleyebilir.",
            })
            .setThumbnail("https://subsplease.org/" + image);

          channel.send({ embeds: [embed], components: [row] });
          console.log("Sent subsplease to channel.");
        })
        .catch((err: any) => {
          console.log(err);
        });
    } else {
      (client as any).login(process.env.CLIENT_TOKEN);
      setTimeout(() => {
        this.sendMessage(client, title, image, path);
      }, 1000);
    }
  }
}
