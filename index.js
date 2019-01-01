var Discord = require('discord.js');
var bot = new Discord.Client();
var botconfig = require('./botconfig.json');


bot.on("ready", async () => {
  console.log(`${bot.user.username} is online!`);
  bot.user.setActivity("NOTHING");
});


bot.on("message", async message => {
  if(message.author.bot) return;

  var prefix = botconfig.prefix;
  var messageArray = message.content.split(" ");
  var cmd = messageArray[0];
  var args = messageArray.slice(1);

    //KICK
  if(cmd === `${prefix}kick`){
      if(!message.member.roles.find(x => x.name === "Admin") && !message.member.roles.find(x => x.name === "Moderator")) return message.channel.send("NOT ALLOWED!");
      var kickedUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
      if(!kickedUser || kickedUser == bot.user.username) return message.channel.send("Couldn't find user to kick");
      var kickReason = args.join(" ").slice(22);
      if(kickReason=="") return message.channel.send("Please enter a kick reason");
      var kickembed = new Discord.RichEmbed()
      .setDescription("KICK")
      .setColor("#348AA7")
      .addField("Kicked User", `${kickedUser} with ID ${kickedUser.id}`)
      .addField("Kicked By", `${message.author}`)
      .addField("Time", message.createdAt)
      .addField("Kicked Reason", kickReason);

      var incidents = message.guild.channels.find(x => x.name == "incidents");
      if(!incidents) return message.channel.send("Could not find channel");
      incidents.send(kickembed);
      message.guild.member(kickedUser).kick(kickReason);
      message.delete();
      return;
    }

    //BAN
  if(cmd === `${prefix}ban`){
        if(!message.member.roles.find(x => x.name === "Admin") && !message.member.roles.find(x => x.name === "Moderator")) return message.channel.send("NOT ALLOWED!");
        var bannedUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!bannedUser || bannedUser == bot.user) return message.channel.send("Couldn't find user to ban");
        var banReason = args.join(" ").slice(22);
        if(banReason=="") return message.channel.send("Please enter a ban reason");
        var banembed = new Discord.RichEmbed()
        .setDescription("BAN")
        .setColor("#7a0e0e")
        .addField("Banned User", `${bannedUser} with ID ${bannedUser.id}`)
        .addField("Banned By", `${message.author}`)
        .addField("Time", message.createdAt)
        .addField("Banned Reason", banReason);

        var incidents = message.guild.channels.find(x => x.name == "incidents");
        if(!incidents) return message.channel.send("Could not find channel");
        incidents.send(banembed);
        message.guild.member(bannedUser).ban(banReason);
        message.delete();
        return;
      }

    //BOTINFO
  if(cmd === `${prefix}botinfo`){
    var botembed = new Discord.RichEmbed()
    .setDescription("BOT INFO")
    .setColor("#15f153")
    .addField("Name: ", bot.user.username);
    message.channel.send(botembed);
  }

    //rank
  if(cmd === `${prefix}rank`){
    if(!message.member.roles.find(x => x.name === "Admin") && !message.member.roles.find(x => x.name === "Moderator") && !message.member.roles.find(x => x.name === "Supporter")) return message.channel.send("NOT ALLOWED!");
    var rankedUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!rankedUser) return message.channel.send("Couldn't find user to rank");
    var applyRole = args.join(" ").slice(22);
    if(rankedUser.roles.find(x => x.name == applyRole)) return message.channel.send("Member already owns this rank");
    if(applyRole=="") return message.channel.send("Please enter a role");
    applyRole = message.member.guild.roles.find(x => x.name === applyRole);
    if(applyRole==null) return message.channel.send("Role not found");
    rankedUser.addRole(applyRole);
  }

    //unrank
  if(cmd === `${prefix}unrank`){
    if(!message.member.roles.find(x => x.name === "Admin") && !message.member.roles.find(x => x.name === "Moderator") && !message.member.roles.find(x => x.name === "Supporter")) return message.channel.send("NOT ALLOWED!");
    var unrankedUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!unrankedUser) return message.channel.send("Couldn't find user to derank");
    var deletedRole = args.join(" ").slice(22);
    if(!unrankedUser.roles.find(x => x.name == deletedRole)) return message.channel.send("Member does'nt have this rank");
    if(deletedRole=="") return message.channel.send("Please enter a deleted role");
    deletedRole = message.member.guild.roles.find(x => x.name === deletedRole);
    if(deletedRole==null) return message.channel.send("Role not found");
    unrankedUser.removeRole(deletedRole);
  }
});

bot.on("guildMemberAdd", (member, server) => {
  console.log(member.user.username + " joined the server!");
  var role = member.guild.roles.find(x => x.name === "Member");
  member.addRole(role);
});


bot.login(process.env.BOT_TOKEN);
