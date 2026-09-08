# Simulasi Pembiayaan Kossuma

Web statis untuk menghitung simulasi tiga akad pembiayaan Kossuma: Murabahah, Qardhul Hasan khusus biaya pendidikan, dan Rahn dengan dua skema pembayaran.

## Cara menjalankan

Buka `index.html` langsung di browser. Tidak membutuhkan server, database, atau proses instalasi.

## Deploy ke GitHub Pages

1. Buat repository baru di GitHub.
2. Upload seluruh isi folder ini ke branch `main`.
3. Buka **Settings → Pages**.
4. Pada **Build and deployment**, pilih **Deploy from a branch**.
5. Pilih branch `main` dan folder `/ (root)`, lalu klik **Save**.

GitHub akan memberikan tautan publik setelah proses deployment selesai.

## Jenis simulasi

- Murabahah: margin tetap 1,2% per bulan.
- Qardhul Hasan: tanpa margin.
- Rahn pokok diangsur: ujrah 1,2% dihitung dari sisa pokok setiap bulan.
- Rahn ujrah bulanan: ujrah 1,2% dibayar per bulan dan pokok dikembalikan pada bulan terakhir.

Pilihan tenor: 3, 4, 5, 6, 10, dan 12 bulan.
