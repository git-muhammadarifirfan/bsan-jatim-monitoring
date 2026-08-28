const fs = require('fs');
const path = require('path');

const dataDir = 'F:/1.PROJECT/Sistem-Survey-Sekolah/Data';
const regencies = [
  { folder: 'Sidoarjo', name: 'Kab. Sidoarjo', csvFile: 'data_kuisoner_sidoarjo.csv', jsonFile: 'sekolah_kab_sidoarjo_sd_data_lengkap.json' },
  { folder: 'Batu', name: 'Kota Batu', csvFile: 'data_kuisoner_batu.csv', jsonFile: 'sekolah_kota_batu_sd_data_lengkap.json' },
  { folder: 'Tuban', name: 'Kab. Tuban', csvFile: 'data_kuisoner_tuban.csv', jsonFile: 'sekolah_tuban_sd_data_lengkap.json' }
];

// Helper to parse CSV properly (handling quotes)
function parseCSV(text) {
  const lines = text.split('\n');
  const result = [];
  
  for (let l = 0; l < lines.length; l++) {
    const line = lines[l].trim();
    if (!line) continue;
    
    const row = [];
    let insideQuote = false;
    let currentCell = '';
    
    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      if (char === '"') {
        insideQuote = !insideQuote;
      } else if (char === ',' && !insideQuote) {
        row.push(currentCell.trim().replace(/^"|"$/g, ''));
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
    row.push(currentCell.trim().replace(/^"|"$/g, ''));
    result.push(row);
  }
  
  return result;
}

let allSchools = [];
const masterNpsns = new Set();
const allRespondents = [];

// Track statistics per kabupaten
const kabupatenStats = {
  'Kab. Sidoarjo': { totalRespondents: 0, penerimaYa: 0, penerimaTidak: 0, implementasiSudah: 0, implementasiSebagian: 0, implementasiTidak: 0 },
  'Kota Batu': { totalRespondents: 0, penerimaYa: 0, penerimaTidak: 0, implementasiSudah: 0, implementasiSebagian: 0, implementasiTidak: 0 },
  'Kab. Tuban': { totalRespondents: 0, penerimaYa: 0, penerimaTidak: 0, implementasiSudah: 0, implementasiSebagian: 0, implementasiTidak: 0 }
};

// Kecamatans per kabupaten
const kecamatansByKab = {
  'Kab. Sidoarjo': ['Waru', 'Taman', 'Gedangan', 'Sedati', 'Buduran', 'Sukodono', 'Sidoarjo', 'Krian', 'Balongbendo', 'Tarik', 'Prambon', 'Krembung', 'Porong', 'Jabon', 'Tanggulangin', 'Tulangan', 'Wonoayu', 'Candi', 'Banjarbendo'],
  'Kota Batu': ['Batu', 'Bumiaji', 'Junrejo'],
  'Kab. Tuban': ['Bancar', 'Bangilan', 'Grabagan', 'Jatirogo', 'Jenu', 'Kenduruan', 'Kerek', 'Merakurak', 'Montong', 'Palang', 'Parengan', 'Plumpang', 'Rengel', 'Semanding', 'Senori', 'Singgahan', 'Soko', 'Tambakboyo', 'Tuban', 'Widang']
};

regencies.forEach(reg => {
  const regPath = path.join(dataDir, reg.folder);
  const csvPath = path.join(regPath, reg.csvFile);
  const jsonPath = path.join(regPath, reg.jsonFile);

  // Parse schools JSON
  if (fs.existsSync(jsonPath)) {
    const schoolsData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    schoolsData.forEach(s => {
      let cleanKec = s.kecamatan || '';
      cleanKec = cleanKec.replace(/^Kec\.\s*/i, '').trim();

      const cleanSchool = {
        id: 'sch-' + s.npsn,
        npsn: s.npsn || '',
        nama: s.nama || '',
        kecamatan: cleanKec,
        kabupaten: reg.name,
        status: 'belum',
        jenjang: s.bentuk_pendidikan || 'SD',
        statusSekolah: s.status_sekolah || 'NEGERI',
        totalGuru: parseInt(s.total_guru) || 0,
        totalSiswa: parseInt(s.total_pd_seluruh) || 0,
        akreditasi: s.akreditasi || '-',
        alamat: s.alamat_jalan || '-',
        email: s.email || '-',
        telepon: s.nomor_telepon || '-',
        x: s.bujur ? parseFloat(s.bujur) : 0,
        y: s.lintang ? parseFloat(s.lintang) : 0
      };
      allSchools.push(cleanSchool);
    });
  }

  // Parse CSV survey responses
  if (fs.existsSync(csvPath)) {
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const parsed = parseCSV(csvContent);
    if (parsed.length > 1) {
      const headers = parsed[0];
      
      // Index mapping
      const timestampIdx = 0;
      const namaIdx = 1;
      const jkelIdx = 2;
      const posisiIdx = 3;
      const sekolahIdx = 4;
      const npsnIdx = 5;
      const kabIdx = 6;
      const kecTubanIdx = 7;
      const kecBatuIdx = 8;
      const kecSidoarjoIdx = 9;
      const penerimaIdx = 10;
      const penyelenggaraIdx = 11;
      const implementasiIdx = 12;
      const kelasMengajarIdx = 13;

      for (let i = 1; i < parsed.length; i++) {
        const row = parsed[i];
        if (!row || row.length < 5) continue;

        const npsn = (row[npsnIdx] || '').trim();
        if (npsn) masterNpsns.add(npsn);

        let kec = row[kecSidoarjoIdx] || row[kecBatuIdx] || row[kecTubanIdx] || '';
        kec = kec.replace(/^Kec\.\s*/i, '').trim();

        const penerimaStr = (row[penerimaIdx] || '').trim().toLowerCase();
        const isPenerima = penerimaStr.startsWith('ya');

        const implStr = (row[implementasiIdx] || '').trim().toLowerCase();
        let statusImpl = 'belum';
        if (implStr.includes('seluruhnya') || implStr === 'ya') statusImpl = 'sudah';
        else if (implStr.includes('sebagian')) statusImpl = 'sebagian';

        // Update stats
        if (kabupatenStats[reg.name]) {
          kabupatenStats[reg.name].totalRespondents++;
          if (isPenerima) kabupatenStats[reg.name].penerimaYa++;
          else kabupatenStats[reg.name].penerimaTidak++;

          if (statusImpl === 'sudah') kabupatenStats[reg.name].implementasiSudah++;
          else if (statusImpl === 'sebagian') kabupatenStats[reg.name].implementasiSebagian++;
          else kabupatenStats[reg.name].implementasiTidak++;
        }

        allRespondents.push({
          id: `resp-${reg.folder}-${i}`,
          timestamp: row[timestampIdx] || '',
          nama: row[namaIdx] || 'Responden',
          jenisKelamin: row[jkelIdx] || 'Laki-Laki',
          posisi: row[posisiIdx] || 'Guru',
          sekolah: row[sekolahIdx] || '',
          npsn: npsn,
          kabupaten: reg.name,
          kecamatan: kec,
          penerima: isPenerima ? 'Ya' : 'Tidak',
          penyelenggara: row[penyelenggaraIdx] || '-',
          statusImplementasi: statusImpl,
          kelasMengajar: row[kelasMengajarIdx] || '-'
        });
      }
    }
  }
});

// Update school status based on survey respondents
allSchools = allSchools.map(s => {
  if (masterNpsns.has(s.npsn)) {
    const resps = allRespondents.filter(r => r.npsn === s.npsn);
    const hasSudah = resps.some(r => r.statusImplementasi === 'sudah');
    return { ...s, status: hasSudah ? 'sudah' : 'sebagian' };
  }
  return s;
});

console.log('Total Parsed Schools:', allSchools.length);
console.log('Total Parsed Survey Respondents:', allRespondents.length);
console.log('Kabupaten Stats:', JSON.stringify(kabupatenStats, null, 2));

// Write schools json & survey json
fs.writeFileSync('F:/1.PROJECT/Sistem-Survey-Sekolah/src/lib/real-schools.json', JSON.stringify(allSchools, null, 2));
fs.writeFileSync('F:/1.PROJECT/Sistem-Survey-Sekolah/src/lib/real-survey-data.json', JSON.stringify({
  stats: kabupatenStats,
  respondents: allRespondents,
  kecamatansByKab
}, null, 2));

console.log('Successfully generated real-schools.json & real-survey-data.json!');
