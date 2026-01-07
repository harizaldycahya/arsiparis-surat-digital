/**
 * Integrasi IndexedDB ke Aplikasi e-TU Sekolah
 * File ini mengganti fungsi localStorage dengan IndexedDB
 * 
 * CARA PAKAI:
 * 1. Pastikan db-indexeddb.js sudah di-include di index.html
 * 2. Include file ini SETELAH app.js
 * 3. Fungsi save/load otomatis akan menggunakan IndexedDB
 */

// ============================================
// OVERRIDE FUNGSI SAVE/LOAD
// ============================================

/**
 * Override saveToLocalStorage untuk menggunakan IndexedDB
 */
async function saveToLocalStorage() {
    try {
        console.log('💾 Menyimpan data ke IndexedDB...');
        
        // Pastikan database siap
        await ensureDbReady();
        
        // Simpan semua data ke IndexedDB
        // Note: Kita tetap simpan ke localStorage juga sebagai backup
        const data = {
            suratMasuk,
            suratKeluar,
            arsipDigital,
            dataPegawai,
            dataSiswa,
            dataNomorSurat,
            dataSekolah,
            nomorSuratCounter,
            lastSaved: new Date().toISOString()
        };
        
        // Simpan ke localStorage (untuk data kecil/metadata)
        try {
            const metadataOnly = {
                nomorSuratCounter,
                lastSaved: data.lastSaved,
                itemCounts: {
                    suratMasuk: suratMasuk.length,
                    suratKeluar: suratKeluar.length,
                    arsipDigital: arsipDigital.length,
                    dataPegawai: dataPegawai.length,
                    dataSiswa: dataSiswa.length
                }
            };
            localStorage.setItem('eTUSekolahMetadata', JSON.stringify(metadataOnly));
        } catch (e) {
            console.warn('localStorage penuh, hanya simpan ke IndexedDB');
        }
        
        // Simpan ke IndexedDB (untuk semua data termasuk file)
        await saveAllDataToIndexedDB(data);
        
        console.log('✅ Data berhasil disimpan ke IndexedDB');
        return true;
    } catch (error) {
        console.error('❌ Error saving to IndexedDB:', error);
        alert('Gagal menyimpan data: ' + error.message);
        return false;
    }
}

/**
 * Helper function untuk save semua data ke IndexedDB
 */
async function saveAllDataToIndexedDB(data) {
    try {
        // Clear existing data
        await Promise.all([
            db.suratMasuk.clear(),
            db.suratKeluar.clear(),
            db.arsipDigital.clear(),
            db.dataPegawai.clear(),
            db.dataSiswa.clear(),
            db.dataNomorSurat.clear()
        ]);
        
        // Bulk insert new data
        const promises = [];
        
        if (data.suratMasuk && data.suratMasuk.length > 0) {
            promises.push(db.suratMasuk.bulkAdd(data.suratMasuk));
        }
        
        if (data.suratKeluar && data.suratKeluar.length > 0) {
            promises.push(db.suratKeluar.bulkAdd(data.suratKeluar));
        }
        
        if (data.arsipDigital && data.arsipDigital.length > 0) {
            promises.push(db.arsipDigital.bulkAdd(data.arsipDigital));
        }
        
        if (data.dataPegawai && data.dataPegawai.length > 0) {
            promises.push(db.dataPegawai.bulkAdd(data.dataPegawai));
        }
        
        if (data.dataSiswa && data.dataSiswa.length > 0) {
            promises.push(db.dataSiswa.bulkAdd(data.dataSiswa));
        }
        
        if (data.dataNomorSurat && data.dataNomorSurat.length > 0) {
            promises.push(db.dataNomorSurat.bulkAdd(data.dataNomorSurat));
        }
        
        if (data.dataSekolah) {
            promises.push(db.dataSekolah.put({ id: 1, ...data.dataSekolah }));
        }
        
        await Promise.all(promises);
        
        // Simpan metadata
        await db.settings.put({
            key: 'nomorSuratCounter',
            value: data.nomorSuratCounter || 0
        });
        
        await db.settings.put({
            key: 'lastSaved',
            value: data.lastSaved
        });
        
        return true;
    } catch (error) {
        throw error;
    }
}

/**
 * Override loadFromLocalStorage untuk menggunakan IndexedDB
 */
async function loadFromLocalStorage() {
    try {
        console.log('📥 Memuat data dari IndexedDB...');
        
        // Pastikan database siap
        await ensureDbReady();
        
        // Load data dari IndexedDB
        const data = await loadAllDataFromIndexedDB();
        
        if (data) {
            // Assign ke global variables
            suratMasuk = data.suratMasuk || [];
            suratKeluar = data.suratKeluar || [];
            arsipDigital = data.arsipDigital || [];
            dataPegawai = data.dataPegawai || [];
            dataSiswa = data.dataSiswa || [];
            dataNomorSurat = data.dataNomorSurat || [];
            dataSekolah = data.dataSekolah || {
                namaSekolah: '',
                npsn: '',
                alamat: '',
                kota: '',
                provinsi: '',
                kodePos: '',
                telepon: '',
                email: '',
                website: '',
                kepalaSekolah: '',
                nipKepsek: ''
            };
            nomorSuratCounter = data.nomorSuratCounter || 0;
            
            console.log('✅ Data berhasil dimuat dari IndexedDB');
            console.log('Data loaded:', {
                suratMasuk: suratMasuk.length,
                suratKeluar: suratKeluar.length,
                arsipDigital: arsipDigital.length,
                dataPegawai: dataPegawai.length,
                dataSiswa: dataSiswa.length
            });
        } else {
            // Fallback ke localStorage jika IndexedDB kosong
            console.log('IndexedDB kosong, coba load dari localStorage...');
            await loadFromLocalStorageFallback();
        }
        
        return true;
    } catch (error) {
        console.error('❌ Error loading from IndexedDB:', error);
        // Fallback ke localStorage
        await loadFromLocalStorageFallback();
        return false;
    }
}

/**
 * Helper function untuk load semua data dari IndexedDB
 */
async function loadAllDataFromIndexedDB() {
    try {
        const [
            suratMasukData,
            suratKeluarData,
            arsipData,
            pegawaiData,
            siswaData,
            nomorSuratData,
            sekolahData,
            counterSetting,
            lastSavedSetting
        ] = await Promise.all([
            db.suratMasuk.toArray(),
            db.suratKeluar.toArray(),
            db.arsipDigital.toArray(),
            db.dataPegawai.toArray(),
            db.dataSiswa.toArray(),
            db.dataNomorSurat.toArray(),
            db.dataSekolah.get(1),
            db.settings.get('nomorSuratCounter'),
            db.settings.get('lastSaved')
        ]);
        
        // Check if ada data
        const hasData = suratMasukData.length > 0 || 
                       suratKeluarData.length > 0 || 
                       arsipData.length > 0 ||
                       pegawaiData.length > 0 ||
                       siswaData.length > 0;
        
        if (!hasData && !sekolahData) {
            return null; // Tidak ada data
        }
        
        return {
            suratMasuk: suratMasukData,
            suratKeluar: suratKeluarData,
            arsipDigital: arsipData,
            dataPegawai: pegawaiData,
            dataSiswa: siswaData,
            dataNomorSurat: nomorSuratData,
            dataSekolah: sekolahData || {},
            nomorSuratCounter: counterSetting?.value || 0,
            lastSaved: lastSavedSetting?.value || null
        };
    } catch (error) {
        throw error;
    }
}

/**
 * Fallback ke localStorage jika IndexedDB gagal
 */
async function loadFromLocalStorageFallback() {
    try {
        const saved = localStorage.getItem('eTUSekolahData');
        if (saved) {
            const data = JSON.parse(saved);
            suratMasuk = data.suratMasuk || [];
            suratKeluar = data.suratKeluar || [];
            arsipDigital = data.arsipDigital || [];
            dataPegawai = data.dataPegawai || [];
            dataSiswa = data.dataSiswa || [];
            dataNomorSurat = data.dataNomorSurat || [];
            dataSekolah = data.dataSekolah || {
                namaSekolah: '',
                npsn: '',
                alamat: '',
                kota: '',
                provinsi: '',
                kodePos: '',
                telepon: '',
                email: '',
                website: '',
                kepalaSekolah: '',
                nipKepsek: ''
            };
            nomorSuratCounter = data.nomorSuratCounter || 0;
            console.log('✅ Data loaded from localStorage (fallback)');
        } else {
            console.log('No saved data found. Starting fresh.');
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
}

// ============================================
// AUTO MIGRATION
// ============================================

/**
 * Auto migrate dari localStorage ke IndexedDB saat pertama kali load
 */
async function autoMigrateIfNeeded() {
    try {
        await ensureDbReady();
        
        // Cek apakah IndexedDB sudah ada data
        const count = await db.suratMasuk.count() + 
                     await db.suratKeluar.count() + 
                     await db.arsipDigital.count();
        
        if (count === 0) {
            // IndexedDB kosong, cek localStorage
            const localData = localStorage.getItem('eTUSekolahData');
            if (localData) {
                console.log('🔄 Auto-migrating data from localStorage to IndexedDB...');
                const migrated = await migrateFromLocalStorageToIndexedDB();
                if (migrated) {
                    console.log('✅ Auto-migration completed successfully');
                }
            }
        }
    } catch (error) {
        console.error('Auto-migration error:', error);
    }
}

// ============================================
// INITIALIZATION
// ============================================

// Auto migrate saat load halaman
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        // Tunggu sebentar untuk database ready
        setTimeout(async () => {
            try {
                await autoMigrateIfNeeded();
            } catch (error) {
                console.error('Error in auto migration:', error);
            }
        }, 1000);
    });
}

console.log(`
╔════════════════════════════════════════╗
║   IndexedDB Integration Active        ║
║   localStorage → IndexedDB            ║
╚════════════════════════════════════════╝

✅ Fungsi save/load sekarang menggunakan IndexedDB
✅ Auto-migration aktif
✅ Kapasitas: 50 MB - 1 GB

Catatan:
- Data otomatis tersimpan ke IndexedDB
- localStorage hanya untuk metadata
- Auto-migrate saat pertama kali load
`);
