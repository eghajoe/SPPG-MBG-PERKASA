const USER = { username: "Helga", password: "111111" };

function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user === USER.username && pass === USER.password) {
    localStorage.setItem("loggedIn", "true");
    window.location.href = "menu.html"; // Arahkan ke halaman menu
  } else {
    alert("Username atau password salah!");
  }
}


window.onload = function () {
  if (window.location.pathname.includes("dashboard.html") && localStorage.getItem("loggedIn") === "true") {
    document.getElementById("welcome-user").innerText = `Halo, ${USER.username}!`;
    renderStok();
  }
};

function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "index.html";
}

function getStok() {
  return JSON.parse(localStorage.getItem("stokBarang")) || [];
}

function saveStok(data) {
  localStorage.setItem("stokBarang", JSON.stringify(data));
}

function tambahBarangMasuk() {
  const nama = document.getElementById("masuk-sekolah").value;
  const jumlah = parseInt(document.getElementById("masuk-jumlah").value);
  if (!nama || isNaN(jumlah) || jumlah <= 0) return alert("Input tidak valid");

  const stok = getStok();
  stok.push({ nama, jumlah, jenis: "Masuk", tanggal: new Date().toLocaleDateString() });
  saveStok(stok);
  renderStok();
  alert("Barang masuk ditambahkan!");
}

function tambahBarangKeluar() {
  const nama = document.getElementById("keluar-sekolah").value;
  const jumlah = parseInt(document.getElementById("keluar-jumlah").value);
  if (!nama || isNaN(jumlah) || jumlah <= 0) return alert("Input tidak valid");

  const stok = getStok();
  stok.push({ nama, jumlah, jenis: "Kirim", tanggal: new Date().toLocaleDateString() });
  saveStok(stok);
  renderStok();
  alert("Barang keluar ditambahkan!");
}

function renderStok() {
  const stok = getStok();
  const tbody = document.querySelector("#tabel-stok tbody");
  tbody.innerHTML = "";

  stok.forEach((item, index) => {
    const row = `<tr>
      <td>${item.nama}</td>
      <td>${item.jumlah}</td>
      <td>${item.jenis}</td>
      <td>${item.tanggal}</td>
      <td><button onclick="tampilkanSurat(${index})">CETAK</button></td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

function tampilkanSurat(index) {
  const stok = getStok();
  const item = stok[index];

  document.getElementById("surat-jalan").style.display = "block";
  document.getElementById("tanggal-kirim").innerText = new Date().toLocaleDateString();

  document.getElementById("daftar-barang").innerHTML = `
    <table border="1" cellspacing="0" cellpadding="8" style="width:100%; border-collapse:collapse; text-align:center;">
      <thead>
        <tr>
          <th>Nama Sekolah</th>
          <th>Jumlah</th>
          <th>Jenis</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${item.nama}</td>
          <td>${item.jumlah}</td>
          <td>${item.jenis}</td>
        </tr>
      </tbody>
    </table>
  `;
}

function cetakSuratJalan() {
  const pengirim = document.getElementById("pengirim").value;
  const penerima = document.getElementById("penerima").value;
  if (!pengirim || !penerima) return alert("Lengkapi data pengirim dan penerima!");

  const tanggalKirim = new Date().toLocaleDateString();
  const daftarBarang = document.getElementById("daftar-barang").innerHTML;

  const win = window.open("", "", "width=800,height=600");
  win.document.write(`
    <html>
    <head><title>Surat Jalan</title>
          <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { text-align: center; margin-bottom: 5px; }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 2px solid #ccc;
          margin-bottom: 20px;
        }
        .header .text {
          font-size: 24px;
          font-weight: bold;
        }
        .header img {
          height: 60px;
        }
        .kontak-info {
          text-align: center;
          margin-top: 10px;
          margin-bottom: 20px;
        }
        .kontak-info img {
          vertical-align: middle;
          height: 20px;
          margin-right: 8px;
        }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #000; padding: 8px; text-align: center; }
        .ttd {
          margin-top: 50px;
          display: flex;
          justify-content: space-between;
        }
        .ttd div { text-align: center; }
      </style></head>
    <body>
       <div class="header">
      <div class="text">
        SPPG MBG PERKASA
      </div>
      <img src="img/logo.png" alt="Logo PT">
    </div>
<h1>Surat Jalan</h1>
    <div class="kontak-info">
      <p>
        <img src="img/wa.png" alt="WA"> 0812-3456-7890 &nbsp; | &nbsp;
        <img src="img/email.png" alt="Email"> admin@mbgperkasa.co.id
      </p>
    </div>
      ${daftarBarang}
      <p>Pengirim: <strong>${pengirim}</strong></p>
      <p>Penerima: <strong>${penerima}</strong></p>
      <p>Tanggal Kirim: ${tanggalKirim}</p>
    </body>
    </html>
  `);
  win.document.close();
  win.print();
}

function exportExcel() {
  const stok = getStok();
  const ws = XLSX.utils.json_to_sheet(stok);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Laporan");
  XLSX.writeFile(wb, "Laporan_Stok.xlsx");
}

function resetData() {
  const pin = prompt("Masukkan PIN untuk reset data:");
  if (pin === "123456") {
    if (confirm("Yakin ingin reset semua data?")) {
      localStorage.clear();
      alert("Data berhasil direset.");
      location.reload();
    }
  } else {
    alert("PIN salah. Reset dibatalkan.");
  }
}
