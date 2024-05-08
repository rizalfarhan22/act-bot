const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');

const token = '7056085852:AAGFj1LNqSh4OEna0Eljq61mm-HeefL7apo';
const bot = new TelegramBot(token, { polling: true });

const directoryPath = 'E:/SMart.ACT.2017.Incl.Keygen.Maret.2017/history/07-05-2024';

// Daftar nama file .act dalam urutan yang diinginkan
const fileNames = [
  '_COM54.act',
  '_COM53.act',
  '_COM55.act',
  '_COM56.act',
  '_COM57.act',
  '_COM59.act',
  '_COM60.act',
  '_COM61.act',
  '_COM63.act',
  '_COM64.act',
  '_COM65.act',
  '_COM67.act'
];

bot.onText(/\/reqact/, (msg) => {
  const chatId = msg.chat.id;
  console.log('Received request from chatId:', chatId);

  let dates = [];

  // Fungsi rekursif untuk mengumpulkan tanggal dari semua file
  function collectDates(index) {
    if (index >= fileNames.length) {
      console.log('All dates collected:', dates);
      // Mengirim semua tanggal dalam satu pesan jika ada data yang dikumpulkan
      if (dates.length > 0) {
        bot.sendMessage(chatId, dates.join('\n')).then(() => {
          console.log('Sent all dates to chatId:', chatId);
        }).catch((error) => {
          console.error('Error sending message:', error);
        });
      } else {
        // Jika tidak ada tanggal yang dikumpulkan, kirim pesan "tidak ada"
        bot.sendMessage(chatId, 'Tidak ada').then(() => {
          console.log('Sent "Tidak ada" to chatId:', chatId);
        }).catch((error) => {
          console.error('Error sending message:', error);
        });
      }
      return;
    }

    const fileName = fileNames[index];
    const filePath = path.join(directoryPath, fileName);

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        collectDates(index + 1); // Lanjut ke file berikutnya jika ada kesalahan
        return;
      }

      // Memisahkan data berdasarkan baris baru
      const lines = data.trim().split('\n');

      // Mengambil bagian tertentu dari baris terakhir (tanggal, bulan, tahun)
      let date = null;
      if (lines.length >= 7) {
        const lastLines = lines.slice(-7); // Ambil 7 baris terakhir
        lastLines.forEach(line => {
          const match = line.match(/(\d{2})\/(\d{2})\/(\d{4})/); // Pencocokan format tanggal (dd/mm/yyyy)
          if (match) {
            date = match[0]; // Mengambil tanggal pertama yang cocok
            return;
          }
        });
      } else if (lines.length >= 4) {
        const lastLines = lines.slice(-4); // Ambil 4 baris terakhir
        lastLines.forEach(line => {
          const match = line.match(/(\d{2})\/(\d{2})\/(\d{4})/); // Pencocokan format tanggal (dd/mm/yyyy)
          if (match) {
            date = match[0]; // Mengambil tanggal pertama yang cocok
            return;
          }
        });
      }

      if (date) {
        dates.push(date);
      } else {
        console.log('No valid date found in file:', fileName);
      }

      // Lanjut ke file berikutnya setelah mengumpulkan tanggal dari file saat ini
      collectDates(index + 1);
    });
  }

  // Memulai pengumpulan tanggal dari file pertama (0)
  collectDates(0);
});
