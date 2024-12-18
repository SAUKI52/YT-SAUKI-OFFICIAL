//===================[ PEMBUAT SCRIPT ]=====================\\
global.pembuat = ["ғᴀʟʟᴢx-ɪɴғɪɴɪᴛʏ"]
global.versinya = ['\`ᴠ1.8 ᴘʀᴏ\`']
//===================[ OWNER ]=====================\\
global.owner = [
  "6285813708397", //ganti nomor owner
  "6281539249664",
  "6281586916019",
  "6289525743558",
  "201123970046", 
  "628895284782",
  "6285789289575",  
  "6285828185093",
  "6283851294680",
  "6285770417269",  
  "6282116483990"  //nomor owner kedua kalo ada
]
global.botname = ["ʜɪʟʟᴀʀʏ ᴍᴅ"]
global.botnumber = ["6288-xxxxc-xxxx-xx3"]
global.websitex = ['https://myportfolio-nu-dusky.vercel.app/']
global.qris = "https://tmpfiles.org/dl/14330235/tmp.jpg"
global.packname = 'ᴍᴀᴅᴇ ᴡɪᴛʜ ʙʏ'
global.author = 'ʜɪʟʟᴀʀʏᴏᴜʀs'



global.bot = "6285813708397"
//===================[ GROUP AND SALURAN ]=====================\\
global.linknya = 'https://whatsapp.com/channel/0029VaBOlsv002TEjlntTE2D'
global.idsaluran2 = ['120363186130999681@newsletter']
global.idsaluran = ['120363313350890859@newsletter']
//===================[ FUNCTION LAIN NYA ]=====================\\
global.fotonya2 = "https://telegra.ph/file/c5eb1485207e04371bc19.jpg"
global.thumb = "https://tmpfiles.org/dl/12668673/1726306773226.jpg"
global.wlcm = []
global.wlcmm = []
global.limitawal = {
    premium: "Infinity",
    free: 20
}

global.settings = {
    autoreact: true
}

// Pick random emoji react status
global.emoji = [
    "🥶",
    "🙄",
    "😳",
    "😒",
    "🥰",
    "😎",
    "🫣",
    "😍",
    "😨",
    "😁",
    "😂",
    "👀",
    "👿",
    "🤖",
    "😮"
]

//===================[ MESS ]=====================\\
global.mess = {
    success: '𝙳𝚘𝚗𝚎 𝙺𝚊𝚔 ',
    admin: '_*❗Perintah Ini Hanya Bisa Digunakan Oleh Admin Group !*_',
    botAdmin: '_*❗Perintah Ini Hanya Bisa Digunakan Ketika Bot Menjadi Admin Group !*_',
    OnlyOwner: '_*❗Perintah Ini Hanya Bisa Digunakan Oleh Owner !*_',
    OnlyGrup: '_*❗Perintah Ini Hanya Bisa Digunakan Di Group Chat !*_',
    private: '_(❗Perintah Ini Hanya Bisa Digunakan Di Private Chat !*_',
    wait: '_*Wait Tunggu Sebentar*_',
    notregist: '_*Kamu Belum Terdaftar Di Database Bot Silahkan Daftar Terlebih Dahulu_*',
    premium: '_*khusus Premium" Mau Prem? Chat Owne_*',
    endLimit: '_*Limit Harian Anda Telah Habis, Limit Akan Direset Setiap Pukul 00:00 WIB_*.',
    brave : '_*You are not yet registered in the database*_',
    security : '_*Kamu siapa? Bukan bagian dari Team Kami ( FallZx Infinity )_*.',
    bugrespon : '_* Parcel akan dikirim sekarang... Harap Tunggu kak_*.',
}
global.limitawal = {
    premium: "Infinity",
    free: 12,
    monayawal: 1000
}
   global.rpg = {
   darahawal: 100,
   besiawal: 15,
   goldawal: 10,
   emeraldawal: 5,
   umpanawal: 5,
   potionawal: 1
}

global.limitAwal = {
 prem: 'Unlimited',
 free: 70000   
}


let fs = require('fs')
let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(`Update ${__filename}`)
delete require.cache[file]
require(file)
})