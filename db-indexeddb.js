/**
 * IndexedDB Setup untuk e-TU Sekolah
 * Menggunakan Dexie.js untuk kemudahan
 * 
 * CARA PAKAI:
 * 1. Tambahkan di index.html sebelum app.js:
 *    <script src="https://unpkg.com/dexie@latest/dist/dexie.js"></script>
 *    <script src="db-indexeddb.js"></script>
 * 
 * 2. Ganti fungsi save di app.js dengan fungsi dari file ini
 * 
 * KAPASITAS: ~50 MB - 1 GB (tergantung browser)
 */

// ============================================
// SETUP DATABASE
// ============================================

const db = new Dexie('eTUSekolahDB');

// Define database schema
db.version(1).stores({
    suratMasuk: '++id, nomorSurat, tanggal, pengirim, perihal, file',
    suratKeluar: '++id, nomorSurat, tanggal, tujuan, perihal, jenis, file',
    arsipDigital: '++id, nama, kategori, tanggal, file',
    dataPegawai: '++id, nip, nama, jabatan',
    dataSiswa: '++id, nisn, nama, kelas',
    dataNomorSurat: '++id, nomorSurat, jenisSurat, tanggal, keterangan, isUsed',
    dataSekolah: 'id, namaSekolah, npsn, alamat, kota, provinsi',
    dataAdmin: '++id, username, password, nama, role',
    settings: 'key, value'
});

// Variable to track database ready state
let dbReady = false;

// Open database
db.open().then(() => {
    dbReady = true;
    console.log('✅ IndexedDB berhasil dibuka');
    console.log('Database: eTUSekolahDB');
    
    // Initialize default admin if not exists
    initializeDefaultAdmin();
}).catch(err => {
    console.error('❌ Gagal membuka IndexedDB:', err);
});

// Helper function to ensure database is ready
async function ensureDbReady() {
    if (dbReady) return true;
    
    // Wait for database to be ready (max 5 seconds)
    for (let i = 0; i < 50; i++) {
        if (dbReady) return true;
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    throw new Error('Database tidak siap setelah 5 detik. Coba refresh halaman.');
}

// ============================================
// FUNGSI SAVE DATA
// ============================================

/**
 * Simpan Surat Masuk ke IndexedDB
 */
async function saveSuratMasukDB(suratData) {
    try {
        const id = await db.suratMasuk.add(suratData);
        console.log('✅ Surat masuk berhasil disimpan, ID:', id);
        return id;
    } catch (error) {
        console.error('❌ Error saving surat masuk:', error);
        throw error;
    }
}

/**
 * Update Surat Masuk
 */
async function updateSuratMasukDB(id, suratData) {
    try {
        await db.suratMasuk.update(id, suratData);
        console.log('✅ Surat masuk berhasil diupdate, ID:', id);
        return true;
    } catch (error) {
        console.error('❌ Error updating surat masuk:', error);
        throw error;
    }
}

/**
 * Simpan Surat Keluar ke IndexedDB
 */
async function saveSuratKeluarDB(suratData) {
    try {
        const id = await db.suratKeluar.add(suratData);
        console.log('✅ Surat keluar berhasil disimpan, ID:', id);
        return id;
    } catch (error) {
        console.error('❌ Error saving surat keluar:', error);
        throw error;
    }
}

/**
 * Update Surat Keluar
 */
async function updateSuratKeluarDB(id, suratData) {
    try {
        await db.suratKeluar.update(id, suratData);
        console.log('✅ Surat keluar berhasil diupdate, ID:', id);
        return true;
    } catch (error) {
        console.error('❌ Error updating surat keluar:', error);
        throw error;
    }
}

/**
 * Simpan Arsip Digital
 */
async function saveArsipDB(arsipData) {
    try {
        const id = await db.arsipDigital.add(arsipData);
        console.log('✅ Arsip berhasil disimpan, ID:', id);
        return id;
    } catch (error) {
        console.error('❌ Error saving arsip:', error);
        throw error;
    }
}

/**
 * Simpan Data Pegawai
 */
async function savePegawaiDB(pegawaiData) {
    try {
        const id = await db.dataPegawai.add(pegawaiData);
        console.log('✅ Data pegawai berhasil disimpan, ID:', id);
        return id;
    } catch (error) {
        console.error('❌ Error saving pegawai:', error);
        throw error;
    }
}

/**
 * Simpan Data Siswa
 */
async function saveSiswaDB(siswaData) {
    try {
        const id = await db.dataSiswa.add(siswaData);
        console.log('✅ Data siswa berhasil disimpan, ID:', id);
        return id;
    } catch (error) {
        console.error('❌ Error saving siswa:', error);
        throw error;
    }
}

/**
 * Simpan Data Sekolah
 */
async function saveDataSekolahDB(sekolahData) {
    try {
        await db.dataSekolah.put({ id: 1, ...sekolahData });
        console.log('✅ Data sekolah berhasil disimpan');
        return true;
    } catch (error) {
        console.error('❌ Error saving data sekolah:', error);
        throw error;
    }
}

/**
 * Simpan Data Admin
 */
async function saveAdminDB(adminData) {
    try {
        const id = await db.dataAdmin.add(adminData);
        console.log('✅ Data admin berhasil disimpan, ID:', id);
        return id;
    } catch (error) {
        console.error('❌ Error saving admin:', error);
        throw error;
    }
}

/**
 * Update Data Admin
 */
async function updateAdminDB(id, adminData) {
    try {
        await db.dataAdmin.update(id, adminData);
        console.log('✅ Data admin berhasil diupdate, ID:', id);
        return true;
    } catch (error) {
        console.error('❌ Error updating admin:', error);
        throw error;
    }
}

// ============================================
// FUNGSI LOAD DATA
// ============================================

/**
 * Load semua Surat Masuk
 */
async function loadSuratMasukDB() {
    try {
        const data = await db.suratMasuk.toArray();
        console.log(`📥 Loaded ${data.length} surat masuk`);
        return data;
    } catch (error) {
        console.error('❌ Error loading surat masuk:', error);
        return [];
    }
}

/**
 * Load semua Surat Keluar
 */
async function loadSuratKeluarDB() {
    try {
        const data = await db.suratKeluar.toArray();
        console.log(`📥 Loaded ${data.length} surat keluar`);
        return data;
    } catch (error) {
        console.error('❌ Error loading surat keluar:', error);
        return [];
    }
}

/**
 * Load semua Arsip Digital
 */
async function loadArsipDB() {
    try {
        const data = await db.arsipDigital.toArray();
        console.log(`📥 Loaded ${data.length} arsip`);
        return data;
    } catch (error) {
        console.error('❌ Error loading arsip:', error);
        return [];
    }
}

/**
 * Load semua Data Pegawai
 */
async function loadPegawaiDB() {
    try {
        const data = await db.dataPegawai.toArray();
        console.log(`📥 Loaded ${data.length} pegawai`);
        return data;
    } catch (error) {
        console.error('❌ Error loading pegawai:', error);
        return [];
    }
}

/**
 * Load semua Data Siswa
 */
async function loadSiswaDB() {
    try {
        const data = await db.dataSiswa.toArray();
        console.log(`📥 Loaded ${data.length} siswa`);
        return data;
    } catch (error) {
        console.error('❌ Error loading siswa:', error);
        return [];
    }
}

/**
 * Load Data Sekolah
 */
async function loadDataSekolahDB() {
    try {
        const data = await db.dataSekolah.get(1);
        console.log('📥 Loaded data sekolah');
        return data || {};
    } catch (error) {
        console.error('❌ Error loading data sekolah:', error);
        return {};
    }
}

/**
 * Load semua Data Admin
 */
async function loadAdminDB() {
    try {
        const data = await db.dataAdmin.toArray();
        console.log(`📥 Loaded ${data.length} admin`);
        return data;
    } catch (error) {
        console.error('❌ Error loading admin:', error);
        return [];
    }
}

/**
 * Authenticate Admin
 */
async function authenticateAdmin(username, password) {
    try {
        const admin = await db.dataAdmin
            .where('username').equals(username)
            .and(item => item.password === password)
            .first();
        
        if (admin) {
            console.log('✅ Login berhasil:', admin.username);
            return admin;
        } else {
            console.log('❌ Username atau password salah');
            return null;
        }
    } catch (error) {
        console.error('❌ Error authenticating:', error);
        return null;
    }
}

/**
 * Initialize default admin if not exists
 */
async function initializeDefaultAdmin() {
    try {
        const adminCount = await db.dataAdmin.count();
        if (adminCount === 0) {
            await db.dataAdmin.add({
                username: 'admin',
                password: 'admin123',
                nama: 'Administrator',
                role: 'Super Admin'
            });
            console.log('✅ Default admin berhasil dibuat');
            return true;
        }
        return false;
    } catch (error) {
        console.error('❌ Error initializing default admin:', error);
        return false;
    }
}

/**
 * Load semua data sekaligus
 */
async function loadAllDataDB() {
    try {
        const [suratMasuk, suratKeluar, arsip, pegawai, siswa, sekolah] = await Promise.all([
            loadSuratMasukDB(),
            loadSuratKeluarDB(),
            loadArsipDB(),
            loadPegawaiDB(),
            loadSiswaDB(),
            loadDataSekolahDB()
        ]);

        console.log('✅ Semua data berhasil di-load dari IndexedDB');

        return {
            suratMasuk,
            suratKeluar,
            arsipDigital: arsip,
            dataPegawai: pegawai,
            dataSiswa: siswa,
            dataSekolah: sekolah
        };
    } catch (error) {
        console.error('❌ Error loading all data:', error);
        return null;
    }
}

// ============================================
// FUNGSI DELETE DATA
// ============================================

/**
 * Hapus Surat Masuk
 */
async function deleteSuratMasukDB(id) {
    try {
        await db.suratMasuk.delete(id);
        console.log('🗑️ Surat masuk berhasil dihapus, ID:', id);
        return true;
    } catch (error) {
        console.error('❌ Error deleting surat masuk:', error);
        return false;
    }
}

/**
 * Hapus Surat Keluar
 */
async function deleteSuratKeluarDB(id) {
    try {
        await db.suratKeluar.delete(id);
        console.log('🗑️ Surat keluar berhasil dihapus, ID:', id);
        return true;
    } catch (error) {
        console.error('❌ Error deleting surat keluar:', error);
        return false;
    }
}

/**
 * Hapus Arsip
 */
async function deleteArsipDB(id) {
    try {
        await db.arsipDigital.delete(id);
        console.log('🗑️ Arsip berhasil dihapus, ID:', id);
        return true;
    } catch (error) {
        console.error('❌ Error deleting arsip:', error);
        return false;
    }
}

/**
 * Hapus Data Admin
 */
async function deleteAdminDB(id) {
    try {
        await db.dataAdmin.delete(id);
        console.log('🗑️ Data admin berhasil dihapus, ID:', id);
        return true;
    } catch (error) {
        console.error('❌ Error deleting admin:', error);
        return false;
    }
}

/**
 * Hapus semua data (Clear Database)
 */
async function clearAllDataDB() {
    try {
        await Promise.all([
            db.suratMasuk.clear(),
            db.suratKeluar.clear(),
            db.arsipDigital.clear(),
            db.dataPegawai.clear(),
            db.dataSiswa.clear(),
            db.dataNomorSurat.clear(),
            db.dataSekolah.clear()
        ]);
        console.log('🗑️ Semua data berhasil dihapus dari IndexedDB');
        return true;
    } catch (error) {
        console.error('❌ Error clearing database:', error);
        return false;
    }
}

// ============================================
// FUNGSI MIGRASI
// ============================================

/**
 * Migrasi data dari localStorage ke IndexedDB
 */
async function migrateFromLocalStorageToIndexedDB() {
    try {
        console.log('🔄 Memulai migrasi dari localStorage ke IndexedDB...');

        // Pastikan database sudah siap
        console.log('⏳ Menunggu database siap...');
        await ensureDbReady();
        console.log('✅ Database siap!');

        const data = localStorage.getItem('eTUSekolahData');
        if (!data) {
            console.log('⚠️ Tidak ada data di localStorage untuk dimigrasi');
            alert('Tidak ada data di localStorage untuk dimigrasi.\n\nPastikan Anda sudah login dan memiliki data di aplikasi.');
            return false;
        }

        const parsedData = JSON.parse(data);
        let migrated = 0;

        // Migrasi Surat Masuk
        if (parsedData.suratMasuk && parsedData.suratMasuk.length > 0) {
            await db.suratMasuk.bulkAdd(parsedData.suratMasuk);
            console.log(`✅ ${parsedData.suratMasuk.length} surat masuk berhasil dimigrasi`);
            migrated += parsedData.suratMasuk.length;
        }

        // Migrasi Surat Keluar
        if (parsedData.suratKeluar && parsedData.suratKeluar.length > 0) {
            await db.suratKeluar.bulkAdd(parsedData.suratKeluar);
            console.log(`✅ ${parsedData.suratKeluar.length} surat keluar berhasil dimigrasi`);
            migrated += parsedData.suratKeluar.length;
        }

        // Migrasi Arsip Digital
        if (parsedData.arsipDigital && parsedData.arsipDigital.length > 0) {
            await db.arsipDigital.bulkAdd(parsedData.arsipDigital);
            console.log(`✅ ${parsedData.arsipDigital.length} arsip berhasil dimigrasi`);
            migrated += parsedData.arsipDigital.length;
        }

        // Migrasi Data Pegawai
        if (parsedData.dataPegawai && parsedData.dataPegawai.length > 0) {
            await db.dataPegawai.bulkAdd(parsedData.dataPegawai);
            console.log(`✅ ${parsedData.dataPegawai.length} pegawai berhasil dimigrasi`);
            migrated += parsedData.dataPegawai.length;
        }

        // Migrasi Data Siswa
        if (parsedData.dataSiswa && parsedData.dataSiswa.length > 0) {
            await db.dataSiswa.bulkAdd(parsedData.dataSiswa);
            console.log(`✅ ${parsedData.dataSiswa.length} siswa berhasil dimigrasi`);
            migrated += parsedData.dataSiswa.length;
        }

        // Migrasi Data Nomor Surat
        if (parsedData.dataNomorSurat && parsedData.dataNomorSurat.length > 0) {
            await db.dataNomorSurat.bulkAdd(parsedData.dataNomorSurat);
            console.log(`✅ ${parsedData.dataNomorSurat.length} nomor surat berhasil dimigrasi`);
            migrated += parsedData.dataNomorSurat.length;
        }

        // Migrasi Data Sekolah
        if (parsedData.dataSekolah) {
            await db.dataSekolah.put({ id: 1, ...parsedData.dataSekolah });
            console.log('✅ Data sekolah berhasil dimigrasi');
        }

        console.log(`\n🎉 MIGRASI SELESAI!`);
        console.log(`Total ${migrated} item berhasil dimigrasi ke IndexedDB`);
        console.log(`\n⚠️ PENTING: Backup localStorage Anda sebelum menghapusnya!`);

        alert(`✅ Migrasi Berhasil!\n\nTotal ${migrated} item berhasil dimigrasi ke IndexedDB.\n\nAplikasi sekarang menggunakan penyimpanan dengan kapasitas lebih besar (50 MB - 1 GB).`);

        return true;
    } catch (error) {
        console.error('❌ Error migrasi:', error);
        
        // Error handling yang lebih detail
        let errorMessage = 'Gagal migrasi data:\n\n';
        
        if (error.message.includes('Database tidak siap')) {
            errorMessage += '❌ Database belum siap.\n\nSolusi:\n1. Refresh halaman (F5)\n2. Tunggu beberapa detik\n3. Coba lagi';
        } else if (error.name === 'ConstraintError') {
            errorMessage += '❌ Data sudah ada di IndexedDB.\n\nSolusi:\n1. Data mungkin sudah dimigrasi sebelumnya\n2. Cek dengan: countAllData()\n3. Atau hapus dulu: clearAllDataDB()';
        } else {
            errorMessage += error.message + '\n\nCoba:\n1. Refresh halaman (F5)\n2. Cek console untuk detail error\n3. Pastikan browser support IndexedDB';
        }
        
        alert(errorMessage);
        return false;
    }
}

// ============================================
// FUNGSI UTILITAS
// ============================================

/**
 * Cek kapasitas IndexedDB
 */
async function checkIndexedDBCapacity() {
    try {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            const estimate = await navigator.storage.estimate();
            const usageInMB = (estimate.usage / (1024 * 1024)).toFixed(2);
            const quotaInMB = (estimate.quota / (1024 * 1024)).toFixed(2);
            const percentUsed = ((estimate.usage / estimate.quota) * 100).toFixed(2);

            console.log('=================================');
            console.log('KAPASITAS INDEXEDDB');
            console.log('=================================');
            console.log(`Terpakai: ${usageInMB} MB`);
            console.log(`Kuota: ${quotaInMB} MB`);
            console.log(`Persentase: ${percentUsed}%`);
            console.log(`Sisa: ${(quotaInMB - usageInMB).toFixed(2)} MB`);
            console.log('=================================');

            return {
                usage: parseFloat(usageInMB),
                quota: parseFloat(quotaInMB),
                percent: parseFloat(percentUsed),
                remaining: parseFloat((quotaInMB - usageInMB).toFixed(2))
            };
        } else {
            console.log('⚠️ Storage API tidak didukung di browser ini');
            return null;
        }
    } catch (error) {
        console.error('❌ Error checking capacity:', error);
        return null;
    }
}

/**
 * Hitung jumlah total data
 */
async function countAllData() {
    try {
        const counts = await Promise.all([
            db.suratMasuk.count(),
            db.suratKeluar.count(),
            db.arsipDigital.count(),
            db.dataPegawai.count(),
            db.dataSiswa.count(),
            db.dataNomorSurat.count()
        ]);

        const [suratMasuk, suratKeluar, arsip, pegawai, siswa, nomorSurat] = counts;
        const total = counts.reduce((a, b) => a + b, 0);

        console.log('=================================');
        console.log('JUMLAH DATA DI INDEXEDDB');
        console.log('=================================');
        console.log(`Surat Masuk: ${suratMasuk}`);
        console.log(`Surat Keluar: ${suratKeluar}`);
        console.log(`Arsip Digital: ${arsip}`);
        console.log(`Data Pegawai: ${pegawai}`);
        console.log(`Data Siswa: ${siswa}`);
        console.log(`Nomor Surat: ${nomorSurat}`);
        console.log(`---------------------------------`);
        console.log(`TOTAL: ${total} item`);
        console.log('=================================');

        return {
            suratMasuk,
            suratKeluar,
            arsip,
            pegawai,
            siswa,
            nomorSurat,
            total
        };
    } catch (error) {
        console.error('❌ Error counting data:', error);
        return null;
    }
}

/**
 * Export data ke JSON (untuk backup)
 */
async function exportDataToJSON() {
    try {
        const allData = await loadAllDataDB();
        const jsonString = JSON.stringify(allData, null, 2);
        
        // Create download link
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `etu-sekolah-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('✅ Data berhasil di-export ke JSON');
        return true;
    } catch (error) {
        console.error('❌ Error exporting data:', error);
        return false;
    }
}

// ============================================
// CONSOLE HELPERS
// ============================================

console.log(`
╔════════════════════════════════════════╗
║   IndexedDB untuk e-TU Sekolah        ║
║   Kapasitas: ~50 MB - 1 GB            ║
╚════════════════════════════════════════╝

📝 FUNGSI YANG TERSEDIA:

SAVE:
- saveSuratMasukDB(data)
- saveSuratKeluarDB(data)
- saveArsipDB(data)
- savePegawaiDB(data)
- saveSiswaDB(data)
- saveDataSekolahDB(data)

LOAD:
- loadSuratMasukDB()
- loadSuratKeluarDB()
- loadArsipDB()
- loadAllDataDB()

DELETE:
- deleteSuratMasukDB(id)
- deleteSuratKeluarDB(id)
- deleteArsipDB(id)
- clearAllDataDB()

UTILITAS:
- migrateFromLocalStorageToIndexedDB()
- checkIndexedDBCapacity()
- countAllData()
- exportDataToJSON()

📖 CARA MIGRASI:
1. Buka Console (F12)
2. Ketik: migrateFromLocalStorageToIndexedDB()
3. Tunggu proses selesai
4. Cek dengan: countAllData()

🔍 CEK KAPASITAS:
checkIndexedDBCapacity()
`);
