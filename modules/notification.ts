import {
  ActionRowBuilder,
  ButtonBuilder,
  Client,
  EmbedBuilder,
} from "discord.js";
import express from "express";

export default class Notification {
  public init(client: Client) {
    const app = express();

    app.use(express.json());

    app.get("/", (req, res) => {
      res.send("Hello!");
    });

    app.post("/notice", (req, res) => {
      console.log(req.body);
      this.sendNotice(client, req);

      res.send("Success");
    });

    app.listen(process.env.PORT || 3000, () => {
      console.log("HTTP server running on port 80");
    });
  }

  sendNotice(client: Client, req: any) {
    const titles: string[] = [];
    const colors = [
      0xf05454, 0xf5f5f5, 0x30475e, 0xff5677, 0xfaedf0, 0xebe645, 0x344cb7,
      0x79018c,
    ];

    console.log("Sending notifications...");
    if (client.isReady()) {
      const { body } = req;
      if (!titles.includes(body.title)) {
        client.channels
          .fetch("920248158762705006")
          .then((channel: any) => {
            const button = new ButtonBuilder()
              .setLabel("İzle")
              .setStyle(5)
              .setURL(body.url);

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
              button
            );

            const embed = new EmbedBuilder() //Ver 11.5.1 of Discord.js
              .setTitle(body.title)
              .setColor(colors[Math.floor(Math.random() * colors.length)])
              .setURL(body.url)
              .setFooter({
                text: "İzlemek için tıklayın.",
              })
              .setThumbnail(body.image);

            channel.send({ embeds: [embed], components: [row] });
            console.log("Sent to channel.");
          })
          .catch((err) => {
            console.log(err);
          });
        titles.push(body.title);
      }
    } else {
      (client as any).login(process.env.CLIENT_TOKEN);
      setTimeout(() => {
        this.sendNotice(client, req);
      }, 1000);
    }
  }
}
