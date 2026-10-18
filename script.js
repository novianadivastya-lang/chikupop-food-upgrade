// =========================================================
// CHIKUPOP - JAVASCRIPT
// Menangani menu mobile, filter menu, keranjang,
// data pelanggan, dan checkout WhatsApp.
// =========================================================

// Nomor WhatsApp Chikupop.
// Format: 62 + nomor HP tanpa tanda +.
const NOMOR_WA = "6285124283099";


// ==================== MENU MOBILE ====================

const menuToggle = document.querySelector("#menu-toggle");
const navLinks = document.querySelector("#nav-links");

menuToggle.addEventListener("click", function () {
    navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
        navLinks.classList.remove("open");
    });
});


// ==================== FILTER MENU ====================

const filterButtons = document.querySelectorAll(".filter");
const productCards = document.querySelectorAll(".product-card");

filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {

        const pilihan = button.dataset.filter;

        filterButtons.forEach(function (item) {
            item.classList.remove("active");
        });

        button.classList.add("active");

        productCards.forEach(function (card) {

            const kategori = card.dataset.kategori;

            if (pilihan === "semua" || pilihan === kategori) {
                card.classList.remove("hidden");
            } else {
                card.classList.add("hidden");
            }
        });
    });
});


// ==================== KERANJANG ====================

const cart = new Map();

const cartItems = document.querySelector("#cart-items");
const cartTotal = document.querySelector("#cart-total");
const cartSummary = document.querySelector("#cart-summary");
const checkoutButton = document.querySelector("#checkout-button");

const namaPelanggan = document.querySelector("#nama-pelanggan");
const alamatPelanggan = document.querySelector("#alamat-pelanggan");


function rupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka);
}


function ubahJumlah(nama, harga, perubahan) {

    let item = cart.get(nama);

    if (!item) {
        item = {
            harga: harga,
            jumlah: 0
        };

        cart.set(nama, item);
    }

    item.jumlah += perubahan;

    if (item.jumlah <= 0) {
        cart.delete(nama);
    }

    tampilkanKeranjang();
}


// Tombol tambah pada setiap produk.
productCards.forEach(function (card) {

    const tombol = card.querySelector(".add-button");
    const nama = card.dataset.nama;
    const harga = Number(card.dataset.harga);

    tombol.addEventListener("click", function () {

        ubahJumlah(nama, harga, 1);

        tombol.classList.add("selected");

        setTimeout(function () {
            tombol.classList.remove("selected");
        }, 250);
    });
});


function tampilkanKeranjang() {

    cartItems.innerHTML = "";

    let totalItem = 0;
    let totalHarga = 0;


    // Jika keranjang kosong.
    if (cart.size === 0) {

        cartItems.innerHTML =
            '<p class="empty-cart">Keranjang masih kosong 🍗</p>';

        cartTotal.textContent = "Rp0";
        cartSummary.textContent = "Belum ada menu yang dipilih.";

        checkoutButton.classList.add("disabled");
        checkoutButton.href = "#";

        return;
    }


    // Membuat daftar produk yang dipilih.
    cart.forEach(function (item, nama) {

        const subtotal = item.harga * item.jumlah;

        totalItem += item.jumlah;
        totalHarga += subtotal;


        const row = document.createElement("div");
        row.className = "cart-row";

        row.innerHTML = `
            <div>
                <strong>${nama}</strong>
                <small>${rupiah(subtotal)}</small>
            </div>

            <div class="quantity">
                <button aria-label="Kurangi ${nama}">−</button>
                <span>${item.jumlah}</span>
                <button aria-label="Tambah ${nama}">+</button>
            </div>
        `;


        const buttons = row.querySelectorAll("button");


        buttons[0].addEventListener("click", function () {
            ubahJumlah(nama, item.harga, -1);
        });


        buttons[1].addEventListener("click", function () {
            ubahJumlah(nama, item.harga, 1);
        });


        cartItems.appendChild(row);
    });


    cartTotal.textContent = rupiah(totalHarga);
    cartSummary.textContent =
        totalItem + (totalItem === 1 ? " item" : " item") +
        " ada di keranjang.";


    checkoutButton.classList.remove("disabled");


    // Checkout WhatsApp.
    checkoutButton.onclick = function (event) {

        event.preventDefault();


        const nama = namaPelanggan.value.trim();
        const alamat = alamatPelanggan.value.trim();


        if (!nama) {
            alert("Silakan isi nama pelanggan terlebih dahulu.");
            namaPelanggan.focus();
            return;
        }


        if (!alamat) {
            alert("Silakan isi alamat pelanggan terlebih dahulu.");
            alamatPelanggan.focus();
            return;
        }


        let pesan =
            "Halo Chikupop, saya mau pesan:%0A%0A";


        pesan +=
            "Nama: " +
            encodeURIComponent(nama) +
            "%0A";


        pesan +=
            "Alamat: " +
            encodeURIComponent(alamat) +
            "%0A%0A";


        cart.forEach(function (item, namaProduk) {

            pesan +=
                item.jumlah +
                "x " +
                encodeURIComponent(namaProduk) +
                " - " +
                encodeURIComponent(
                    rupiah(item.harga * item.jumlah)
                ) +
                "%0A";
        });


        pesan +=
            "%0ATotal: " +
            encodeURIComponent(rupiah(totalHarga));


        pesan +=
            "%0A%0ATerima kasih!";


        window.open(
            "https://wa.me/" +
            NOMOR_WA +
            "?text=" +
            pesan,
            "_blank"
        );
    };
}


// ==================== FOOTER WHATSAPP ====================

const footerWa = document.querySelector("#footer-wa");

footerWa.href =
    "https://wa.me/" +
    NOMOR_WA +
    "?text=Halo%20Chikupop,%20saya%20mau%20tanya%20tentang%20menu.";


// ==================== TAHUN FOOTER ====================

document.querySelector("#tahun").textContent =
    new Date().getFullYear();
