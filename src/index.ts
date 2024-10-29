import { Client, GatewayIntentBits, Message, ActivityType } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);

  // Set bot status
  client.user?.setPresence({
    activities: [
      {
        name: "Watching for scam Taylor Swift tickets",
        type: ActivityType.Custom,
      },
    ],
    status: "online",
  });
});

client.on("messageCreate", (message: Message) => {
  // Check if the message was sent by a bot, if so, ignore it.
  if (message.author.bot) return;

  // Convert the message content to lowercase and check for required keywords
  const content = message.content.toLowerCase();
  if (
    content.includes("taylor") &&
    content.includes("swift") &&
    content.includes("ticket")
  ) {
    message.reply(
      "Please sell Taylor Swift scam tickets here (or else you will be banned): <#1281404126374400020>"
    );
  }
});

client.login(process.env.TOKEN);
