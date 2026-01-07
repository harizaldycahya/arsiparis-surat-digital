// ============================================
// LAPORAN MODULE - Arsiparis Surat Digital
// ============================================

// Initialize Laporan Module
function initializeLaporan() {
    // Event Listeners
    const btnTampilkanLaporan = document.getElementById('btnTampilkanLaporan');
    const btnResetLaporan = document.getElementById('btnResetLaporan');
    const btnCetakLaporan = document.getElementById('btnCetakLaporan');
    const btnExportExcel = document.getElementById('btnExportExcel');
    const btnExportPDF = document.getElementById('btnExportPDF');
    const filterJenisLaporan = document.getElementById('filterJenisLaporan');
    const searchLaporan = document.getElementById('searchLaporan');

    if (btnTampilkanLaporan) {
        btnTampilkanLaporan.addEventListener('click', generateLaporan);
    }
    if (btnResetLaporan) {
        btnResetLaporan.addEventListener('click', resetLaporan);
    }
    if (btnCetakLaporan) {
        btnCetakLaporan.addEventListener('click', cetakLaporan);
    }
    if (btnExportExcel) {
        btnExportExcel.addEventListener('click', exportToExcel);
    }
    if (btnExportPDF) {
        btnExportPDF.addEventListener('click', exportToPDF);
    }
    if (searchLaporan) {
        searchLaporan.addEventListener('input', filterLaporanTable);
    }

    // Chart tabs
    const chartTabs = document.querySelectorAll('.chart-tab-btn');
    chartTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            chartTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const chartType = this.getAttribute('data-chart');
            updateChartType(chartType);
        });
    });
}

// Generate Laporan
function generateLaporan() {
    const jenisLaporan = document.getElementById('filterJenisLaporan').value;
    const periodeDari = document.getElementById('filterPeriodeDari').value;
    const periodeSampai = document.getElementById('filterPeriodeSampai').value;

    if (!jenisLaporan) {
        showNotification('Pilih jenis laporan terlebih dahulu', 'warning');
        return;
    }

    // Hide empty state
    document.getElementById('laporanEmpty').style.display = 'none';

    // Show statistics
    document.getElementById('laporanStatistik').style.display = 'grid';

    // Generate based on type
    switch(jenisLaporan) {
        case 'surat-masuk':
            generateLaporanSuratMasuk(periodeDari, periodeSampai);
            break;
        case 'surat-keluar':
            generateLaporanSuratKeluar(periodeDari, periodeSampai);
            break;
        case 'arsip':
            generateLaporanArsip(periodeDari, periodeSampai);
            break;
        case 'rekapitulasi':
            generateLaporanRekapitulasi(periodeDari, periodeSampai);
            break;
        case 'statistik':
            generateLaporanStatistik(periodeDari, periodeSampai);
            break;
    }

    showNotification('Laporan berhasil ditampilkan', 'success');
}

// Generate Laporan Surat Masuk
function generateLaporanSuratMasuk(dari, sampai) {
    let data = [...suratMasuk];

    // Filter by period
    if (dari && sampai) {
        data = data.filter(item => {
            const itemDate = new Date(item.tanggal);
            const dariDate = new Date(dari + '-01');
            const sampaiDate = new Date(sampai + '-01');
            sampaiDate.setMonth(sampaiDate.getMonth() + 1);
            return itemDate >= dariDate && itemDate < sampaiDate;
        });
    }

    // Update statistics
    updateStatisticsCards(data.length, 0, 0, dari, sampai);

    // Show table
    renderLaporanTable(data, 'Laporan Surat Masuk', 'surat-masuk');

    // Show chart
    renderLaporanChart(data, 'surat-masuk');
}

// Generate Laporan Surat Keluar
function generateLaporanSuratKeluar(dari, sampai) {
    let data = [...suratKeluar];

    // Filter by period
    if (dari && sampai) {
        data = data.filter(item => {
            const itemDate = new Date(item.tanggal);
            const dariDate = new Date(dari + '-01');
            const sampaiDate = new Date(sampai + '-01');
            sampaiDate.setMonth(sampaiDate.getMonth() + 1);
            return itemDate >= dariDate && itemDate < sampaiDate;
        });
    }

    // Update statistics
    updateStatisticsCards(0, data.length, 0, dari, sampai);

    // Show table
    renderLaporanTable(data, 'Laporan Surat Keluar', 'surat-keluar');

    // Show chart
    renderLaporanChart(data, 'surat-keluar');
}

// Generate Laporan Arsip
function generateLaporanArsip(dari, sampai) {
    let data = [...arsipDigital];

    // Filter by period
    if (dari && sampai) {
        data = data.filter(item => {
            const itemDate = new Date(item.tanggalUpload);
            const dariDate = new Date(dari + '-01');
            const sampaiDate = new Date(sampai + '-01');
            sampaiDate.setMonth(sampaiDate.getMonth() + 1);
            return itemDate >= dariDate && itemDate < sampaiDate;
        });
    }

    // Update statistics
    updateStatisticsCards(0, 0, data.length, dari, sampai);

    // Show table
    renderLaporanTable(data, 'Laporan Arsip Digital', 'arsip');

    // Show chart
    renderLaporanChart(data, 'arsip');
}

// Generate Laporan Rekapitulasi
function generateLaporanRekapitulasi(dari, sampai) {
    let dataMasuk = [...suratMasuk];
    let dataKeluar = [...suratKeluar];
    let dataArsip = [...arsipDigital];

    // Filter by period
    if (dari && sampai) {
        const dariDate = new Date(dari + '-01');
        const sampaiDate = new Date(sampai + '-01');
        sampaiDate.setMonth(sampaiDate.getMonth() + 1);

        dataMasuk = dataMasuk.filter(item => {
            const itemDate = new Date(item.tanggal);
            return itemDate >= dariDate && itemDate < sampaiDate;
        });

        dataKeluar = dataKeluar.filter(item => {
            const itemDate = new Date(item.tanggal);
            return itemDate >= dariDate && itemDate < sampaiDate;
        });

        dataArsip = dataArsip.filter(item => {
            const itemDate = new Date(item.tanggalUpload);
            return itemDate >= dariDate && itemDate < sampaiDate;
        });
    }

    // Update statistics
    updateStatisticsCards(dataMasuk.length, dataKeluar.length, dataArsip.length, dari, sampai);

    // Combine data for table
    const combinedData = [
        ...dataMasuk.map(item => ({...item, jenis: 'Surat Masuk'})),
        ...dataKeluar.map(item => ({...item, jenis: 'Surat Keluar'})),
        ...dataArsip.map(item => ({...item, jenis: 'Arsip Digital'}))
    ];

    // Show table
    renderLaporanTable(combinedData, 'Rekapitulasi Bulanan', 'rekapitulasi');

    // Show chart
    renderRekapitulasiChart(dataMasuk.length, dataKeluar.length, dataArsip.length);
}

// Generate Laporan Statistik
function generateLaporanStatistik(dari, sampai) {
    // Similar to rekapitulasi but with more detailed analysis
    generateLaporanRekapitulasi(dari, sampai);
}

// Update Statistics Cards
function updateStatisticsCards(masuk, keluar, arsip, dari, sampai) {
    const total = masuk + keluar + arsip;
    const periode = dari && sampai ? `${formatMonth(dari)} - ${formatMonth(sampai)}` : 'Semua Periode';

    document.getElementById('statLaporanMasuk').textContent = masuk;
    document.getElementById('periodeMasuk').textContent = periode;

    document.getElementById('statLaporanKeluar').textContent = keluar;
    document.getElementById('periodeKeluar').textContent = periode;

    document.getElementById('statLaporanArsip').textContent = arsip;
    document.getElementById('periodeArsip').textContent = periode;

    document.getElementById('statLaporanTotal').textContent = total;
    document.getElementById('periodeTotal').textContent = periode;
}

// Render Laporan Table
function renderLaporanTable(data, title, type) {
    document.getElementById('laporanTableTitle').textContent = title;
    document.getElementById('laporanTable').style.display = 'block';

    const tbody = document.getElementById('laporanTableBody');
    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="no-data">Tidak ada data untuk periode ini</td></tr>';
        document.getElementById('laporanShowingCount').textContent = '0';
        document.getElementById('laporanTotalCount').textContent = '0';
        return;
    }

    data.forEach((item, index) => {
        const row = document.createElement('tr');
        
        if (type === 'surat-masuk') {
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${formatDate(item.tanggal)}</td>
                <td>${item.nomorSurat || '-'}</td>
                <td>${item.perihal || '-'}</td>
                <td><span class="badge badge-success">Masuk</span></td>
            `;
        } else if (type === 'surat-keluar') {
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${formatDate(item.tanggal)}</td>
                <td>${item.nomorSurat || '-'}</td>
                <td>${item.perihal || '-'}</td>
                <td><span class="badge badge-primary">Keluar</span></td>
            `;
        } else if (type === 'arsip') {
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${formatDate(item.tanggalUpload)}</td>
                <td>${item.nomorDokumen || '-'}</td>
                <td>${item.namaDokumen || '-'}</td>
                <td><span class="badge badge-warning">Arsip</span></td>
            `;
        } else if (type === 'rekapitulasi') {
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${formatDate(item.tanggal || item.tanggalUpload)}</td>
                <td>${item.nomorSurat || item.nomorDokumen || '-'}</td>
                <td>${item.perihal || item.namaDokumen || '-'}</td>
                <td><span class="badge ${getBadgeClass(item.jenis)}">${item.jenis}</span></td>
            `;
        }

        tbody.appendChild(row);
    });

    document.getElementById('laporanShowingCount').textContent = data.length;
    document.getElementById('laporanTotalCount').textContent = data.length;
}

// Render Laporan Chart
let currentChart = null;

function renderLaporanChart(data, type) {
    document.getElementById('laporanChart').style.display = 'block';

    // Group data by month
    const monthlyData = groupByMonth(data, type);
    
    renderChart(monthlyData, 'bar');
}

function renderRekapitulasiChart(masuk, keluar, arsip) {
    document.getElementById('laporanChart').style.display = 'block';

    const chartData = {
        labels: ['Surat Masuk', 'Surat Keluar', 'Arsip Digital'],
        values: [masuk, keluar, arsip]
    };

    renderChart(chartData, 'bar');
}

function renderChart(data, chartType) {
    const canvas = document.getElementById('laporanChartElement');
    const ctx = canvas.getContext('2d');

    // Destroy previous chart
    if (currentChart) {
        currentChart.destroy();
    }

    // Simple chart rendering (you can integrate Chart.js library for better charts)
    // For now, we'll create a basic visualization
    drawSimpleChart(ctx, data, chartType);
}

function drawSimpleChart(ctx, data, type) {
    const canvas = ctx.canvas;
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = 400;

    ctx.clearRect(0, 0, width, height);

    if (!data.labels || data.labels.length === 0) {
        ctx.fillStyle = '#999';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Tidak ada data untuk ditampilkan', width / 2, height / 2);
        return;
    }

    const maxValue = Math.max(...data.values);
    const barWidth = (width - 100) / data.labels.length;
    const colors = ['#3498db', '#2ecc71', '#f39c12', '#e74c3c', '#9b59b6'];

    if (type === 'bar') {
        data.labels.forEach((label, index) => {
            const value = data.values[index];
            const barHeight = (value / maxValue) * (height - 100);
            const x = 50 + index * barWidth;
            const y = height - 50 - barHeight;

            // Draw bar
            ctx.fillStyle = colors[index % colors.length];
            ctx.fillRect(x + 10, y, barWidth - 20, barHeight);

            // Draw value
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(value, x + barWidth / 2, y - 5);

            // Draw label
            ctx.save();
            ctx.translate(x + barWidth / 2, height - 30);
            ctx.rotate(-Math.PI / 4);
            ctx.textAlign = 'right';
            ctx.fillText(label, 0, 0);
            ctx.restore();
        });
    } else if (type === 'pie') {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 3;
        const total = data.values.reduce((a, b) => a + b, 0);
        let currentAngle = -Math.PI / 2;

        data.labels.forEach((label, index) => {
            const value = data.values[index];
            const sliceAngle = (value / total) * 2 * Math.PI;

            // Draw slice
            ctx.beginPath();
            ctx.fillStyle = colors[index % colors.length];
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fill();

            // Draw label
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius + 30);
            const labelY = centerY + Math.sin(labelAngle) * (radius + 30);
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${label}: ${value}`, labelX, labelY);

            currentAngle += sliceAngle;
        });
    } else if (type === 'line') {
        const points = [];
        data.labels.forEach((label, index) => {
            const value = data.values[index];
            const x = 50 + index * barWidth;
            const y = height - 50 - (value / maxValue) * (height - 100);
            points.push({x, y, value});
        });

        // Draw line
        ctx.beginPath();
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 2;
        points.forEach((point, index) => {
            if (index === 0) {
                ctx.moveTo(point.x + barWidth / 2, point.y);
            } else {
                ctx.lineTo(point.x + barWidth / 2, point.y);
            }
        });
        ctx.stroke();

        // Draw points and values
        points.forEach((point, index) => {
            ctx.beginPath();
            ctx.fillStyle = '#3498db';
            ctx.arc(point.x + barWidth / 2, point.y, 5, 0, 2 * Math.PI);
            ctx.fill();

            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(point.value, point.x + barWidth / 2, point.y - 10);

            // Draw label
            ctx.save();
            ctx.translate(point.x + barWidth / 2, height - 30);
            ctx.rotate(-Math.PI / 4);
            ctx.textAlign = 'right';
            ctx.fillText(data.labels[index], 0, 0);
            ctx.restore();
        });
    }
}

function updateChartType(type) {
    const jenisLaporan = document.getElementById('filterJenisLaporan').value;
    if (!jenisLaporan) return;

    // Re-render chart with new type
    const canvas = document.getElementById('laporanChartElement');
    const ctx = canvas.getContext('2d');
    
    // Get current data from the chart
    // For simplicity, regenerate the report
    generateLaporan();
}

// Group data by month
function groupByMonth(data, type) {
    const monthlyCount = {};

    data.forEach(item => {
        const date = new Date(item.tanggal || item.tanggalUpload);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyCount[monthKey] = (monthlyCount[monthKey] || 0) + 1;
    });

    const labels = Object.keys(monthlyCount).sort().map(key => formatMonth(key));
    const values = Object.keys(monthlyCount).sort().map(key => monthlyCount[key]);

    return { labels, values };
}

// Filter Laporan Table
function filterLaporanTable() {
    const searchTerm = document.getElementById('searchLaporan').value.toLowerCase();
    const rows = document.querySelectorAll('#laporanTableBody tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Reset Laporan
function resetLaporan() {
    document.getElementById('filterJenisLaporan').value = '';
    document.getElementById('filterPeriodeDari').value = '';
    document.getElementById('filterPeriodeSampai').value = '';
    document.getElementById('searchLaporan').value = '';

    // Hide all sections
    document.getElementById('laporanStatistik').style.display = 'none';
    document.getElementById('laporanChart').style.display = 'none';
    document.getElementById('laporanTable').style.display = 'none';

    // Show empty state
    document.getElementById('laporanEmpty').style.display = 'flex';

    showNotification('Filter laporan telah direset', 'info');
}

// Cetak Laporan
function cetakLaporan() {
    const jenisLaporan = document.getElementById('filterJenisLaporan').value;
    if (!jenisLaporan) {
        showNotification('Pilih jenis laporan terlebih dahulu', 'warning');
        return;
    }

    // Update print header before printing
    updatePrintHeader();

    // Show print header
    const printHeader = document.getElementById('printHeader');
    if (printHeader) {
        printHeader.style.display = 'block';
    }

    // Print
    window.print();

    // Hide print header after printing
    setTimeout(() => {
        if (printHeader) {
            printHeader.style.display = 'none';
        }
    }, 100);
}

// Update Print Header with current report data
function updatePrintHeader() {
    const periodeDari = document.getElementById('filterPeriodeDari').value;
    const periodeSampai = document.getElementById('filterPeriodeSampai').value;
    
    const printYear = document.getElementById('printYear');
    const printPeriod = document.getElementById('printPeriod');

    if (periodeDari && periodeSampai) {
        // Extract year from period
        const tahunDari = periodeDari.split('-')[0];
        const tahunSampai = periodeSampai.split('-')[0];
        const tahunText = tahunDari === tahunSampai ? `TAHUN ${tahunDari}` : `TAHUN ${tahunDari} - ${tahunSampai}`;
        
        printYear.textContent = tahunText;
        printPeriod.textContent = `Periode: ${formatMonth(periodeDari)} s/d ${formatMonth(periodeSampai)}`;
    } else {
        // If no period selected, show current year
        const currentYear = new Date().getFullYear();
        printYear.textContent = `TAHUN ${currentYear}`;
        printPeriod.textContent = 'Semua Periode';
    }
}

// Export to Excel
function exportToExcel() {
    const jenisLaporan = document.getElementById('filterJenisLaporan').value;
    if (!jenisLaporan) {
        showNotification('Pilih jenis laporan terlebih dahulu', 'warning');
        return;
    }

    const table = document.querySelector('#laporanTable table');
    if (!table) {
        showNotification('Tidak ada data untuk diexport', 'warning');
        return;
    }

    // Convert table to CSV
    let csv = [];
    const rows = table.querySelectorAll('tr');

    rows.forEach(row => {
        const cols = row.querySelectorAll('td, th');
        const csvRow = [];
        cols.forEach(col => {
            csvRow.push('"' + col.textContent.replace(/"/g, '""') + '"');
        });
        csv.push(csvRow.join(','));
    });

    const csvContent = csv.join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `laporan_${jenisLaporan}_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('Laporan berhasil diexport ke Excel', 'success');
}

// Export to PDF
function exportToPDF() {
    const jenisLaporan = document.getElementById('filterJenisLaporan').value;
    if (!jenisLaporan) {
        showNotification('Pilih jenis laporan terlebih dahulu', 'warning');
        return;
    }

    const table = document.querySelector('#laporanTable table');
    if (!table) {
        showNotification('Tidak ada data untuk diexport', 'warning');
        return;
    }

    // Check if jsPDF is loaded
    if (typeof window.jspdf === 'undefined') {
        showNotification('Library PDF sedang dimuat, silakan coba lagi...', 'info');
        loadJsPDFLibrary().then(() => {
            generatePDFReport();
        });
        return;
    }

    generatePDFReport();
}

// Load jsPDF library dynamically
function loadJsPDFLibrary() {
    return new Promise((resolve, reject) => {
        // Check if already loaded
        if (typeof window.jspdf !== 'undefined') {
            resolve();
            return;
        }

        // Load jsPDF
        const script1 = document.createElement('script');
        script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script1.onload = () => {
            // Load jsPDF-AutoTable
            const script2 = document.createElement('script');
            script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js';
            script2.onload = () => resolve();
            script2.onerror = () => reject();
            document.head.appendChild(script2);
        };
        script1.onerror = () => reject();
        document.head.appendChild(script1);
    });
}

// Generate PDF Report
function generatePDFReport() {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');

        // Get report data
        const jenisLaporan = document.getElementById('filterJenisLaporan').value;
        const periodeDari = document.getElementById('filterPeriodeDari').value;
        const periodeSampai = document.getElementById('filterPeriodeSampai').value;

        // Get school data if available
        const namaSekolah = dataSekolah?.namaSekolah || 'Arsiparis Surat Digital';
        const alamatSekolah = dataSekolah?.alamat || '';
        const telepon = dataSekolah?.telepon || '';
        const email = dataSekolah?.email || '';

        // Header with better formatting
        let yPos = 15;
        
        // School name
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.text(namaSekolah, 105, yPos, { align: 'center' });
        yPos += 7;
        
        // Address
        if (alamatSekolah) {
            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');
            doc.text(alamatSekolah, 105, yPos, { align: 'center' });
            yPos += 5;
        }
        
        // Contact info
        if (telepon || email) {
            doc.setFontSize(8);
            const contact = [];
            if (telepon) contact.push(`Telp: ${telepon}`);
            if (email) contact.push(`Email: ${email}`);
            doc.text(contact.join(' | '), 105, yPos, { align: 'center' });
            yPos += 5;
        }

        // Double line separator for professional look
        yPos += 2;
        doc.setLineWidth(0.8);
        doc.line(15, yPos, 195, yPos);
        yPos += 0.5;
        doc.setLineWidth(0.3);
        doc.line(15, yPos, 195, yPos);
        yPos += 8;

        // Report title - LAPORAN REKAP SURAT
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('LAPORAN REKAP SURAT', 105, yPos, { align: 'center' });
        yPos += 6;

        // Year and Period
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        
        if (periodeDari && periodeSampai) {
            // Extract year from period
            const tahunDari = periodeDari.split('-')[0];
            const tahunSampai = periodeSampai.split('-')[0];
            const tahunText = tahunDari === tahunSampai ? `TAHUN ${tahunDari}` : `TAHUN ${tahunDari} - ${tahunSampai}`;
            
            doc.text(tahunText, 105, yPos, { align: 'center' });
            yPos += 5;
            
            // Period detail
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            const periodeText = `Periode: ${formatMonth(periodeDari)} s/d ${formatMonth(periodeSampai)}`;
            doc.text(periodeText, 105, yPos, { align: 'center' });
            yPos += 5;
        } else {
            // If no period selected, show current year
            const currentYear = new Date().getFullYear();
            doc.text(`TAHUN ${currentYear}`, 105, yPos, { align: 'center' });
            yPos += 5;
            
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.text('Semua Periode', 105, yPos, { align: 'center' });
            yPos += 5;
        }

        yPos += 3;

        // Statistics summary in a styled box
        const statMasuk = document.getElementById('statLaporanMasuk').textContent;
        const statKeluar = document.getElementById('statLaporanKeluar').textContent;
        const statArsip = document.getElementById('statLaporanArsip').textContent;
        const statTotal = document.getElementById('statLaporanTotal').textContent;

        // Draw summary box
        doc.setDrawColor(102, 126, 234);
        doc.setFillColor(245, 247, 250);
        doc.roundedRect(15, yPos, 180, 25, 2, 2, 'FD');
        
        yPos += 6;
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(102, 126, 234);
        doc.text('RINGKASAN DATA', 20, yPos);
        
        yPos += 6;
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        
        // Two columns for statistics
        const col1X = 25;
        const col2X = 110;
        
        doc.text(`Surat Masuk`, col1X, yPos);
        doc.setFont(undefined, 'bold');
        doc.text(`: ${statMasuk} dokumen`, col1X + 35, yPos);
        doc.setFont(undefined, 'normal');
        
        doc.text(`Surat Keluar`, col2X, yPos);
        doc.setFont(undefined, 'bold');
        doc.text(`: ${statKeluar} dokumen`, col2X + 35, yPos);
        
        yPos += 5;
        doc.setFont(undefined, 'normal');
        doc.text(`Arsip Digital`, col1X, yPos);
        doc.setFont(undefined, 'bold');
        doc.text(`: ${statArsip} dokumen`, col1X + 35, yPos);
        
        yPos += 6;
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(102, 126, 234);
        doc.text(`TOTAL DOKUMEN: ${statTotal}`, 105, yPos, { align: 'center' });
        doc.setTextColor(0, 0, 0);
        
        yPos += 8;

        // Table data
        const table = document.querySelector('#laporanTable table');
        const headers = [];
        const rows = [];

        // Get headers
        const headerCells = table.querySelectorAll('thead th');
        headerCells.forEach(cell => {
            headers.push(cell.textContent.trim());
        });

        // Get rows
        const bodyRows = table.querySelectorAll('tbody tr');
        bodyRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length > 1) { // Skip "no data" row
                const rowData = [];
                cells.forEach(cell => {
                    rowData.push(cell.textContent.trim());
                });
                rows.push(rowData);
            }
        });

        // Add table using autoTable with improved styling
        doc.autoTable({
            head: [headers],
            body: rows,
            startY: yPos,
            theme: 'striped',
            styles: {
                fontSize: 9,
                cellPadding: 3,
                overflow: 'linebreak',
                halign: 'left',
                valign: 'middle',
                lineColor: [200, 200, 200],
                lineWidth: 0.1
            },
            headStyles: {
                fillColor: [102, 126, 234],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                halign: 'center',
                fontSize: 10,
                cellPadding: 4
            },
            alternateRowStyles: {
                fillColor: [248, 249, 250]
            },
            columnStyles: {
                0: { cellWidth: 12, halign: 'center', fontStyle: 'bold' }, // No
                1: { cellWidth: 30, halign: 'center' }, // Tanggal
                2: { cellWidth: 45 }, // Nomor Surat
                3: { cellWidth: 70 }, // Perihal
                4: { cellWidth: 33, halign: 'center', fontStyle: 'bold' } // Status
            },
            margin: { left: 15, right: 15 },
            didDrawPage: function(data) {
                // Add page border
                doc.setDrawColor(200, 200, 200);
                doc.setLineWidth(0.5);
                doc.rect(10, 10, 190, 277);
            }
        });

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setFont(undefined, 'normal');
            
            // Date generated
            const today = new Date();
            const dateStr = `Dicetak: ${formatDate(today.toISOString().split('T')[0])}`;
            doc.text(dateStr, 15, 287);
            
            // Page number
            doc.text(`Halaman ${i} dari ${pageCount}`, 195, 287, { align: 'right' });
        }

        // Save PDF
        const fileName = `laporan_${jenisLaporan}_${new Date().getTime()}.pdf`;
        doc.save(fileName);

        showNotification('Laporan berhasil diexport ke PDF', 'success');
    } catch (error) {
        console.error('Error generating PDF:', error);
        showNotification('Gagal membuat PDF. Gunakan fitur Cetak sebagai alternatif.', 'error');
    }
}

// Helper Functions
function formatMonth(monthStr) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const [year, month] = monthStr.split('-');
    return `${months[parseInt(month) - 1]} ${year}`;
}

function getBadgeClass(jenis) {
    switch(jenis) {
        case 'Surat Masuk': return 'badge-success';
        case 'Surat Keluar': return 'badge-primary';
        case 'Arsip Digital': return 'badge-warning';
        default: return 'badge-secondary';
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLaporan);
} else {
    initializeLaporan();
}
