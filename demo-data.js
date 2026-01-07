// Demo Data untuk Testing e-TU Sekolah
// Jalankan fungsi ini di Console Browser untuk mengisi data demo

function loadDemoData() {
    console.log('🚀 Loading Demo Data...');
    
    // Demo Surat Masuk
    suratMasuk = [
        {
            id: 1698234567890,
            nomorSurat: '001/DINAS/X/2024',
            tanggal: '2024-10-15',
            pengirim: 'Dinas Pendidikan Kota',
            perihal: 'Undangan Rapat Koordinasi',
            file: 'undangan-rapat.pdf'
        },
        {
            id: 1698234567891,
            nomorSurat: '002/KOMITE/X/2024',
            tanggal: '2024-10-18',
            pengirim: 'Komite Sekolah',
            perihal: 'Proposal Kegiatan Ekstrakurikuler',
            file: 'proposal-ekskul.pdf'
        },
        {
            id: 1698234567892,
            nomorSurat: '003/OSIS/X/2024',
            tanggal: '2024-10-20',
            pengirim: 'OSIS SMA Negeri',
            perihal: 'Permohonan Izin Kegiatan',
            file: ''
        }
    ];
    
    // Demo Surat Keluar
    suratKeluar = [
        {
            id: 1698234567893,
            nomorSurat: '001/TU/X/2024',
            tanggal: '2024-10-16',
            tujuan: 'Dinas Pendidikan Kota',
            perihal: 'Laporan Kegiatan Bulanan',
            jenis: 'Pemberitahuan'
        },
        {
            id: 1698234567894,
            nomorSurat: '002/TU/X/2024',
            tanggal: '2024-10-19',
            tujuan: 'Seluruh Guru dan Pegawai',
            perihal: 'Undangan Rapat Dewan Guru',
            jenis: 'Undangan'
        },
        {
            id: 1698234567895,
            nomorSurat: '003/TU/X/2024',
            tanggal: '2024-10-22',
            tujuan: 'Bapak Ahmad Rizki, S.Pd',
            perihal: 'Surat Tugas Mengikuti Workshop',
            jenis: 'Tugas'
        }
    ];
    
    // Demo Arsip Digital
    arsipDigital = [
        {
            id: 1698234567896,
            nama: 'SK Kepala Sekolah Tahun 2024',
            kategori: 'SK',
            tanggal: '2024-01-15',
            file: 'sk-kepsek-2024.pdf'
        },
        {
            id: 1698234567897,
            nama: 'Berita Acara Rapat Pleno',
            kategori: 'BA',
            tanggal: '2024-09-20',
            file: 'ba-rapat-pleno.pdf'
        },
        {
            id: 1698234567898,
            nama: 'MoU dengan Universitas',
            kategori: 'MoU',
            tanggal: '2024-08-10',
            file: 'mou-universitas.pdf'
        },
        {
            id: 1698234567899,
            nama: 'Dokumen Akreditasi Sekolah',
            kategori: 'Lainnya',
            tanggal: '2024-07-05',
            file: 'akreditasi-2024.pdf'
        }
    ];
    
    // Demo Data Pegawai
    dataPegawai = [
        {
            id: 1698234567900,
            nip: '196801011990031001',
            nama: 'Drs. Budi Santoso, M.Pd',
            jabatan: 'Kepala Sekolah'
        },
        {
            id: 1698234567901,
            nip: '197205151998022001',
            nama: 'Siti Nurhaliza, S.Pd',
            jabatan: 'Guru Matematika'
        },
        {
            id: 1698234567902,
            nip: '198003102005011002',
            nama: 'Ahmad Rizki, S.Pd',
            jabatan: 'Guru Bahasa Indonesia'
        },
        {
            id: 1698234567903,
            nip: '198507202010012003',
            nama: 'Dewi Lestari, S.Pd',
            jabatan: 'Guru Bahasa Inggris'
        },
        {
            id: 1698234567904,
            nip: '199001152015031004',
            nama: 'Eko Prasetyo, S.Kom',
            jabatan: 'Staf TU'
        }
    ];
    
    // Demo Data Siswa
    dataSiswa = [
        {
            id: 1698234567905,
            nisn: '0051234567',
            nama: 'Andi Wijaya',
            kelas: 'XII IPA 1'
        },
        {
            id: 1698234567906,
            nisn: '0051234568',
            nama: 'Bella Safira',
            kelas: 'XII IPA 1'
        },
        {
            id: 1698234567907,
            nisn: '0051234569',
            nama: 'Citra Dewi',
            kelas: 'XII IPA 2'
        },
        {
            id: 1698234567908,
            nisn: '0051234570',
            nama: 'Dimas Pratama',
            kelas: 'XII IPS 1'
        },
        {
            id: 1698234567909,
            nisn: '0051234571',
            nama: 'Eka Putri',
            kelas: 'XII IPS 1'
        },
        {
            id: 1698234567910,
            nisn: '0051234572',
            nama: 'Fajar Ramadhan',
            kelas: 'XI IPA 1'
        },
        {
            id: 1698234567911,
            nisn: '0051234573',
            nama: 'Gita Savitri',
            kelas: 'XI IPA 2'
        },
        {
            id: 1698234567912,
            nisn: '0051234574',
            nama: 'Hendra Kusuma',
            kelas: 'XI IPS 1'
        }
    ];
    
    // Set nomor surat counter
    nomorSuratCounter = 3;
    
    // Save to localStorage
    saveToLocalStorage();
    
    console.log('✅ Demo Data Loaded Successfully!');
    console.log('📊 Statistik:');
    console.log('   - Surat Masuk:', suratMasuk.length);
    console.log('   - Surat Keluar:', suratKeluar.length);
    console.log('   - Arsip Digital:', arsipDigital.length);
    console.log('   - Data Pegawai:', dataPegawai.length);
    console.log('   - Data Siswa:', dataSiswa.length);
    console.log('');
    console.log('🔄 Silakan refresh halaman untuk melihat data demo!');
    
    alert('✅ Demo data berhasil dimuat!\n\nSilakan refresh halaman (F5) untuk melihat data.');
}

// Fungsi untuk reset data
function resetAllData() {
    if (confirm('⚠️ Apakah Anda yakin ingin menghapus SEMUA data?\n\nTindakan ini tidak dapat dibatalkan!')) {
        suratMasuk = [];
        suratKeluar = [];
        arsipDigital = [];
        dataPegawai = [];
        dataSiswa = [];
        nomorSuratCounter = 0;
        
        saveToLocalStorage();
        
        console.log('🗑️ Semua data telah dihapus!');
        alert('✅ Semua data telah dihapus!\n\nSilakan refresh halaman (F5).');
    }
}

// Instruksi penggunaan
console.log('📝 DEMO DATA - e-TU Sekolah');
console.log('═══════════════════════════════════════');
console.log('');
console.log('Untuk memuat data demo, ketik di console:');
console.log('   loadDemoData()');
console.log('');
console.log('Untuk menghapus semua data, ketik:');
console.log('   resetAllData()');
console.log('');
console.log('═══════════════════════════════════════');
