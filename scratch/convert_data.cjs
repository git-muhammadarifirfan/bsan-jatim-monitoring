const fs = require('fs');
const path = require('path');

const files = [
  { kab: 'Kab. Sidoarjo', json: 'F:/1.PROJECT/survasi.com/Data/Sidoarjo/sekolah_kab_sidoarjo_sd_data_lengkap.json', csv: 'F:/1.PROJECT/survasi.com/Data/Sidoarjo/data_kuisoner_sidoarjo.csv' },
  { kab: 'Kota Batu', json: 'F:/1.PROJECT/survasi.com/Data/Batu/sekolah_kota_batu_sd_data_lengkap.json', csv: 'F:/1.PROJECT/survasi.com/Data/Batu/data_kuisoner_batu.csv' },
  { kab: 'Kab. Tuban', json: 'F:/1.PROJECT/survasi.com/Data/Tuban/sekolah_tuban_sd_data_lengkap.json', csv: 'F:/1.PROJECT/survasi.com/Data/Tuban/data_kuisoner_tuban.csv' }
];

const npsnCounts = {};

files.forEach(f => {
  if (fs.existsSync(f.csv)) {
    const lines = fs.readFileSync(f.csv, 'utf8').split('\n');
    lines.slice(1).forEach(line => {
      const parts = line.split(',');
      if (parts.length > 5) {
        const npsn = parts[5] ? parts[5].replace(/['"]/g, '').trim() : '';
        if (npsn && npsn.length >= 7) {
          npsnCounts[npsn] = (npsnCounts[npsn] || 0) + 1;
        }
      }
    });
  }
});

const allSchools = [];
const missingCoords = [];

files.forEach(f => {
  if (fs.existsSync(f.json)) {
    const data = JSON.parse(fs.readFileSync(f.json, 'utf8'));
    data.forEach(item => {
      const npsn = item.npsn ? String(item.npsn).trim() : '';
      const count = npsnCounts[npsn] || 0;
      let status = 'belum';
      if (count >= 5) {
        status = 'sudah';
      } else if (count > 0) {
        status = 'sebagian';
      }

      const lat = parseFloat(item.lintang) || 0;
      const lng = parseFloat(item.bujur) || 0;
      const hasCoords = lat !== 0 && lng !== 0;

      const schoolObj = {
        id: item.sekolah_id || 'sch-' + (npsn || Math.random().toString(36).substr(2, 9)),
        npsn: npsn || '-',
        nama: item.nama || 'Sekolah Tanpa Nama',
        kecamatan: (item.kecamatan || '').replace(/^Kec\.\s*/i, '').trim(),
        kabupaten: item.kabupaten || f.kab,
        alamat: item.alamat_jalan || '-',
        latitude: lat,
        longitude: lng,
        hasCoordinates: hasCoords,
        status: status,
        respondenCount: count,
        totalGuru: item.total_guru || 0,
        totalSiswa: item.total_pd_seluruh || 0,
        statusSekolah: item.status_sekolah || 'SWASTA'
      };

      allSchools.push(schoolObj);
      if (!hasCoords) {
        missingCoords.push(schoolObj);
      }
    });
  }
});

fs.writeFileSync('F:/1.PROJECT/survasi.com/public/sekolah_jatim_map.json', JSON.stringify(allSchools, null, 2));
fs.writeFileSync('F:/1.PROJECT/survasi.com/src/shared/data/sekolah-map-data.json', JSON.stringify(allSchools, null, 2));

console.log('Processed total schools:', allSchools.length);
console.log('Valid coordinates:', allSchools.length - missingCoords.length);
console.log('Missing coordinates:', missingCoords.length);
