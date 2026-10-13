// @ts-nocheck
/* ==========================================
   MAKE UP BY. NISSA
   SISTEM BOOKING MAKEUP
========================================== */

// ==========================================
// BAGIAN 1 — PENGATURAN ADMIN
// ==========================================

const NOMOR_WA = "6285212348650";
const NAMA_USAHA = "Make Up By. Nissa";
const MIN_ORANG = 1;

// ==========================================
// BAGIAN 2 — ELEMEN HTML
// ==========================================

const form = document.getElementById("bookingForm");
const tombolMulai = document.getElementById("btnMulaiBooking");
const namaInput = document.getElementById("nama");
const waInput = document.getElementById("wa");
const alamatInput = document.getElementById("alamat");
const acaraInput = document.getElementById("acara");
const tglInput = document.getElementById("tgl");
const jamInput = document.getElementById("jam");
const jumlahInput = document.getElementById("jumlah");
const setujuInput = document.getElementById("setuju");
const errorBox = document.getElementById("err");
const previewBox = document.getElementById("preview");
const transportBox = document.getElementById("transportBox");
const tombolTambah = document.getElementById("plus");
const tombolKurang = document.getElementById("minus");
const tombolJumlah = document.querySelectorAll("#chips button");
const tombolSalinRek = document.getElementById("salinRek");

// ==========================================
// BAGIAN 3 — BUKA FORM BOOKING
// ==========================================

if (tombolMulai && form) {
  tombolMulai.addEventListener("click", function () {
    Array.prototype.forEach.call(form.children, function (el, i) {
      el.style.setProperty("--i", i);
    });

    form.classList.remove("form-tersembunyi");
    form.classList.add("form-terbuka");

    setTimeout(function () {
      form.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 100);
  });
}

// ==========================================
// BAGIAN 4 — PESAN ERROR
// ==========================================

function tampilkanError(pesan) {
  if (errorBox) {
    errorBox.style.color = "";
    errorBox.textContent = pesan;
  }
}

function hapusError() {
  if (errorBox) errorBox.textContent = "";
}

function tandaiSalah(el) {
  if (!el) return;
  el.classList.add("invalid");
  el.focus();
}

document.querySelectorAll("input, textarea").forEach(function (el) {
  el.addEventListener("input", function () {
    el.classList.remove("invalid");
  });
});

// ==========================================
// BAGIAN 5 — PILIHAN RADIO
// ==========================================

function nilaiRadio(nama) {
  const pilihan = document.querySelector(
    'input[name="' + nama + '"]:checked'
  );

  return pilihan ? pilihan.value : "";
}

function perbaruiTransport() {
  const homeservice =
    nilaiRadio("lokasi").indexOf("Homeservice") === 0;

  if (!transportBox) return;

  transportBox.classList.toggle("hide", !homeservice);
  transportBox.classList.toggle("show", homeservice);
}

document.querySelectorAll('input[name="lokasi"]').forEach(function (radio) {
  radio.addEventListener("change", perbaruiTransport);
});

perbaruiTransport();

// ==========================================
// BAGIAN 6 — JUMLAH ORANG
// ==========================================

function tandaiChip() {
  tombolJumlah.forEach(function (tombol) {
    tombol.classList.toggle(
      "on",
      tombol.dataset.v === String(jumlahInput.value)
    );
  });
}

function aturJumlah(nilai) {
  let jumlah = Math.round(Number(nilai));

  if (!Number.isFinite(jumlah) || jumlah < MIN_ORANG) {
    jumlah = MIN_ORANG;
  }

  jumlahInput.value = jumlah;
  tandaiChip();
  hapusError();
}

if (jumlahInput) {
  jumlahInput.addEventListener("change", function () {
    aturJumlah(this.value);
  });

  tandaiChip();
}

if (tombolTambah) {
  tombolTambah.addEventListener("click", function () {
    aturJumlah(Number(jumlahInput.value || MIN_ORANG) + 1);
  });
}

if (tombolKurang) {
  tombolKurang.addEventListener("click", function () {
    aturJumlah(Number(jumlahInput.value || MIN_ORANG) - 1);
  });
}

tombolJumlah.forEach(function (tombol) {
  tombol.addEventListener("click", function () {
    aturJumlah(this.dataset.v);
  });
});

// ==========================================
// BAGIAN 7 — TANGGAL MINIMAL HARI INI
// ==========================================

(function aturTanggalMinimal() {
  if (!tglInput) return;

  const d = new Date();
  const bln = String(d.getMonth() + 1).padStart(2, "0");
  const tgl = String(d.getDate()).padStart(2, "0");

  tglInput.min = d.getFullYear() + "-" + bln + "-" + tgl;
})();

function formatTanggal(nilai) {
  if (!nilai) return "";

  const p = nilai.split("-");
  const d = new Date(
    Number(p[0]),
    Number(p[1]) - 1,
    Number(p[2])
  );

  try {
    return d.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  } catch (e) {
    return nilai;
  }
}

// ==========================================
// BAGIAN 8 — VALIDASI FORMULIR
// ==========================================

function validasi() {
  hapusError();

  if (!namaInput.value.trim()) {
    tampilkanError("Silakan isi nama.");
    tandaiSalah(namaInput);
    return false;
  }

  const digitWa = waInput.value.replace(/\D/g, "");

  if (digitWa.length < 9) {
    tampilkanError(
      "Nomor WA belum benar. Contoh: 08xxxxxxxxxx."
    );
    tandaiSalah(waInput);
    return false;
  }

  if (!alamatInput.value.trim()) {
    tampilkanError("Silakan isi alamat.");
    tandaiSalah(alamatInput);
    return false;
  }

  if (!acaraInput.value.trim()) {
    tampilkanError("Silakan isi jenis acara.");
    tandaiSalah(acaraInput);
    return false;
  }

  if (!tglInput.value) {
    tampilkanError("Silakan pilih hari/tanggal acara.");
    tandaiSalah(tglInput);
    return false;
  }

  if (!jamInput.value) {
    tampilkanError("Silakan pilih jam acara.");
    tandaiSalah(jamInput);
    return false;
  }

  if (!(Number(jumlahInput.value) >= MIN_ORANG)) {
    tampilkanError(
      "Jumlah yang di makeup minimal 1 orang."
    );
    tandaiSalah(jumlahInput);
    return false;
  }

  if (!setujuInput.checked) {
    tampilkanError(
      "Centang persetujuan DP terlebih dahulu."
    );
    setujuInput.focus();
    return false;
  }

  return true;
}

// ==========================================
// BAGIAN 9 — PESAN WHATSAPP TANPA EMOJI
// ==========================================

function buatPesan() {
  const baris = [
    "Halo " + NAMA_USAHA + ", saya sudah DP dan ingin booking.",
    "",
    "FORMAT BOOKING",
    "Nama: " + namaInput.value.trim(),
    "Alamat: " + alamatInput.value.trim(),
    "Acara: " + acaraInput.value.trim(),
    "Hari/tgl acara: " + formatTanggal(tglInput.value),
    "Jam acara: " + jamInput.value,
    "Hijab do (free)/hairdo (+150k): " + nilaiRadio("hijab"),
    "No WA: " + waInput.value.trim(),
    "Jumlah di makeup: " + jumlahInput.value + " orang",
    "Studio/homeservice: " + nilaiRadio("lokasi"),
    "Reguler/premium: " + nilaiRadio("paket"),
    "DP minimal 50%/pelunasan: " + nilaiRadio("bayar"),
    "",
    "Note: cancel = DP hangus"
  ];

  return baris.join("\n");
}

// ==========================================
// BAGIAN 10 — SALIN TEKS
// ==========================================

async function salinTeks(teks) {
  try {
    await navigator.clipboard.writeText(teks);
    return true;
  } catch (e) {
    try {
      const ta = document.createElement("textarea");

      ta.value = teks;
      ta.style.position = "fixed";
      ta.style.opacity = "0";

      document.body.appendChild(ta);
      ta.select();

      const ok = document.execCommand("copy");
      document.body.removeChild(ta);

      return ok;
    } catch (e2) {
      return false;
    }
  }
}

// ==========================================
// BAGIAN 11 — SALIN NOMOR REKENING
// ==========================================

if (tombolSalinRek) {
  tombolSalinRek.addEventListener("click", async function () {
    const elemenRek = document.getElementById("noRek");

    if (!elemenRek) return;

    const norek = elemenRek.textContent.trim();
    const ok = await salinTeks(norek);

    tombolSalinRek.textContent = ok ? "Tersalin ✓" : "Gagal";
    tombolSalinRek.classList.toggle("ok", ok);

    setTimeout(function () {
      tombolSalinRek.textContent = "Salin";
      tombolSalinRek.classList.remove("ok");
    }, 1800);
  });
}

// ==========================================
// BAGIAN 12 — KIRIM BOOKING KE WHATSAPP
// ==========================================

if (form) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!validasi()) return;

    const pesan = buatPesan();
    const nomor = NOMOR_WA.replace(/\D/g, "");

    if (nomor) {
      window.location.href =
        "https://wa.me/" +
        nomor +
        "?text=" +
        encodeURIComponent(pesan);

      return;
    }

    previewBox.hidden = false;
    previewBox.textContent = pesan;

    const ok = await salinTeks(pesan);

    tampilkanError("");

    errorBox.textContent = ok
      ? "Format booking sudah disalin. Tempel dan kirim ke WhatsApp Nissa."
      : "Salin teks di bawah, lalu kirim ke WhatsApp Nissa.";

    errorBox.style.color = "#11804a";

    previewBox.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  });
}

// ==========================================
// BAGIAN 13 — ANIMASI ITEM MAKEUP DI WEBSITE
// Emoji di bagian ini hanya untuk tampilan website.
// Tidak ikut masuk ke pesan WhatsApp.
// ==========================================

(function buatAnimasiLatar() {
  if (document.querySelector(".terbang-bg")) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const latar = document.createElement("div");
  latar.className = "terbang-bg";
  latar.setAttribute("aria-hidden", "true");

  const bentuk = ["💄", "💋", "✨", "🌸", "🪞", "🎀"];
  const jumlah = 22;

  for (let i = 0; i < jumlah; i++) {
    const item = document.createElement("span");

    item.className = "terbang";
    item.textContent = bentuk[i % bentuk.length];
    item.style.left = Math.random() * 100 + "%";
    item.style.fontSize = 14 + Math.random() * 12 + "px";
    item.style.animationDuration = 12 + Math.random() * 18 + "s";
    item.style.animationDelay = -Math.random() * 25 + "s";

    latar.appendChild(item);
  }

  document.body.prepend(latar);
})();