const fs = require('fs')
const Discord = require('discord.js');

const { checkMutedUsers } = require('./utils/utils')

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  client.commands.set(command.name, command)
}

const BOT_TOKEN = process.env.BOT_TOKEN;
const PREFIX = process.env.PREFIX;

const startBot = async () => {
  try {
    // Called when the server starts
    client.on('ready', () => {
      console.log(`Logged in as ${client.user.tag}!`);
      setInterval(() => checkMutedUsers(client), 5000)
    });

    // Called whenever a message is created
    client.on(`message`, message => {
      // Ignore other bots
      if (message.author.bot) return;

      // Ignore messages without prefix
      if (message.content.indexOf(PREFIX) !== 0) return;

      // Splice "command" away from "arguments"
      const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();

      if (!client.commands.has(command)) return

      try {
        client.commands.get(command).execute(message, args);
      } catch (e) {
        console.log(e)
        message.reply('Oops! There was an error trying to run that command!')
      }

    });

    client.login(BOT_TOKEN);
  } catch (err) {
    console.error(`Bot failed to start`, error);
    process.exit(1);
  }
};

module.exports = startBot;
