import {
  Client,
  GatewayIntentBits,
  Message,
  PartialMessage,
  ActivityType,
  TextChannel,
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

const MSG_SENDER = process.env.MSG_SENDER; // Updated from BOT_OWNER to MSG_SENDER
let targetChannelId: string | undefined = process.env.TARGET_CHANNEL; // Initial channel ID from .env

client.once("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);

  // Set bot status
  client.user?.setPresence({
    activities: [
      {
        name: "Watching for Taylor Swift scam tickets",
        type: ActivityType.Custom,
      },
    ],
    status: "online",
  });
});

// Helper function to normalize content by removing zero-width spaces,
// spaces between letters, regional indicators, and Greek letters
function normalizeContent(content: string): string {
  const greekToLatinMap: { [key: string]: string } = {
    α: "a",
    β: "b",
    γ: "g",
    δ: "d",
    ε: "e",
    ζ: "z",
    η: "h",
    θ: "th",
    ι: "i",
    κ: "k",
    λ: "l",
    μ: "m",
    ν: "n",
    ξ: "x",
    ο: "o",
    π: "p",
    ρ: "r",
    σ: "s",
    τ: "t",
    υ: "u",
    φ: "f",
    χ: "ch",
    ψ: "ps",
    ω: "o",
    Α: "a",
    Β: "b",
    Γ: "g",
    Δ: "d",
    Ε: "e",
    Ζ: "z",
    Η: "h",
    Θ: "th",
    Ι: "i",
    Κ: "k",
    Λ: "l",
    Μ: "m",
    Ν: "n",
    Ξ: "x",
    Ο: "o",
    Π: "p",
    Ρ: "r",
    Σ: "s",
    Τ: "t",
    Υ: "u",
    Φ: "f",
    Χ: "ch",
    Ψ: "ps",
    Ω: "o",
  };

  const regionalIndicators: { [key: string]: string } = {
    "🇦": "a",
    "🇧": "b",
    "🇨": "c",
    "🇩": "d",
    "🇪": "e",
    "🇫": "f",
    "🇬": "g",
    "🇭": "h",
    "🇮": "i",
    "🇯": "j",
    "🇰": "k",
    "🇱": "l",
    "🇲": "m",
    "🇳": "n",
    "🇴": "o",
    "🇵": "p",
    "🇶": "q",
    "🇷": "r",
    "🇸": "s",
    "🇹": "t",
    "🇺": "u",
    "🇻": "v",
    "🇼": "w",
    "🇽": "x",
    "🇾": "y",
    "🇿": "z",
  };

  return content
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // Remove zero-width spaces
    .replace(/\s+/g, "") // Remove all spaces
    .replace(/\p{Regional_Indicator}/gu, (code) => {
      return code in regionalIndicators ? regionalIndicators[code] : code;
    }) // Convert regional indicators
    .replace(/[α-ωΑ-Ω]/g, (match) => greekToLatinMap[match]) // Convert Greek letters
    .toLowerCase();
}

// Function to check message content for keywords and react accordingly
function checkMessageContent(message: Message | PartialMessage) {
  if (message.author?.bot) return;

  const content = normalizeContent(message.content || "");
  const isTrustedUser = message.author?.id === process.env.TRUSTED_USER;
  const isSpecificChannel = message.channelId === "1281404126374400020";

  const containsTaylorSwiftKeywords =
    (content.includes("taylor") || content.includes("tayior")) &&
    content.includes("swift") &&
    content.includes("ticket");

  if (containsTaylorSwiftKeywords || content.includes("🪡💨🎟️")) {
    if (isTrustedUser && (content.includes("!") || content.includes("not"))) {
      message.react("<:tay_thumbsup:1301054437112021082>");
    } else if (isSpecificChannel) {
      message.reply(
        "This is the correct channel to sell Taylor Swift scam tickets. However, it is still a bannable offense."
      );
    } else {
      message.reply(
        "Please sell Taylor Swift scam tickets in the correct channel or you will be banned: <#1281404126374400020> (you will also be banned if you post them in the correct channel anyways)."
      );
    }
    message.react("<:tay_wave:1279609313433882705>");
  }

  if (content.includes("the") && content.includes("cure")) {
    message.react("<:a_forest_the_cure:1301027405321736243>");
  }
}

// Event listeners for message creation and updates
client.on("messageCreate", async (message: Message) => {
  if (message.content.startsWith("!target ")) {
    if (message.author.id !== MSG_SENDER) return; // Restrict to message sender.

    const channelId = message.content.split(" ")[1];
    targetChannelId = channelId;
    message.reply(`Target channel set to <#${channelId}>.`);
  }

  if (message.content.startsWith("!msg ")) {
    if (message.author.id !== MSG_SENDER) return; // Restrict to message sender.

    if (!targetChannelId) {
      message.reply(
        "Please set a target channel first using '!target <channel id>'."
      );
      return;
    }

    const targetChannel = client.channels.cache.get(
      targetChannelId
    ) as TextChannel;
    const text = message.content.slice(5); // Get text after "!msg "

    if (targetChannel) {
      targetChannel.send(text);
      message.reply("Message sent to target channel.");
    } else {
      message.reply(
        "The target channel is invalid. Please set a valid channel ID."
      );
    }
  }

  if (message.content.startsWith("!reply ")) {
    if (message.author.id !== MSG_SENDER) return; // Restrict to the message sender.

    const args = message.content.split(" ");
    const channelId = args[1];
    const messageId = args[2];
    const replyText = args.slice(3).join(" "); // Combine the remaining parts as the reply text

    try {
      const targetChannel = client.channels.cache.get(channelId) as TextChannel;
      if (!targetChannel) {
        return message.reply(
          "Invalid channel ID. Please make sure it exists and is accessible."
        );
      }

      const targetMessage = await targetChannel.messages.fetch(messageId);
      await targetMessage.reply(replyText);
      message.reply(
        "Replied to the specified message in the specified channel."
      );
    } catch (error) {
      console.error("Failed to fetch or reply to the message:", error);
      message.reply(
        "Could not find the specified channel or message ID. Please make sure they are correct and that the bot has access."
      );
    }
  }

  if (message.content.startsWith("!replytsw ")) {
    if (message.author.id !== MSG_SENDER) return; // Restrict to the message sender.

    const args = message.content.split(" ");
    const channelId = args[1];
    const messageId = args[2];

    try {
      const targetChannel = client.channels.cache.get(channelId) as TextChannel;
      if (!targetChannel) {
        return message.reply(
          "Invalid channel ID. Please make sure it exists and is accessible."
        );
      }

      const targetMessage = await targetChannel.messages.fetch(messageId);
      await targetMessage.react("<:tay_wave:1279609313433882705>");
      message.reply(
        "Reacted to the specified message in the specified channel."
      );
    } catch (error) {
      console.error("Failed to fetch or react to the message:", error);
      message.reply(
        "Could not find the specified channel or message ID. Please make sure they are correct and that the bot has access."
      );
    }
  }

  checkMessageContent(message);
});

client.on("messageUpdate", (_, newMessage: Message | PartialMessage) =>
  checkMessageContent(newMessage)
);

client.login(process.env.TOKEN);
