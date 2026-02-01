// 1. Inisialisasi variabel Chart agar bisa diakses secara global
let catC, lineC, barC;

// 2. Fungsi Utama untuk mengambil data dari MariaDB melalui api.php
async function fetchData(lokasi = 'All') {
    try {
        // Memanggil api.php dengan parameter lokasi
        const response = await fetch(`api.php?lokasi=${lokasi}`);
        const result = await response.json();

        if (result.error) {
            alert("Error: " + result.error);
            return;
        }

        // 3. Update Angka KPI (Header Card)
        document.getElementById('revVal').innerText = result.kpi.revenue;
        document.getElementById('salesVal').innerText = result.kpi.sales;
        
        // Update Produk Nomor 1 di Card (Jika ada data)
        if (result.chartProduk.labels.length > 0) {
            document.getElementById('prodVal').innerText = result.chartProduk.labels[0];
        }

        // 4. Update Grafik Kategori (Doughnut)
        catC.data.labels = result.chartKategori.labels;
        catC.data.datasets[0].data = result.chartKategori.data;
        catC.update();

        // 5. Update Grafik Top 5 Produk (Bar)
        barC.data.labels = result.chartProduk.labels;
        barC.data.datasets[0].data = result.chartProduk.data;
        barC.update();

        // 6. Update Grafik Jam Teramai (Line)
        lineC.data.labels = result.chartJam.labels;
        lineC.data.datasets[0].data = result.chartJam.data;
        lineC.update();

    } catch (error) {
        console.error("Gagal memuat data:", error);
    }
}

// 7. Fungsi untuk mengatur rangka grafik saat pertama kali dibuka
function initCharts() {
    const ctx1 = document.getElementById('catChart');
    const ctx2 = document.getElementById('lineChart');
    const ctx3 = document.getElementById('barChart');

    catC = new Chart(ctx1, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{ data: [], backgroundColor: ['#4a3428', '#d9b99b', '#f3e5d8'] }]
        }
    });

    lineC = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{ label: 'Unit', data: [], borderColor: '#4a3428', tension: 0.3 }]
        }
    });

    barC = new Chart(ctx3, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{ label: 'Unit Terjual', data: [], backgroundColor: '#4a3428' }]
        }
    });
}

// 8. Event Listener untuk Dropdown Lokasi
document.getElementById('cityFilter').addEventListener('change', (e) => {
    fetchData(e.target.value);
});

// 9. Jalankan saat halaman web siap
window.onload = () => {
    initCharts(); // Siapkan rangka
    fetchData();  // Isi dengan data awal (All)
};