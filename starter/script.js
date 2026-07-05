// Elements
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const landingState = document.getElementById('landing-state');
const toneButtons = document.querySelectorAll('.tone-btn');
const starterCards = document.querySelectorAll('.starter-card');
const photoInput = document.getElementById('photo-input');

// State
let currentTone = 'empathetic'; // Default tone

// SVG Icon for AI Avatar
const botAvatarSVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
`;

// AI Romance Response Library
const responseDatabase = {
  chat: {
    empathetic: "Memulai obrolan dengan crush memang bisa bikin deg-degan banget! Wajar kok kalau kamu merasa gugup. Tips terbaik adalah mulai dengan tulus dan ringan. Coba tanyakan kegiatannya hari ini atau komentari sesuatu yang kalian berdua sukai di media sosialnya. Jadilah dirimu sendiri dan tunjukkan ketertarikan yang tulus pada ceritanya. Semangat ya, kamu pasti bisa! 💕",
    realistic: "Jangan overthink. Mulailah dengan sapaan sederhana yang relevan, misalnya menanyakan opini tentang suatu tempat, tugas, atau film. Jika dia membalas singkat, jangan langsung berasumsi dia tidak suka, tapi perhatikan konsistensinya. Hubungan yang baik dimulai dari obrolan dua arah yang seimbang, jadi jangan berjuang sendirian jika dia tidak membalas antusiasme kamu. 🧠",
    playful: "Trik jitu PDKT: jangan chat 'Hai lagi apa?'. Bosan banget! Coba kirim meme lucu yang relate dengan kehidupannya atau bahas hal unik/absurd yang baru kamu alami. Kalau dia tertawa, kamu sudah menang satu langkah. Kalau dia cuma baca... tenang, masih banyak ikan di laut dan masih banyak crush di luar sana! 😉"
  },
  conflict: {
    empathetic: "Aku sangat mengerti, berselisih paham dengan orang yang kita sayang itu rasanya berat dan membuat hati sedih sekali. Langkah pertama untuk baikan adalah menenangkan diri dahulu. Setelah emosi mereda, bicaralah dari hati ke hati. Fokus pada perasaanmu sendiri (gunakan kalimat bermula dengan 'Aku merasa...' alih-alih menyalahkan dia dengan 'Kamu selalu...'). Aku di sini mendukungmu agar hubungan kalian lekas membaik. 💕",
    realistic: "Dalam konflik, tujuannya adalah menyelesaikan masalah, bukan memenangkan perdebatan. Akui kesalahanmu secara jujur dan spesifik tanpa membuat alasan pembelaan diri. Mintalah waktu untuk berdiskusi dengan kepala dingin dan buatlah kesepakatan atau solusi nyata agar masalah serupa tidak terulang di masa depan. Hubungan dewasa butuh tanggung jawab. 🧠",
    playful: "Berantem itu bumbu hubungan, tapi jangan kelamaan asinnya ya! Coba turunkan gengsi sedikit, lalu kirimkan makanan atau minuman kesukaannya via ojol disertai catatan kecil yang tulus. Menyogok perut pasangan biasanya 90% berhasil meredakan badai kemarahan seketika! 🍕"
  },
  signs: {
    empathetic: "Membaca tanda-tanda ketertarikan seseorang memang manis dan mendebarkan sekali. Biasanya, jika dia tertarik padamu, dia akan berusaha meluangkan waktu di tengah kesibukannya, mendengarkan cerita-cerita kecilmu dengan antusias, dan mengingat hal-hal detail tentang dirimu yang bahkan kamu sendiri lupa. Semoga perasaanmu terbalas dengan indah ya! 💕",
    realistic: "Secara psikologis, tanda terkuat adalah konsistensi tindakan, bukan sekadar kata-kata manis di chat. Perhatikan bahasa tubuhnya saat bertemu langsung: apakah ada kontak mata yang intens, apakah dia mencondongkan tubuhnya ke arahmu saat mengobrol, dan apakah dia berinisiatif menghubungimu duluan secara berkala. Jika tidak ada konsistensi, dia mungkin hanya bersikap ramah biasa. 🧠",
    playful: "Sederhananya: kalau dia membalas chatmu secepat kilat, tertawa lebar bahkan pada lelucon garingmu, dan selalu mencari alasan untuk dekat-dekat... fix, dia naksir berat! Tapi kalau dia balasnya 3 hari sekali dengan 'wkwk iya', mungkin kamu perlu pelan-pelan pasang rem dan mundur teratur! 🚀"
  },
  deeptalk: {
    empathetic: "Deep talk adalah jembatan terindah untuk merajut kedekatan emosional yang mendalam. Coba tanyakan hal-hal yang menyentuh perasaannya, seperti: 'Momen apa dalam hidupmu yang paling membentuk karaktermu saat ini?' atau 'Apa ketakutan terbesar yang sedang kamu hadapi sekarang?'. Dengarkan jawabannya dengan empati penuh tanpa menghakimi. 💕",
    realistic: "Deep talk membutuhkan rasa aman dan kepercayaan. Mulailah dengan berbagi kerentanan atau cerita pribadimu sendiri terlebih dahulu sebelum bertanya, agar dia tidak merasa sedang diinterogasi. Beberapa topik bagus: target hidupnya 3 tahun ke depan, pandangannya mengenai komitmen jangka panjang, serta bagaimana cara dia ingin ditenangkan saat sedang stres berat. 🧠",
    playful: "Mau deep talk yang seru tapi tetap santai? Coba tanya: 'Kalau kita terdampar di pulau kosong berdua, satu barang apa yang wajib kamu bawa?' atau 'Apa sifat konyolku yang paling kamu maklumi?'. Dijamin obrolan bakal mengalir seru sampai larut malam tanpa terasa canggung atau membosankan! 📞"
  },
  default: {
    empathetic: "Terima kasih sudah mau berbagi cerita denganku. Masalah asmara memang seringkali rumit dan melibatkan banyak emosi, tetapi ingatlah bahwa perasaanmu sepenuhnya valid. Berikan dirimu waktu untuk memproses semuanya dengan tenang. Ingat, kamu layak mendapatkan cinta yang tulus dan menghargaimu sepenuhnya. 💕",
    realistic: "Setiap hubungan yang sehat membutuhkan kerja sama, komunikasi yang jujur tanpa kode-kodean, dan batasan (*boundaries*) yang jelas. Solusi terbaik dari masalahmu saat ini adalah membicarakannya secara langsung, rasional, dan terbuka dengan pasanganmu. Tebak-tebakan pikiran hanya akan memicu kesalahpahaman baru. 🧠",
    playful: "Asmara itu memang mirip wahana roller coaster: kadang bikin seneng banget sampai teriak, kadang bikin pusing sampai pengen pulang! 🎢 Apapun masalah asmaramu saat ini, bawa santai dulu aja. Yuk, ceritakan lebih detail, aku siap dengerin dan kasih perspektif seru buat kamu!"
  }
};

// Event: Tone Selector
toneButtons.forEach(btn => {
  btn.addEventListener('click', function() {
    toneButtons.forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    currentTone = this.dataset.tone;
  });
});

// Event: Quick Starters
starterCards.forEach(card => {
  card.addEventListener('click', function() {
    const question = this.dataset.message;
    submitMessage(question);
  });
});

// Event: Form Submit
form.addEventListener('submit', function (e) {
  e.preventDefault();
  const userMessage = input.value.trim();
  if (!userMessage) return;

  submitMessage(userMessage);
  input.value = '';
});

// Event: Photo Upload
photoInput.addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;

  submitPhoto(file);
  this.value = ''; // reset so the same file can be re-selected later
});

// Handle Photo Submission (body language analysis)
async function submitPhoto(file) {
  // Hide landing state if it is still visible
  if (landingState && landingState.style.display !== 'none') {
    landingState.style.display = 'none';
  }

  // 1. Append User Message with image preview
  const imageUrl = URL.createObjectURL(file);
  appendMessage('user', 'Tolong analisis bahasa tubuh dari foto ini.', imageUrl);

  // 2. Show Typing Indicator
  const typingIndicator = showTypingIndicator();

  // 3. Call Backend API
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('tone', currentTone);

    const response = await fetch('http://localhost:3000/analyze-photo', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    // Remove Typing Indicator
    typingIndicator.remove();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    // Append Real Bot Response
    appendMessage('bot', data.result || "Maaf, terjadi kesalahan saat menganalisis foto.");
  } catch (error) {
    console.error('Error analyzing photo:', error);

    // Remove Typing Indicator (safe even if already removed)
    typingIndicator.remove();

    // Append Error Message
    appendMessage('bot', `⚠️ Gagal menganalisis foto: ${error.message}`);
  }
}

// Handle Message Submission
async function submitMessage(text) {
  // Hide landing state if it is still visible
  if (landingState && landingState.style.display !== 'none') {
    landingState.style.display = 'none';
  }

  // 1. Append User Message
  appendMessage('user', text);

  // 2. Show Typing Indicator
  const typingIndicator = showTypingIndicator();

  // 3. Call Backend API
  try {
    const response = await fetch('http://localhost:3000/generate-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: text,
        tone: currentTone
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Remove Typing Indicator
    typingIndicator.remove();

    // Append Real Bot Response
    appendMessage('bot', data.result || "Maaf, terjadi kesalahan saat menerima respons.");
  } catch (error) {
    console.error('Error fetching from backend:', error);
    
    // Remove Typing Indicator
    typingIndicator.remove();
    
    // Append Error Message
    appendMessage('bot', "⚠️ Gagal terhubung ke server Rela-she-on. Pastikan server backend Anda sudah dinyalakan di `http://localhost:3000`.");
  }
}

// Append Message to Chat Box
function appendMessage(sender, text, imageUrl) {
  const row = document.createElement('div');
  row.classList.add('message-row', sender);

  const formattedText = formatResponseText(text);
  const imageHTML = imageUrl ? `<img src="${imageUrl}" alt="Foto yang diunggah" class="msg-image" />` : '';

  if (sender === 'bot') {
    // Bot needs avatar + bubble
    row.innerHTML = `
      <div class="msg-avatar">
        ${botAvatarSVG}
      </div>
      <div class="message-bubble">
        ${imageHTML}${formattedText}
      </div>
    `;
  } else {
    // User only needs bubble
    row.innerHTML = `
      <div class="message-bubble">
        ${imageHTML}${formattedText}
      </div>
    `;
  }

  chatBox.appendChild(row);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Show Typing Indicator
function showTypingIndicator() {
  const indicator = document.createElement('div');
  indicator.id = 'typing-indicator';
  indicator.classList.add('message-row', 'bot');
  indicator.innerHTML = `
    <div class="msg-avatar">
      ${botAvatarSVG}
    </div>
    <div class="typing-bubble">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  
  chatBox.appendChild(indicator);
  chatBox.scrollTop = chatBox.scrollHeight;
  return indicator;
}

// Helper to format simple markdown (bold, italic, and newlines)
function formatResponseText(text) {
  if (!text) return "";
  
  // Escape HTML to prevent XSS but keep format tags
  let formatted = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Bold: **text** -> <strong>text</strong> (non-greedy)
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Italic: *text* -> <em>text</em> (non-greedy)
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Newlines: \n -> <br>
  formatted = formatted.replace(/\n/g, '<br>');

  return formatted;
}

