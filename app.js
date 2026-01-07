// Data Storage
let currentUser = null;
let suratMasuk = [];
let suratKeluar = [];
let arsipDigital = [];
let dataPegawai = [];
let dataSiswa = [];
let dataNomorSurat = [];
let dataSekolah = {
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
let nomorSuratCounter = 0;

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    loadFromLocalStorage();
    initializeApp();
    
    // Check if user was logged in before (optional: auto-login)
    // For now, just ensure data is loaded
    console.log('Data loaded from localStorage:', {
        suratMasuk: suratMasuk.length,
        suratKeluar: suratKeluar.length,
        arsipDigital: arsipDigital.length,
        dataPegawai: dataPegawai.length,
        dataSiswa: dataSiswa.length,
        dataNomorSurat: dataNomorSurat.length
    });
});

function initializeApp() {
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Logout Button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }

    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            if (page) {
                navigateToPage(page);
            }
        });
    });

    // Quick Action Buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            navigateToPage(action);
        });
    });

    // Surat Masuk
    const btnTambahSuratMasuk = document.getElementById('btnTambahSuratMasuk');
    if (btnTambahSuratMasuk) {
        btnTambahSuratMasuk.addEventListener('click', () => showModalSuratMasuk());
    }

    // Surat Keluar
    const btnTambahSuratKeluar = document.getElementById('btnTambahSuratKeluar');
    if (btnTambahSuratKeluar) {
        btnTambahSuratKeluar.addEventListener('click', () => showModalSuratKeluar());
    }

    // Buat Surat
    const jenisSurat = document.getElementById('jenisSurat');
    if (jenisSurat) {
        jenisSurat.addEventListener('change', handleJenisSuratChange);
    }

    // Arsip
    const btnUploadArsip = document.getElementById('btnUploadArsip');
    if (btnUploadArsip) {
        btnUploadArsip.addEventListener('click', () => showModalUploadArsip());
    }

    // Data Master
    const btnTambahPegawai = document.getElementById('btnTambahPegawai');
    if (btnTambahPegawai) {
        btnTambahPegawai.addEventListener('click', () => showModalPegawai());
    }

    const btnTambahSiswa = document.getElementById('btnTambahSiswa');
    if (btnTambahSiswa) {
        btnTambahSiswa.addEventListener('click', () => showModalSiswa());
    }

    const btnTambahNomorSurat = document.getElementById('btnTambahNomorSurat');
    if (btnTambahNomorSurat) {
        btnTambahNomorSurat.addEventListener('click', () => showModalNomorSurat());
    }

    const btnEditSekolah = document.getElementById('btnEditSekolah');
    if (btnEditSekolah) {
        btnEditSekolah.addEventListener('click', () => showModalDataSekolah());
    }

    // Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    // Search and Filter
    setupSearchAndFilter();
}

// Login Handler
async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        // Authenticate using database
        const admin = await authenticateAdmin(username, password);
        
        if (admin) {
            currentUser = { 
                id: admin.id,
                username: admin.username, 
                nama: admin.nama,
                role: admin.role 
            };
            document.getElementById('loginPage').style.display = 'none';
            document.getElementById('mainApp').style.display = 'flex';
            document.getElementById('userDisplay').textContent = admin.nama || admin.username;
            
            // Re-initialize after login to bind all event listeners
            setTimeout(() => {
                initializeAppAfterLogin();
                loadAllData();
                updateDashboard();
            }, 100);
            
            saveToLocalStorage();
        } else {
            alert('Username atau password salah!');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('Terjadi kesalahan saat login. Silakan coba lagi.');
    }
}

// Initialize app components after login
function initializeAppAfterLogin() {
    // Logout Button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.onclick = function(e) {
            e.preventDefault();
            handleLogout();
        };
    }

    // Surat Masuk
    const btnTambahSuratMasuk = document.getElementById('btnTambahSuratMasuk');
    if (btnTambahSuratMasuk) {
        btnTambahSuratMasuk.onclick = () => showModalSuratMasuk();
    }

    // Surat Keluar
    const btnTambahSuratKeluar = document.getElementById('btnTambahSuratKeluar');
    if (btnTambahSuratKeluar) {
        btnTambahSuratKeluar.onclick = () => showModalSuratKeluar();
    }

    // Buat Surat
    const jenisSurat = document.getElementById('jenisSurat');
    if (jenisSurat) {
        jenisSurat.onchange = handleJenisSuratChange;
    }

    // Arsip
    const btnUploadArsip = document.getElementById('btnUploadArsip');
    if (btnUploadArsip) {
        btnUploadArsip.onclick = () => showModalUploadArsip();
    }

    // Data Master
    const btnTambahPegawai = document.getElementById('btnTambahPegawai');
    if (btnTambahPegawai) {
        btnTambahPegawai.onclick = () => showModalPegawai();
    }

    const btnTambahSiswa = document.getElementById('btnTambahSiswa');
    if (btnTambahSiswa) {
        btnTambahSiswa.onclick = () => showModalSiswa();
    }

    const btnTambahNomorSurat = document.getElementById('btnTambahNomorSurat');
    if (btnTambahNomorSurat) {
        btnTambahNomorSurat.onclick = () => showModalNomorSurat();
    }

    const btnEditSekolah = document.getElementById('btnEditSekolah');
    if (btnEditSekolah) {
        btnEditSekolah.onclick = () => showModalDataSekolah();
    }

    const btnTambahAdmin = document.getElementById('btnTambahAdmin');
    if (btnTambahAdmin) {
        btnTambahAdmin.onclick = () => showModalAdmin();
    }

    // Backup and Import
    const btnBackupData = document.getElementById('btnBackupData');
    if (btnBackupData) {
        btnBackupData.onclick = () => backupAllData();
    }

    const btnImportData = document.getElementById('btnImportData');
    if (btnImportData) {
        btnImportData.onclick = () => showImportDataModal();
    }

    // Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.onclick = function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        };
    });

    // Search and Filter
    setupSearchAndFilter();
}

// Logout Handler
function handleLogout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        currentUser = null;
        
        // Reset ke halaman login
        document.getElementById('loginPage').style.display = 'flex';
        document.getElementById('mainApp').style.display = 'none';
        document.getElementById('loginForm').reset();
        
        // Reset navigasi ke dashboard
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => item.classList.remove('active'));
        const dashboardNav = document.querySelector('.nav-item[data-page="dashboard"]');
        if (dashboardNav) {
            dashboardNav.classList.add('active');
        }
        
        // Reset halaman ke dashboard
        const pages = document.querySelectorAll('.page-content');
        pages.forEach(page => page.classList.remove('active'));
        const dashboardPage = document.getElementById('dashboardPage');
        if (dashboardPage) {
            dashboardPage.classList.add('active');
        }
    }
}

// Navigation
function navigateToPage(pageName) {
    // Remove active class from all nav items and pages
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.remove('active');
    });

    // Add active class to selected nav item and page
    const navItem = document.querySelector(`[data-page="${pageName}"]`);
    if (navItem) {
        navItem.classList.add('active');
    }

    // Map page names to their IDs
    const pageIds = {
        'dashboard': 'dashboardPage',
        'surat-masuk': 'suratMasukPage',
        'surat-keluar': 'suratKeluarPage',
        'buat-surat': 'buatSuratPage',
        'arsip': 'arsipPage',
        'laporan': 'laporanPage',
        'data-master': 'dataMasterPage'
    };

    const pageId = pageIds[pageName];
    const page = document.getElementById(pageId);
    if (page) {
        page.classList.add('active');
    }

    // Update page title
    const titles = {
        'dashboard': 'Dashboard',
        'surat-masuk': 'Surat Masuk',
        'surat-keluar': 'Surat Keluar',
        'buat-surat': 'Buat Surat',
        'arsip': 'Arsip Digital',
        'laporan': 'Laporan',
        'data-master': 'Data Master'
    };
    if (document.getElementById('pageTitle')) {
        document.getElementById('pageTitle').textContent = titles[pageName] || 'Dashboard';
    }

    // Refresh data when navigating
    if (pageName === 'dashboard') updateDashboard();
    if (pageName === 'surat-masuk') renderSuratMasuk();
    if (pageName === 'surat-keluar') renderSuratKeluar();
    if (pageName === 'arsip') renderArsip();
    if (pageName === 'data-master') {
        renderPegawai();
        renderSiswa();
    }
}

// Update Dashboard
function updateDashboard() {
    document.getElementById('statSuratMasuk').textContent = suratMasuk.length;
    document.getElementById('statSuratKeluar').textContent = suratKeluar.length;
    document.getElementById('statArsip').textContent = arsipDigital.length;
    document.getElementById('statPegawai').textContent = dataPegawai.length;

    // Update recent activity
    const activityList = document.getElementById('recentActivityList');
    const allActivities = [
        ...suratMasuk.map(s => ({ type: 'masuk', data: s })),
        ...suratKeluar.map(s => ({ type: 'keluar', data: s }))
    ].sort((a, b) => new Date(b.data.tanggal) - new Date(a.data.tanggal)).slice(0, 5);

    if (allActivities.length === 0) {
        activityList.innerHTML = '<p class="no-data">Belum ada aktivitas</p>';
    } else {
        activityList.innerHTML = allActivities.map(activity => {
            const icon = activity.type === 'masuk' ? 'inbox' : 'paper-plane';
            const label = activity.type === 'masuk' ? 'Surat Masuk' : 'Surat Keluar';
            return `
                <div class="activity-item">
                    <div class="time">${formatDate(activity.data.tanggal)}</div>
                    <div class="description">
                        <i class="fas fa-${icon}"></i>
                        ${label}: ${activity.data.perihal}
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Surat Masuk Functions
function showModalSuratMasuk(data = null) {
    const isEdit = data !== null;
    const modal = createModal('Tambah Surat Masuk', `
        <form id="formSuratMasuk">
            <div class="form-group">
                <label>Nomor Surat *</label>
                <input type="text" class="form-control" id="nomorSuratMasuk" value="${isEdit ? data.nomorSurat : ''}" required>
            </div>
            <div class="form-group">
                <label>Tanggal *</label>
                <input type="date" class="form-control" id="tanggalMasuk" value="${isEdit ? data.tanggal : ''}" required>
            </div>
            <div class="form-group">
                <label>Pengirim *</label>
                <input type="text" class="form-control" id="pengirimMasuk" value="${isEdit ? data.pengirim : ''}" required>
            </div>
            <div class="form-group">
                <label>Perihal *</label>
                <textarea class="form-control" id="perihalMasuk" required>${isEdit ? data.perihal : ''}</textarea>
            </div>
            <div class="form-group">
                <label>File Surat (PDF)</label>
                <input type="file" class="form-control" id="fileMasuk" accept=".pdf">
                <small>Format: PDF (Max 5MB)</small>
                ${isEdit && data.file ? `<br><small>File saat ini: ${data.file}</small>` : ''}
            </div>
        </form>
    `, [
        { text: 'Batal', class: 'btn-secondary', onClick: closeModal },
        { text: 'Simpan', class: 'btn-primary', onClick: () => saveSuratMasuk(isEdit ? data.id : null) }
    ]);
    showModal(modal);
}

function saveSuratMasuk(id = null) {
    const nomorSurat = document.getElementById('nomorSuratMasuk').value;
    const tanggal = document.getElementById('tanggalMasuk').value;
    const pengirim = document.getElementById('pengirimMasuk').value;
    const perihal = document.getElementById('perihalMasuk').value;
    const fileInput = document.getElementById('fileMasuk');

    if (!nomorSurat || !tanggal || !pengirim || !perihal) {
        alert('Mohon lengkapi semua field yang wajib diisi!');
        return;
    }

    // Handle file upload
    if (fileInput.files[0]) {
        const file = fileInput.files[0];
        
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Ukuran file terlalu besar! Maksimal 5MB.');
            return;
        }
        
        // Check file type
        if (file.type !== 'application/pdf') {
            alert('Hanya file PDF yang diperbolehkan!');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const suratData = {
                id: id || Date.now(),
                nomorSurat,
                tanggal,
                pengirim,
                perihal,
                file: file.name,
                fileData: e.target.result // base64 data
            };
            
            saveSuratMasukData(suratData, id);
        };
        reader.readAsDataURL(file);
    } else {
        // No new file uploaded
        const suratData = {
            id: id || Date.now(),
            nomorSurat,
            tanggal,
            pengirim,
            perihal,
            file: id ? (suratMasuk.find(s => s.id === id)?.file || '') : '',
            fileData: id ? (suratMasuk.find(s => s.id === id)?.fileData || '') : ''
        };
        
        saveSuratMasukData(suratData, id);
    }
}

function saveSuratMasukData(suratData, id) {
    if (id) {
        const index = suratMasuk.findIndex(s => s.id === id);
        if (index !== -1) {
            suratMasuk[index] = suratData;
        }
    } else {
        suratMasuk.push(suratData);
    }

    saveToLocalStorage();
    renderSuratMasuk();
    updateDashboard();
    closeModal();
    alert('Surat masuk berhasil disimpan!');
}

function renderSuratMasuk(filter = '', filterBulan = '') {
    const tbody = document.getElementById('tableSuratMasuk');
    let filtered = suratMasuk;

    // Filter berdasarkan pencarian teks
    if (filter) {
        filtered = filtered.filter(s => 
            s.nomorSurat.toLowerCase().includes(filter.toLowerCase()) ||
            s.pengirim.toLowerCase().includes(filter.toLowerCase()) ||
            s.perihal.toLowerCase().includes(filter.toLowerCase())
        );
    }

    // Filter berdasarkan bulan (format: YYYY-MM)
    if (filterBulan) {
        filtered = filtered.filter(s => {
            const tanggalSurat = s.tanggal.substring(0, 7); // Ambil YYYY-MM dari YYYY-MM-DD
            return tanggalSurat === filterBulan;
        });
    }

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="no-data">Belum ada data surat masuk</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map((surat, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${surat.nomorSurat}</td>
            <td>${formatDate(surat.tanggal)}</td>
            <td>${surat.pengirim}</td>
            <td>${surat.perihal}</td>
            <td>
                ${surat.file ? `
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-file-pdf" style="color: #F5222D;"></i>
                        <span style="flex: 1; font-size: 13px;">${surat.file}</span>
                        <button class="btn-sm btn-primary" onclick="downloadFile('${surat.file.replace(/'/g, "\\'")}')"; title="Download File">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>
                ` : '-'}
            </td>
            <td>
                <button class="btn-sm btn-primary" onclick="showModalSuratMasuk(${JSON.stringify(surat).replace(/"/g, '&quot;')})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-sm btn-danger" onclick="deleteSuratMasuk(${surat.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function deleteSuratMasuk(id) {
    if (confirm('Apakah Anda yakin ingin menghapus surat ini?')) {
        suratMasuk = suratMasuk.filter(s => s.id !== id);
        saveToLocalStorage();
        renderSuratMasuk();
        updateDashboard();
    }
}

// Surat Keluar Functions
function showModalSuratKeluar(data = null) {
    const isEdit = data !== null;
    const modal = createModal('Tambah Surat Keluar', `
        <form id="formSuratKeluar">
            <div class="form-group">
                <label>Nomor Surat *</label>
                <select class="form-control" id="selectNomorSuratKeluar" onchange="handleNomorSuratChange('Keluar')" ${isEdit ? 'disabled' : ''}>
                    ${isEdit ? `<option value="${data.nomorSurat}" selected>${data.nomorSurat}</option>` : getNomorSuratOptions()}
                </select>
                <small>Pilih nomor surat dari Data Master atau input manual</small>
            </div>
            <div class="form-group" id="manualNomorKeluarGroup" style="display: none;">
                <label>Input Nomor Surat Manual *</label>
                <input type="text" class="form-control" id="manualNomorSuratKeluar" placeholder="Contoh: 001/TU/X/2024">
            </div>
            <input type="hidden" id="nomorSuratKeluar" value="${isEdit ? data.nomorSurat : ''}">
            <div class="form-group">
                <label>Tanggal *</label>
                <input type="date" class="form-control" id="tanggalKeluar" value="${isEdit ? data.tanggal : new Date().toISOString().split('T')[0]}" required>
            </div>
            <div class="form-group">
                <label>Tujuan *</label>
                <input type="text" class="form-control" id="tujuanKeluar" value="${isEdit ? data.tujuan : ''}" required>
            </div>
            <div class="form-group">
                <label>Perihal *</label>
                <textarea class="form-control" id="perihalKeluar" required>${isEdit ? data.perihal : ''}</textarea>
            </div>
            <div class="form-group">
                <label>Jenis Surat *</label>
                <input type="text" class="form-control" id="jenisKeluar" value="${isEdit ? data.jenis : ''}" placeholder="Contoh: Undangan, Tugas, Keputusan, dll" required>
                <small>Masukkan jenis surat secara manual</small>
            </div>
            <div class="form-group">
                <label>File Surat (PDF)</label>
                <input type="file" class="form-control" id="fileKeluar" accept=".pdf">
                <small>Format: PDF (Max 5MB)</small>
                ${isEdit && data.file ? `<br><small>File saat ini: ${data.file}</small>` : ''}
            </div>
        </form>
    `, [
        { text: 'Batal', class: 'btn-secondary', onClick: closeModal },
        { text: 'Simpan', class: 'btn-primary', onClick: () => saveSuratKeluar(isEdit ? data.id : null) }
    ]);
    showModal(modal);
}

function saveSuratKeluar(id = null) {
    const selectNomor = document.getElementById('selectNomorSuratKeluar');
    const manualNomor = document.getElementById('manualNomorSuratKeluar');
    let nomorSurat = '';
    
    // Ambil nomor surat dari dropdown atau manual input
    if (selectNomor.value === 'manual') {
        nomorSurat = manualNomor.value.trim();
        if (!nomorSurat) {
            alert('Mohon input nomor surat manual!');
            return;
        }
    } else {
        nomorSurat = selectNomor.value;
    }
    
    const tanggal = document.getElementById('tanggalKeluar').value;
    const tujuan = document.getElementById('tujuanKeluar').value;
    const perihal = document.getElementById('perihalKeluar').value;
    const jenis = document.getElementById('jenisKeluar').value;
    const fileInput = document.getElementById('fileKeluar');

    if (!nomorSurat || !tanggal || !tujuan || !perihal || !jenis) {
        alert('Mohon lengkapi semua field yang wajib diisi!');
        return;
    }

    // Handle file upload
    if (fileInput.files[0]) {
        const file = fileInput.files[0];
        
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Ukuran file terlalu besar! Maksimal 5MB.');
            return;
        }
        
        // Check file type
        if (file.type !== 'application/pdf') {
            alert('Hanya file PDF yang diperbolehkan!');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const suratData = {
                id: id || Date.now(),
                nomorSurat,
                tanggal,
                tujuan,
                perihal,
                jenis,
                file: file.name,
                fileData: e.target.result // base64 data
            };
            
            saveSuratKeluarData(suratData, id);
        };
        reader.readAsDataURL(file);
    } else {
        // No new file uploaded
        const suratData = {
            id: id || Date.now(),
            nomorSurat,
            tanggal,
            tujuan,
            perihal,
            jenis,
            file: id ? (suratKeluar.find(s => s.id === id)?.file || '') : '',
            fileData: id ? (suratKeluar.find(s => s.id === id)?.fileData || '') : ''
        };
        
        saveSuratKeluarData(suratData, id);
    }
}

function saveSuratKeluarData(suratData, id) {
    if (id) {
        const index = suratKeluar.findIndex(s => s.id === id);
        suratKeluar[index] = suratData;
    } else {
        suratKeluar.push(suratData);
        
        // Tandai nomor surat sebagai sudah digunakan jika dari Data Master
        const selectNomor = document.getElementById('selectNomorSuratKeluar');
        if (selectNomor && selectNomor.value !== 'manual' && selectNomor.value !== '') {
            markNomorSuratAsUsed(suratData.nomorSurat);
        }
        
        nomorSuratCounter++;
    }

    saveToLocalStorage();
    renderSuratKeluar();
    renderNomorSurat(); // Update tampilan nomor surat
    updateDashboard();
    closeModal();
    alert('Surat keluar berhasil disimpan!');
}

function renderSuratKeluar(filter = '', filterBulan = '') {
    const tbody = document.getElementById('tableSuratKeluar');
    let filtered = suratKeluar;

    // Filter berdasarkan pencarian teks
    if (filter) {
        filtered = filtered.filter(s => 
            s.nomorSurat.toLowerCase().includes(filter.toLowerCase()) ||
            s.tujuan.toLowerCase().includes(filter.toLowerCase()) ||
            s.perihal.toLowerCase().includes(filter.toLowerCase())
        );
    }

    // Filter berdasarkan bulan (format: YYYY-MM)
    if (filterBulan) {
        filtered = filtered.filter(s => {
            const tanggalSurat = s.tanggal.substring(0, 7); // Ambil YYYY-MM dari YYYY-MM-DD
            return tanggalSurat === filterBulan;
        });
    }

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="no-data">Belum ada data surat keluar</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map((surat, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${surat.nomorSurat}</td>
            <td>${formatDate(surat.tanggal)}</td>
            <td>${surat.tujuan}</td>
            <td>${surat.perihal}</td>
            <td><span class="badge badge-info">${surat.jenis}</span></td>
            <td>
                ${surat.file ? `
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-file-pdf" style="color: #F5222D;"></i>
                        <span style="flex: 1; font-size: 13px;">${surat.file}</span>
                        <button class="btn-sm btn-primary" onclick="downloadFile('${surat.file.replace(/'/g, "\\'")}')"; title="Download File">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>
                ` : '-'}
            </td>
            <td>
                <button class="btn-sm btn-primary" onclick="showModalSuratKeluar(${JSON.stringify(surat).replace(/"/g, '&quot;')})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-sm btn-danger" onclick="deleteSuratKeluar(${surat.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function deleteSuratKeluar(id) {
    if (confirm('Apakah Anda yakin ingin menghapus surat ini?')) {
        suratKeluar = suratKeluar.filter(s => s.id !== id);
        saveToLocalStorage();
        renderSuratKeluar();
        updateDashboard();
    }
}

// Buat Surat Otomatis
function handleJenisSuratChange() {
    const jenis = document.getElementById('jenisSurat').value;
    const formContainer = document.getElementById('formSuratDynamic');

    if (!jenis) {
        formContainer.innerHTML = '<p class="info-text">Silakan pilih jenis surat terlebih dahulu</p>';
        return;
    }

    let formHTML = '';
    switch (jenis) {
        case 'aktif':
            formHTML = getFormAktifSekolah();
            break;
        case 'tugas':
            formHTML = getFormSuratTugas();
            break;
        case 'undangan':
            formHTML = getFormSuratUndangan();
            break;
        case 'izin':
            formHTML = getFormSuratIzin();
            break;
        case 'rekomendasi':
            formHTML = getFormSuratRekomendasi();
            break;
        case 'keterangan':
            formHTML = getFormSuratKeterangan();
            break;
    }

    formContainer.innerHTML = formHTML;
}

function getFormAktifSekolah() {
    return `
        <h3>Surat Keterangan Aktif Sekolah</h3>
        <form id="formAktif">
            <div class="form-group">
                <label>Ukuran Kertas *</label>
                <select class="form-control" id="paperSizeAktif" required>
                    <option value="A4">A4 (210 x 297 mm)</option>
                    <option value="F4">F4/Folio (215 x 330 mm)</option>
                    <option value="Letter">Letter (216 x 279 mm)</option>
                </select>
                <small><i class="fas fa-info-circle"></i> Pilih ukuran kertas untuk print</small>
            </div>
            <div class="form-group">
                <label>Nomor Surat *</label>
                <input type="text" class="form-control" id="nomorAktif" value="${generateNomorSurat()}" required>
                <small>Nomor surat dapat diedit. Akan otomatis tersimpan ke Data Master.</small>
            </div>
            <div class="form-group">
                <label>Nama Siswa *</label>
                <input type="text" class="form-control" id="namaSiswaAktif" required>
            </div>
            <div class="form-group">
                <label>NISN *</label>
                <input type="text" class="form-control" id="nisnAktif" required>
            </div>
            <div class="form-group">
                <label>Kelas *</label>
                <input type="text" class="form-control" id="kelasAktif" required>
            </div>
            <div class="form-group">
                <label>Keperluan *</label>
                <textarea class="form-control" id="keperluanAktif" required></textarea>
            </div>
            <button type="button" class="btn-primary" onclick="generateSuratAktif()">
                <i class="fas fa-file-pdf"></i> Generate Surat
            </button>
        </form>
        <div id="previewAktif"></div>
    `;
}

function getFormSuratTugas() {
    // Generate dropdown options dari data pegawai
    let pegawaiOptions = '<option value="">-- Pilih Pegawai --</option>';
    if (dataPegawai && dataPegawai.length > 0) {
        pegawaiOptions += dataPegawai.map(p => 
            `<option value="${p.id}" data-nama="${p.nama}" data-nip="${p.nip || ''}" data-jabatan="${p.jabatan}" data-alamat="${p.alamat || ''}">${p.nama} - ${p.jabatan}</option>`
        ).join('');
    } else {
        pegawaiOptions += '<option value="" disabled>Belum ada data pegawai</option>';
    }
    
    return `
        <h3>Surat Tugas</h3>
        <form id="formTugas">
            <div class="form-group">
                <label>Ukuran Kertas *</label>
                <select class="form-control" id="paperSizeTugas" required>
                    <option value="A4">A4 (210 x 297 mm)</option>
                    <option value="F4">F4/Folio (215 x 330 mm)</option>
                    <option value="Letter">Letter (216 x 279 mm)</option>
                </select>
                <small><i class="fas fa-info-circle"></i> Pilih ukuran kertas untuk print</small>
            </div>
            <div class="form-group">
                <label>Nomor Surat *</label>
                <input type="text" class="form-control" id="nomorTugas" value="${generateNomorSurat()}" required>
                <small>Nomor surat dapat diedit. Akan otomatis tersimpan ke Data Master.</small>
            </div>
            <div class="form-group">
                <label>Pilih Pegawai *</label>
                <select class="form-control" id="selectPegawaiTugas" onchange="fillPegawaiData()" required>
                    ${pegawaiOptions}
                </select>
                <small>Pilih pegawai dari Data Master</small>
            </div>
            <div class="form-group">
                <label>Nama Pegawai *</label>
                <input type="text" class="form-control" id="namaPegawaiTugas" readonly required>
            </div>
            <div class="form-group">
                <label>NIP *</label>
                <input type="text" class="form-control" id="nipTugas" readonly required>
            </div>
            <div class="form-group">
                <label>Jabatan *</label>
                <input type="text" class="form-control" id="jabatanTugas" readonly required>
            </div>
            <div class="form-group">
                <label>Alamat *</label>
                <input type="text" class="form-control" id="alamatTugas" required>
                <small>Alamat dapat diedit manual</small>
            </div>
            <div class="form-group">
                <label>Tugas/Kegiatan *</label>
                <textarea class="form-control" id="tugasKegiatan" required></textarea>
            </div>
            <div class="form-group">
                <label>Tanggal Mulai *</label>
                <input type="date" class="form-control" id="tanggalMulaiTugas" required>
                <small>Tanggal mulai pelaksanaan tugas</small>
            </div>
            <div class="form-group">
                <label>Tanggal Selesai *</label>
                <input type="date" class="form-control" id="tanggalSelesaiTugas" required>
                <small>Tanggal selesai pelaksanaan tugas</small>
            </div>
            <div class="form-group">
                <label>Jam *</label>
                <input type="time" class="form-control" id="jamTugas" required>
            </div>
            <div class="form-group">
                <label>Tempat *</label>
                <input type="text" class="form-control" id="tempatTugas" required>
            </div>
            <button type="button" class="btn-primary" onclick="generateSuratTugas()">
                <i class="fas fa-file-pdf"></i> Generate Surat
            </button>
        </form>
        <div id="previewTugas"></div>
    `;
}

function getFormSuratUndangan() {
    return `
        <h3>Surat Undangan</h3>
        <form id="formUndangan">
            <div class="form-group">
                <label>Ukuran Kertas *</label>
                <select class="form-control" id="paperSizeUndangan" required>
                    <option value="A4">A4 (210 x 297 mm)</option>
                    <option value="F4">F4/Folio (215 x 330 mm)</option>
                    <option value="Letter">Letter (216 x 279 mm)</option>
                </select>
                <small><i class="fas fa-info-circle"></i> Pilih ukuran kertas untuk print</small>
            </div>
            <div class="form-group">
                <label>Nomor Surat *</label>
                <input type="text" class="form-control" id="nomorUndangan" value="${generateNomorSurat()}" required>
                <small>Nomor surat dapat diedit. Akan otomatis tersimpan ke Data Master.</small>
            </div>
            <div class="form-group">
                <label>Kepada *</label>
                <input type="text" class="form-control" id="kepadaUndangan" required>
            </div>
            <div class="form-group">
                <label>Acara *</label>
                <input type="text" class="form-control" id="acaraUndangan" required>
            </div>
            <div class="form-group">
                <label>Hari/Tanggal *</label>
                <input type="date" class="form-control" id="tanggalUndangan" required>
            </div>
            <div class="form-group">
                <label>Waktu *</label>
                <input type="time" class="form-control" id="waktuUndangan" required>
            </div>
            <div class="form-group">
                <label>Tempat *</label>
                <input type="text" class="form-control" id="tempatUndangan" required>
            </div>
            <button type="button" class="btn-primary" onclick="generateSuratUndangan()">
                <i class="fas fa-file-pdf"></i> Generate Surat
            </button>
        </form>
        <div id="previewUndangan"></div>
    `;
}

function getFormSuratIzin() {
    // Generate dropdown options dari data siswa
    let siswaOptions = '<option value="">-- Pilih Siswa --</option>';
    if (dataSiswa && dataSiswa.length > 0) {
        siswaOptions += dataSiswa.map(s => 
            `<option value="${s.id}" data-nama="${s.nama}" data-nisn="${s.nisn}" data-kelas="${s.kelas}">${s.nama} - ${s.kelas}</option>`
        ).join('');
    } else {
        siswaOptions += '<option value="" disabled>Belum ada data siswa</option>';
    }
    
    // Generate dropdown options dari data pegawai
    let pegawaiOptions = '<option value="">-- Pilih Guru/Pegawai --</option>';
    if (dataPegawai && dataPegawai.length > 0) {
        pegawaiOptions += dataPegawai.map(p => 
            `<option value="${p.id}" data-nama="${p.nama}" data-nip="${p.nip}" data-jabatan="${p.jabatan}">${p.nama} - ${p.jabatan}</option>`
        ).join('');
    } else {
        pegawaiOptions += '<option value="" disabled>Belum ada data pegawai</option>';
    }
    
    return `
        <h3>Surat Izin</h3>
        <form id="formIzin">
            <div class="form-group">
                <label>Ukuran Kertas *</label>
                <select class="form-control" id="paperSizeIzin" required>
                    <option value="A4">A4 (210 x 297 mm)</option>
                    <option value="F4">F4/Folio (215 x 330 mm)</option>
                    <option value="Letter">Letter (216 x 279 mm)</option>
                </select>
                <small><i class="fas fa-info-circle"></i> Pilih ukuran kertas untuk print</small>
            </div>
            <div class="form-group">
                <label>Nomor Surat *</label>
                <input type="text" class="form-control" id="nomorIzin" value="${generateNomorSurat()}" required>
                <small>Nomor surat dapat diedit. Akan otomatis tersimpan ke Data Master.</small>
            </div>
            <div class="form-group">
                <label>Izin Untuk *</label>
                <select class="form-control" id="tipeIzin" onchange="handleTipeIzinChange()" required>
                    <option value="">-- Pilih Tipe --</option>
                    <option value="siswa">Siswa</option>
                    <option value="guru">Guru/Pegawai</option>
                </select>
            </div>
            
            <!-- Form untuk Siswa -->
            <div id="formSiswaIzin" style="display: none;">
                <div class="form-group">
                    <label>Pilih Siswa *</label>
                    <select class="form-control" id="selectSiswaIzin" onchange="fillSiswaDataIzin()">
                        ${siswaOptions}
                    </select>
                    <small>Pilih siswa dari Data Master</small>
                </div>
                <div class="form-group">
                    <label>Nama Siswa *</label>
                    <input type="text" class="form-control" id="namaSiswaIzin">
                </div>
                <div class="form-group">
                    <label>NISN</label>
                    <input type="text" class="form-control" id="nisnIzin">
                </div>
                <div class="form-group">
                    <label>Kelas *</label>
                    <input type="text" class="form-control" id="kelasIzin">
                </div>
            </div>
            
            <!-- Form untuk Guru/Pegawai -->
            <div id="formGuruIzin" style="display: none;">
                <div class="form-group">
                    <label>Pilih Guru/Pegawai *</label>
                    <select class="form-control" id="selectGuruIzin" onchange="fillGuruDataIzin()">
                        ${pegawaiOptions}
                    </select>
                    <small>Pilih guru/pegawai dari Data Master</small>
                </div>
                <div class="form-group">
                    <label>Nama Guru/Pegawai *</label>
                    <input type="text" class="form-control" id="namaGuruIzin">
                </div>
                <div class="form-group">
                    <label>NIP</label>
                    <input type="text" class="form-control" id="nipIzin">
                </div>
                <div class="form-group">
                    <label>Jabatan *</label>
                    <input type="text" class="form-control" id="jabatanIzin">
                </div>
            </div>
            
            <div class="form-group">
                <label>Jenis Izin *</label>
                <select class="form-control" id="jenisIzin" required>
                    <option value="">-- Pilih Jenis Izin --</option>
                    <option value="Sakit">Sakit</option>
                    <option value="Keperluan Keluarga">Keperluan Keluarga</option>
                    <option value="Acara Keluarga">Acara Keluarga</option>
                    <option value="Cuti">Cuti</option>
                    <option value="Dinas Luar">Dinas Luar</option>
                    <option value="Lainnya">Lainnya</option>
                </select>
            </div>
            <div class="form-group">
                <label>Tanggal Mulai *</label>
                <input type="date" class="form-control" id="tanggalMulaiIzin" required>
            </div>
            <div class="form-group">
                <label>Tanggal Selesai *</label>
                <input type="date" class="form-control" id="tanggalSelesaiIzin" required>
            </div>
            <div class="form-group">
                <label>Keterangan/Alasan *</label>
                <textarea class="form-control" id="keteranganIzin" rows="3" required></textarea>
            </div>
            <button type="button" class="btn-primary" onclick="generateSuratIzin()">
                <i class="fas fa-file-pdf"></i> Generate Surat
            </button>
        </form>
        <div id="previewIzin"></div>
    `;
}

function getFormSuratRekomendasi() {
    // Generate dropdown options dari data pegawai
    let pegawaiOptions = '<option value="">-- Pilih Pegawai --</option>';
    if (dataPegawai && dataPegawai.length > 0) {
        pegawaiOptions += dataPegawai.map(p => 
            `<option value="${p.id}" data-nama="${p.nama}" data-jabatan="${p.jabatan}">${p.nama} - ${p.jabatan}</option>`
        ).join('');
    } else {
        pegawaiOptions += '<option value="" disabled>Belum ada data pegawai</option>';
    }
    
    return `
        <h3>Surat Rekomendasi</h3>
        <form id="formRekomendasi">
            <div class="form-group">
                <label>Ukuran Kertas *</label>
                <select class="form-control" id="paperSizeRekomendasi" required>
                    <option value="A4">A4 (210 x 297 mm)</option>
                    <option value="F4">F4/Folio (215 x 330 mm)</option>
                    <option value="Letter">Letter (216 x 279 mm)</option>
                </select>
                <small><i class="fas fa-info-circle"></i> Pilih ukuran kertas untuk print</small>
            </div>
            <div class="form-group">
                <label>Nomor Surat *</label>
                <input type="text" class="form-control" id="nomorRekomendasi" value="${generateNomorSurat()}" required>
                <small>Nomor surat dapat diedit. Akan otomatis tersimpan ke Data Master.</small>
            </div>
            <div class="form-group">
                <label>Pilih Pegawai *</label>
                <select class="form-control" id="selectPegawaiRekomendasi" onchange="fillPegawaiDataRekomendasi()" required>
                    ${pegawaiOptions}
                </select>
                <small>Pilih pegawai dari Data Master</small>
            </div>
            <div class="form-group">
                <label>Nama *</label>
                <input type="text" class="form-control" id="namaRekomendasi" readonly required>
            </div>
            <div class="form-group">
                <label>Jabatan/Status *</label>
                <input type="text" class="form-control" id="statusRekomendasi" readonly required>
            </div>
            <div class="form-group">
                <label>Tujuan Rekomendasi *</label>
                <textarea class="form-control" id="tujuanRekomendasi" required></textarea>
            </div>
            <button type="button" class="btn-primary" onclick="generateSuratRekomendasi()">
                <i class="fas fa-file-pdf"></i> Generate Surat
            </button>
        </form>
        <div id="previewRekomendasi"></div>
    `;
}

function getFormSuratKeterangan() {
    return `
        <h3>Surat Keterangan Lainnya</h3>
        <form id="formKeterangan">
            <div class="form-group">
                <label>Ukuran Kertas *</label>
                <select class="form-control" id="paperSizeKeterangan" required>
                    <option value="A4">A4 (210 x 297 mm)</option>
                    <option value="F4">F4/Folio (215 x 330 mm)</option>
                    <option value="Letter">Letter (216 x 279 mm)</option>
                </select>
                <small><i class="fas fa-info-circle"></i> Pilih ukuran kertas untuk print</small>
            </div>
            <div class="form-group">
                <label>Nomor Surat *</label>
                <input type="text" class="form-control" id="nomorKeterangan" value="${generateNomorSurat()}" required>
                <small>Nomor surat dapat diedit. Akan otomatis tersimpan ke Data Master.</small>
            </div>
            <div class="form-group">
                <label>Nama *</label>
                <input type="text" class="form-control" id="namaKeterangan" required>
            </div>
            <div class="form-group">
                <label>Keterangan/Isi Surat *</label>
                <textarea class="form-control" id="isiKeterangan" rows="5" required></textarea>
            </div>
            <button type="button" class="btn-primary" onclick="generateSuratKeterangan()">
                <i class="fas fa-file-pdf"></i> Generate Surat
            </button>
        </form>
        <div id="previewKeterangan"></div>
    `;
}

// Arsip Digital Functions
function showModalUploadArsip(data = null) {
    const isEdit = data !== null;
    const modal = createModal('Upload Arsip Digital', `
        <form id="formArsip">
            <div class="form-group">
                <label>Nama Dokumen *</label>
                <input type="text" class="form-control" id="namaArsip" value="${isEdit ? data.nama : ''}" required>
            </div>
            <div class="form-group">
                <label>Kategori *</label>
                <input type="text" class="form-control" id="kategoriArsip" value="${isEdit ? data.kategori : ''}" placeholder="Contoh: Surat, Laporan, SK, Notulen, dll" required>
                <small>Masukkan kategori dokumen secara manual</small>
            </div>
            <div class="form-group">
                <label>Tanggal *</label>
                <input type="date" class="form-control" id="tanggalArsip" value="${isEdit ? data.tanggal : ''}" required>
            </div>
            <div class="form-group">
                <label>File Dokumen (PDF, DOC/DOCX)</label>
                <input type="file" class="form-control" id="fileArsip" accept=".pdf,.doc,.docx">
                <small>Format: PDF, DOC, DOCX (Max 5MB)</small>
                ${isEdit && data.file ? `<br><small>File saat ini: ${data.file}</small>` : ''}
            </div>
        </form>
    `, [
        { text: 'Batal', class: 'btn-secondary', onClick: closeModal },
        { text: 'Simpan', class: 'btn-primary', onClick: () => saveArsip(isEdit ? data.id : null) }
    ]);
    showModal(modal);
}

function saveArsip(id = null) {
    const nama = document.getElementById('namaArsip').value;
    const kategori = document.getElementById('kategoriArsip').value;
    const tanggal = document.getElementById('tanggalArsip').value;
    const fileInput = document.getElementById('fileArsip');

    if (!nama || !kategori || !tanggal) {
        alert('Mohon lengkapi semua field yang wajib diisi!');
        return;
    }

    // Handle file upload
    if (fileInput.files[0]) {
        const file = fileInput.files[0];
        
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Ukuran file terlalu besar! Maksimal 5MB.');
            return;
        }
        
        // Check file type (PDF or DOC)
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            alert('Hanya file PDF, DOC, atau DOCX yang diperbolehkan!');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const arsipData = {
                id: id || Date.now(),
                nama,
                kategori,
                tanggal,
                file: file.name,
                fileData: e.target.result // base64 data
            };
            
            saveArsipData(arsipData, id);
        };
        reader.readAsDataURL(file);
    } else {
        // No new file uploaded
        const arsipData = {
            id: id || Date.now(),
            nama,
            kategori,
            tanggal,
            file: id ? (arsipDigital.find(a => a.id === id)?.file || '') : '',
            fileData: id ? (arsipDigital.find(a => a.id === id)?.fileData || '') : ''
        };
        
        saveArsipData(arsipData, id);
    }
}

function saveArsipData(arsipData, id) {
    if (id) {
        const index = arsipDigital.findIndex(a => a.id === id);
        if (index !== -1) {
            arsipDigital[index] = arsipData;
        }
    } else {
        arsipDigital.push(arsipData);
    }

    saveToLocalStorage();
    renderArsip();
    updateDashboard();
    closeModal();
    alert('Arsip berhasil disimpan!');
}

function populateKategoriFilter() {
    const filterKategori = document.getElementById('filterKategori');
    if (!filterKategori) return;

    // Get unique categories from arsipDigital
    const categories = [...new Set(arsipDigital.map(a => a.kategori))].filter(k => k).sort();

    // Save current selection
    const currentValue = filterKategori.value;

    // Rebuild options
    filterKategori.innerHTML = '<option value="">Semua Kategori</option>';
    categories.forEach(kategori => {
        const option = document.createElement('option');
        option.value = kategori;
        option.textContent = kategori;
        if (kategori === currentValue) {
            option.selected = true;
        }
        filterKategori.appendChild(option);
    });
}

function renderArsip(filter = '', kategori = '') {
    const grid = document.getElementById('arsipGrid');
    let filtered = arsipDigital;

    // Update category filter options
    populateKategoriFilter();

    if (filter) {
        filtered = filtered.filter(a => a.nama.toLowerCase().includes(filter.toLowerCase()));
    }

    if (kategori) {
        filtered = filtered.filter(a => a.kategori === kategori);
    }

    if (filtered.length === 0) {
        grid.innerHTML = '<p class="no-data">Belum ada arsip digital</p>';
        return;
    }

    grid.innerHTML = filtered.map(arsip => {
        let fileIcon = 'file';
        let fileColor = '#8C8C8C';
        
        if (arsip.file) {
            if (arsip.file.endsWith('.pdf')) {
                fileIcon = 'file-pdf';
                fileColor = '#F5222D';
            } else if (arsip.file.endsWith('.html')) {
                fileIcon = 'file-alt';
                fileColor = '#1890FF';
            } else {
                fileIcon = 'file-word';
                fileColor = '#2B579A';
            }
        }
        
        return `
        <div class="arsip-card">
            <div class="arsip-header">
                <div class="arsip-icon">
                    <i class="fas fa-${fileIcon}" style="color: ${fileColor};"></i>
                </div>
                <div class="arsip-info">
                    <h4 title="${arsip.nama}">${arsip.nama}</h4>
                    <p><i class="fas fa-tag"></i> <span>${arsip.kategori}</span></p>
                    <p><i class="fas fa-calendar"></i> <span>${formatDate(arsip.tanggal)}</span></p>
                    ${arsip.file ? `<p><i class="fas fa-paperclip"></i> <span>${arsip.file}</span></p>` : ''}
                </div>
            </div>
            <div class="arsip-actions">
                ${arsip.file && arsip.fileData ? `
                    <button class="btn-sm btn-info" onclick="downloadFileArsip(${arsip.id})" title="Download File">
                        <i class="fas fa-download"></i> Download
                    </button>
                ` : ''}
                <button class="btn-sm btn-primary" onclick="showModalUploadArsip(${JSON.stringify(arsip).replace(/"/g, '&quot;')})" title="Edit">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-sm btn-danger" onclick="deleteArsip(${arsip.id})" title="Hapus">
                    <i class="fas fa-trash"></i> Hapus
                </button>
            </div>
        </div>
        `;
    }).join('');
}

function deleteArsip(id) {
    if (confirm('Apakah Anda yakin ingin menghapus arsip ini?')) {
        arsipDigital = arsipDigital.filter(a => a.id !== id);
        saveToLocalStorage();
        renderArsip();
        updateDashboard();
    }
}

function viewFileArsip(arsipId) {
    // Cari file di arsip digital
    const arsip = arsipDigital.find(a => a.id === arsipId);
    
    if (arsip && arsip.fileData) {
        const fileData = arsip.fileData;
        const fileName = arsip.file;
        const isPDF = fileName.toLowerCase().endsWith('.pdf');
        const isHTML = fileName.toLowerCase().endsWith('.html');
        const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileName);
        
        let contentHTML = '';
        
        if (isHTML && arsip.isSuratGenerated) {
            // Tampilkan surat yang di-generate
            contentHTML = `
                <div style="border: 1px solid var(--gray-300); border-radius: 8px; overflow: auto; margin-bottom: 20px; max-height: 600px; padding: 20px; background: white;">
                    ${fileData}
                </div>
            `;
        } else if (isPDF) {
            // Tampilkan PDF dengan object tag dan fallback
            contentHTML = `
                <div style="border: 1px solid var(--gray-300); border-radius: 8px; overflow: hidden; margin-bottom: 20px; background: #f5f5f5;">
                    <object data="${fileData}" 
                            type="application/pdf" 
                            style="width: 100%; height: 600px; border: none;">
                        <embed src="${fileData}" 
                               type="application/pdf" 
                               style="width: 100%; height: 600px; border: none;">
                        </embed>
                        <div style="padding: 40px; text-align: center;">
                            <i class="fas fa-file-pdf" style="font-size: 64px; color: #F5222D; margin-bottom: 20px;"></i>
                            <p style="color: var(--gray-600); margin-bottom: 10px;">Browser Anda tidak mendukung tampilan PDF.</p>
                            <p style="color: var(--gray-500); font-size: 14px;">Silakan download file untuk membukanya.</p>
                        </div>
                    </object>
                </div>
                <div style="text-align: center; margin-bottom: 15px;">
                    <button class="btn-info" onclick="window.open('${fileData}', '_blank')" style="margin-right: 10px;">
                        <i class="fas fa-external-link-alt"></i> Buka di Tab Baru
                    </button>
                </div>
            `;
        } else if (isImage) {
            // Tampilkan gambar
            contentHTML = `
                <div style="border: 1px solid var(--gray-300); border-radius: 8px; overflow: auto; margin-bottom: 20px; text-align: center; background: #f5f5f5; padding: 20px;">
                    <img src="${fileData}" 
                         style="max-width: 100%; max-height: 600px; border-radius: 4px;" 
                         alt="${fileName}">
                </div>
            `;
        } else {
            // File lainnya (DOC/DOCX, dll)
            contentHTML = `
                <div style="border: 1px solid var(--gray-300); border-radius: 8px; padding: 40px; margin-bottom: 20px; text-align: center; background: #f5f5f5;">
                    <i class="fas fa-file-word" style="font-size: 64px; color: #2B579A; margin-bottom: 20px;"></i>
                    <p style="color: var(--gray-600); margin-bottom: 10px;">File ini tidak dapat ditampilkan di browser.</p>
                    <p style="color: var(--gray-500); font-size: 14px;">Silakan download file untuk membukanya.</p>
                </div>
            `;
        }
        
        // Tampilkan file di modal
        const modal = createModal('Lihat File', `
            <div style="padding: 20px;">
                <h3 style="margin-bottom: 15px; text-align: center;">${arsip.nama}</h3>
                ${contentHTML}
                <div style="display: flex; gap: 10px; justify-content: center;">
                    ${isHTML ? `
                        <button class="btn-success" onclick="printSuratFromArsip(${arsipId})">
                            <i class="fas fa-print"></i> Cetak
                        </button>
                    ` : ''}
                    <button class="btn-primary" onclick="downloadFileArsip(${arsipId})">
                        <i class="fas fa-download"></i> Download
                    </button>
                    <button class="btn-secondary" onclick="closeModal()">
                        <i class="fas fa-times"></i> Tutup
                    </button>
                </div>
            </div>
        `, []);
        showModal(modal);
    } else {
        alert('File tidak ditemukan atau belum di-upload!');
    }
}

function downloadFileArsip(arsipId) {
    // Cari file di arsip digital
    const arsip = arsipDigital.find(a => a.id === arsipId);
    
    if (arsip && arsip.fileData) {
        const fileData = arsip.fileData;
        const fileName = arsip.file;
        const isHTML = fileName.toLowerCase().endsWith('.html');
        
        if (isHTML && arsip.isSuratGenerated) {
            // Download surat sebagai HTML
            const blob = new Blob([createFullHTMLDocument(fileData, arsip.nama)], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } else {
            // Download file menggunakan base64 data
            const link = document.createElement('a');
            link.href = fileData;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        
        // Tutup modal jika ada
        closeModal();
    } else {
        alert('File tidak ditemukan atau belum di-upload!');
    }
}

function createFullHTMLDocument(suratContent, title) {
    return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: 'Times New Roman', Times, serif;
            margin: 40px;
            line-height: 1.6;
        }
        .surat-preview {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            background: white;
        }
        .surat-kop {
            text-align: center;
            border-bottom: 3px solid #000;
            padding-bottom: 15px;
            margin-bottom: 30px;
        }
        .surat-kop h2 {
            margin: 5px 0;
            font-size: 16px;
            font-weight: bold;
        }
        .surat-kop p {
            margin: 3px 0;
            font-size: 12px;
        }
        .surat-nomor {
            text-align: center;
            margin-bottom: 30px;
        }
        .surat-nomor h3 {
            margin: 10px 0;
            font-size: 14px;
        }
        .surat-content {
            text-align: justify;
            margin-bottom: 40px;
        }
        .surat-content table {
            margin: 20px 0;
        }
        .surat-content td {
            padding: 5px;
            vertical-align: top;
        }
        .surat-ttd {
            margin-top: 40px;
            text-align: left;
            margin-left: 50%;
        }
        .surat-ttd p {
            margin: 5px 0;
        }
        @media print {
            body { margin: 0; }
            .surat-preview { padding: 20px; }
        }
    </style>
</head>
<body>
    ${suratContent}
</body>
</html>`;
}

function printSuratFromArsip(arsipId) {
    const arsip = arsipDigital.find(a => a.id === arsipId);
    if (arsip && arsip.fileData && arsip.isSuratGenerated) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(createFullHTMLDocument(arsip.fileData, arsip.nama));
        printWindow.document.close();
        printWindow.onload = function() {
            printWindow.print();
        };
    }
}

// Data Master Functions
function showModalPegawai(data = null) {
    const isEdit = data !== null;
    const modal = createModal('Tambah Data Pegawai', `
        <form id="formPegawai">
            <div class="form-group">
                <label>NIP *</label>
                <input type="text" class="form-control" id="nipPegawai" value="${isEdit ? data.nip : ''}" required>
            </div>
            <div class="form-group">
                <label>Nama *</label>
                <input type="text" class="form-control" id="namaPegawai" value="${isEdit ? data.nama : ''}" required>
            </div>
            <div class="form-group">
                <label>Jabatan *</label>
                <input type="text" class="form-control" id="jabatanPegawai" value="${isEdit ? data.jabatan : ''}" required>
            </div>
            <div class="form-group">
                <label>Pangkat/Golongan</label>
                <input type="text" class="form-control" id="pangkatPegawai" value="${isEdit && data.pangkat ? data.pangkat : ''}" placeholder="Contoh: Penata Muda / III/a">
            </div>
        </form>
    `, [
        { text: 'Batal', class: 'btn-secondary', onClick: closeModal },
        { text: 'Simpan', class: 'btn-primary', onClick: () => savePegawai(isEdit ? data.id : null) }
    ]);
    showModal(modal);
}

function savePegawai(id = null) {
    const nip = document.getElementById('nipPegawai').value;
    const nama = document.getElementById('namaPegawai').value;
    const jabatan = document.getElementById('jabatanPegawai').value;
    const pangkat = document.getElementById('pangkatPegawai').value;

    if (!nip || !nama || !jabatan) {
        alert('Mohon lengkapi semua field!');
        return;
    }

    const pegawaiData = { 
        id: id || Date.now(), 
        nip, 
        nama, 
        jabatan,
        pangkat: pangkat || '' 
    };

    if (id) {
        const index = dataPegawai.findIndex(p => p.id === id);
        if (index !== -1) dataPegawai[index] = pegawaiData;
    } else {
        dataPegawai.push(pegawaiData);
    }

    saveToLocalStorage();
    renderPegawai();
    updateDashboard();
    closeModal();
    alert('Data pegawai berhasil disimpan!');
}

function renderPegawai() {
    const tbody = document.getElementById('tablePegawai');
    if (dataPegawai.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data">Belum ada data pegawai</td></tr>';
        return;
    }

    tbody.innerHTML = dataPegawai.map((pegawai, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${pegawai.nip}</td>
            <td>${pegawai.nama}</td>
            <td>${pegawai.jabatan}</td>
            <td>${pegawai.pangkat || '-'}</td>
            <td>
                <button class="btn-sm btn-primary" onclick="showModalPegawai(${JSON.stringify(pegawai).replace(/"/g, '&quot;')})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-sm btn-danger" onclick="deletePegawai(${pegawai.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function deletePegawai(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data pegawai ini?')) {
        dataPegawai = dataPegawai.filter(p => p.id !== id);
        saveToLocalStorage();
        renderPegawai();
        updateDashboard();
    }
}

function showModalSiswa(data = null) {
    const isEdit = data !== null;
    const modal = createModal('Tambah Data Siswa', `
        <form id="formSiswa">
            <div class="form-group">
                <label>NISN *</label>
                <input type="text" class="form-control" id="nisnSiswa" value="${isEdit ? data.nisn : ''}" required>
            </div>
            <div class="form-group">
                <label>Nama *</label>
                <input type="text" class="form-control" id="namaSiswa" value="${isEdit ? data.nama : ''}" required>
            </div>
            <div class="form-group">
                <label>Kelas *</label>
                <input type="text" class="form-control" id="kelasSiswa" value="${isEdit ? data.kelas : ''}" required>
            </div>
        </form>
    `, [
        { text: 'Batal', class: 'btn-secondary', onClick: closeModal },
        { text: 'Simpan', class: 'btn-primary', onClick: () => saveSiswa(isEdit ? data.id : null) }
    ]);
    showModal(modal);
}

function saveSiswa(id = null) {
    const nisn = document.getElementById('nisnSiswa').value;
    const nama = document.getElementById('namaSiswa').value;
    const kelas = document.getElementById('kelasSiswa').value;

    if (!nisn || !nama || !kelas) {
        alert('Mohon lengkapi semua field!');
        return;
    }

    const siswaData = { id: id || Date.now(), nisn, nama, kelas };

    if (id) {
        const index = dataSiswa.findIndex(s => s.id === id);
        if (index !== -1) dataSiswa[index] = siswaData;
    } else {
        dataSiswa.push(siswaData);
    }

    saveToLocalStorage();
    renderSiswa();
    closeModal();
    alert('Data siswa berhasil disimpan!');
}

function renderSiswa() {
    const tbody = document.getElementById('tableSiswa');
    if (dataSiswa.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="no-data">Belum ada data siswa</td></tr>';
        return;
    }

    tbody.innerHTML = dataSiswa.map((siswa, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${siswa.nisn}</td>
            <td>${siswa.nama}</td>
            <td>${siswa.kelas}</td>
            <td>
                <button class="btn-sm btn-primary" onclick="showModalSiswa(${JSON.stringify(siswa).replace(/"/g, '&quot;')})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-sm btn-danger" onclick="deleteSiswa(${siswa.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function deleteSiswa(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data siswa ini?')) {
        dataSiswa = dataSiswa.filter(s => s.id !== id);
        saveToLocalStorage();
        renderSiswa();
    }
}

// Admin Management Functions
function showModalAdmin(data = null) {
    const isEdit = data !== null;
    const modal = createModal(isEdit ? 'Edit Data Admin' : 'Tambah Data Admin', `
        <form id="formAdmin">
            <div class="form-group">
                <label>Username *</label>
                <input type="text" class="form-control" id="usernameAdmin" value="${isEdit ? data.username : ''}" required ${isEdit ? 'readonly' : ''}>
                ${isEdit ? '<small class="text-muted">Username tidak dapat diubah</small>' : ''}
            </div>
            <div class="form-group">
                <label>Password ${isEdit ? '(Kosongkan jika tidak ingin mengubah)' : '*'}</label>
                <input type="password" class="form-control" id="passwordAdmin" ${isEdit ? '' : 'required'}>
            </div>
            <div class="form-group">
                <label>Konfirmasi Password ${isEdit ? '' : '*'}</label>
                <input type="password" class="form-control" id="passwordAdminConfirm" ${isEdit ? '' : 'required'}>
            </div>
            <div class="form-group">
                <label>Nama Lengkap *</label>
                <input type="text" class="form-control" id="namaAdmin" value="${isEdit ? data.nama : ''}" required>
            </div>
            <div class="form-group">
                <label>Role *</label>
                <select class="form-control" id="roleAdmin" required>
                    <option value="">-- Pilih Role --</option>
                    <option value="Super Admin" ${isEdit && data.role === 'Super Admin' ? 'selected' : ''}>Super Admin</option>
                    <option value="Admin" ${isEdit && data.role === 'Admin' ? 'selected' : ''}>Admin</option>
                    <option value="Operator" ${isEdit && data.role === 'Operator' ? 'selected' : ''}>Operator</option>
                </select>
            </div>
        </form>
    `, [
        { text: 'Batal', class: 'btn-secondary', onClick: closeModal },
        { text: 'Simpan', class: 'btn-primary', onClick: () => saveAdmin(isEdit ? data.id : null) }
    ]);
    showModal(modal);
}

async function saveAdmin(id = null) {
    const username = document.getElementById('usernameAdmin').value;
    const password = document.getElementById('passwordAdmin').value;
    const passwordConfirm = document.getElementById('passwordAdminConfirm').value;
    const nama = document.getElementById('namaAdmin').value;
    const role = document.getElementById('roleAdmin').value;

    if (!username || !nama || !role) {
        alert('Mohon lengkapi semua field yang wajib diisi!');
        return;
    }

    // Validasi password untuk admin baru
    if (!id && !password) {
        alert('Password wajib diisi untuk admin baru!');
        return;
    }

    // Validasi konfirmasi password
    if (password && password !== passwordConfirm) {
        alert('Password dan konfirmasi password tidak cocok!');
        return;
    }

    try {
        const adminData = { username, nama, role };
        
        if (id) {
            // Update existing admin
            if (password) {
                adminData.password = password;
            }
            await updateAdminDB(id, adminData);
            alert('Data admin berhasil diupdate!');
        } else {
            // Add new admin
            adminData.password = password;
            await saveAdminDB(adminData);
            alert('Data admin berhasil ditambahkan!');
        }

        await renderAdmin();
        closeModal();
    } catch (error) {
        console.error('Error saving admin:', error);
        alert('Gagal menyimpan data admin. Silakan coba lagi.');
    }
}

async function renderAdmin() {
    const tbody = document.getElementById('tableAdmin');
    
    try {
        const dataAdmin = await loadAdminDB();
        
        if (dataAdmin.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="no-data">Belum ada data admin</td></tr>';
            return;
        }

        tbody.innerHTML = dataAdmin.map((admin, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${admin.username}</td>
                <td>${admin.nama}</td>
                <td><span class="badge badge-primary">${admin.role}</span></td>
                <td>
                    <button class="btn-sm btn-primary" onclick='editAdmin(${JSON.stringify(admin).replace(/'/g, "&#39;")})'>
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-sm btn-danger" onclick="deleteAdmin(${admin.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error rendering admin:', error);
        tbody.innerHTML = '<tr><td colspan="5" class="no-data">Gagal memuat data admin</td></tr>';
    }
}

function editAdmin(data) {
    showModalAdmin(data);
}

async function deleteAdmin(id) {
    try {
        const dataAdmin = await loadAdminDB();
        
        // Prevent deleting the last admin
        if (dataAdmin.length <= 1) {
            alert('Tidak dapat menghapus admin terakhir! Harus ada minimal 1 admin.');
            return;
        }

        if (confirm('Apakah Anda yakin ingin menghapus data admin ini?')) {
            await deleteAdminDB(id);
            await renderAdmin();
            alert('Data admin berhasil dihapus!');
        }
    } catch (error) {
        console.error('Error deleting admin:', error);
        alert('Gagal menghapus data admin. Silakan coba lagi.');
    }
}

// Backup and Import Functions
async function backupAllData() {
    try {
        const loadingMsg = document.createElement('div');
        loadingMsg.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2); z-index: 10000; text-align: center;';
        loadingMsg.innerHTML = '<i class="fas fa-spinner fa-spin" style="font-size: 32px; color: var(--primary-color);"></i><p style="margin-top: 15px; font-weight: 600;">Memproses backup data...</p>';
        document.body.appendChild(loadingMsg);

        const allData = await loadAllDataDB();
        const dataAdmin = await loadAdminDB();
        
        const backupData = {
            metadata: {
                appName: 'e-TU Sekolah',
                version: '1.0',
                backupDate: new Date().toISOString(),
                backupDateReadable: new Date().toLocaleString('id-ID')
            },
            data: {
                ...allData,
                dataAdmin: dataAdmin
            }
        };

        const jsonString = JSON.stringify(backupData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        const dateStr = new Date().toISOString().split('T')[0];
        const timeStr = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
        a.download = `etu-sekolah-backup-${dateStr}-${timeStr}.json`;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        document.body.removeChild(loadingMsg);

        alert('✅ Backup berhasil!\n\nFile: ' + a.download);
        console.log('✅ Backup berhasil');
    } catch (error) {
        console.error('❌ Error backup data:', error);
        alert('❌ Gagal melakukan backup data.\n\nError: ' + error.message);
    }
}

function showImportDataModal() {
    const modal = createModal('Import Data', `
        <div style="padding: 20px 0;">
            <div class="alert alert-warning" style="background: #FFF3CD; border: 1px solid #FFE69C; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <i class="fas fa-exclamation-triangle" style="color: #856404;"></i>
                <strong>Peringatan:</strong>
                <ul style="margin: 10px 0 0 20px; color: #856404;">
                    <li>Import data akan <strong>mengganti semua data yang ada</strong></li>
                    <li>Pastikan Anda sudah melakukan backup data saat ini</li>
                    <li>Proses ini tidak dapat dibatalkan</li>
                </ul>
            </div>
            
            <div class="form-group">
                <label><i class="fas fa-file-upload"></i> Pilih File Backup (JSON)</label>
                <input type="file" id="importFileInput" accept=".json" class="form-control" style="padding: 10px;">
                <small class="text-muted">File harus berformat JSON dari hasil backup aplikasi ini</small>
            </div>

            <div id="importPreview" style="display: none; margin-top: 20px; padding: 15px; background: #F8F9FA; border-radius: 8px;">
                <h4 style="margin-top: 0;">Preview Data:</h4>
                <div id="importPreviewContent"></div>
            </div>
        </div>
    `, [
        { text: 'Batal', class: 'btn-secondary', onClick: closeModal },
        { text: 'Import Data', class: 'btn-danger', onClick: () => processImportData() }
    ]);
    
    showModal(modal);

    setTimeout(() => {
        const fileInput = document.getElementById('importFileInput');
        if (fileInput) {
            fileInput.onchange = (e) => previewImportData(e.target.files[0]);
        }
    }, 100);
}

function previewImportData(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            window.importDataBuffer = data;
            
            const preview = document.getElementById('importPreview');
            const content = document.getElementById('importPreviewContent');
            
            if (data.metadata && data.data) {
                let html = `
                    <p><strong>Nama Aplikasi:</strong> ${data.metadata.appName}</p>
                    <p><strong>Tanggal Backup:</strong> ${data.metadata.backupDateReadable}</p>
                    <hr>
                    <p><strong>Jumlah Data:</strong></p>
                    <ul>
                        <li>Surat Masuk: ${data.data.suratMasuk?.length || 0}</li>
                        <li>Surat Keluar: ${data.data.suratKeluar?.length || 0}</li>
                        <li>Arsip Digital: ${data.data.arsipDigital?.length || 0}</li>
                        <li>Data Pegawai: ${data.data.dataPegawai?.length || 0}</li>
                        <li>Data Siswa: ${data.data.dataSiswa?.length || 0}</li>
                        <li>Data Admin: ${data.data.dataAdmin?.length || 0}</li>
                    </ul>
                `;
                content.innerHTML = html;
                preview.style.display = 'block';
            } else {
                throw new Error('Format file tidak valid');
            }
        } catch (error) {
            alert('❌ File tidak valid!\n\nPastikan file adalah hasil backup dari aplikasi ini.');
            console.error('Error parsing file:', error);
        }
    };
    reader.readAsText(file);
}

async function processImportData() {
    if (!window.importDataBuffer) {
        alert('Silakan pilih file terlebih dahulu!');
        return;
    }

    if (!confirm('⚠️ PERINGATAN!\n\nImport data akan mengganti SEMUA data yang ada saat ini.\n\nApakah Anda yakin ingin melanjutkan?')) {
        return;
    }

    try {
        closeModal();
        
        const loadingMsg = document.createElement('div');
        loadingMsg.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2); z-index: 10000; text-align: center;';
        loadingMsg.innerHTML = '<i class="fas fa-spinner fa-spin" style="font-size: 32px; color: var(--primary-color);"></i><p style="margin-top: 15px; font-weight: 600;">Mengimport data...</p>';
        document.body.appendChild(loadingMsg);

        const data = window.importDataBuffer.data;

        // Clear all data first
        await clearAllDataDB();
        
        // Wait a bit to ensure clear is complete
        await new Promise(resolve => setTimeout(resolve, 500));

        // Import data using bulkPut to avoid ID conflicts
        if (data.suratMasuk && data.suratMasuk.length > 0) {
            // Remove id field to let database auto-generate
            const cleanData = data.suratMasuk.map(item => {
                const { id, ...rest } = item;
                return rest;
            });
            await db.suratMasuk.bulkAdd(cleanData);
        }
        if (data.suratKeluar && data.suratKeluar.length > 0) {
            const cleanData = data.suratKeluar.map(item => {
                const { id, ...rest } = item;
                return rest;
            });
            await db.suratKeluar.bulkAdd(cleanData);
        }
        if (data.arsipDigital && data.arsipDigital.length > 0) {
            const cleanData = data.arsipDigital.map(item => {
                const { id, ...rest } = item;
                return rest;
            });
            await db.arsipDigital.bulkAdd(cleanData);
        }
        if (data.dataPegawai && data.dataPegawai.length > 0) {
            const cleanData = data.dataPegawai.map(item => {
                const { id, ...rest } = item;
                return rest;
            });
            await db.dataPegawai.bulkAdd(cleanData);
        }
        if (data.dataSiswa && data.dataSiswa.length > 0) {
            const cleanData = data.dataSiswa.map(item => {
                const { id, ...rest } = item;
                return rest;
            });
            await db.dataSiswa.bulkAdd(cleanData);
        }
        if (data.dataAdmin && data.dataAdmin.length > 0) {
            const cleanData = data.dataAdmin.map(item => {
                const { id, ...rest } = item;
                return rest;
            });
            await db.dataAdmin.bulkAdd(cleanData);
        }
        if (data.dataSekolah) {
            await db.dataSekolah.put({ id: 1, ...data.dataSekolah });
        }

        document.body.removeChild(loadingMsg);
        
        alert('✅ Import berhasil!\n\nSemua data telah diimport.\n\nHalaman akan di-refresh.');
        
        window.importDataBuffer = null;
        location.reload();
    } catch (error) {
        console.error('❌ Error import data:', error);
        
        // Show more detailed error message
        let errorMsg = '❌ Gagal mengimport data.\n\n';
        if (error.message.includes('ConstraintError')) {
            errorMsg += 'Error: Data sudah ada di database.\n\nSolusi: Refresh halaman (F5) dan coba lagi.';
        } else {
            errorMsg += 'Error: ' + error.message;
        }
        
        alert(errorMsg);
        
        // Remove loading message if still exists
        const loadingMsg = document.querySelector('div[style*="position: fixed"]');
        if (loadingMsg) {
            document.body.removeChild(loadingMsg);
        }
    }
}

// Tab Functions
function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`tab${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`).classList.add('active');
    
    // Render data when switching tabs
    if (tabName === 'sekolah') renderDataSekolah();
    if (tabName === 'pegawai') renderPegawai();
    if (tabName === 'siswa') renderSiswa();
    if (tabName === 'nomor') renderNomorSurat();
    if (tabName === 'admin') renderAdmin();
}

// Search and Filter Functions
function setupSearchAndFilter() {
    // Surat Masuk - Search
    const searchSuratMasuk = document.getElementById('searchSuratMasuk');
    if (searchSuratMasuk) {
        searchSuratMasuk.oninput = (e) => {
            const filterBulan = document.getElementById('filterBulanMasuk').value;
            renderSuratMasuk(e.target.value, filterBulan);
        };
    }

    // Surat Masuk - Filter Bulan
    const filterBulanMasuk = document.getElementById('filterBulanMasuk');
    if (filterBulanMasuk) {
        filterBulanMasuk.onchange = (e) => {
            const search = document.getElementById('searchSuratMasuk').value;
            renderSuratMasuk(search, e.target.value);
        };
    }

    // Surat Masuk - Reset Filter
    const btnResetFilterMasuk = document.getElementById('btnResetFilterMasuk');
    if (btnResetFilterMasuk) {
        btnResetFilterMasuk.onclick = () => {
            document.getElementById('searchSuratMasuk').value = '';
            document.getElementById('filterBulanMasuk').value = '';
            renderSuratMasuk();
        };
    }

    // Surat Keluar - Search
    const searchSuratKeluar = document.getElementById('searchSuratKeluar');
    if (searchSuratKeluar) {
        searchSuratKeluar.oninput = (e) => {
            const filterBulan = document.getElementById('filterBulanKeluar').value;
            renderSuratKeluar(e.target.value, filterBulan);
        };
    }

    // Surat Keluar - Filter Bulan
    const filterBulanKeluar = document.getElementById('filterBulanKeluar');
    if (filterBulanKeluar) {
        filterBulanKeluar.onchange = (e) => {
            const search = document.getElementById('searchSuratKeluar').value;
            renderSuratKeluar(search, e.target.value);
        };
    }

    // Surat Keluar - Reset Filter
    const btnResetFilterKeluar = document.getElementById('btnResetFilterKeluar');
    if (btnResetFilterKeluar) {
        btnResetFilterKeluar.onclick = () => {
            document.getElementById('searchSuratKeluar').value = '';
            document.getElementById('filterBulanKeluar').value = '';
            renderSuratKeluar();
        };
    }

    // Arsip - Search
    const searchArsip = document.getElementById('searchArsip');
    if (searchArsip) {
        searchArsip.oninput = (e) => {
            const kategori = document.getElementById('filterKategori').value;
            renderArsip(e.target.value, kategori);
        };
    }

    // Arsip - Filter Kategori
    const filterKategori = document.getElementById('filterKategori');
    if (filterKategori) {
        filterKategori.onchange = (e) => {
            const search = document.getElementById('searchArsip').value;
            renderArsip(search, e.target.value);
        };
    }

    const btnSimpanNomor = document.getElementById('btnSimpanNomor');
    if (btnSimpanNomor) {
        btnSimpanNomor.onclick = () => {
            nomorSuratCounter = parseInt(document.getElementById('nomorTerakhir').value);
            saveToLocalStorage();
            alert('Pengaturan nomor surat berhasil disimpan!');
        };
    }

    // Update nomor terakhir display
    const nomorTerakhirInput = document.getElementById('nomorTerakhir');
    if (nomorTerakhirInput) {
        nomorTerakhirInput.value = nomorSuratCounter;
    }
}

// Modal Functions
function createModal(title, bodyHTML, buttons = []) {
    return {
        title,
        bodyHTML,
        buttons
    };
}

function showModal(modal) {
    const modalContainer = document.getElementById('modalContainer');
    
    const buttonsHTML = modal.buttons.map(btn => 
        `<button class="${btn.class}" onclick="modalButtonClick(${modal.buttons.indexOf(btn)})">${btn.text}</button>`
    ).join('');

    modalContainer.innerHTML = `
        <div class="modal-overlay">
            <div class="modal">
                <div class="modal-header">
                    <h3>${modal.title}</h3>
                    <button class="modal-close" onclick="closeModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${modal.bodyHTML}
                </div>
                <div class="modal-footer">
                    ${buttonsHTML}
                </div>
            </div>
        </div>
    `;

    window.currentModalButtons = modal.buttons;
}

function modalButtonClick(index) {
    if (window.currentModalButtons && window.currentModalButtons[index]) {
        window.currentModalButtons[index].onClick();
    }
}

function closeModal() {
    document.getElementById('modalContainer').innerHTML = '';
    window.currentModalButtons = null;
}

// Local Storage Functions
function saveToLocalStorage() {
    try {
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
        localStorage.setItem('eTUSekolahData', JSON.stringify(data));
        console.log('Data saved to localStorage successfully');
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        alert('Gagal menyimpan data. Storage mungkin penuh.');
    }
}

function loadFromLocalStorage() {
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
            console.log('Data loaded successfully. Last saved:', data.lastSaved);
        } else {
            console.log('No saved data found. Starting fresh.');
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        alert('Gagal memuat data tersimpan.');
    }
}

// Load all data into tables after login
function loadAllData() {
    renderSuratMasuk();
    renderSuratKeluar();
    renderArsip();
    renderDataSekolah();
    renderPegawai();
    renderSiswa();
    renderNomorSurat();
    
    // Update nomor terakhir display
    const nomorTerakhirInput = document.getElementById('nomorTerakhir');
    if (nomorTerakhirInput) {
        nomorTerakhirInput.value = nomorSuratCounter;
    }
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function generateNomorSurat() {
    const now = new Date();
    const bulan = toRoman(now.getMonth() + 1);
    const tahun = now.getFullYear();
    nomorSuratCounter++;
    const nomor = String(nomorSuratCounter).padStart(3, '0');
    return `${nomor}/TU/${bulan}/${tahun}`;
}

// Generate dropdown options untuk nomor surat dari Data Master
function getNomorSuratOptions() {
    let options = '<option value="">-- Pilih Nomor Surat --</option>';
    
    if (dataNomorSurat && dataNomorSurat.length > 0) {
        // Filter nomor surat yang belum digunakan
        const availableNomor = dataNomorSurat.filter(n => !n.isUsed);
        
        if (availableNomor.length > 0) {
            options += availableNomor.map(n => 
                `<option value="${n.nomorSurat}" data-id="${n.id}" data-jenis="${n.jenisSurat}">${n.nomorSurat} - ${n.jenisSurat}</option>`
            ).join('');
        } else {
            options += '<option value="" disabled>Semua nomor surat sudah digunakan</option>';
        }
    } else {
        options += '<option value="" disabled>Belum ada nomor surat di Data Master</option>';
    }
    
    options += '<option value="manual">Input Manual</option>';
    return options;
}

// Tandai nomor surat sebagai sudah digunakan
function markNomorSuratAsUsed(nomorSurat) {
    const nomor = dataNomorSurat.find(n => n.nomorSurat === nomorSurat);
    if (nomor) {
        nomor.isUsed = true;
        nomor.usedDate = new Date().toISOString();
        saveToLocalStorage();
    }
}

// Handle perubahan dropdown nomor surat
function handleNomorSuratChange(type) {
    const selectId = type === 'Keluar' ? 'selectNomorSuratKeluar' : 'selectNomorSuratMasuk';
    const manualGroupId = type === 'Keluar' ? 'manualNomorKeluarGroup' : 'manualNomorMasukGroup';
    
    const select = document.getElementById(selectId);
    const manualGroup = document.getElementById(manualGroupId);
    
    if (select && manualGroup) {
        if (select.value === 'manual') {
            manualGroup.style.display = 'block';
        } else {
            manualGroup.style.display = 'none';
        }
    }
}

function toRoman(num) {
    const romans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    return romans[num - 1] || num;
}

// File Management Functions
function viewFile(fileName) {
    // Cari file di surat masuk atau keluar
    let fileData = null;
    let surat = suratMasuk.find(s => s.file === fileName);
    if (!surat) {
        surat = suratKeluar.find(s => s.file === fileName);
    }
    
    if (surat && surat.fileData) {
        fileData = surat.fileData;
    }
    
    if (fileData) {
        const isPDF = fileName.toLowerCase().endsWith('.pdf');
        const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileName);
        
        let contentHTML = '';
        
        if (isPDF) {
            // Tampilkan PDF dengan object tag dan fallback
            contentHTML = `
                <div style="border: 1px solid var(--gray-300); border-radius: 8px; overflow: hidden; margin-bottom: 20px; background: #f5f5f5;">
                    <object data="${fileData}" 
                            type="application/pdf" 
                            style="width: 100%; height: 600px; border: none;">
                        <embed src="${fileData}" 
                               type="application/pdf" 
                               style="width: 100%; height: 600px; border: none;">
                        </embed>
                        <div style="padding: 40px; text-align: center;">
                            <i class="fas fa-file-pdf" style="font-size: 64px; color: #F5222D; margin-bottom: 20px;"></i>
                            <p style="color: var(--gray-600); margin-bottom: 10px;">Browser Anda tidak mendukung tampilan PDF.</p>
                            <p style="color: var(--gray-500); font-size: 14px;">Silakan download file untuk membukanya.</p>
                        </div>
                    </object>
                </div>
                <div style="text-align: center; margin-bottom: 15px;">
                    <button class="btn-info" onclick="window.open('${fileData}', '_blank')" style="margin-right: 10px;">
                        <i class="fas fa-external-link-alt"></i> Buka di Tab Baru
                    </button>
                </div>
            `;
        } else if (isImage) {
            // Tampilkan gambar
            contentHTML = `
                <div style="border: 1px solid var(--gray-300); border-radius: 8px; overflow: auto; margin-bottom: 20px; text-align: center; background: #f5f5f5; padding: 20px;">
                    <img src="${fileData}" 
                         style="max-width: 100%; max-height: 600px; border-radius: 4px;" 
                         alt="${fileName}">
                </div>
            `;
        } else {
            // File lainnya - tampilkan info dan tombol download
            contentHTML = `
                <div style="border: 1px solid var(--gray-300); border-radius: 8px; padding: 40px; margin-bottom: 20px; text-align: center; background: #f5f5f5;">
                    <i class="fas fa-file" style="font-size: 64px; color: var(--gray-400); margin-bottom: 20px;"></i>
                    <p style="color: var(--gray-600); margin-bottom: 10px;">File ini tidak dapat ditampilkan di browser.</p>
                    <p style="color: var(--gray-500); font-size: 14px;">Silakan download file untuk membukanya.</p>
                </div>
            `;
        }
        
        // Tampilkan modal dengan file
        const modal = createModal('Lihat File', `
            <div style="padding: 20px;">
                <h3 style="margin-bottom: 15px; text-align: center;">${fileName}</h3>
                ${contentHTML}
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button class="btn-primary" onclick="downloadFile('${fileName}')">
                        <i class="fas fa-download"></i> Download
                    </button>
                    <button class="btn-secondary" onclick="closeModal()">
                        <i class="fas fa-times"></i> Tutup
                    </button>
                </div>
            </div>
        `, []);
        showModal(modal);
    } else {
        alert('File tidak ditemukan atau belum di-upload!');
    }
}

function downloadFile(fileName) {
    // Cari file di surat masuk atau keluar
    let fileData = null;
    let surat = suratMasuk.find(s => s.file === fileName);
    if (!surat) {
        surat = suratKeluar.find(s => s.file === fileName);
    }
    
    if (surat && surat.fileData) {
        fileData = surat.fileData;
    }
    
    if (fileData) {
        // Download file menggunakan base64 data
        const link = document.createElement('a');
        link.href = fileData;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Tutup modal jika ada
        closeModal();
    } else {
        alert('File tidak ditemukan atau belum di-upload!');
    }
}

// Alternative: Jika ingin menyimpan file sebagai base64 di localStorage
function handleFileUpload(fileInput, callback) {
    const file = fileInput.files[0];
    if (!file) {
        callback(null);
        return;
    }
    
    // Check file size (max 5MB untuk localStorage)
    if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file terlalu besar! Maksimal 5MB.');
        callback(null);
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        callback({
            name: file.name,
            type: file.type,
            size: file.size,
            data: e.target.result // base64 data
        });
    };
    reader.onerror = function() {
        alert('Gagal membaca file!');
        callback(null);
    };
    reader.readAsDataURL(file);
}

// Nomor Surat Functions
function showModalNomorSurat(data = null) {
    const isEdit = data !== null;
    const modal = createModal(isEdit ? 'Edit Nomor Surat' : 'Tambah Nomor Surat', `
        <form id="formNomorSurat">
            <div class="form-group">
                <label>Nomor Surat *</label>
                <input type="text" class="form-control" id="nomorSuratInput" value="${isEdit ? data.nomorSurat : ''}" placeholder="Contoh: 001/TU/X/2024" required>
                <small>Masukkan nomor surat secara manual</small>
            </div>
            <div class="form-group">
                <label>Jenis Surat *</label>
                <select class="form-control" id="jenisSuratNomor" required>
                    <option value="">-- Pilih Jenis Surat --</option>
                    <option value="Keputusan" ${isEdit && data.jenisSurat === 'Keputusan' ? 'selected' : ''}>Keputusan</option>
                    <option value="Permohonan" ${isEdit && data.jenisSurat === 'Permohonan' ? 'selected' : ''}>Permohonan</option>
                    <option value="Kuasa" ${isEdit && data.jenisSurat === 'Kuasa' ? 'selected' : ''}>Kuasa</option>
                    <option value="Pengantar" ${isEdit && data.jenisSurat === 'Pengantar' ? 'selected' : ''}>Pengantar</option>
                    <option value="Perintah" ${isEdit && data.jenisSurat === 'Perintah' ? 'selected' : ''}>Perintah</option>
                    <option value="Edaran" ${isEdit && data.jenisSurat === 'Edaran' ? 'selected' : ''}>Edaran</option>
                    <option value="Rekomendasi" ${isEdit && data.jenisSurat === 'Rekomendasi' ? 'selected' : ''}>Rekomendasi</option>
                    <option value="Undangan" ${isEdit && data.jenisSurat === 'Undangan' ? 'selected' : ''}>Undangan</option>
                    <option value="Tugas" ${isEdit && data.jenisSurat === 'Tugas' ? 'selected' : ''}>Tugas</option>
                    <option value="Izin" ${isEdit && data.jenisSurat === 'Izin' ? 'selected' : ''}>Izin</option>
                    <option value="Keterangan" ${isEdit && data.jenisSurat === 'Keterangan' ? 'selected' : ''}>Keterangan</option>
                    <option value="Pemberitahuan" ${isEdit && data.jenisSurat === 'Pemberitahuan' ? 'selected' : ''}>Pemberitahuan</option>
                    <option value="Lainnya" ${isEdit && data.jenisSurat === 'Lainnya' ? 'selected' : ''}>Lainnya</option>
                </select>
            </div>
            <div class="form-group">
                <label>Tanggal Dibuat *</label>
                <input type="date" class="form-control" id="tanggalNomor" value="${isEdit ? data.tanggal : new Date().toISOString().split('T')[0]}" required>
            </div>
            <div class="form-group">
                <label>Keterangan</label>
                <textarea class="form-control" id="keteranganNomor" rows="3" placeholder="Keterangan tambahan (opsional)">${isEdit ? data.keterangan : ''}</textarea>
            </div>
        </form>
    `, [
        { text: 'Batal', class: 'btn-secondary', onClick: closeModal },
        { text: 'Simpan', class: 'btn-primary', onClick: () => saveNomorSurat(isEdit ? data.id : null) }
    ]);
    showModal(modal);
}

function saveNomorSurat(id = null) {
    const nomorSurat = document.getElementById('nomorSuratInput').value.trim();
    const jenisSurat = document.getElementById('jenisSuratNomor').value;
    const tanggal = document.getElementById('tanggalNomor').value;
    const keterangan = document.getElementById('keteranganNomor').value.trim();

    if (!nomorSurat || !jenisSurat || !tanggal) {
        alert('Mohon lengkapi semua field yang wajib diisi!');
        return;
    }

    // Check if nomor surat already exists (except when editing)
    const exists = dataNomorSurat.some(n => n.nomorSurat === nomorSurat && n.id !== id);
    if (exists) {
        alert('Nomor surat sudah digunakan! Silakan gunakan nomor yang berbeda.');
        return;
    }

    if (id) {
        // Edit existing nomor surat
        const index = dataNomorSurat.findIndex(n => n.id === id);
        if (index !== -1) {
            const existingData = dataNomorSurat[index];
            dataNomorSurat[index] = {
                ...existingData,
                nomorSurat,
                jenisSurat,
                tanggal,
                keterangan
            };
        }
    } else {
        // Add new nomor surat
        const nomorData = {
            id: Date.now(),
            nomorSurat,
            jenisSurat,
            tanggal,
            keterangan,
            isUsed: false
        };
        dataNomorSurat.push(nomorData);
    }

    saveToLocalStorage();
    renderNomorSurat();
    closeModal();
    alert('Nomor surat berhasil disimpan!');
}

function renderNomorSurat() {
    const tbody = document.getElementById('tableNomorSurat');
    
    if (!tbody) return;

    if (dataNomorSurat.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="no-data">Belum ada data nomor surat</td></tr>';
        return;
    }

    // Sort by date descending
    const sorted = [...dataNomorSurat].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

    tbody.innerHTML = sorted.map((nomor, index) => {
        const statusBadge = nomor.isUsed 
            ? '<span class="badge badge-danger">Sudah Digunakan</span>' 
            : '<span class="badge badge-success">Tersedia</span>';
        
        return `
        <tr ${nomor.isUsed ? 'style="opacity: 0.7;"' : ''}>
            <td>${index + 1}</td>
            <td><strong>${nomor.nomorSurat}</strong></td>
            <td><span class="badge badge-info">${nomor.jenisSurat}</span></td>
            <td>${formatDate(nomor.tanggal)}</td>
            <td>${statusBadge}</td>
            <td>${nomor.keterangan || '-'}</td>
            <td>
                <button class="btn-sm btn-primary" onclick="editNomorSurat(${nomor.id})" title="Edit" ${nomor.isUsed ? 'disabled' : ''}>
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-sm btn-danger" onclick="deleteNomorSurat(${nomor.id})" title="Hapus" ${nomor.isUsed ? 'disabled' : ''}>
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
        `;
    }).join('');
}

function editNomorSurat(id) {
    const nomor = dataNomorSurat.find(n => n.id === id);
    if (!nomor) {
        alert('Data nomor surat tidak ditemukan!');
        return;
    }
    
    // Jangan bisa edit jika sudah digunakan
    if (nomor.isUsed) {
        alert('Nomor surat yang sudah digunakan tidak dapat diedit!');
        return;
    }
    
    showModalNomorSurat(nomor);
}

function deleteNomorSurat(id) {
    const nomor = dataNomorSurat.find(n => n.id === id);
    
    // Jangan bisa hapus jika sudah digunakan
    if (nomor && nomor.isUsed) {
        alert('Nomor surat yang sudah digunakan tidak dapat dihapus!');
        return;
    }
    
    if (confirm('Apakah Anda yakin ingin menghapus nomor surat ini?')) {
        dataNomorSurat = dataNomorSurat.filter(n => n.id !== id);
        saveToLocalStorage();
        renderNomorSurat();
        alert('Nomor surat berhasil dihapus!');
    }
}

// Helper function untuk mengisi data pegawai dari dropdown
function fillPegawaiData() {
    const select = document.getElementById('selectPegawaiTugas');
    if (!select) return;
    
    const selectedOption = select.options[select.selectedIndex];
    if (selectedOption && selectedOption.value) {
        const nama = selectedOption.getAttribute('data-nama');
        const nip = selectedOption.getAttribute('data-nip');
        const jabatan = selectedOption.getAttribute('data-jabatan');
        const alamat = selectedOption.getAttribute('data-alamat');
        
        const namaInput = document.getElementById('namaPegawaiTugas');
        const nipInput = document.getElementById('nipTugas');
        const jabatanInput = document.getElementById('jabatanTugas');
        const alamatInput = document.getElementById('alamatTugas');
        
        if (namaInput) namaInput.value = nama || '';
        if (nipInput) nipInput.value = nip || '';
        if (jabatanInput) jabatanInput.value = jabatan || '';
        if (alamatInput) alamatInput.value = alamat || '';
    } else {
        // Clear fields if no selection
        const namaInput = document.getElementById('namaPegawaiTugas');
        const nipInput = document.getElementById('nipTugas');
        const jabatanInput = document.getElementById('jabatanTugas');
        const alamatInput = document.getElementById('alamatTugas');
        
        if (namaInput) namaInput.value = '';
        if (nipInput) nipInput.value = '';
        if (jabatanInput) jabatanInput.value = '';
        if (alamatInput) alamatInput.value = '';
    }
}

function fillPegawaiDataRekomendasi() {
    const select = document.getElementById('selectPegawaiRekomendasi');
    if (!select) return;
    
    const selectedOption = select.options[select.selectedIndex];
    if (selectedOption && selectedOption.value) {
        const nama = selectedOption.getAttribute('data-nama');
        const jabatan = selectedOption.getAttribute('data-jabatan');
        
        const namaInput = document.getElementById('namaRekomendasi');
        const statusInput = document.getElementById('statusRekomendasi');
        
        if (namaInput) namaInput.value = nama || '';
        if (statusInput) statusInput.value = jabatan || '';
    } else {
        // Clear fields if no selection
        const namaInput = document.getElementById('namaRekomendasi');
        const statusInput = document.getElementById('statusRekomendasi');
        
        if (namaInput) namaInput.value = '';
        if (statusInput) statusInput.value = '';
    }
}

function handleTipeIzinChange() {
    const tipe = document.getElementById('tipeIzin');
    if (!tipe) return;
    
    const formSiswa = document.getElementById('formSiswaIzin');
    const formGuru = document.getElementById('formGuruIzin');
    
    if (tipe.value === 'siswa') {
        if (formSiswa) formSiswa.style.display = 'block';
        if (formGuru) formGuru.style.display = 'none';
    } else if (tipe.value === 'guru') {
        if (formSiswa) formSiswa.style.display = 'none';
        if (formGuru) formGuru.style.display = 'block';
    } else {
        if (formSiswa) formSiswa.style.display = 'none';
        if (formGuru) formGuru.style.display = 'none';
    }
}

function fillSiswaDataIzin() {
    const select = document.getElementById('selectSiswaIzin');
    if (!select) return;
    
    const selectedOption = select.options[select.selectedIndex];
    if (selectedOption && selectedOption.value) {
        const nama = selectedOption.getAttribute('data-nama');
        const nisn = selectedOption.getAttribute('data-nisn');
        const kelas = selectedOption.getAttribute('data-kelas');
        
        const namaInput = document.getElementById('namaSiswaIzin');
        const nisnInput = document.getElementById('nisnIzin');
        const kelasInput = document.getElementById('kelasIzin');
        
        if (namaInput) namaInput.value = nama || '';
        if (nisnInput) nisnInput.value = nisn || '';
        if (kelasInput) kelasInput.value = kelas || '';
    } else {
        // Clear fields if no selection
        const namaInput = document.getElementById('namaSiswaIzin');
        const nisnInput = document.getElementById('nisnIzin');
        const kelasInput = document.getElementById('kelasIzin');
        
        if (namaInput) namaInput.value = '';
        if (nisnInput) nisnInput.value = '';
        if (kelasInput) kelasInput.value = '';
    }
}

function fillGuruDataIzin() {
    const select = document.getElementById('selectGuruIzin');
    if (!select) return;
    
    const selectedOption = select.options[select.selectedIndex];
    if (selectedOption && selectedOption.value) {
        const nama = selectedOption.getAttribute('data-nama');
        const nip = selectedOption.getAttribute('data-nip');
        const jabatan = selectedOption.getAttribute('data-jabatan');
        
        const namaInput = document.getElementById('namaGuruIzin');
        const nipInput = document.getElementById('nipIzin');
        const jabatanInput = document.getElementById('jabatanIzin');
        
        if (namaInput) namaInput.value = nama || '';
        if (nipInput) nipInput.value = nip || '';
        if (jabatanInput) jabatanInput.value = jabatan || '';
    } else {
        // Clear fields if no selection
        const namaInput = document.getElementById('namaGuruIzin');
        const nipInput = document.getElementById('nipIzin');
        const jabatanInput = document.getElementById('jabatanIzin');
        
        if (namaInput) namaInput.value = '';
        if (nipInput) nipInput.value = '';
        if (jabatanInput) jabatanInput.value = '';
    }
}

// Data Sekolah Functions
function showModalDataSekolah() {
    const modal = createModal('Edit Data Sekolah', `
        <form id="formDataSekolah">
            <div class="form-group">
                <label>Logo Sekolah 1 (Kiri - untuk Kop Surat)</label>
                <input type="file" class="form-control" id="logoSekolahInput" accept="image/png,image/jpeg,image/jpg">
                <small style="color: var(--gray-600);">
                    <i class="fas fa-info-circle"></i> Format: PNG, JPG, JPEG | Max: 500KB | Rekomendasi: 150x150px
                </small>
                ${dataSekolah.logo ? `
                    <div style="margin-top: 10px;">
                        <img src="${dataSekolah.logo}" alt="Logo 1" style="max-width: 100px; max-height: 100px; border: 1px solid var(--gray-300); border-radius: 4px; padding: 5px;">
                        <button type="button" class="btn-sm btn-danger" onclick="removeLogo('logo')" style="margin-left: 10px;">
                            <i class="fas fa-trash"></i> Hapus Logo 1
                        </button>
                    </div>
                ` : ''}
            </div>
            <div class="form-group">
                <label>Logo Sekolah 2 (Kanan - Opsional)</label>
                <input type="file" class="form-control" id="logoSekolahInput2" accept="image/png,image/jpeg,image/jpg">
                <small style="color: var(--gray-600);">
                    <i class="fas fa-info-circle"></i> Logo tambahan (contoh: Logo Daerah/Yayasan) | Max: 500KB
                </small>
                ${dataSekolah.logo2 ? `
                    <div style="margin-top: 10px;">
                        <img src="${dataSekolah.logo2}" alt="Logo 2" style="max-width: 100px; max-height: 100px; border: 1px solid var(--gray-300); border-radius: 4px; padding: 5px;">
                        <button type="button" class="btn-sm btn-danger" onclick="removeLogo('logo2')" style="margin-left: 10px;">
                            <i class="fas fa-trash"></i> Hapus Logo 2
                        </button>
                    </div>
                ` : ''}
            </div>
            <div class="form-group">
                <label>Nama Sekolah *</label>
                <input type="text" class="form-control" id="namaSekolahInput" value="${dataSekolah.namaSekolah}" placeholder="Contoh: SMA Negeri 1 Jakarta" required>
            </div>
            <div class="form-group">
                <label>NPSN *</label>
                <input type="text" class="form-control" id="npsnInput" value="${dataSekolah.npsn}" placeholder="Nomor Pokok Sekolah Nasional" required>
            </div>
            <div class="form-group">
                <label>Alamat *</label>
                <textarea class="form-control" id="alamatInput" rows="2" placeholder="Alamat lengkap sekolah" required>${dataSekolah.alamat}</textarea>
            </div>
            <div class="form-group">
                <label>Kota/Kabupaten *</label>
                <input type="text" class="form-control" id="kotaInput" value="${dataSekolah.kota}" placeholder="Contoh: Jakarta Selatan" required>
            </div>
            <div class="form-group">
                <label>Provinsi *</label>
                <input type="text" class="form-control" id="provinsiInput" value="${dataSekolah.provinsi}" placeholder="Contoh: DKI Jakarta" required>
            </div>
            <div class="form-group">
                <label>Kode Pos</label>
                <input type="text" class="form-control" id="kodePosInput" value="${dataSekolah.kodePos}" placeholder="Contoh: 12345">
            </div>
            <div class="form-group">
                <label>Telepon *</label>
                <input type="text" class="form-control" id="teleponInput" value="${dataSekolah.telepon}" placeholder="Contoh: (021) 12345678" required>
            </div>
            <div class="form-group">
                <label>Email *</label>
                <input type="email" class="form-control" id="emailInput" value="${dataSekolah.email}" placeholder="Contoh: info@sekolah.sch.id" required>
            </div>
            <div class="form-group">
                <label>Website</label>
                <input type="text" class="form-control" id="websiteInput" value="${dataSekolah.website}" placeholder="Contoh: www.sekolah.sch.id">
            </div>
            <div class="form-group">
                <label>Nama Kepala Sekolah *</label>
                <input type="text" class="form-control" id="kepalaSekolahInput" value="${dataSekolah.kepalaSekolah}" placeholder="Nama lengkap Kepala Sekolah" required>
            </div>
            <div class="form-group">
                <label>NIP Kepala Sekolah *</label>
                <input type="text" class="form-control" id="nipKepsekInput" value="${dataSekolah.nipKepsek}" placeholder="NIP Kepala Sekolah" required>
            </div>
        </form>
    `, [
        { text: 'Batal', class: 'btn-secondary', onClick: closeModal },
        { text: 'Simpan', class: 'btn-primary', onClick: saveDataSekolah }
    ]);
    showModal(modal);
}

function saveDataSekolah() {
    const namaSekolah = document.getElementById('namaSekolahInput').value.trim();
    const npsn = document.getElementById('npsnInput').value.trim();
    const alamat = document.getElementById('alamatInput').value.trim();
    const kota = document.getElementById('kotaInput').value.trim();
    const provinsi = document.getElementById('provinsiInput').value.trim();
    const kodePos = document.getElementById('kodePosInput').value.trim();
    const telepon = document.getElementById('teleponInput').value.trim();
    const email = document.getElementById('emailInput').value.trim();
    const website = document.getElementById('websiteInput').value.trim();
    const kepalaSekolah = document.getElementById('kepalaSekolahInput').value.trim();
    const nipKepsek = document.getElementById('nipKepsekInput').value.trim();
    const logoInput = document.getElementById('logoSekolahInput');
    const logoInput2 = document.getElementById('logoSekolahInput2');

    if (!namaSekolah || !npsn || !alamat || !kota || !provinsi || !telepon || !email || !kepalaSekolah || !nipKepsek) {
        alert('Mohon lengkapi semua field yang wajib diisi!');
        return;
    }

    // Check if any logo needs to be uploaded
    const hasLogo1 = logoInput.files && logoInput.files[0];
    const hasLogo2 = logoInput2.files && logoInput2.files[0];

    // Validate logos if present
    if (hasLogo1) {
        const file = logoInput.files[0];
        if (file.size > 500 * 1024) {
            alert('Ukuran Logo 1 terlalu besar! Maksimal 500KB.');
            return;
        }
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            alert('Format Logo 1 tidak valid! Gunakan PNG, JPG, atau JPEG.');
            return;
        }
    }

    if (hasLogo2) {
        const file = logoInput2.files[0];
        if (file.size > 500 * 1024) {
            alert('Ukuran Logo 2 terlalu besar! Maksimal 500KB.');
            return;
        }
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            alert('Format Logo 2 tidak valid! Gunakan PNG, JPG, atau JPEG.');
            return;
        }
    }

    // Function to save data
    const saveData = (logo1Data, logo2Data) => {
        dataSekolah = {
            namaSekolah,
            npsn,
            alamat,
            kota,
            provinsi,
            kodePos,
            telepon,
            email,
            website,
            kepalaSekolah,
            nipKepsek,
            logo: logo1Data || dataSekolah.logo || null,
            logo2: logo2Data || dataSekolah.logo2 || null
        };
        
        saveToLocalStorage();
        renderDataSekolah();
        closeModal();
        alert('Data sekolah berhasil disimpan!');
    };

    // Handle logo uploads
    if (hasLogo1 && hasLogo2) {
        // Upload both logos
        const reader1 = new FileReader();
        const reader2 = new FileReader();
        let logo1Data = null;
        let logo2Data = null;
        
        reader1.onload = function(e) {
            logo1Data = e.target.result;
            if (logo2Data !== null) {
                saveData(logo1Data, logo2Data);
            }
        };
        
        reader2.onload = function(e) {
            logo2Data = e.target.result;
            if (logo1Data !== null) {
                saveData(logo1Data, logo2Data);
            }
        };
        
        reader1.readAsDataURL(logoInput.files[0]);
        reader2.readAsDataURL(logoInput2.files[0]);
    } else if (hasLogo1) {
        // Upload only logo 1
        const reader = new FileReader();
        reader.onload = function(e) {
            saveData(e.target.result, null);
        };
        reader.readAsDataURL(logoInput.files[0]);
    } else if (hasLogo2) {
        // Upload only logo 2
        const reader = new FileReader();
        reader.onload = function(e) {
            saveData(null, e.target.result);
        };
        reader.readAsDataURL(logoInput2.files[0]);
    } else {
        // No new logos uploaded
        saveData(null, null);
    }
}

// Function to remove logo
function removeLogo(logoType) {
    const logoName = logoType === 'logo' ? 'Logo 1' : 'Logo 2';
    if (confirm(`Apakah Anda yakin ingin menghapus ${logoName}?`)) {
        if (logoType === 'logo') {
            dataSekolah.logo = null;
        } else {
            dataSekolah.logo2 = null;
        }
        saveToLocalStorage();
        closeModal();
        showModalDataSekolah();
        alert(`${logoName} berhasil dihapus!`);
    }
}

function renderDataSekolah() {
    // Display logo 1 if exists
    const logoRow = document.getElementById('logoRow');
    const displayLogo = document.getElementById('displayLogo');
    if (dataSekolah.logo) {
        displayLogo.src = dataSekolah.logo;
        logoRow.style.display = 'flex';
    } else {
        logoRow.style.display = 'none';
    }
    
    // Display logo 2 if exists
    const logoRow2 = document.getElementById('logoRow2');
    const displayLogo2 = document.getElementById('displayLogo2');
    if (dataSekolah.logo2) {
        displayLogo2.src = dataSekolah.logo2;
        logoRow2.style.display = 'flex';
    } else {
        logoRow2.style.display = 'none';
    }
    
    document.getElementById('displayNamaSekolah').textContent = dataSekolah.namaSekolah || '-';
    document.getElementById('displayNPSN').textContent = dataSekolah.npsn || '-';
    document.getElementById('displayAlamat').textContent = dataSekolah.alamat || '-';
    document.getElementById('displayKota').textContent = dataSekolah.kota || '-';
    document.getElementById('displayProvinsi').textContent = dataSekolah.provinsi || '-';
    document.getElementById('displayKodePos').textContent = dataSekolah.kodePos || '-';
    document.getElementById('displayTelepon').textContent = dataSekolah.telepon || '-';
    document.getElementById('displayEmail').textContent = dataSekolah.email || '-';
    document.getElementById('displayWebsite').textContent = dataSekolah.website || '-';
    document.getElementById('displayKepalaSekolah').textContent = dataSekolah.kepalaSekolah || '-';
    document.getElementById('displayNIPKepsek').textContent = dataSekolah.nipKepsek || '-';
}
