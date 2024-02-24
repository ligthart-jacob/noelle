const { Events } = require('discord.js');
const fs = require("fs");
const path = `${__dirname}/../aliases.json`;

function getSeries(description)
{
  const aliases = JSON.parse(fs.readFileSync(path));
  const series = description.split('<:')[0].trim();
  return aliases[series] ?? series;
}

async function execute(reaction)
{
  if (reaction.partial)
  {
    try { await reaction.fetch(); }
    catch (error)
    {
      console.error("Something went wrong when fetching the message:", error);
      return;
    }
  }

  const embed = reaction.message.embeds[0];
  const formData = new FormData();

  formData.set("name", embed.author.name);
  formData.set("image", embed.image.url);
  formData.set("series", getSeries(embed.description));
  formData.set("obtained", embed.footer.text.includes("Belongs") ? 1 : 0);

  try
  {
    await fetch(`http://localhost/lynette/controllers/bot.php`, {
      method: "POST",
      body: formData
    });
  }
  catch
  {
    console.error("Fetching lynette failed: ", error);
  }
}

module.exports = {
  name: Events.MessageReactionAdd,
  execute
}