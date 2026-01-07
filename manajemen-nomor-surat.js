/**
 * Manajemen Nomor Surat - JavaScript
 * Sistem penomoran surat otomatis dengan format custom
 */

// Data nomor surat
let dataNomorSurat = [];
let formatList = [];

// Load data saat halaman dimuat
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    updateStats();
    renderTable();
    loadFormatOptions();
});

// ============================================
// LOAD & SAVE DATA
// ============================================

async function loadData() {
    try {
        // Cek apakah menggunakan IndexedDB
        if (typeof db !== 'undefined' && typeof ensureDbReady === 'function') {
            await ensureDbReady();
            dataNomorSurat = await db.dataNomorSurat.toArray();
            
            // Load format list dari settings
            const formatSetting = await db.settings.get('formatNomorSurat');
            formatList = formatSetting?.value || [];
        } else {
            // Fallback ke localStorage
            const saved = localStorage.getItem('dataNomorSurat');
            if (saved) {
                dataNomorSurat = JSON.parse(saved);
            }
            
            const savedFormats = localStorage.getItem('formatNomorSurat');
            if (savedFormats) {
                formatList = JSON.parse(savedFormats);
            }
        }
        
        console.log('Data loaded:', dataNomorSurat.length, 'nomor surat');
        console.log('Format loaded:', formatList.length, 'format');
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

async function saveData() {
    try {
        // Cek apakah menggunakan IndexedDB
        if (typeof db !== 'undefined' && typeof ensureDbReady === 'function') {
            await ensureDbReady();
            
            // Clear dan save ulang
            await db.dataNomorSurat.clear();
            if (dataNomorSurat.length > 0) {
                await db.dataNomorSurat.bulkAdd(dataNomorSurat);
            }
            
            // Save format list
            await db.settings.put({
                key: 'formatNomorSurat',
                value: formatList
            });
        } else {
            // Fallback ke localStorage
            localStorage.setItem('dataNomorSurat', JSON.stringify(dataNomorSurat));
            localStorage.setItem('formatNomorSurat', JSON.stringify(formatList));
        }
        
        console.log('Data saved successfully');
    } catch (error) {
        console.error('Error saving data:', error);
        alert('Gagal menyimpan data: ' + error.message);
    }
}

// ============================================
// FORMAT FUNCTIONS
// ============================================

// Insert variable ke input format
function insertVariable(variable) {
    const input = document.getElementById('formatInput');
    const cursorPos = input.selectionStart;
    const textBefore = input.value.substring(0, cursorPos);
    const textAfter = input.value.substring(cursorPos);
    
    input.value = textBefore + variable + textAfter;
    input.focus();
    
    // Update preview
    updatePreview();
}

// Update preview nomor surat
function updatePreview() {
    const format = document.getElementById('formatInput').value;
    const kode = document.getElementById('kodeSurat').value || 'XX';
    const nomorAwal = document.getElementById('nomorAwal').value || 1;
    
    if (format) {
        const preview = generateNomorFromFormat(format, kode, parseInt(nomorAwal));
        document.getElementById('previewNumber').textContent = preview;
    } else {
        document.getElementById('previewNumber').textContent = '-';
    }
}

// Generate nomor dari format
function generateNomorFromFormat(format, kode, nomor) {
    const now = new Date();
    const bulanRomawi = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const tahun = now.getFullYear();
    const bulan = bulanRomawi[now.getMonth()];
    
    // Pad nomor dengan leading zeros (3 digit)
    const nomorPadded = String(nomor).padStart(3, '0');
    
    let result = format;
    result = result.replace(/{nomor}/g, nomorPadded);
    result = result.replace(/{bulan}/g, bulan);
    result = result.replace(/{tahun}/g, tahun);
    result = result.replace(/{kode}/g, kode);
    
    return result;
}

// Event listeners untuk preview
document.getElementById('formatInput')?.addEventListener('input', updatePreview);
document.getElementById('kodeSurat')?.addEventListener('input', updatePreview);
document.getElementById('nomorAwal')?.addEventListener('input', updatePreview);

// ============================================
// FORM SUBMIT - SIMPAN FORMAT
// ============================================

document.getElementById('formatForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const format = document.getElementById('formatInput').value.trim();
    const kode = document.getElementById('kodeSurat').value.trim().toUpperCase();
    const jenis = document.getElementById('jenisSurat').value;
    const nomorAwal = parseInt(document.getElementById('nomorAwal').value) || 1;
    const keterangan = document.getElementById('keterangan').value.trim();
    
    if (!format || !kode || !jenis) {
        alert('Mohon lengkapi semua field yang wajib diisi!');
        return;
    }
    
    // Cek apakah format sudah ada
    const existingFormat = formatList.find(f => f.format === format && f.kode === kode);
    if (existingFormat) {
        alert('Format dengan kode ini sudah ada!');
        return;
    }
    
    // Simpan format
    const newFormat = {
        id: Date.now(),
        format: format,
        kode: kode,
        jenis: jenis,
        nomorAwal: nomorAwal,
        nomorTerakhir: nomorAwal - 1,
        keterangan: keterangan,
        tanggalBuat: new Date().toISOString()
    };
    
    formatList.push(newFormat);
    await saveData();
    
    alert('✅ Format nomor surat berhasil disimpan!');
    resetForm();
    loadFormatOptions();
});

// ============================================
// GENERATE NOMOR BARU
// ============================================

function updateGeneratePreview() {
    const selectFormat = document.getElementById('selectFormat');
    const selectedId = parseInt(selectFormat.value);
    
    if (!selectedId) {
        document.getElementById('generatePreview').textContent = 'Pilih format terlebih dahulu';
        return;
    }
    
    const format = formatList.find(f => f.id === selectedId);
    if (format) {
        const nextNomor = format.nomorTerakhir + 1;
        const preview = generateNomorFromFormat(format.format, format.kode, nextNomor);
        document.getElementById('generatePreview').textContent = preview;
    }
}

document.getElementById('generateForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const selectFormat = document.getElementById('selectFormat');
    const selectedId = parseInt(selectFormat.value);
    const keteranganGenerate = document.getElementById('keteranganGenerate').value.trim();
    
    if (!selectedId) {
        alert('Pilih format terlebih dahulu!');
        return;
    }
    
    const format = formatList.find(f => f.id === selectedId);
    if (!format) {
        alert('Format tidak ditemukan!');
        return;
    }
    
    // Generate nomor baru
    const nextNomor = format.nomorTerakhir + 1;
    const nomorSurat = generateNomorFromFormat(format.format, format.kode, nextNomor);
    
    // Simpan ke data nomor surat
    const newNomor = {
        id: Date.now(),
        nomorSurat: nomorSurat,
        formatId: format.id,
        jenisSurat: format.jenis,
        kode: format.kode,
        nomorUrut: nextNomor,
        tanggal: new Date().toISOString(),
        isUsed: false,
        keterangan: keteranganGenerate || 'Nomor surat baru'
    };
    
    dataNomorSurat.push(newNomor);
    
    // Update nomor terakhir di format
    format.nomorTerakhir = nextNomor;
    
    await saveData();
    
    alert(`✅ Nomor surat berhasil di-generate!\n\n${nomorSurat}`);
    
    // Reset form
    document.getElementById('generateForm').reset();
    document.getElementById('generatePreview').textContent = 'Pilih format terlebih dahulu';
    
    // Update tampilan
    updateStats();
    renderTable();
});

// ============================================
// RENDER TABLE
// ============================================

function renderTable() {
    const tbody = document.getElementById('tableBody');
    
    if (dataNomorSurat.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px;">
                    <i class="fas fa-inbox" style="font-size: 48px; color: #ccc;"></i>
                    <p style="color: #999; margin-top: 10px;">Belum ada nomor surat</p>
                </td>
            </tr>
        `;
        return;
    }
    
    // Sort by tanggal (terbaru dulu)
    const sortedData = [...dataNomorSurat].sort((a, b) => 
        new Date(b.tanggal) - new Date(a.tanggal)
    );
    
    tbody.innerHTML = sortedData.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td><strong>${item.nomorSurat}</strong></td>
            <td>${item.jenisSurat}</td>
            <td>${formatDate(item.tanggal)}</td>
            <td>
                <span class="badge ${item.isUsed ? 'used' : 'available'}">
                    ${item.isUsed ? '✓ Terpakai' : '○ Tersedia'}
                </span>
            </td>
            <td>${item.keterangan || '-'}</td>
            <td>
                <div class="btn-group">
                    ${!item.isUsed ? `
                        <button class="btn btn-success btn-small" onclick="markAsUsed(${item.id})">
                            <i class="fas fa-check"></i> Gunakan
                        </button>
                    ` : `
                        <button class="btn btn-secondary btn-small" onclick="markAsAvailable(${item.id})">
                            <i class="fas fa-undo"></i> Batalkan
                        </button>
                    `}
                    <button class="btn btn-danger btn-small" onclick="deleteNomor(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ============================================
// ACTIONS
// ============================================

async function markAsUsed(id) {
    const nomor = dataNomorSurat.find(n => n.id === id);
    if (nomor) {
        nomor.isUsed = true;
        nomor.tanggalDigunakan = new Date().toISOString();
        
        await saveData();
        updateStats();
        renderTable();
        
        // Auto-generate nomor baru dengan format yang sama
        const format = formatList.find(f => f.id === nomor.formatId);
        if (format && confirm('Nomor telah ditandai terpakai.\n\nGenerate nomor baru otomatis dengan format yang sama?')) {
            await autoGenerateNext(format);
        }
    }
}

async function markAsAvailable(id) {
    const nomor = dataNomorSurat.find(n => n.id === id);
    if (nomor) {
        nomor.isUsed = false;
        delete nomor.tanggalDigunakan;
        
        await saveData();
        updateStats();
        renderTable();
    }
}

async function deleteNomor(id) {
    if (!confirm('Yakin ingin menghapus nomor surat ini?')) return;
    
    dataNomorSurat = dataNomorSurat.filter(n => n.id !== id);
    await saveData();
    updateStats();
    renderTable();
}

async function autoGenerateNext(format) {
    const nextNomor = format.nomorTerakhir + 1;
    const nomorSurat = generateNomorFromFormat(format.format, format.kode, nextNomor);
    
    const newNomor = {
        id: Date.now(),
        nomorSurat: nomorSurat,
        formatId: format.id,
        jenisSurat: format.jenis,
        kode: format.kode,
        nomorUrut: nextNomor,
        tanggal: new Date().toISOString(),
        isUsed: false,
        keterangan: 'Auto-generated setelah nomor sebelumnya terpakai'
    };
    
    dataNomorSurat.push(newNomor);
    format.nomorTerakhir = nextNomor;
    
    await saveData();
    updateStats();
    renderTable();
    
    alert(`✅ Nomor baru berhasil di-generate otomatis!\n\n${nomorSurat}`);
}

// ============================================
// UTILITIES
// ============================================

function updateStats() {
    const total = dataNomorSurat.length;
    const used = dataNomorSurat.filter(n => n.isUsed).length;
    const available = total - used;
    
    document.getElementById('statTotal').textContent = total;
    document.getElementById('statUsed').textContent = used;
    document.getElementById('statAvailable').textContent = available;
}

function loadFormatOptions() {
    const select = document.getElementById('selectFormat');
    
    if (formatList.length === 0) {
        select.innerHTML = '<option value="">-- Belum ada format --</option>';
        return;
    }
    
    select.innerHTML = '<option value="">-- Pilih Format --</option>' +
        formatList.map(f => `
            <option value="${f.id}">
                ${f.jenis} (${f.kode}) - ${f.format}
            </option>
        `).join('');
}

function resetForm() {
    document.getElementById('formatForm').reset();
    document.getElementById('previewNumber').textContent = '-';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('id-ID', options);
}

function searchTable() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase();
    const table = document.getElementById('nomorSuratTable');
    const tr = table.getElementsByTagName('tr');
    
    for (let i = 1; i < tr.length; i++) {
        const td = tr[i].getElementsByTagName('td');
        let found = false;
        
        for (let j = 0; j < td.length; j++) {
            if (td[j]) {
                const textValue = td[j].textContent || td[j].innerText;
                if (textValue.toLowerCase().indexOf(filter) > -1) {
                    found = true;
                    break;
                }
            }
        }
        
        tr[i].style.display = found ? '' : 'none';
    }
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.insertVariable = insertVariable;
window.updatePreview = updatePreview;
window.updateGeneratePreview = updateGeneratePreview;
window.markAsUsed = markAsUsed;
window.markAsAvailable = markAsAvailable;
window.deleteNomor = deleteNomor;
window.resetForm = resetForm;
window.searchTable = searchTable;
