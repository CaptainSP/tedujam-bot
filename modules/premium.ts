import { CommandInteraction, CommandInteractionOptionResolver, SlashCommandBuilder } from "discord.js";
const { default: axios } = require("axios");

export default class Premium {
  public static init(commands: any) {
    const data = new SlashCommandBuilder()
      .setName("premium")
      .setDescription("Aboneliğinize özel premium rolünüzü alın!")
      .addIntegerOption((option) =>
        option
          .setName("kod")
          .setRequired(true)
          .setDescription("5 Haneli Bir Kod Girin")
      );

    commands.create(data.toJSON());
  }

  public static async message(
    interaction: CommandInteraction
  ) {
    try {
      interaction.reply("Rol veriliyor...");
      console.log("Checking code");
      const response = await axios.get(
        `https://animecix.net/api/v1/discord/user/${
          interaction.user.id
        }/give-premium/${(interaction.options as CommandInteractionOptionResolver).getInteger("kod")}`,
        {
          headers: {
            Authorization: "Bearer 1|E6RGQh3V6qK3fhsansMnCBgUIeTpGTkYcmrQluHn",
          },
        }
      );
      
      if (response.data.can_give == true) {
        console.log("Can give", response.data);
        const type = response.data.type;

        const roles = await interaction.guild?.roles.fetch();

        const role = roles?.find((item:any) => {
          return (
            item.id == (type == 2 ? "972099358172524595" : "999621305030672415")
          );
        });
        const members = interaction.guild?.members.cache;

        if (role) {
          await members
            ?.find((user:any) => user.id == interaction.user.id)
            ?.roles.add(role);
        }

        await interaction.editReply("Premium rolün verildi! Güle güle kullan.");
      } else {
        console.log("Error: ", response.data);
        await interaction.editReply(response.data.error);
      }
    } catch (e) {
      console.log(e);
      await axios.get(
        `https://animecix.net/api/v1/discord/user/${
          interaction.user.id
        }/reset-premium/${(interaction.options as CommandInteractionOptionResolver).getInteger("kod")}`,
        {
          headers: {
            Authorization: "Bearer 1|E6RGQh3V6qK3fhsansMnCBgUIeTpGTkYcmrQluHn",
          },
        }
      );
      
    }
  }
}
