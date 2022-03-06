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
    .post("https://animecix.net/secure/discord-add-channel", {
      channel_id: channel,
    })
    .then((data) => {
      console.log("add", data);
    }).catch(err => {
        console.log(err);
    });;
}

function removeFromChannels(channel) {
  /*if (!channels.includes(channel)) {
    channels.splice(channels.indexOf(channel), 1);
  }*/
  axios
    .get("https://animecix.net/secure/discord-delete-channel/" + channel)
    .then((data) => {
      console.log("delete", data);
    }).catch(err => {
        console.log(err);
    });
}

function sendNotice(req) {
  if (client.isReady()) {
    const { body } = req;
    if (!titles.includes(body.title)) {
      axios
        .get("https://animecix.net/secure/discord-channels-list")
        .then((data) => {
          data.forEach((channel_id) => {
            client.channels
              .fetch(channel_id)
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
