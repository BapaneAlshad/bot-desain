Saya ingin membuat aplikasi web internal bernama **Job Vacancy Creative Generator**.

Saya bukan programmer, jadi kerjakan project ini dengan pendekatan yang aman, sederhana, terstruktur, dan mudah saya lanjutkan menggunakan AI coding agent.

## TUJUAN APLIKASI

Aplikasi digunakan untuk membuat gambar kebutuhan lowongan kerja melalui form.

User tidak perlu menulis prompt AI secara manual.

User cukup mengisi informasi lowongan, memilih style, mengupload gambar referensi, lalu aplikasi otomatis menyusun prompt lengkap dan mengirimnya ke AI image generation API.

Untuk V1, fokus hanya sampai:

FORM → PROMPT BUILDER → AI IMAGE GENERATION → PREVIEW → DOWNLOAD

Jangan tambahkan fitur yang belum diperlukan.

---

## TEKNOLOGI

Gunakan:

- Next.js terbaru yang stabil
- TypeScript
- Tailwind CSS
- App Router
- API Route / Server Action yang sesuai
- clean reusable component structure

Untuk tahap pertama tidak perlu database dan authentication.

API key harus menggunakan environment variable dan tidak boleh terekspos di browser/client.

---

# HALAMAN UTAMA

Buat interface desktop-first tetapi tetap responsive.

Layout utama:

LEFT:
form konfigurasi lowongan

RIGHT:
live preview / generated image

---

# FORM

Buat field berikut.

## 1. Brand

Dropdown:

- Javacafe
- RUMA
- Machiro
- Custom

Untuk sekarang data brand boleh menggunakan local configuration.

Struktur brand minimal menyimpan:

- brand name
- primary color
- secondary color
- visual description

---

## 2. Job Position

Text input.

Contoh:

Admin Gudang

Barista

Marketing

Field Surveyor

---

## 3. Model

Pilihan:

- Male
- Female
- Auto

Tambahkan optional:

Age range

Contoh:

20-25 years old

---

## 4. Uniform Reference

Upload image.

User dapat mengupload foto referensi seragam yang nantinya diberikan ke AI sebagai image reference.

Tampilkan thumbnail setelah image dipilih.

---

## 5. Additional Reference Images

Buat upload opsional untuk:

- style reference
- environment reference
- pose reference

Untuk V1 cukup masing-masing satu gambar.

---

## 6. Environment / Background

Textarea.

Contoh:

"Modern warehouse with organized inventory shelves and cardboard boxes."

---

## 7. Supporting Props

Textarea.

Contoh:

Laptop, clipboard, warehouse shelves and packages.

---

## 8. Color

Color input / color picker:

Primary color

Secondary color

Secara default mengikuti brand yang dipilih tetapi user tetap dapat mengubahnya.

---

## 9. Visual Mood

Dropdown:

- Professional
- Modern
- Young & Energetic
- Warm
- Corporate
- Minimal

---

## 10. Pose Description

Textarea optional.

Contoh:

Standing confidently while holding clipboard.

---

## 11. Requirements

Buat dynamic list.

User bisa:

+ Add Requirement

Delete Requirement

Contoh:

- Female maximum 27 years old
- Familiar with Microsoft Excel
- Detail oriented
- Responsible

IMPORTANT:

Persyaratan ini saat ini tidak perlu dirender ke dalam AI generated image.

Persyaratan disiapkan untuk tahap layout poster berikutnya.

---

## 12. Vacancy Information

Input:

Headline

Position

Location

CTA

Application URL

Default headline:

WE'RE HIRING

---

## 13. Output Ratio

Pilihan:

1:1

4:5

9:16

Default:

4:5

---

# PROMPT BUILDER

Ini bagian penting.

Jangan langsung mengirim isi form mentah ke AI.

Buat sebuah reusable prompt builder.

File misalnya:

lib/buildImagePrompt.ts

Prompt harus disusun berdasarkan data form.

Contohnya apabila input:

Brand:
Javacafe

Position:
Admin Gudang

Gender:
Female

Age:
22-27

Environment:
Clean warehouse

Props:
Clipboard and boxes

Mood:
Professional

Maka prompt kurang lebih menjadi:

"Create a professional commercial recruitment campaign photograph for Javacafe.

Feature a young Indonesian female employee approximately 22-27 years old.

She is applying/working as a warehouse administrator.

Use the uploaded uniform reference as the clothing reference and preserve the important uniform characteristics accurately.

Scene:
A clean modern warehouse environment with organized inventory shelves and neatly stacked boxes.

Supporting props:
Clipboard and warehouse packages.

Visual direction:
Professional recruitment advertising photography.
Natural confident pose.
Clean composition.
Realistic human proportions.
Commercial studio quality.
Soft professional lighting.

Brand visual direction:
Primary color: ...
Secondary color: ...

Do not generate typography, recruitment requirements, random logos, watermarks or unnecessary text inside the image.

Leave enough negative space for graphic design elements that will be added by the application later."

Prompt harus menyesuaikan field yang tersedia.

Jangan menyisipkan field kosong.

---

# IMPORTANT IMAGE RULE

Untuk V1 AI hanya menghasilkan:

MODEL + CLOTHING + BACKGROUND + PROPS

JANGAN meminta AI membuat:

- headline
- persyaratan
- CTA
- nomor WhatsApp
- QR
- typography poster

Text akan ditambahkan oleh aplikasi pada tahap berikutnya.

---

# IMAGE PROVIDER ARCHITECTURE

Jangan hardcode aplikasi hanya untuk satu provider.

Buat abstraction sederhana seperti:

lib/image/providers/

dengan interface kira-kira:

generateImage({
 prompt,
 references,
 aspectRatio
})

Buat struktur agar nantinya mudah mempunyai:

- OpenAI provider
- Gemini provider

Untuk tahap awal implementasikan satu provider terlebih dahulu.

Buat provider melalui environment configuration seperti:

IMAGE_PROVIDER=openai

atau

IMAGE_PROVIDER=gemini

Jangan pernah expose API key ke frontend.

---

# UI

Saya ingin desain:

- clean
- modern
- minimal
- professional internal tool
- tidak terlalu ramai

Gunakan card dan spacing yang rapi.

Form berada di sisi kiri.

Preview berada di sisi kanan dan sticky pada desktop.

Preview state:

1. Empty state
2. Generating state
3. Generated image
4. Error state

Setelah berhasil generate sediakan:

Generate Again

Download Image

---

# VALIDATION

Pastikan minimum:

Brand

Job Position

Gender

Environment

Output Ratio

harus valid sebelum generate.

Handle error API dengan jelas dan user friendly.

---

# SECURITY

Pastikan:

API key hanya berada server-side.

.env.local masuk .gitignore.

Tidak ada secret/API key yang dikirim ke client.

Validasi file upload.

Batasi tipe file:

JPG
JPEG
PNG
WEBP

dan berikan reasonable maximum file size.

---

# PROJECT STRUCTURE

Gunakan struktur kode yang bersih dan jangan membuat satu file sangat besar.

Pisahkan minimal:

components/

types/

lib/

lib/image/

lib/image/providers/

config/

app/api/

---

# TUGAS SEKARANG

Kerjakan project secara bertahap.

Pertama:

1. Periksa environment/repository yang tersedia.
2. Buat project Next.js apabila belum ada.
3. Susun folder structure.
4. Buat data types.
5. Buat UI form lengkap.
6. Buat preview panel.
7. Buat prompt builder.
8. Buat API architecture untuk image provider.
9. Hubungkan satu image generation provider.
10. Tambahkan .env.example.
11. Jalankan lint/typecheck/build.
12. Perbaiki error yang ditemukan.

Jangan membuat fitur di luar scope V1.

Setelah selesai, jelaskan:

- apa saja yang sudah dibuat
- struktur aplikasi
- file penting
- environment variable yang harus saya isi
- cara menjalankannya
- bagian apa yang belum selesai
- rekomendasi langkah berikutnya

Jika terdapat keputusan teknis kecil, ambil keputusan terbaik sendiri tanpa terus bertanya kepada saya.

Jangan melakukan deployment terlebih dahulu.