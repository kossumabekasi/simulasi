# Simulasi Pembiayaan Kossuma

Web statis untuk menghitung simulasi tiga akad pembiayaan Kossuma: Murabahah, Qardhul Hasan khusus biaya pendidikan, dan Rahn dengan dua skema pembayaran.

Harga buyback Antam untuk simulasi Rahn diperbarui otomatis pada hari kerja melalui GitHub Actions. Sumber harga: situs resmi Logam Mulia Antam.

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

Nilai pembiayaan Rahn dihitung dari 90% nilai buyback, lalu dibulatkan menurut aturan Kossuma: sisa sampai Rp300.000 ke juta bawah, sisa di atas Rp300.000 sampai di bawah Rp800.000 ke Rp500.000, dan sisa mulai Rp800.000 ke juta atas.

Pilihan tenor: 3, 4, 5, 6, 10, dan 12 bulan.
