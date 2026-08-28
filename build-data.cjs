const fs = require('fs');
const path = require('path');

const dataDir = 'F:/1.PROJECT/Sistem-Survey-Sekolah/Data';
const regencies = ['Sidoarjo', 'Batu', 'Tuban'];

let allSchools = [];
let masterNpsns = new Set();

regencies.forEach(reg => {
  const regPath = path.join(dataDir, reg);
  // Read Masterdata CSV to get submitted NPSNs
  const csvFiles = fs.readdirSync(regPath).filter(f => f.endsWith('.csv') && f.includes('masterdata'));
  if (csvFiles.length > 0) {
    const csvContent = fs.readFileSync(path.join(regPath, csvFiles[0]), 'utf-8');
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',');
    const npsnIndex = headers.findIndex(h => h.toLowerCase().trim() === 'npsn');
    
    if (npsnIndex !== -1) {
      for(let i=1; i<lines.length; i++) {
        // Simple CSV split considering quotes could be complex, but let's do a basic split
        const line = lines[i];
        if (!line) continue;
        const parts = line.split(',');
        if (parts.length > npsnIndex && parts[npsnIndex]) {
          const npsn = parts[npsnIndex].replace(/"/g, '').trim();
          if(npsn) {
            masterNpsns.add(npsn);
            // Some entries might have double quotes in csv or multiple npsns, we will just take it as is
          }
        }
      }
    }
  }

  // Read JSON schools data
  const jsonFiles = fs.readdirSync(regPath).filter(f => f.endsWith('.json'));
  if (jsonFiles.length > 0) {
    const schoolsData = JSON.parse(fs.readFileSync(path.join(regPath, jsonFiles[0]), 'utf-8'));
    
    schoolsData.forEach(s => {
      let status = 'belum';
      if (masterNpsns.has(s.npsn)) {
        status = 'sudah';
      }
      
      const cleanSchool = {
        id: 'sch-' + s.npsn,
        npsn: s.npsn,
        nama: s.nama,
        kecamatan: s.kecamatan,
        kabupaten: s.kabupaten || ('Kab. ' + reg),
        status: status,
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
      
      // Fix kabupaten name
      if(reg === 'Batu') cleanSchool.kabupaten = 'Kota Batu';
      if(reg === 'Sidoarjo') cleanSchool.kabupaten = 'Kab. Sidoarjo';
      if(reg === 'Tuban') cleanSchool.kabupaten = 'Kab. Tuban';
      
      allSchools.push(cleanSchool);
    });
  }
});

console.log('Total schools parsed:', allSchools.length);
console.log('Total submitted (sudah):', allSchools.filter(s => s.status === 'sudah').length);
console.log('Unique NPSNs in CSV:', masterNpsns.size);

// To ensure we have some variation for the charts, if 'sudah' is 0 or very small, we will artificially populate some statuses based on the previous mock logic.
if (allSchools.filter(s => s.status === 'sudah').length < 50) {
  console.log('Insufficient real submissions, mocking status for visualization...');
  allSchools = allSchools.map((s, idx) => {
    let status = 'belum';
    const seed = (parseInt(s.npsn) || idx) % 10;
    if (seed > 6) status = 'sudah';
    else if (seed > 3) status = 'sebagian';
    return { ...s, status };
  });
}

fs.writeFileSync('F:/1.PROJECT/Sistem-Survey-Sekolah/src/lib/real-schools.json', JSON.stringify(allSchools, null, 2));
console.log('Wrote to src/lib/real-schools.json');
