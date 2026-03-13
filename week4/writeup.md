# Week 4 Write-up
Tip: To preview this markdown file
- On Mac, press `Command (⌘) + Shift + V`
- On Windows/Linux, press `Ctrl + Shift + V`

## INSTRUCTIONS

Fill out all of the `TODO`s in this file.

## SUBMISSION DETAILS

Name: Rifky Putra Mahardika \
SUNet ID: 2310817210023 \
Citations: 
- Anthropic Claude Code Best Practices (anthropic.com/engineering/claude-code-best-practices)
- Claude Code Sub-Agents Documentation (docs.anthropic.com/en/docs/claude-code/sub-agents)
- Week 4: Coding Agent Patterns (Course Material)

This assignment took me about **3** hours to do. 


## YOUR RESPONSES
### Automation #1: CLAUDE.md Context Guidance
a. Design inspiration (e.g. cite the best-practices and/or sub-agents docs)
> Inspirasi diambil dari Claude Code best-practices mengenai "Context Guidance". Saya sadar kalau agen AI butuh peta jalan yang jelas untuk lingkungan lokal, terutama karena keterbatasan perintah make di sistem Windows saya.

b. Design of each automation, including goals, inputs/outputs, steps
Goal: 
> - Goal: Memberikan instruksi tetap agar AI selalu menggunakan type hints, pola TDD, dan perintah uvicorn yang benar.
> - Inputs: Berkas CLAUDE.md di root folder.
> - Outputs: Perubahan kode yang konsisten dan sesuai dengan struktur project.
> - Steps: Mendefinisikan lokasi file (backend/app), perintah run, dan aturan pengujian.

c. How to run it (exact commands), expected outputs, and rollback/safety notes
> - Exact Action: Mengetikkan prompt berikut di Cursor Chat: "Tolong baca @CLAUDE.md. Berdasarkan panduan di sana, tambahkan fitur Delete Note di @backend/app/main.py dan tambahkan tombol Delete di @frontend/index.html agar user bisa menghapus catatan."
> - Expected Output: Cursor membaca konteks dari @CLAUDE.md dan langsung memberikan saran kode yang sudah menggunakan type hints serta menyertakan unit test.
> - Safety: Membatasi AI agar tidak menggunakan perintah CLI yang tidak kompatibel dengan Windows.

d. Before vs. after (i.e. manual workflow vs. automated workflow)
> - Manual: Saya harus mengoreksi AI berkali-kali jika kodenya tidak rapi atau salah menggunakan perintah jalannya.
> - Automated: Dengan satu prompt yang merujuk ke @CLAUDE.md, AI langsung bekerja sesuai standar tanpa perlu dikoreksi lagi.

e. How you used the automation to enhance the starter application
> Saya menggunakan prompt: "Tolong baca @CLAUDE.md... tambahkan fitur Delete Note..." untuk memandu Cursor. AI secara otomatis mengimplementasikan endpoint DELETE di backend dan tombol hapus di UI dengan mengikuti struktur yang sudah ditentukan dalam file panduan tersebut.


### Automation #2: /health-check (Verified Workflow)
a. Design inspiration (e.g. cite the best-practices and/or sub-agents docs)
> Terinspirasi dari konsep Custom slash commands untuk "Repeated Workflows" yang menggabungkan beberapa tahap verifikasi dalam satu definisi file Markdown.

b. Design of each automation, including goals, inputs/outputs, steps
> - Goal: Memastikan kualitas kode melalui tiga tahap: Formatting, Linting, dan Testing.
> - Inputs: Berkas instruksi di .claude/commands/health-check.md.
> - Outputs: Status "All done!" dari Black dan "4 passed" dari Pytest di terminal.
> - Steps: 
> 1.Menjalankan black . untuk merapikan kode.
> 2.Menjalankan ruff check . --fix untuk memperbaiki linting. 
> 3.Menjalankan python -m pytest untuk verifikasi fungsionalitas.

c. How to run it (exact commands), expected outputs, and rollback/safety notes
> - Exact Action: Membuka berkas @health-check.md sebagai referensi, lalu menjalankan perintah terminal sesuai urutan langkah di dalamnya.
> - Expected Output: Terminal menunjukkan hasil tes hijau (4 passed) dan konfirmasi file sudah rapi (All done!).
> - Safety: Menghindari bug baru merusak fitur lama lewat pengujian otomatis.

d. Before vs. after (i.e. manual workflow vs. automated workflow)
> - Manual: Sering lupa menjalankan tes, sehingga bug baru (seperti PermissionError pada database) tidak terdeteksi sebelum push.
> - Automated: Alur kerja menjadi lebih disiplin; saya selalu mengecek kesehatan kode lewat rangkaian perintah yang sudah dirancang sebelum melakukan pengumpulan.

e. How you used the automation to enhance the starter application
> Setelah fitur Delete selesai, saya menjalankan simulasi /health-check. Saya menemukan error akses file (PermissionError) di Windows pada tahap testing, yang akhirnya berhasil saya perbaiki hingga mendapatkan hasil akhir 4 passed.


### *(Optional) Automation #3*
*If you choose to build additional automations, feel free to detail them here!*

a. Design inspiration (e.g. cite the best-practices and/or sub-agents docs)
> TODO

b. Design of each automation, including goals, inputs/outputs, steps
> TODO

c. How to run it (exact commands), expected outputs, and rollback/safety notes
> TODO

d. Before vs. after (i.e. manual workflow vs. automated workflow)
> TODO

e. How you used the automation to enhance the starter application
> TODO
