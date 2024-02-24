const fs = require('node:fs');
const { token } = require('./config.json');
const { Client, Events, GatewayIntentBits, Partials, Collection } = require('discord.js');

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction
  ]
});

client.commands = new Collection();

for (const file of fs.readdirSync("./commands").filter(file => file.endsWith('.js')))
{
  const command = require(`./commands/${file}`);
  if ("data" in command && "execute" in command)
  {
    client.commands.set(command.data.name, command);
  }
}

for (const file of fs.readdirSync('./events').filter(file => file.endsWith('.js')))
{
  const event = require(`./events/${file}`);
  if (event.once)
  {
    client.once(event.name, (...args) => event.execute(...args));
  }
  else
  {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(token);