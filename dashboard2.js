const USER = { username: "Helga", password: "111111" };

window.onload = function () {
  document.getElementById("welcome-user").innerText = `Halo, ${USER.username}!`;
  renderRiwayat();
};

function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "index.html";
}

function getRiwayatGudang() {
  return JSON.parse(localStorage.getItem("riwayatGudang")) || [];
}

function saveRiwayatGudang(data) {
  localStorage.setItem("riwayatGudang", JSON.stringify(data));
}

function tambahTransaksi() {
  const gudang = document.getElementById("jenis-gudang").value;
  const nama = document.getElementById("nama-barang").value.trim();
  const jumlah = parseInt(document.getElementById("jumlah-barang").value);
  const jenis = document.getElementById("jenis-transaksi").value;
  const tanggal = new Date().toLocaleDateString();

  if (!nama || isNaN(jumlah) || jumlah <= 0) return alert("Input tidak valid!");

  const data = getRiwayatGudang();
  data.push({ gudang, nama, jumlah, jenis, tanggal });
  saveRiwayatGudang(data);
  renderRiwayat();
  alert("Transaksi berhasil ditambahkan!");
}

function renderRiwayat() {
  const data = getRiwayatGudang();
  const tbody = document.querySelector("#tabel-riwayat tbody");
  tbody.innerHTML = "";
  data.forEach(item => {
    tbody.innerHTML += `
      <tr>
        <td>${item.gudang}</td>
        <td>${item.nama}</td>
        <td>${item.jumlah}</td>
        <td>${item.jenis}</td>
        <td>${item.tanggal}</td>
      </tr>
    `;
  });
}

function exportExcel() {
  const data = getRiwayatGudang();
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Gudang");
  XLSX.writeFile(wb, "Riwayat_Gudang.xlsx");
}

function resetData() {
  const pin = prompt("Masukkan PIN untuk reset:");
  if (pin === "123456") {
    if (confirm("Yakin mau reset semua data gudang?")) {
      localStorage.removeItem("riwayatGudang");
      renderRiwayat();
      alert("Data berhasil direset.");
    }
  } else {
    alert("PIN salah.");
  }
}
