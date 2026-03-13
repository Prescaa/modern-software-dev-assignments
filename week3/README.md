# Week 3 — Crypto Tracker MCP Server

MCP Server sederhana untuk memantau harga cryptocurrency dan koin trending menggunakan CoinGecko API.

## Prerequisites

- Python 3.10 atau lebih baru
- Node.js (untuk menjalankan MCP Inspector)

## Setup & Installation

1. Masuk ke direktori server:
   ```bash
   cd week3/server
   ```

2. Instal dependensi:
   ```bash
   pip install -r requirements.txt
   ```

## Cara Menjalankan (Local)

Gunakan MCP Inspector untuk melakukan debugging dan testing:

```bash
npx @modelcontextprotocol/inspector python main.py
```

Setelah berjalan, buka `http://localhost:6274` di browser, klik **Connect**, dan masuk ke tab **Tools**.

## Konfigurasi Claude Desktop

Tambahkan konfigurasi berikut pada file `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "crypto-tracker": {
      "command": "python",
      "args": ["ABSOLUTE_PATH_TO_YOUR_FILE/main.py"]
    }
  }
}
```

## Tool Reference

| Tool | Deskripsi | Parameter |
|------|-----------|-----------|
| `get_crypto_price` | Mengambil harga real-time | `coin_id`, `vs_currency` |
| `get_trending_coins` | Menampilkan 7 koin paling trending di pasar saat ini | — |

## Resilience & Error Handling

- Menangani error HTTP (404, 500) secara graceful
- Rate limit awareness (HTTP 429) dengan pesan peringatan kepada user
- Validasi input untuk mencegah pengiriman data kosong ke API

## Struktur Folder

```text
week3/
├── README.md
└── server/
    ├── main.py
    └── requirements.txt
```