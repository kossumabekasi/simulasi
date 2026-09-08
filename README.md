# Simulasi Pembiayaan Murabahah Kossuma

Web statis sederhana untuk menghitung simulasi pembiayaan murabahah dengan margin tetap 1,2% per bulan.

## Cara menjalankan

Buka `index.html` langsung di browser. Tidak membutuhkan server, database, atau proses instalasi.

## Deploy ke GitHub Pages

1. Buat repository baru di GitHub.
2. Upload seluruh isi folder ini ke branch `main`.
3. Buka **Settings → Pages**.
4. Pada **Build and deployment**, pilih **Deploy from a branch**.
5. Pilih branch `main` dan folder `/ (root)`, lalu klik **Save**.

GitHub akan memberikan tautan publik setelah proses deployment selesai.

## Rumus

- Margin = pokok pembiayaan × 1,2% × tenor
- Total pembayaran = pokok pembiayaan + margin
- Cicilan per bulan = total pembayaran ÷ tenor, dibulatkan ke atas ke rupiah penuh

Pilihan tenor: 3, 4, 5, 6, 10, dan 12 bulan.
