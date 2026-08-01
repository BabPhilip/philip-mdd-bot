const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

const ACCESS_TOKEN = process.env.ACCESS_TOKEN || '';
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID || '';
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || '';
const HF_API_TOKEN = process.env.HF_API_TOKEN || '';
const HF_MODEL = process.env.HF_MODEL || 'google/flan-t5-small';
const API_VERSION = process.env.API_VERSION || 'v17.0';
const PORT = process.env.PORT || 3000;

// In-memory simple stores for Phase 1 (persist to DB in Phase 2)
const sudoList = new Set();
const bannedNumbers = new Set();

if (!VERIFY_TOKEN) {
  console.warn('WARN: VERIFY_TOKEN not set — webhook verification will fail until you set it');
}

const MENU_TEXT = `*╔═━━━━━✦✦✦━━━━━━═❐*
*┃ PHIL D WIZ MD BUG*
*╚═━━━━━✦✦✦━━━━━━═❐*
*╔═━━━━━━━━━━━━━━━━━❐*
*┃𖠁 *OWNER:* *PHIL D WIZ ☠️*
*┃𖠁 *VERSION:* *PHIL D WIZ MD BUG*
*┃𖠁 *USER:* Hondo
*┃𖠁 *TIME:* --:--:-- (your timezone)
*┃𖠁 *UPTIME:* --
*┃𖠁 *TOTAL CMD:* many
*┃𖠁 *TODAY:* --
*┃𖠁 *DATE:* --
*┃𖠁 *MODE:* 🌍 Public
*┃*
*╚═━━━━━━━━━━━━━━━━━❐*

*┏━❐〔 🦠🐛 Bug menu〕━━┈❐*
*┃➺│ .phil-destroy* (blocked)
*┃➺│ .phil-infinity*
*┃➺│ .philfc*
*┃➺│ .delayhard* (blocked)
*┃➺│ .crash_ios* (blocked)
*┃➺│ .forcecloseios* (blocked)
*┃➺│ .crash* (blocked)
*┃➺│ .clearbugs*
*┗━━━━━━━━━━━━━━━━┈❐*

*... menu shortened for WhatsApp readability ...*

*⚙️ Powered by PHIL D WIZ*`;

// A set of substrings that are considered unsafe or disallowed. Any command
// matching these substrings will be refused for safety/legal reasons.
const UNSAFE_PATTERNS = [
  'crash', 'hijack', 'forceclose', 'destroy', 'getnumber', 'getsms', 'sms', 'loli', 'hentai', 'boost', 'spam', 'hack'
];

// Helper to check if a command is unsafe
function isUnsafeCommand(cmd) {
  const s = cmd.toLowerCase();
  return UNSAFE_PATTERNS.some(p => s.includes(p));
}

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Webhook verification endpoint
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified');
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
});

// Main webhook receiver
app.post('/webhook', async (req, res) => {
  try {
    const body = req.body;
    if (!body || !body.entry) return res.sendStatus(400);

    for (const entry of body.entry) {
      const changes = entry.changes || [];
      for (const change of changes) {
        const value = change.value || {};
        const messages = value.messages || [];
        for (const m of messages) {
          const from = m.from;
          const text = m.text?.body || '';
          console.log(`Incoming message from ${from}: ${text}`);

          if (bannedNumbers.has(from)) {
            console.log(`Ignoring banned number ${from}`);
            continue;
          }

          // Normalize and parse command
          const raw = (text || '').trim();
          if (!raw) {
            await sendTextMessage(from, 'Empty message received.');
            continue;
          }

          // Support dot-prefixed commands and plain words.
          let cmd = '';
          let args = '';
          if (raw.startsWith('.')) {
            const parts = raw.slice(1).split(/\s+/);
            cmd = parts[0].toLowerCase();
            args = parts.slice(1).join(' ');
          } else {
            const parts = raw.split(/\s+/);
            cmd = parts[0].toLowerCase();
            args = parts.slice(1).join(' ');
          }

          // Special-case 'menu' and 'help' to send the big menu
          if (cmd === 'menu' || cmd === 'help' || cmd === 'commands' || cmd === 'start') {
            await sendLongMessage(from, MENU_TEXT);
            continue;
          }

          // Owner/admin internal commands (no auth required yet; improve in Phase 2)
          if (cmd === 'addsudo') {
            if (!args) {
              await sendTextMessage(from, 'Usage: .addsudo <number>');
            } else {
              sudoList.add(args);
              await sendTextMessage(from, `Added ${args} to sudo list.`);
            }
            continue;
          }

          if (cmd === 'listsudo') {
            const list = Array.from(sudoList).join('\n') || '(none)';
            await sendTextMessage(from, `Sudo list:\n${list}`);
            continue;
          }

          if (cmd === 'delsudo') {
            if (!args) {
              await sendTextMessage(from, 'Usage: .delsudo <number>');
            } else {
              sudoList.delete(args);
              await sendTextMessage(from, `Removed ${args} from sudo list.`);
            }
            continue;
          }

          if (cmd === 'ban') {
            if (!args) {
              await sendTextMessage(from, 'Usage: .ban <number>');
            } else {
              bannedNumbers.add(args);
              await sendTextMessage(from, `Number ${args} is now banned (bot will ignore messages).`);
            }
            continue;
          }

          if (cmd === 'unban') {
            if (!args) {
              await sendTextMessage(from, 'Usage: .unban <number>');
            } else {
              bannedNumbers.delete(args);
              await sendTextMessage(from, `Number ${args} unbanned.`);
            }
            continue;
          }

          // Greeting and info
          if (cmd === 'hello' || cmd === 'hi') {
            await sendTextMessage(from, "Hello! I'm Phil D Wiz. Send 'menu' or '.menu' to see commands.");
            continue;
          }

          if (cmd === 'info') {
            await sendTextMessage(from, 'Phil D Wiz Bot: WhatsApp Cloud API demo with Hugging Face inference powered AI and many command stubs.');
            continue;
          }

          if (cmd === 'ping') {
            await sendTextMessage(from, 'pong');
            continue;
          }

          // Fun/Games
          if (cmd === 'coin') {
            const res = Math.random() < 0.5 ? 'Heads' : 'Tails';
            await sendTextMessage(from, `Coin flip: ${res}`);
            continue;
          }

          if (cmd === 'dice') {
            const roll = Math.floor(Math.random() * 6) + 1;
            await sendTextMessage(from, `You rolled a ${roll}`);
            continue;
          }

          if (cmd === 'rps') {
            const choices = ['rock', 'paper', 'scissors'];
            const bot = choices[Math.floor(Math.random() * choices.length)];
            const user = args.toLowerCase();
            let result = 'I did not understand your move. Use: .rps rock|paper|scissors';
            if (choices.includes(user)) {
              if (user === bot) result = `Tie! We both chose ${bot}`;
              else if ((user === 'rock' && bot === 'scissors') || (user === 'paper' && bot === 'rock') || (user === 'scissors' && bot === 'paper')) result = `You win! I chose ${bot}`;
              else result = `You lose! I chose ${bot}`;
            }
            await sendTextMessage(from, result);
            continue;
          }

          // AI command - use HF if configured
          if (['ai','chatgpt','mathgpt','codeai','chat'].includes(cmd)) {
            const prompt = args || raw.replace(/^\.(ai|chatgpt|mathgpt|codeai|chat)\s*/i, '').trim();
            if (!prompt) {
              await sendTextMessage(from, 'Usage: .ai <your question>');
              continue;
            }
            if (!HF_API_TOKEN) {
              await sendTextMessage(from, 'AI is not configured. Set HF_API_TOKEN in environment to enable AI replies.');
              continue;
            }
            const reply = await generateReplyHf(prompt);
            await sendTextMessage(from, reply || 'Sorry, I could not generate a reply.');
            continue;
          }

          // vCard / contact (send simple vCard as text - Cloud API supports contact messages with specific payloads; for Phase 1 we provide vCard text)
          if (cmd === 'vcf' || cmd === 'savecontact') {
            const contact = args || 'Name: Unknown, Phone: (provide phone)';
            await sendTextMessage(from, `vCard:\n${contact}`);
            continue;
          }

          // If command appears unsafe, refuse
          if (isUnsafeCommand(cmd)) {
            await sendTextMessage(from, `The command '.${cmd}' is unavailable for safety or policy reasons.`);
            continue;
          }

          // Default: echo or placeholder acknowledgement
          await sendTextMessage(from, `Command '.${cmd}' received. This is a placeholder implementation. Arguments: ${args || '(none)'}`);
        }
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('Error handling webhook POST', err?.message || err);
    res.sendStatus(500);
  }
});

// sendTextMessage uses the WhatsApp Cloud API to send text messages
async function sendTextMessage(to, text) {
  if (!ACCESS_TOKEN || !PHONE_NUMBER_ID) {
    console.warn('ACCESS_TOKEN or PHONE_NUMBER_ID not set — cannot send message.');
    return;
  }

  const url = `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`;
  const body = {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body: text }
  };

  try {
    const resp = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Sent message, status:', resp.status);
  } catch (err) {
    console.error('Failed to send message:', err?.response?.data || err?.message || err);
  }
}

// sendLongMessage splits long menu into multiple messages to avoid size limits
async function sendLongMessage(to, longText) {
  const max = 1500; // safe chunk size for WhatsApp
  for (let i = 0; i < longText.length; i += max) {
    const chunk = longText.slice(i, i + max);
    await sendTextMessage(to, chunk);
  }
}

async function generateReplyHf(prompt) {
  if (!HF_API_TOKEN) return null;

  const url = `https://api-inference.huggingface.co/models/${HF_MODEL}`;
  try {
    const resp = await axios.post(url, { inputs: prompt, parameters: { max_new_tokens: 150 } }, {
      headers: {
        Authorization: `Bearer ${HF_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      timeout: 60_000
    });

    const data = resp.data;
    if (!data) return null;
    if (typeof data === 'string') return data;
    if (Array.isArray(data)) {
      if (data[0]?.generated_text) return data[0].generated_text;
      if (typeof data[0] === 'string') return data[0];
    }
    if (data.generated_text) return data.generated_text;
    return JSON.stringify(data).slice(0, 1000);
  } catch (err) {
    console.error('HF generate error:', err?.response?.data || err?.message || err);
    return null;
  }
}

app.listen(PORT, () => {
  console.log(`Phil D Wiz Bot listening on port ${PORT}`);
});
