const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = `${__dirname}/../aliases.json`;

function setAlias(key, value) 
{
  const aliases = JSON.parse(fs.readFileSync(path));
  aliases[key] = value;
  fs.writeFileSync(path, JSON.stringify(aliases));
}

function showAliases()
{
  const aliases = JSON.parse(fs.readFileSync(path));
  return Object.keys(aliases).map(key => `${key}: ${aliases[key]}`).join('\n');
}

function removeAlias(key)
{
  const aliases = JSON.parse(fs.readFileSync(path));
  delete aliases[key];
  fs.writeFileSync(path, JSON.stringify(aliases));
}

async function execute(interaction)
{
  switch (interaction.options.getSubcommand())
  {
    case "set":
      setAlias(interaction.options.getString("series"), interaction.options.getString("alias"));
      interaction.reply("The alias has been set");
      break;
    case "show":
      interaction.reply(showAliases());
      break;
    case "remove":
      removeAlias(interaction.options.getString("series"))
      interaction.reply("The alias has been removed")
      break;
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("alias")
        .setDescription("Removes the alias for of a given Series")
        .addSubcommand(subcommand =>
          subcommand
            .setName("set")
            .setDescription("Set an alias for a Series")
            .addStringOption(option =>
              option
                .setName("series")
                .setDescription("Name of the series")
                .setRequired(true))
            .addStringOption(option =>
              option
                .setName("alias")
                .setDescription("Alias for the series")
                .setRequired(true))
        )
        .addSubcommand(subcommand =>
          subcommand
            .setName("show")
            .setDescription("Shows all aliases")
        )
        .addSubcommand(subcommand =>
          subcommand
            .setName("remove")
            .setDescription("Remove the alias of a Series")
            .addStringOption(option =>
              option
                .setName("series")
                .setDescription("Name of the series")
                .setRequired(true))
        ),
  execute
}