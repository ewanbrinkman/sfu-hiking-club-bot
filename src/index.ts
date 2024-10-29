import {
  Client,
  GatewayIntentBits,
  Message,
  PartialMessage,
  ActivityType,
} from "discord.js";
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
        type: ActivityType.Watching,
      },
    ],
    status: "online",
  });
});

// Helper function to normalize zero-width spaces and other formats
function normalizeContent(content: string): string {
  // Normalize zero-width spaces, remove spaces between letters, and lowercase the text
  content = content
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // Remove zero-width spaces
    .replace(/\s+/g, "") // Remove all spaces
    .toLowerCase(); // Convert to lowercase

  // Replace regional indicator emojis with corresponding alphabet letters
  content = content
    .replace(/🇦/g, "a")
    .replace(/🇧/g, "b")
    .replace(/🇨/g, "c")
    .replace(/🇩/g, "d")
    .replace(/🇪/g, "e")
    .replace(/🇫/g, "f")
    .replace(/🇬/g, "g")
    .replace(/🇭/g, "h")
    .replace(/🇮/g, "i")
    .replace(/🇯/g, "j")
    .replace(/🇰/g, "k")
    .replace(/🇱/g, "l")
    .replace(/🇲/g, "m")
    .replace(/🇳/g, "n")
    .replace(/🇴/g, "o")
    .replace(/🇵/g, "p")
    .replace(/🇶/g, "q")
    .replace(/🇷/g, "r")
    .replace(/🇸/g, "s")
    .replace(/🇹/g, "t")
    .replace(/🇺/g, "u")
    .replace(/🇻/g, "v")
    .replace(/🇼/g, "w")
    .replace(/🇽/g, "x")
    .replace(/🇾/g, "y")
    .replace(/🇿/g, "z");

  // Replace common visually similar substitutions
  content = content.replace(/1/g, "l").replace(/!/g, "i");

  return content;
}

// Function to check message content for keywords
function checkMessageContent(message: Message | PartialMessage) {
  if (message.author?.bot) return;

  const content = normalizeContent(message.content || "");

  if (
    content.includes("taylor") &&
    content.includes("swift") &&
    content.includes("ticket")
  ) {
    message.reply(
      "Please sell Taylor Swift scam tickets here (or else you will be banned): <#1281404126374400020>"
    );
  }
}

// Event listener for new messages
client.on("messageCreate", (message: Message) => {
  checkMessageContent(message);
});

// Event listener for edited messages
client.on(
  "messageUpdate",
  (
    oldMessage: Message | PartialMessage,
    newMessage: Message | PartialMessage
  ) => {
    checkMessageContent(newMessage);
  }
);

client.login(process.env.TOKEN);
