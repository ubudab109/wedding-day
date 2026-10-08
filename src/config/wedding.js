// Single source of truth for every piece of invitation content.
// Edit this file to change names, dates, venue, story, or bank accounts.

export const wedding = {
  couple: {
    groom: {
      nickname: 'Rizky',
      fullName: 'Muhammad Rizky Firdaus',
      role: 'Mempelai Pria',
      parents: 'Putra Pertama dari Bpk. Suryadi & Ibu Patimah',
      description:
        'Sosok penyayang, tangguh, dan penuh kasih yang siap mengarungi bahtera kehidupan bersama.',
      instagram: 'rizkyfirdaus0309',
    },
    bride: {
      nickname: 'Indah',
      fullName: 'Lanina Indah Setyani',
      role: 'Mempelai Wanita',
      parents: 'Putri Pertama dari Bpk. Setio Budi & Ibu Mulyani',
      description:
        'Sosok yang lembut, ceria, dan penuh kehangatan yang melengkapi setiap langkah perjalanan ini.',
      instagram: 'lanina_indah',
    },
  },

  // ISO string with Jakarta offset so the countdown is correct in every timezone.
  date: '2026-11-07T08:00:00+07:00',
  dateLabel: 'Sabtu, 07 November 2026',
  dateShort: '07 . 11 . 2026',

  // NOTE: times are placeholders — adjust to the real rundown.
  events: [
    {
      title: 'Akad Nikah',
      arabic: 'عَقْدُ النِّكَاح',
      date: 'Sabtu, 07 November 2026',
      time: '08.00 – 10.00 WIB',
      start: '20261107T010000Z',
      end: '20261107T030000Z',
    },
    {
      title: 'Resepsi',
      arabic: 'وَلِيمَةُ العُرْس',
      date: 'Sabtu, 07 November 2026',
      time: '11.00 WIB – Selesai',
      start: '20261107T040000Z',
      end: '20261107T070000Z',
    },
  ],

  venue: {
    name: 'Taman Tapawira',
    city: 'Jakarta',
    lat: -6.286921577886651,
    lng: 106.8240474809991,
  },

  quran: {
    arabic:
      'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ',
    translation:
      'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.',
    source: 'QS. Ar-Rum : 21',
  },

  story: [
    {
      date: '08 Agustus 2017',
      title: 'Pertemuan Pertama',
      text: 'Kami bertemu dalam komunitas yang sama. Percakapan singkat hari itu membuka pintu kebersamaan kami.',
      icon: 'spark',
    },
    {
      date: '03 September 2017',
      title: 'Berjanji',
      text: 'Kami resmi menjalin hubungan untuk mengenal lebih jauh satu sama lain. Di sinilah kisah cinta kami benar-benar bersemi.',
      icon: 'heart',
    },
    {
      date: '27 Juni 2026',
      title: 'Momen Lamaran',
      text: 'Setelah bertahun-tahun saling mengenal, kami memutuskan mengikat janji suci dan melangkah ke pelaminan.',
      icon: 'ring',
    },
    {
      date: '07 November 2026',
      title: 'Hari Bahagia Kami',
      text: 'Pada tanggal ini kami akan mengikat janji suci dan melanjutkan kisah kami selamanya. Doakan kami agar menjadi keluarga yang sakinah, mawaddah, warahmah.',
      icon: 'mosque',
    },
  ],

  giftAddress:
    'Jl. Ampera II Gang Haji Nata Sirin RT004/RW09 No. 28B, Kelurahan Ragunan, Kecamatan Pasar Minggu, Jakarta Selatan 12550',

  // Keys match file names in public/images (optimized at build time).
  photos: { opening: 'couple_opening', groom: 'rizky', bride: 'indah' },

  // AI-generated sticker of the couple drawn as little kids, shown on the cover.
  child: {
    sticker: 'child',
    alt: 'Ilustrasi AI Rizky dan Indah sebagai anak kecil, saling berpelukan',
    caption: '',
  },

  gifts: [
    { bank: 'BCA', bankName: 'Bank Central Asia', holder: 'Muhammad Rizky Firdaus', number: '5855141016' },
    { bank: 'BCA', bankName: 'Bank Central Asia', holder: 'Lanina Indah Setyani', number: '5855141580' },
  ],

  // Replaces `gifts` entirely when the link carries `?from=<key>` (e.g. `?from=mertua`).
  giftsByFrom: {
    mertua: [{ bank: 'BCA', bankName: 'Bank Central Asia', holder: 'Mulyani', number: '5540870286' }],
  },

  music: {
    // If the file is missing, a soft generated ambient melody plays instead.
    src: '/music/song.mp3',
    title: "You're Still the One",
    subtitle: 'Instrumental',
  },
};
