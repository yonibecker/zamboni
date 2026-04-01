const Discord = require("discord.js");
const logo = process.env.BASE_URL ? `${process.env.BASE_URL}/zamboni.png` : undefined;

const zamboniInfo = async (message) => {
  var embed = new Discord.MessageEmbed()
    .setColor(`#f2432c`)
    .setAuthor("Zamboni Info", logo).setDescription(`
**General**
Latency: *Loading...*

**Bot Dev Info**
Zamboni is being actively monitored and developed by \`Konoguppy\`. If you have any comments, questions, hopes, dreams, aspirations, and/or concerns please feel free to private message.

**Bot Links**
Click on [this link](https://discord.com/api/oauth2/authorize?client_id=816064566412836904&permissions=8&scope=bot) to add Zamboni to your server and [click here](https://top.gg/bot/816064566412836904/vote/) to vote for Zamboni on top.gg!

    `);
  var message2 = await message.channel.send(embed);
  var embed2 = new Discord.MessageEmbed()
    .setColor(`#f2432c`)
    .setAuthor("Zamboni Info", logo).setDescription(`
**General**
Latency: ${message2.createdTimestamp - message.createdTimestamp}ms

**Bot Dev Info**
Zamboni is being actively monitored and developed by \`Konoguppy#0265\`. If you have any comments, questions, hopes, dreams, aspirations, and/or concerns please feel free to private message.

**Bot Links**
Click on [this link](https://discord.com/api/oauth2/authorize?client_id=816064566412836904&permissions=534723950704&scope=bot) to add Zamboni to your server and [click here](https://top.gg/bot/816064566412836904/vote/) to vote for Zamboni on top.gg!
  `);
  message2.edit(embed2);
};
module.exports = {
  zamboniInfo,
};
