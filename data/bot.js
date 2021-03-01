const Discord = require("discord.js"); //
const client = new Discord.Client(); //
const ayarlar = require("./ayarlar.json"); //
const chalk = require("chalk"); //
const moment = require("moment"); //
var Jimp = require("jimp"); //
const { Client, Util } = require("discord.js"); //
const fs = require("fs"); //
const db = require("quick.db"); //
const qdb = require('quick.db')
const express = require("express"); //
require("./util/eventLoader.js")(client); //
const path = require("path"); //
const snekfetch = require("snekfetch"); //
const ms = require("ms"); //
const tags = require("common-tags");
const logkanal = ayarlar.guardlog;
//

var prefix = ayarlar.prefix; //
//
const log = message => {
  //
  console.log(`${message}`); //
};

client.commands = new Discord.Collection(); //
client.aliases = new Discord.Collection(); //
fs.readdir("./komutlar/", (err, files) => {
  //
  if (err) console.error(err); //
  log(`‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒
    ${files.length} komut yüklenecek.
‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒`); //
  files.forEach(f => {
    //
    let props = require(`./komutlar/${f}`); //
    log(`[KOMUT] | ${props.help.name} Eklendi.`); //
    client.commands.set(props.help.name, props); //
    props.conf.aliases.forEach(alias => {
      //
      client.aliases.set(alias, props.help.name); //
    });
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////
client.on("message", async message => {
  if (message.author.bot || message.channel.type === "dm") return;

  var afklar = await db.fetch(`afk_${message.author.id}, ${message.guild.id}`);

  if (afklar) {
    db.delete(`afk_${message.author.id}, ${message.guild.id}`);
    db.delete(`afk-zaman_${message.author.id}, ${message.guild.id}`);

    message.reply(`Afklıktan Çıktın!`);
    try {
      let isim = message.member.nickname.replace("[AFK]", "");
      message.member.setNickname(isim).catch(err => console.log(err));
    } catch (err) {
      console.log(err.message);
    }
  }
  let ms = require("ms");

  var kullanıcı = message.mentions.users.first();
  if (!kullanıcı) return;
  let zaman = await db.fetch(`afk-zaman_${kullanıcı.id}, ${message.guild.id}`);

  var süre = ms(new Date().getTime() - zaman);

  var sebep = await db.fetch(`afk_${kullanıcı.id}, ${message.guild.id}`);
  if (
    await db.fetch(
      `afk_${message.mentions.users.first().id}, ${message.guild.id}`
    )
  ) {
    süre.days !== 0;
    const dcs = new Discord.MessageEmbed()
      .setTitle("Uyarı!")
      .setDescription(
        "Etiketlediniz Kullanıcı Afk! Boş yere etiket atma kızar bak gelice demedi deme "
      )
      .addField("Afk Nedeni:", `> ${sebep}`)
      .setColor("RANDOM")
      .setThumbnail(message.author.avatarURL())
      .addField("Afk Olma Süresi", `> ${süre}`);
    message.channel.send(dcs);
    return;
  }
});
//////////////////////////////////////////

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }

  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });
client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});
client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});

client.login(process.env.TOKEN);

//------------------------------------------------------------------------------------------------------------\\

client.on("message", message => {
  if (message.content.toLowerCase() == "!tag")
    return message.channel.send(`TAG`);
});

client.on("message", message => {
  if (message.content.toLowerCase() == "-tag")
    return message.channel.send(`TAG`);
});

client.on("message", message => {
  if (message.content.toLowerCase() == "u!tag")
    return message.channel.send(`TAG`);
});

client.on("message", message => {
  if (message.content.toLowerCase() == "u.tag")
    return message.channel.send(`TAG`);
});

client.on("message", message => {
  if (message.content.toLowerCase() == "u-tag")
    return message.channel.send(`TAG`);
});

client.on("message", message => {
  if (message.content.toLowerCase() == ".tag")
    return message.channel.send(`TAG`);
});

//------------------------------------------------------------------------------------------------------------\\



//------------------------------------------------------------------------------------------------------------\\

client.on("message", async msg => {
  if (!msg.guild) return;
  if (msg.content.startsWith(ayarlar.prefix + "afk")) return;

  let afk = msg.mentions.users.first();

  const kisi = db.fetch(`afkid_${msg.author.id}_${msg.guild.id}`);

  const isim = db.fetch(`afkAd_${msg.author.id}_${msg.guild.id}`);
  if (afk) {
    const sebep = db.fetch(`afkSebep_${afk.id}_${msg.guild.id}`);
    const kisi3 = db.fetch(`afkid_${afk.id}_${msg.guild.id}`);
    if (msg.content.includes(kisi3)) {
      msg.channel.send(
        new Discord.MessageEmbed()
          .setColor("BLACK")
          .setDescription(
            `<@` +
              msg.author.id +
              `> Etiketlediğiniz Kişi Afk \nSebep : ${sebep}`
          )
      );
    }
  }
  if (msg.author.id === kisi) {
    msg.channel.send(
      new Discord.MessageEmbed()
        .setColor("BLACK")
        .setDescription(`<@${kisi}> Başarıyla Afk Modundan Çıktınız`)
    );
    db.delete(`afkSebep_${msg.author.id}_${msg.guild.id}`);
    db.delete(`afkid_${msg.author.id}_${msg.guild.id}`);
    db.delete(`afkAd_${msg.author.id}_${msg.guild.id}`);
    msg.member.setNickname(isim);
  }
});

//--------------------------------------------------------------------------------------\\

client.on("guildMemberAdd", async member => {
  let rol = member.guild.roles.cache.find(
    r => r.name === "CEZALI ROLÜNÜN ADI NEYSE YAZ"
  );
  let cezalımı = db.fetch(`cezali_${member.guild.id + member.id}`);
  let sürejail = db.fetch(`süreJail_${member.id + member.guild.id}`);
  if (!cezalımı) return;
  if (cezalımı == "cezali") {
    member.roles.add(ayarlar.JailCezalıRol);

    member.send(
      "Cezalıyken Sunucudan Çıktığın için Yeniden Cezalı Rolü Verildi!"
    );
    setTimeout(function() {
      // msg.channel.send(`<@${user.id}> Muten açıldı.`)
      db.delete(`cezali_${member.guild.id + member.id}`);
      member.send(`<@${member.id}> Cezan açıldı.`);
      member.roles.remove("cezalı rol id");
    }, ms(sürejail));
  }
});

//--------------------------------------------------------------------------------------\\

client.on("guildMemberAdd", async member => {
  let mute = member.guild.roles.cache.find(
    r => r.name === "MUTELİ ROLÜNÜN ADI NEYSE YAZ"
  );
  let mutelimi = db.fetch(`muteli_${member.guild.id + member.id}`);
  let süre = db.fetch(`süre_${member.id + member.guild.id}`);
  if (!mutelimi) return;
  if (mutelimi == "muteli") {
    member.roles.add(ayarlar.MuteliRol);

    member.send("Muteliyken Sunucudan Çıktığın için Yeniden Mutelendin!");
    setTimeout(function() {
      // msg.channel.send(`<@${user.id}> Muten açıldı.`)
      db.delete(`muteli_${member.guild.id + member.id}`);
      member.send(`<@${member.id}> Muten açıldı.`);
      member.roles.remove("muteli rol id");
    }, ms(süre));
  }
});

//--------------------------------------------------------------------------------------\\

client.on("guildMemberAdd", async member => {
  const data = require("quick.db");
  const asd = data.fetch(`${member.guild.id}.jail.${member.id}`);
  if (asd) {
    let data2 = await data.fetch(`jailrol_${member.guild.id}`);
    let rol = member.guild.roles.cache.get(data2);
    if (!rol) return;
    let kişi = member.guild.members.cache.get(member.id);
    kişi.roles.add(rol.id);
    kişi.roles.cache.forEach(r => {
      kişi.roles.remove(r.id);
      data.set(`${member.guild.id}.jail.${kişi.id}.roles.${r.id}`, r.id);
    });
    data.set(`${member.guild.id}.jail.${kişi.id}`);
    const wasted = new Discord.MessageEmbed()
      .setAuthor(member.user.tag, member.user.avatarURL({ dynamic: true }))
      .setColor(`#0x800d0d`)
      .setDescription(
        `Dostum hadi ama !!! Jaildan Kaçamazsın ikimizde birbirimizi kandırmayalım...!`
      )
      .setTimestamp();
    member.send(wasted);
  }
});

//--------------------------------------------------------------------------------------\\

client.on("message", async msg => {
  const i = await db.fetch(`kufur_${msg.guild.id}`);
  if (i == "acik") {
    const kufur = [
      "oç",
      "amk",
      "ananı sikiyim",
      "ananıskm",
      "piç",
      "amk",
      "amsk",
      "sikim",
      "sikiyim",
      "orospu çocuğu",
      "piç kurusu",
      "kahpe",
      "orospu",
      "mal",
      "sik",
      "yarrak",
      "am",
      "amcık",
      "amık",
      "yarram",
      "sikimi ye",
      "mk",
      "mq",
      "aq",
      "ak",
      "amq"
    ];
    if (kufur.some(word => msg.content.includes(word))) {
      try {
        if (!msg.member.hasPermission("BAN_MEMBERS")) {
          msg.delete();

          return msg.channel
            .send(
              new Discord.MessageEmbed()
                .setDescription(
                  `${msg.author} Bu sunucuda küfür filtresi etkin.`
                )
                .setColor("0x800d0d")
                .setAuthor(
                  msg.member.displayName,
                  msg.author.avatarURL({ dynamic: true })
                )
                .setTimestamp()
            )
            .then(x => x.delete({ timeout: 5000 }));
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
  if (!i) return;
});

client.on("messageUpdate", (oldMessage, newMessage) => {
  const i = db.fetch(`${oldMessage.guild.id}.kufur`);
  if (i) {
    const kufur = [
      "oç",
      "amk",
      "ananı sikiyim",
      "ananıskm",
      "piç",
      "amk",
      "amsk",
      "sikim",
      "sikiyim",
      "orospu çocuğu",
      "piç kurusu",
      "kahpe",
      "orospu",
      "mal",
      "sik",
      "yarrak",
      "am",
      "amcık",
      "amık",
      "yarram",
      "sikimi ye",
      "mk",
      "mq",
      "aq",
      "ak",
      "amq",
      "amguard",
      "seksüel",
      "sekssüel"
    ];
    if (kufur.some(word => newMessage.content.includes(word))) {
      try {
        if (!oldMessage.member.hasPermission("BAN_MEMBERS")) {
          oldMessage.delete();

          return oldMessage.channel
            .send(
              new Discord.MessageEmbed()
                .setDescription(
                  `${oldMessage.author} Bu sunucuda küfür filtresi etkin.`
                )
                .setColor("0x800d0d")
                .setAuthor(
                  oldMessage.member.displayName,
                  oldMessage.author.avatarURL({ dynamic: true })
                )
                .setTimestamp()
            )
            .then(x => x.delete({ timeout: 5000 }));
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
  if (!i) return;
});

//--------------------------------------------------------------------------------------\\

//--------------------------------------------------------------------------------------\\

client.on("message", msg => {
  if (!db.has(`reklam_${msg.guild.id}`)) return;
  const reklam = [
    ".com",
    ".net",
    ".xyz",
    ".tk",
    ".pw",
    ".io",
    ".me",
    ".gg",
    "www.",
    "https",
    "http",
    ".gl",
    ".org",
    ".com.tr",
    ".biz",
    "net",
    ".rf.gd",
    ".az",
    ".party",
    "discord.gg"
  ];
  if (reklam.some(word => msg.content.includes(word))) {
    try {
      if (!msg.member.hasPermission("BAN_MEMBERS")) {
        msg.delete();
        return msg.channel
          .send(
            new Discord.MessageEmbed()
              .setDescription(
                `${msg.author} Bu sunucuda reklam filtresi etkin.`
              )
              .setColor("0x800d0d")
              .setAuthor(
                msg.member.displayName,
                msg.author.avatarURL({ dynamic: true })
              )
              .setTimestamp()
          )
          .then(x => x.delete({ timeout: 5000 }));

        msg.delete(3000);
      }
    } catch (err) {
      console.log(err);
    }
  }
});

//--------------------------------------------------------------------------------------\\

client.on("messageDelete", message => {
  const data = require("quick.db");
  data.set(`snipe.mesaj.${message.guild.id}`, message.content);
  data.set(`snipe.id.${message.guild.id}`, message.author.id);
});

//////////////////
client.on("guildMemberAdd", member => {
  const gereksiz = db.fetch(`dmhgbb_${member.guild.id}`);
  if (gereksiz === "aktif") {
    const hg = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle(member.guild.name + "\n Sunucusuna Hoşgeldin!")
      .setDescription(
        `__**RynoCode Development Sunucusuna Hoşgeldin!**__ \n Bu sunucuda bot yapmayı öğrenebilirsin, \n Zaten botun varsa bu botu sunucumuza ekleyebilirsin. \n Güzel vakitler geçirmen dileğiyle...`
      )
      .setFooter("Hoşgeldin")
      .setTimestamp();
    member.send(hg);
  } else if (gereksiz === "deaktif") {
  }
  if (!gereksiz) return;
});
////////////////////
client.on("guildMemberRemove", member => {
  const gereksiz = db.fetch(`dmhgbb_${member.guild.id}`);
  if (gereksiz === "aktif") {
    const hg = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle(member.guild.name + "\n Görüşürüz!")
      .setDescription(
        `__**RynoCode Development**__ Sunucusundan çıktın. \n Umarım güzel vakit geçirmişsindir. \n Ama şunu unutma eğer botunu ekleyip sunucudan çıktıysan botun **atılır.**`
      )
      .setFooter("Görüşürüz")
      .setTimestamp();
    member.send(hg);
  } else if (gereksiz === "deaktif") {
  }
  if (!gereksiz) return;
});
/////////////////////
client.on("userUpdate", async (oldUser, newUser) => {
  if (oldUser.avatarURL() !== newUser.avatarURL()) {
    client.guilds.cache.forEach(async guild => {
      if (guild.members.cache.get(newUser.id)) {
        const channeldata = await require("quick.db").fetch(
          `darkcode.${guild.id}`
        );
        if (!channeldata) return;
        let channel = await guild.channels.cache.get(channeldata);

        let avatar = new Discord.Attachment(newUser.avatarURL());
        let gifkontrol = newUser.avatarURL().includes(".gif")
          ? `**[[GIF]](${newUser.avatarURL()})**`
          : `~~**[GIF]**~~`;
        const DarkCode = new Discord.MessageEmbed()
          .setColor("BLACK")
          .setAuthor(newUser.tag)
          .setImage(newUser.avatarURL())
          .setDescription(
            `${gifkontrol} | **[[PNG]](${newUser
              .avatarURL()
              .replace(".gif", ".png")
              .replace(".jpg", ".png")
              .replace(".webp", ".png")})** | **[[JPG]](${newUser
              .avatarURL()
              .replace(".png", ".jpg")
              .replace(".gif", ".jpg")
              .replace(".webp", ".jpg")})** | **[[WEBP]](${newUser
              .avatarURL()
              .replace(".gif", ".webp")
              .replace(".png", ".webp")
              .replace(".jpg", ".webp")})**`
          );
        return channel.send(DarkCode);
      }
    });
  }
});

client.on("ready",() => {
  var degisendurum = [`r.help`,`Ryno Bot`,`${client.guilds.cache.reduce((a,b) => a + b .memberCount,0) .toLocaleString()} Kullanıcı | ${client.guilds.cache.size} Sunucuya Hizmet Ediyor!`]
  setInterval(function() {
      var degisendurum2 = degisendurum[Math.floor(Math.random() * (degisendurum.length))]
      client.user.setActivity(`${degisendurum2}`);}, 3 * 3000);
  client.user.setStatus("PLAYING");
  })
