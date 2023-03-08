require("dotenv").config();
const { Client, IntentsBitField } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});
client.on("ready", () => {
  console.log("ready");
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith("/gpt")) {
    try {
      await message.channel.sendTyping();
      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);

      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `${message.content}` }],
      });
      let response = completion.data.choices[0].message.content.trim();
      message.reply(response);
    } catch (error) {
      console.log(error);
    }
  }
});

client.login(process.env.TOKEN);
