require("dotenv").config(); //initialize dotenv

import Premium from './modules/premium'
import MangaciX from './modules/mangacix'
import Notification from './modules/notification';
import AnimeciX from './modules/animecix'
import SubsPlease from './modules/subsplease'
import { Client } from 'discord.js';

const client = new Client({
  intents: ["GuildMessages", "Guilds"],
}); //create new client

client.on("ready", () => {
  console.log(`Logged in as ${client?.user?.tag}!`);

  const guildId = "919985525635571793";

  const guild = client.guilds.cache.get(guildId);

  let commands;

  if (guild) {
    commands = guild.commands;
  } else {
    commands = client.application?.commands;
  }

  Premium.init(commands)
  MangaciX.init(commands)
  AnimeciX.init(commands)
  SubsPlease.init(commands)
});

client.on("interactionCreate", async (interaction:any) => {
  if (interaction.commandName === "premium") {
    await Premium.message(interaction);
  } else if (interaction.commandName == "mangacix") {
    await MangaciX.message(interaction)
  } else if (interaction.commandName == "animecix_ekip") {
    await AnimeciX.message(interaction)
  } else if (interaction.commandName == "subsplease") {
    await SubsPlease.add(interaction)
  } else if (interaction.commandName == "subsplease_kaldir") {
    await SubsPlease.remove(interaction)
  }
});

client.on("messageCreate", (msg:any) => {
  
});

client.login(process.env.CLIENT_TOKEN);


new Notification().init(client);
SubsPlease.setTimer(client)

process
  .on("unhandledRejection", (reason, p) => {
    console.error(reason, "Unhandled Rejection at Promise", p);
  })
  .on("uncaughtException", (err) => {
    console.error(err, "Uncaught Exception thrown");
  });
