require('dotenv').config();

const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.tokken);

const Genius = require('genius-lyrics');
const Client = new Genius.Client(process.env.tokkeGenuius);

const fetch = require('node-fetch');

async function findSongByText(text) {
  const res = [];
  const searches = await Client.songs.search(text);
  searches.forEach(async (el) => {
    await res.push(`${el.artist.name} - ${el.title} \n \n`);
  });
  return res;
}

async function randTrandGif() {
  const response = await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${process.env.giphy}`);
  const res = await response.json();
  return res.data[Math.floor(Math.random() * res.data.length)].bitly_gif_url;
}

async function randomGif() {
  const response = await fetch(`http://api.giphy.com/v1/gifs/random?api_key=${process.env.giphy}`);
  const res = await response.json();
  return res.data.bitly_gif_url;
}

async function doneGif() {
  const response = await fetch(`http://api.giphy.com/v1/gifs/search?q=anime&api_key=${process.env.giphy}`);
  const res = await response.json();
  return res.data[Math.floor(Math.random() * res.data.length)].bitly_gif_url;
}

async function undoneGif() {
  const response = await fetch(`http://api.giphy.com/v1/gifs/search?q=naruto+anime+cry&api_key=${process.env.giphy}`);
  const res = await response.json();
  return res.data[Math.floor(Math.random() * res.data.length)].bitly_gif_url;
}

async function cringeGif() {
  const response = await fetch(`http://api.giphy.com/v1/gifs/search?q=cringe&api_key=${process.env.giphy}`);
  const res = await response.json();
  return res.data[Math.floor(Math.random() * res.data.length)].bitly_gif_url;
}

async function userGif(text) {
  const userArr = text.split(' ');
  userArr.shift();
  const response = await fetch(`http://api.giphy.com/v1/gifs/search?q=${userArr.join('+')}&api_key=${process.env.giphy}`);
  const res = await response.json();
  return res.data[Math.floor(Math.random() * res.data.length)].bitly_gif_url;
}

bot.start((ctx) => {
  ctx.reply(`Yap ${ctx.message.from.first_name}`);
});

bot.help(async (ctx) => ctx.reply('Send me text of the song \nOr write "myGif" and description of gif, that you want to find'));

bot.on('message', async (ctx) => {
  if (ctx.message.text === '/randomgif') {
    return ctx.reply(await randomGif());
  }

  if (ctx.message.text === '/trandgif') {
    return ctx.reply(await randTrandGif());
  }

  if (ctx.message.text.includes('myGif')) {
    try {
      return ctx.reply(await userGif(ctx.message.text));
    } catch {
      ctx.reply(await undoneGif());
      return ctx.reply("Dont find any gif's");
    }
  }

  // for (let i = 0; i < ctx.message.text.length; i += 1) {
  //   if (ctx.message.text.charCodeAt(i) >= 410) {
  //     ctx.reply('Мммм, русское');
  //     return ctx.reply(await cringeGif());
  //   }
  // }

  ctx.reply('Possible matches: \n \n');
  try {
    const songs = await findSongByText(ctx.message.text);
    await songs.forEach((el) => {
      ctx.reply(el);
    });
    ctx.reply(await doneGif());
  } catch {
    ctx.reply(await undoneGif());
    return ctx.reply('Dont have any songs');
  }
});

bot.launch();
