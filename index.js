require('dotenv').config(); //initialize dotenv
const Discord = require('discord.js'); //import discord.js

const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILDS

    ]
}); //create new client

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

});

let channel = null;

client.on('message', msg => {
    if (msg.content === '!startnotifications') {

        if (msg.author.username == "CaptainSP") {
            channel = msg.channel;
            msg.channel.send("Yeni bölümleri bildirmeye başlıyorum");

        }

        console.log(msg.author.username);
    } else if (msg.content === "!stopnotifications") {
        if (msg.author.username == "CaptainSP") {
            channel = null;
            msg.channel.send("Bildirimler durduruldu.");
        }
    }
});


client.login(process.env.CLIENT_TOKEN);

const express = require('express');

const app = express();

app.use(express.json());

const colors = [
    "#F05454",
    "#F5F5F5",
    "#30475E",
    "#FF5677",
    "#FAEDF0",
    "#EBE645",
    "#344CB7",
    "#79018C"
]
app.post("/notice", (req, res) => {
    const { body } = req;
    if (channel != null) {
        //channel.send(body.title + "\n\n" + body.url);
        const embed = new Discord.MessageEmbed() //Ver 11.5.1 of Discord.js
            .setTitle(body.title)
            .setColor(colors[Math.floor(Math.random() * colors.length)])
            .setURL(body.url)
            .setFooter("İzlemek için tıklayın.")
            //.addField("This is a field", "this is its description")
            .setThumbnail(body.image);
        // .setThumbnail("https://cdn.discordapp.com/avatars/449250687868469258/1709ab4f567c56eaa731518ff621747c.png?size=2048")
        channel.send({ embeds: [embed] });
    }
    res.send("Success");
});

app.listen(1224, () => {
    console.log('HTTP server running on port 1224');
});