import {
  Client,
  GatewayIntentBits,
  Message,
  PartialMessage,
  ActivityType,
} from "discord.js";
import dotenv from "dotenv";
import Fuse from "fuse.js";

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

// Helper function to normalize zero-width spaces and other formats
function normalizeContent(content: string): string {
  // Normalize zero-width spaces, remove spaces between letters, and lowercase the text
  content = content
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // Remove zero-width spaces
    .replace(/\s+/g, "") // Remove all spaces
    .toLowerCase(); // Convert to lowercase

  // Replace regional indicator emojis with corresponding alphabet letters
  content = content
    // Convert regional indicator emojis to letters
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
    .replace(/🇿/g, "z")

    // Convert Greek letters to corresponding Latin letters
    .replace(/α/g, "a") // Greek alpha
    .replace(/β/g, "b") // Greek beta
    .replace(/γ/g, "g") // Greek gamma
    .replace(/δ/g, "d") // Greek delta
    .replace(/ε/g, "e") // Greek epsilon
    .replace(/ζ/g, "z") // Greek zeta
    .replace(/η/g, "h") // Greek eta
    .replace(/θ/g, "th") // Greek theta
    .replace(/ι/g, "i") // Greek iota
    .replace(/κ/g, "k") // Greek kappa
    .replace(/λ/g, "l") // Greek lambda
    .replace(/μ/g, "m") // Greek mu
    .replace(/ν/g, "n") // Greek nu
    .replace(/ξ/g, "x") // Greek xi
    .replace(/ο/g, "o") // Greek omicron
    .replace(/π/g, "p") // Greek pi
    .replace(/ρ/g, "r") // Greek rho
    .replace(/σ/g, "s") // Greek sigma
    .replace(/τ/g, "t") // Greek tau
    .replace(/υ/g, "u") // Greek upsilon
    .replace(/φ/g, "f") // Greek phi
    .replace(/χ/g, "ch") // Greek chi
    .replace(/ψ/g, "ps") // Greek psi
    .replace(/ω/g, "o") // Greek omega
    .replace(/Α/g, "a") // Greek capital alpha
    .replace(/Β/g, "b") // Greek capital beta
    .replace(/Γ/g, "g") // Greek capital gamma
    .replace(/Δ/g, "d") // Greek capital delta
    .replace(/Ε/g, "e") // Greek capital epsilon
    .replace(/Ζ/g, "z") // Greek capital zeta
    .replace(/Η/g, "h") // Greek capital eta
    .replace(/Θ/g, "th") // Greek capital theta
    .replace(/Ι/g, "i") // Greek capital iota
    .replace(/Κ/g, "k") // Greek capital kappa
    .replace(/Λ/g, "l") // Greek capital lambda
    .replace(/Μ/g, "m") // Greek capital mu
    .replace(/Ν/g, "n") // Greek capital nu
    .replace(/Ξ/g, "x") // Greek capital xi
    .replace(/Ο/g, "o") // Greek capital omicron
    .replace(/Π/g, "p") // Greek capital pi
    .replace(/Ρ/g, "r") // Greek capital rho
    .replace(/Σ/g, "s") // Greek capital sigma
    .replace(/Τ/g, "t") // Greek capital tau
    .replace(/Υ/g, "u") // Greek capital upsilon
    .replace(/Φ/g, "f") // Greek capital phi
    .replace(/Χ/g, "ch") // Greek capital chi
    .replace(/Ψ/g, "ps") // Greek capital psi
    .replace(/Ω/g, "o"); // Greek capital omega

  content = content.normalize("NFC");

  return content;
}

// Function to check message content for keywords
function checkMessageContent(message: Message | PartialMessage) {
  if (message.author?.bot) return;

  const content = normalizeContent(message.content || "");

  // const data = [
  //   { message: "taylor swift tickets" },
  //   { message: "swift tickets" },
  //   { message: "ticket for Taylor" },
  // ];

  // // const keywords = ["taylor", "swift", "ticket"];
  // const fuse = new Fuse(
  //   // keywords, {
  //   data,
  //   {
  //     keys: ["message"],
  //     includeScore: true,
  //     threshold: 0.1,
  //   }
  // );

  // const result = fuse.search(content).length > 0;
  // console.log(result);

  if (
    ((content.includes("taylor") || content.includes("tayior")) &&
      content.includes("swift") &&
      content.includes("ticket")) ||
    content.includes("🪡💨🎟️")
  ) {
    if (message.channelId === "1281404126374400020") {
      message.reply(
        "This is the correct channel to sell Taylor Swift scam tickets. However, it is still a bannable offense."
      );
    } else {
      message.reply(
        "Please sell Taylor Swift scam tickets in the correct channel or you will be banned: <#1281404126374400020> (you will also be banned if you post them in the correct channel anyways)."
      );
    }
  }
}

// Event listener for new messagesz
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
