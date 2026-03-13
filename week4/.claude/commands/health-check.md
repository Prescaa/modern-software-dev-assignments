---
description: Menjalankan pembersihan kode, linting, dan tes secara otomatis.
---

# Intent
Memastikan kode dalam kondisi prima dan siap untuk di-commit.

# Steps
1. Jalankan `black .` untuk merapikan format kode.
2. Jalankan `ruff check . --fix` untuk memperbaiki error linting yang simpel.
3. Jalankan `pytest` untuk memastikan tidak ada fitur yang rusak.
4. Berikan laporan ringkas: "Siap di-commit" atau "Ada yang gagal".