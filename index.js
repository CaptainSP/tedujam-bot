require("dotenv").config(); //initialize dotenv
const { default: axios } = require("axios");
const Discord = require("discord.js"); //import discord.js

const titles = [];

const client = new Discord.Client({
  intents: [Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILDS],
}); //create new client

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

let channels = [];

client.on("message", (msg) => {
  if (msg.content === "!startnotifications") {
    //if (msg.author.username == "CaptainSP") {
    addToChannels(msg.channel);
    msg.channel.send("Yeni bölümleri bildirmeye başlıyorum.");
    //}

    console.log(msg.author.username);
  } else if (msg.content === "!stopnotifications") {
    if (msg.author.username == "CaptainSP") {
      removeFromChannels(msg.channel);
      msg.channel.send("Bildirimler durduruldu.");
    }
  }
});

client.login(process.env.CLIENT_TOKEN);

const express = require("express");
const { send } = require("express/lib/response");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello!");
});

const colors = [
  "#F05454",
  "#F5F5F5",
  "#30475E",
  "#FF5677",
  "#FAEDF0",
  "#EBE645",
  "#344CB7",
  "#79018C",
];
let interval = null;
app.post("/notice", (req, res) => {
  sendNotice(req);

  res.send("Success");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("HTTP server running on port 80");
});

function addToChannels(channel) {
  axios
    .post(
      "https://animecix.net/api/v1/discord-add-channel",
      {
        channel_id: channel.id,
      },
      {
        headers: {
          Authorization: "Bearer 23|aeLDTYnHwlnCqH5TnhguUPGv9Uj5E98uExAewI0z",
        },
      }
    )
    .then((data) => {
      console.log("add", data);
    })
    .catch((err) => {
      console.log(err);
    });
}

function removeFromChannels(channel) {
  /*if (!channels.includes(channel)) {
    channels.splice(channels.indexOf(channel), 1);
  }*/
  axios
    .get("https://animecix.net/api/v1/discord-delete-channel/" + channel, {
      headers: {
        Authorization: "Bearer 23|aeLDTYnHwlnCqH5TnhguUPGv9Uj5E98uExAewI0z",
      },
    })
    .then((data) => {
      console.log("delete", data);
    })
    .catch((err) => {
      console.log(err);
    });
}

function sendNotice(req) {
  console.log("Sending notifications...");
  if (client.isReady()) {
    const { body } = req;
    if (!titles.includes(body.title)) {
      axios
        .get("https://animecix.net/api/v1/discord-channels-list", {
          headers: {
            Authorization: "1|E6RGQh3V6qK3fhsansMnCBgUIeTpGTkYcmrQluHn",
          },
        })
        .then((data) => {
          
          data.data.forEach((ch) => {
            console.log(ch);
            client.channels
              .fetch(ch.channel_id)
              .then((channel) => {
                //if (channel != null) {
                //channel.send(body.title + "\n\n" + body.url);
                const embed = new Discord.MessageEmbed() //Ver 11.5.1 of Discord.js
                  .setTitle(body.title)
                  .setColor(colors[Math.floor(Math.random() * colors.length)])
                  .setURL(body.url)
                  .setFooter("İzlemek için tıklayın.")
                  .setThumbnail(body.image);
                //channels.forEach((channel) => {
                channel.send({ embeds: [embed] });
                console.log("Sent to channel.")
                //});
              })
              .catch((err) => console.log);
            titles.push(body.title);
          });
        });
    }
  } else {
    setTimeout(() => {
      sendNotice(req);
    }, 1000);
  }
}
