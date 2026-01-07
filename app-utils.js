// Utility Functions for e-TU Sekolah

// Helper: Generate Kop Surat dari Data Sekolah
function generateKopSurat() {
    // Gunakan data dari dataSekolah
    const kopData = dataSekolah || {};
    const logo1 = dataSekolah.logo || null;
    const logo2 = dataSekolah.logo2 || null;
    
    // Generate kop content
    const kopContent = `
        <div style="text-align: center; flex: 1;">
            <h2 style="margin: 0; line-height: 1.3; white-space: nowrap;">PEMERINTAH ${kopData.provinsi ? kopData.provinsi.toUpperCase() : 'PROVINSI'}</h2>
            <h2 style="margin: 0; line-height: 1.3; white-space: nowrap;">DINAS PENDIDIKAN DAN KEBUDAYAAN</h2>
            <h2 style="margin: 0; line-height: 1.3; white-space: nowrap;">${kopData.namaSekolah ? kopData.namaSekolah.toUpperCase() : 'NAMA SEKOLAH'}</h2>
            <p style="margin: 5px 0; white-space: nowrap;">${kopData.alamat || 'Alamat Sekolah'}</p>
            <p style="margin: 5px 0; white-space: nowrap;">Telp: ${kopData.telepon || '-'} | Email: ${kopData.email || '-'}</p>
        </div>
    `;
    
    let kopHTML = '';
    
    if (logo1 && logo2) {
        // Both logos exist - display side by side with text in center
        kopHTML = `
            <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 15px; gap: 20px; padding: 10px 5px; width: 100%;">
                <div style="flex-shrink: 0; width: 90px; height: 90px; display: flex; align-items: center; justify-content: center;">
                    <img src="${logo1}" alt="Logo 1" style="max-width: 90px; max-height: 90px; width: auto; height: auto; object-fit: contain; display: block;">
                </div>
                ${kopContent}
                <div style="flex-shrink: 0; width: 90px; height: 90px; display: flex; align-items: center; justify-content: center;">
                    <img src="${logo2}" alt="Logo 2" style="max-width: 90px; max-height: 90px; width: auto; height: auto; object-fit: contain; display: block;">
                </div>
            </div>
        `;
    } else if (logo1) {
        // Only logo 1 exists - display on left with text on right
        kopHTML = `
            <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 15px; padding: 10px 5px; width: 100%;">
                <div style="flex-shrink: 0; width: 90px; height: 90px; display: flex; align-items: center; justify-content: center;">
                    <img src="${logo1}" alt="Logo Sekolah" style="max-width: 90px; max-height: 90px; width: auto; height: auto; object-fit: contain; display: block;">
                </div>
                ${kopContent}
            </div>
        `;
    } else if (logo2) {
        // Only logo 2 exists - display on left with text on right
        kopHTML = `
            <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 15px; padding: 10px 5px; width: 100%;">
                <div style="flex-shrink: 0; width: 90px; height: 90px; display: flex; align-items: center; justify-content: center;">
                    <img src="${logo2}" alt="Logo Sekolah" style="max-width: 90px; max-height: 90px; width: auto; height: auto; object-fit: contain; display: block;">
                </div>
                ${kopContent}
            </div>
        `;
    } else {
        // No logos - just centered text
        kopHTML = `
            <div style="text-align: center; margin-bottom: 10px;">
                <h2 style="margin: 0; line-height: 1.3; white-space: nowrap;">PEMERINTAH ${kopData.provinsi ? kopData.provinsi.toUpperCase() : 'PROVINSI'}</h2>
                <h2 style="margin: 0; line-height: 1.3; white-space: nowrap;">DINAS PENDIDIKAN DAN KEBUDAYAAN</h2>
                <h2 style="margin: 0; line-height: 1.3; white-space: nowrap;">${kopData.namaSekolah ? kopData.namaSekolah.toUpperCase() : 'NAMA SEKOLAH'}</h2>
                <p style="margin: 5px 0; white-space: nowrap;">${kopData.alamat || 'Alamat Sekolah'}</p>
                <p style="margin: 5px 0; white-space: nowrap;">Telp: ${kopData.telepon || '-'} | Email: ${kopData.email || '-'}</p>
            </div>
        `;
    }
    
    return `
        <div class="surat-kop">
            ${kopHTML}
        </div>
    `;
}

// Helper: Generate Tanda Tangan dari Data Sekolah
function generateTandaTangan(kota = '') {
    const sekolah = dataSekolah || {};
    const lokasiKota = kota || sekolah.kota || 'Kota';
    const kepalaSekolah = sekolah.kepalaSekolah || 'Nama Kepala Sekolah';
    const nipKepsek = sekolah.nipKepsek || '-';
    
    return `
        <div class="surat-ttd">
            <p>${lokasiKota}, ${formatDateIndo(new Date())}</p>
            <p>Kepala Sekolah,</p>
            <br><br><br>
            <p><strong><u>${kepalaSekolah}</u></strong></p>
            <p>NIP. ${nipKepsek}</p>
        </div>
    `;
}

// Helper: Apply Paper Size to Preview Container
function applyPaperSize(paperSize) {
    const container = document.getElementById('suratPreviewContainer');
    if (!container) return;
    
    // Remove existing paper size classes
    container.classList.remove('paper-a4', 'paper-f4', 'paper-letter');
    
    // Add new paper size class
    switch(paperSize) {
        case 'A4':
            container.classList.add('paper-a4');
            break;
        case 'F4':
            container.classList.add('paper-f4');
            break;
        case 'Letter':
            container.classList.add('paper-letter');
            break;
        default:
            container.classList.add('paper-a4'); // Default to A4
    }
}

// Helper: Simpan nomor surat ke Data Master
function saveNomorSuratToDataMaster(nomorSurat, jenisSurat, keterangan = '') {
    // Cek apakah nomor sudah ada di Data Master
    const exists = dataNomorSurat.find(n => n.nomorSurat === nomorSurat);
    
    if (!exists) {
        const nomorData = {
            id: Date.now(),
            nomorSurat: nomorSurat,
            jenisSurat: jenisSurat,
            tanggal: new Date().toISOString().split('T')[0],
            keterangan: keterangan || `Dibuat dari form ${jenisSurat}`,
            isUsed: true, // Langsung tandai sudah digunakan
            usedDate: new Date().toISOString()
        };
        
        dataNomorSurat.push(nomorData);
        saveToLocalStorage();
        renderNomorSurat(); // Update tampilan
        
        console.log(`Nomor surat ${nomorSurat} tersimpan ke Data Master`);
    }
}

// Generate Surat Functions
function generateSuratAktif() {
    const paperSize = document.getElementById('paperSizeAktif').value;
    const nomor = document.getElementById('nomorAktif').value;
    const nama = document.getElementById('namaSiswaAktif').value;
    const nisn = document.getElementById('nisnAktif').value;
    const kelas = document.getElementById('kelasAktif').value;
    const keperluan = document.getElementById('keperluanAktif').value;

    if (!paperSize || !nomor || !nama || !nisn || !kelas || !keperluan) {
        alert('Mohon lengkapi semua field!');
        return;
    }

    // Apply paper size
    applyPaperSize(paperSize);

    // Simpan nomor surat ke Data Master
    saveNomorSuratToDataMaster(nomor, 'Keterangan', `Surat Keterangan Aktif - ${nama}`);

    const suratHTML = `
        <div class="surat-preview">
            ${generateKopSurat()}
            <div class="surat-nomor">
                <h3><u>SURAT KETERANGAN AKTIF SEKOLAH</u></h3>
                <p>Nomor: ${nomor}</p>
            </div>
            <div class="surat-content">
                <p>Yang bertanda tangan di bawah ini Kepala ${dataSekolah.namaSekolah || 'Sekolah'}, menerangkan bahwa:</p>
                <table style="margin: 20px 0; width: 100%;">
                    <tr>
                        <td width="150">Nama</td>
                        <td width="20">:</td>
                        <td>${nama}</td>
                    </tr>
                    <tr>
                        <td>NISN</td>
                        <td>:</td>
                        <td>${nisn}</td>
                    </tr>
                    <tr>
                        <td>Kelas</td>
                        <td>:</td>
                        <td>${kelas}</td>
                    </tr>
                </table>
                <p>Adalah benar siswa aktif di sekolah kami pada Tahun Ajaran ${getCurrentAcademicYear()}.</p>
                <p>Surat keterangan ini dibuat untuk keperluan: <strong>${keperluan}</strong></p>
                <p>Demikian surat keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.</p>
            </div>
            ${generateTandaTangan()}
        </div>
        <div class="surat-actions">
            <button class="btn-success" onclick="printSurat()">
                <i class="fas fa-print"></i> Cetak Surat
            </button>
            <button class="btn-primary" onclick="saveSuratToArsipFromPreview('Surat Keterangan Aktif - ${nama}')">
                <i class="fas fa-save"></i> Simpan ke Arsip
            </button>
        </div>
    `;
    
    // Update both preview containers
    const previewContainer = document.getElementById('suratPreviewContainer');
    if (previewContainer) {
        previewContainer.innerHTML = suratHTML;
    }
    
    const previewAktif = document.getElementById('previewAktif');
    if (previewAktif) {
        previewAktif.innerHTML = suratHTML;
    }
}

function generateSuratTugas() {
    const paperSize = document.getElementById('paperSizeTugas').value;
    const nomor = document.getElementById('nomorTugas').value;
    const nama = document.getElementById('namaPegawaiTugas').value;
    const nip = document.getElementById('nipTugas').value;
    const jabatan = document.getElementById('jabatanTugas').value;
    const alamat = document.getElementById('alamatTugas').value;
    const tugas = document.getElementById('tugasKegiatan').value;
    const tanggalMulai = document.getElementById('tanggalMulaiTugas').value;
    const tanggalSelesai = document.getElementById('tanggalSelesaiTugas').value;
    const jam = document.getElementById('jamTugas').value;
    const tempat = document.getElementById('tempatTugas').value;

    if (!paperSize || !nomor || !nama || !nip || !jabatan || !alamat || !tugas || !tanggalMulai || !tanggalSelesai || !jam || !tempat) {
        alert('Mohon lengkapi semua field!');
        return;
    }

    // Validasi tanggal
    if (new Date(tanggalSelesai) < new Date(tanggalMulai)) {
        alert('Tanggal selesai tidak boleh lebih awal dari tanggal mulai!');
        return;
    }

    // Hitung durasi
    const durasi = hitungDurasi(tanggalMulai, tanggalSelesai);

    // Apply paper size
    applyPaperSize(paperSize);

    // Simpan nomor surat ke Data Master
    saveNomorSuratToDataMaster(nomor, 'Tugas', `Surat Tugas - ${nama}`);

    const suratHTML = `
        <div class="surat-preview">
            ${generateKopSurat()}
            <div class="surat-nomor">
                <h3><u>SURAT TUGAS</u></h3>
                <p>Nomor: ${nomor}</p>
            </div>
            <div class="surat-content">
                <p>Yang bertanda tangan di bawah ini Kepala ${dataSekolah.namaSekolah || 'Sekolah'}, dengan ini memberikan tugas kepada:</p>
                <table style="margin: 20px 0; width: 100%;">
                    <tr>
                        <td width="150">Nama</td>
                        <td width="20">:</td>
                        <td>${nama}</td>
                    </tr>
                    <tr>
                        <td>NIP</td>
                        <td>:</td>
                        <td>${nip}</td>
                    </tr>
                    <tr>
                        <td>Jabatan</td>
                        <td>:</td>
                        <td>${jabatan}</td>
                    </tr>
                    <tr>
                        <td>Alamat</td>
                        <td>:</td>
                        <td>${alamat}</td>
                    </tr>
                </table>
                <p>Untuk melaksanakan tugas:</p>
                <p style="margin-left: 20px;"><strong>${tugas}</strong></p>
                <table style="margin: 20px 0; width: 100%;">
                    <tr>
                        <td width="150">Tanggal Mulai</td>
                        <td width="20">:</td>
                        <td>${formatDateIndo(new Date(tanggalMulai))}</td>
                    </tr>
                    <tr>
                        <td>Tanggal Selesai</td>
                        <td>:</td>
                        <td>${formatDateIndo(new Date(tanggalSelesai))}</td>
                    </tr>
                    <tr>
                        <td>Durasi</td>
                        <td>:</td>
                        <td>${durasi}</td>
                    </tr>
                    <tr>
                        <td>Jam</td>
                        <td>:</td>
                        <td>${jam} WIB</td>
                    </tr>
                    <tr>
                        <td>Tempat</td>
                        <td>:</td>
                        <td>${tempat}</td>
                    </tr>
                </table>
                <p>Demikian surat tugas ini dibuat untuk dilaksanakan dengan sebaik-baiknya dan penuh tanggung jawab.</p>
            </div>
            ${generateTandaTangan()}
        </div>
        <div class="surat-actions">
            <button class="btn-success" onclick="printSurat()">
                <i class="fas fa-print"></i> Cetak Surat
            </button>
            <button class="btn-primary" onclick="saveSuratToArsipFromPreview('Surat Tugas - ${nama}')">
                <i class="fas fa-save"></i> Simpan ke Arsip
            </button>
        </div>
    `;
    
    updatePreviewContainers(suratHTML, 'previewTugas');
}

function generateSuratUndangan() {
    const paperSize = document.getElementById('paperSizeUndangan').value;
    const nomor = document.getElementById('nomorUndangan').value;
    const kepada = document.getElementById('kepadaUndangan').value;
    const acara = document.getElementById('acaraUndangan').value;
    const tanggal = document.getElementById('tanggalUndangan').value;
    const waktu = document.getElementById('waktuUndangan').value;
    const tempat = document.getElementById('tempatUndangan').value;

    if (!paperSize || !nomor || !kepada || !acara || !tanggal || !waktu || !tempat) {
        alert('Mohon lengkapi semua field!');
        return;
    }

    // Apply paper size
    applyPaperSize(paperSize);

    // Simpan nomor surat ke Data Master
    saveNomorSuratToDataMaster(nomor, 'Undangan', `Undangan ${acara}`);

    const suratHTML = `
        <div class="surat-preview">
            ${generateKopSurat()}
            <div class="surat-nomor">
                <h3><u>SURAT UNDANGAN</u></h3>
                <p>Nomor: ${nomor}</p>
            </div>
            <div class="surat-content">
                <p>Kepada Yth.<br><strong>${kepada}</strong><br>Di tempat</p>
                <p>Dengan hormat,</p>
                <p>Sehubungan dengan akan dilaksanakannya <strong>${acara}</strong>, dengan ini kami mengundang Bapak/Ibu untuk hadir pada:</p>
                <table style="margin: 20px 0; width: 100%;">
                    <tr>
                        <td width="150">Hari/Tanggal</td>
                        <td width="20">:</td>
                        <td>${formatDateIndo(new Date(tanggal))}</td>
                    </tr>
                    <tr>
                        <td>Jam</td>
                        <td>:</td>
                        <td>${waktu} WIB</td>
                    </tr>
                    <tr>
                        <td>Tempat</td>
                        <td>:</td>
                        <td>${tempat}</td>
                    </tr>
                </table>
                <p>Demikian undangan ini kami sampaikan. Atas perhatian dan kehadirannya kami ucapkan terima kasih.</p>
            </div>
            ${generateTandaTangan()}
        </div>
        <div class="surat-actions">
            <button class="btn-success" onclick="printSurat()">
                <i class="fas fa-print"></i> Cetak Surat
            </button>
            <button class="btn-primary" onclick="saveSuratToArsipFromPreview('Surat Undangan - ${acara}')">
                <i class="fas fa-save"></i> Simpan ke Arsip
            </button>
        </div>
    `;
    
    updatePreviewContainers(suratHTML, 'previewUndangan');
}

function generateSuratIzin() {
    const paperSize = document.getElementById('paperSizeIzin').value;
    const nomor = document.getElementById('nomorIzin').value;
    const tipeIzin = document.getElementById('tipeIzin').value;
    const jenisIzin = document.getElementById('jenisIzin').value;
    const tanggalMulai = document.getElementById('tanggalMulaiIzin').value;
    const tanggalSelesai = document.getElementById('tanggalSelesaiIzin').value;
    const keterangan = document.getElementById('keteranganIzin').value;

    if (!paperSize || !nomor || !tipeIzin || !jenisIzin || !tanggalMulai || !tanggalSelesai || !keterangan) {
        alert('Mohon lengkapi semua field yang wajib diisi!');
        return;
    }

    let nama, identitas, statusLabel, statusValue, keteranganTambahan;

    if (tipeIzin === 'siswa') {
        nama = document.getElementById('namaSiswaIzin').value;
        const nisn = document.getElementById('nisnIzin').value;
        const kelas = document.getElementById('kelasIzin').value;
        
        if (!nama || !kelas) {
            alert('Mohon lengkapi data siswa!');
            return;
        }
        
        identitas = nisn ? `<tr>
            <td>NISN</td>
            <td>:</td>
            <td>${nisn}</td>
        </tr>` : '';
        statusLabel = 'Kelas';
        statusValue = kelas;
        keteranganTambahan = 'Siswa yang bersangkutan diberikan izin untuk tidak mengikuti kegiatan belajar mengajar pada tanggal tersebut di atas.';
    } else if (tipeIzin === 'guru') {
        nama = document.getElementById('namaGuruIzin').value;
        const nip = document.getElementById('nipIzin').value;
        const jabatan = document.getElementById('jabatanIzin').value;
        
        if (!nama || !jabatan) {
            alert('Mohon lengkapi data guru/pegawai!');
            return;
        }
        
        identitas = nip ? `<tr>
            <td>NIP</td>
            <td>:</td>
            <td>${nip}</td>
        </tr>` : '';
        statusLabel = 'Jabatan';
        statusValue = jabatan;
        keteranganTambahan = 'Guru/Pegawai yang bersangkutan diberikan izin untuk tidak melaksanakan tugas pada tanggal tersebut di atas.';
    } else {
        alert('Mohon pilih tipe izin (Siswa atau Guru/Pegawai)!');
        return;
    }

    // Apply paper size
    applyPaperSize(paperSize);

    // Simpan nomor surat ke Data Master
    saveNomorSuratToDataMaster(nomor, 'Izin', `Izin ${jenisIzin} - ${nama}`);

    // Hitung durasi izin
    const mulai = new Date(tanggalMulai);
    const selesai = new Date(tanggalSelesai);
    const durasi = Math.ceil((selesai - mulai) / (1000 * 60 * 60 * 24)) + 1;

    const suratHTML = `
        <div class="surat-preview">
            ${generateKopSurat()}
            <div class="surat-nomor">
                <h3><u>SURAT IZIN</u></h3>
                <p>Nomor: ${nomor}</p>
            </div>
            <div class="surat-content">
                <p>Yang bertanda tangan di bawah ini Kepala ${dataSekolah.namaSekolah || 'Sekolah'}, menerangkan bahwa:</p>
                <table style="margin: 20px 0; width: 100%;">
                    <tr>
                        <td width="150">Nama</td>
                        <td width="20">:</td>
                        <td><strong>${nama}</strong></td>
                    </tr>
                    ${identitas}
                    <tr>
                        <td>${statusLabel}</td>
                        <td>:</td>
                        <td>${statusValue}</td>
                    </tr>
                    <tr>
                        <td>Jenis Izin</td>
                        <td>:</td>
                        <td><strong>${jenisIzin}</strong></td>
                    </tr>
                    <tr>
                        <td>Tanggal Mulai</td>
                        <td>:</td>
                        <td>${formatDateIndo(new Date(tanggalMulai))}</td>
                    </tr>
                    <tr>
                        <td>Tanggal Selesai</td>
                        <td>:</td>
                        <td>${formatDateIndo(new Date(tanggalSelesai))}</td>
                    </tr>
                    <tr>
                        <td>Durasi</td>
                        <td>:</td>
                        <td>${durasi} hari</td>
                    </tr>
                    <tr>
                        <td>Keterangan</td>
                        <td>:</td>
                        <td>${keterangan}</td>
                    </tr>
                </table>
                <p>${keteranganTambahan}</p>
                <p>Demikian surat izin ini dibuat untuk dapat dipergunakan sebagaimana mestinya.</p>
            </div>
            ${generateTandaTangan()}
        </div>
        <div class="surat-actions">
            <button class="btn-success" onclick="printSurat()">
                <i class="fas fa-print"></i> Cetak Surat
            </button>
            <button class="btn-primary" onclick="saveSuratToArsipFromPreview('Surat Izin - ${nama}')">
                <i class="fas fa-save"></i> Simpan ke Arsip
            </button>
        </div>
    `;
    
    updatePreviewContainers(suratHTML, 'previewIzin');
}

function generateSuratRekomendasi() {
    const paperSize = document.getElementById('paperSizeRekomendasi').value;
    const nomor = document.getElementById('nomorRekomendasi').value;
    const nama = document.getElementById('namaRekomendasi').value;
    const status = document.getElementById('statusRekomendasi').value;
    const tujuan = document.getElementById('tujuanRekomendasi').value;

    if (!paperSize || !nomor || !nama || !status || !tujuan) {
        alert('Mohon lengkapi semua field!');
        return;
    }

    // Apply paper size
    applyPaperSize(paperSize);

    // Simpan nomor surat ke Data Master
    saveNomorSuratToDataMaster(nomor, 'Rekomendasi', `Rekomendasi ${nama}`);

    const suratHTML = `
        <div class="surat-preview">
            ${generateKopSurat()}
            <div class="surat-nomor">
                <h3><u>SURAT REKOMENDASI</u></h3>
                <p>Nomor: ${nomor}</p>
            </div>
            <div class="surat-content">
                <p>Yang bertanda tangan di bawah ini Kepala ${dataSekolah.namaSekolah || 'Sekolah'}, menerangkan bahwa:</p>
                <table style="margin: 20px 0; width: 100%;">
                    <tr>
                        <td width="150">Nama</td>
                        <td width="20">:</td>
                        <td>${nama}</td>
                    </tr>
                    <tr>
                        <td>Jabatan/Status</td>
                        <td>:</td>
                        <td>${status}</td>
                    </tr>
                </table>
                <p>Adalah benar yang bersangkutan merupakan ${status} di sekolah kami yang memiliki dedikasi dan kinerja yang baik.</p>
                <p>Dengan ini kami merekomendasikan yang bersangkutan untuk: <strong>${tujuan}</strong></p>
                <p>Demikian surat rekomendasi ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.</p>
            </div>
            ${generateTandaTangan()}
        </div>
        <div class="surat-actions">
            <button class="btn-success" onclick="printSurat()">
                <i class="fas fa-print"></i> Cetak Surat
            </button>
            <button class="btn-primary" onclick="saveSuratToArsipFromPreview('Surat Rekomendasi - ${nama}')">
                <i class="fas fa-save"></i> Simpan ke Arsip
            </button>
        </div>
    `;
    
    updatePreviewContainers(suratHTML, 'previewRekomendasi');
}

function generateSuratKeterangan() {
    const paperSize = document.getElementById('paperSizeKeterangan').value;
    const nomor = document.getElementById('nomorKeterangan').value;
    const nama = document.getElementById('namaKeterangan').value;
    const isi = document.getElementById('isiKeterangan').value;

    if (!paperSize || !nomor || !nama || !isi) {
        alert('Mohon lengkapi semua field!');
        return;
    }

    // Apply paper size
    applyPaperSize(paperSize);

    // Simpan nomor surat ke Data Master
    saveNomorSuratToDataMaster(nomor, 'Keterangan', `Surat Keterangan - ${nama}`);

    const suratHTML = `
        <div class="surat-preview">
            ${generateKopSurat()}
            <div class="surat-nomor">
                <h3><u>SURAT KETERANGAN</u></h3>
                <p>Nomor: ${nomor}</p>
            </div>
            <div class="surat-content">
                <p>Yang bertanda tangan di bawah ini Kepala ${dataSekolah.namaSekolah || 'Sekolah'}, menerangkan bahwa:</p>
                <p style="margin: 20px 0;"><strong>Nama: ${nama}</strong></p>
                <p style="text-align: justify;">${isi}</p>
                <p>Demikian surat keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.</p>
            </div>
            ${generateTandaTangan()}
        </div>
        <div class="surat-actions">
            <button class="btn-success" onclick="printSurat()">
                <i class="fas fa-print"></i> Cetak Surat
            </button>
            <button class="btn-primary" onclick="saveSuratToArsipFromPreview('Surat Keterangan - ${nama}')">
                <i class="fas fa-save"></i> Simpan ke Arsip
            </button>
        </div>
    `;
    
    updatePreviewContainers(suratHTML, 'previewKeterangan');
}

// Helper Functions
function generateNomorSurat() {
    const now = new Date();
    const bulan = toRoman(now.getMonth() + 1);
    const tahun = now.getFullYear();
    nomorSuratCounter++;
    const nomor = String(nomorSuratCounter).padStart(3, '0');
    return `${nomor}/TU/${bulan}/${tahun}`;
}

function toRoman(num) {
    const romans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    return romans[num - 1] || num;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function formatDateIndo(date) {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
}

function hitungDurasi(tanggalMulai, tanggalSelesai) {
    const start = new Date(tanggalMulai);
    const end = new Date(tanggalSelesai);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 untuk include hari terakhir
    
    if (diffDays === 1) {
        return '1 hari';
    } else {
        return `${diffDays} hari`;
    }
}

function getCurrentAcademicYear() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    if (month >= 6) {
        return `${year}/${year + 1}`;
    } else {
        return `${year - 1}/${year}`;
    }
}

function getCurrentCity() {
    return 'Jakarta'; // Can be configured
}

// Helper function to update preview containers
function updatePreviewContainers(htmlContent, specificPreviewId = null) {
    // Update main preview container
    const previewContainer = document.getElementById('suratPreviewContainer');
    if (previewContainer) {
        previewContainer.innerHTML = htmlContent;
    }
    
    // Update specific preview if provided
    if (specificPreviewId) {
        const specificPreview = document.getElementById(specificPreviewId);
        if (specificPreview) {
            specificPreview.innerHTML = htmlContent;
        }
    }
}

// Helper function to print surat
function printSurat() {
    const suratPreview = document.querySelector('.surat-preview');
    if (!suratPreview) {
        alert('Tidak ada surat untuk dicetak!');
        return;
    }
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Cetak Surat</title>
            <style>
                body { font-family: 'Times New Roman', serif; margin: 20px; }
                .surat-preview { padding: 40px; }
                .surat-kop { text-align: center; border-bottom: 3px solid #000; padding-bottom: 15px; margin-bottom: 30px; }
                .surat-kop h2 { font-size: 16px; margin: 5px 0; }
                .surat-kop p { font-size: 11px; margin: 2px 0; }
                .surat-nomor { text-align: center; margin-bottom: 30px; }
                .surat-nomor h3 { font-size: 14px; margin: 10px 0; }
                .surat-content { text-align: justify; margin-bottom: 30px; font-size: 12px; }
                .surat-content table { margin: 20px 0; width: 100%; }
                .surat-content td { padding: 5px; vertical-align: top; }
                .surat-ttd { margin-top: 40px; text-align: left; margin-left: 50%; font-size: 12px; }
                @media print { body { margin: 0; } }
            </style>
        </head>
        <body>
            ${suratPreview.outerHTML}
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.onload = function() {
        printWindow.print();
    };
}

// Helper function to save surat from preview
function saveSuratToArsipFromPreview(namaFile) {
    const suratContent = document.querySelector('#suratPreviewContainer .surat-preview');
    if (!suratContent) {
        alert('Konten surat tidak ditemukan!');
        return;
    }
    
    const htmlContent = suratContent.outerHTML;
    
    const arsipData = {
        id: Date.now(),
        nama: namaFile,
        kategori: 'Surat',
        tanggal: new Date().toISOString().split('T')[0],
        file: namaFile + '.html',
        fileData: htmlContent,
        isSuratGenerated: true
    };
    
    arsipDigital.push(arsipData);
    saveToLocalStorage();
    alert('Surat berhasil disimpan ke arsip!');
    
    if (document.getElementById('arsipPage').classList.contains('active')) {
        renderArsip();
    }
}

// Reset form surat
function resetFormSurat() {
    const jenisSurat = document.getElementById('jenisSurat');
    if (jenisSurat) {
        jenisSurat.value = '';
    }
    
    const formContainer = document.getElementById('formSuratDynamic');
    if (formContainer) {
        formContainer.innerHTML = `
            <div class="info-placeholder">
                <i class="fas fa-hand-pointer"></i>
                <p>Silakan pilih jenis surat terlebih dahulu</p>
            </div>
        `;
    }
    
    const previewContainer = document.getElementById('suratPreviewContainer');
    if (previewContainer) {
        previewContainer.innerHTML = `
            <div class="preview-placeholder">
                <i class="fas fa-file-alt"></i>
                <p>Preview surat akan muncul di sini</p>
            </div>
        `;
    }
}
