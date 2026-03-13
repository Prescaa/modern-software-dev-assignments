import requests
import sys
from mcp.server.fastmcp import FastMCP

# 1. Inisialisasi FastMCP Server
mcp = FastMCP("Crypto-Tracker")

COINGECKO_API_BASE = "https://api.coingecko.com/api/v3"


# 2. Tool 1: Mendapatkan Harga Koin
@mcp.tool()
def get_crypto_price(coin_id: str, vs_currency: str = "usd") -> str:
    """
    Mengambil harga real-time sebuah cryptocurrency.

    Args:
        coin_id: ID koin dari CoinGecko (contoh: 'bitcoin', 'ethereum').
        vs_currency: Mata uang target (contoh: 'usd', 'idr').
    """
    # Sanitasi input: hapus spasi dan jadikan huruf kecil
    coin_id = coin_id.strip().lower()
    vs_currency = vs_currency.strip().lower()

    if not coin_id:
        return "Error: coin_id tidak boleh kosong."

    try:
        url = f"{COINGECKO_API_BASE}/simple/price"
        # Menyiapkan parameter untuk API
        query_params = {"ids": coin_id, "vs_currencies": vs_currency}

        # PERBAIKAN: Masukkan params=query_params ke dalam request
        response = requests.get(url, params=query_params, timeout=10)

        # Log ke stderr agar muncul di inspector/logs tanpa ngerusak transport
        print(f"DEBUG: Meminta harga untuk {coin_id} dalam {vs_currency}", file=sys.stderr)

        # Implementasi Resilience: Cek Rate Limit (HTTP 429)
        if response.status_code == 429:
            return "Error: Terkena rate limit API CoinGecko. Silakan coba lagi nanti."

        response.raise_for_status()
        data = response.json()

        # Validasi jika data kosong atau koin tidak ditemukan
        if not data or coin_id not in data:
            return f"Error: Koin '{coin_id}' tidak ditemukan. Gunakan ID resmi (misal: 'bitcoin', 'ethereum')."

        if vs_currency not in data[coin_id]:
            return f"Error: Mata uang '{vs_currency}' tidak didukung."

        price = data[coin_id][vs_currency]
        return f"Harga {coin_id.capitalize()} saat ini adalah {price:,} {vs_currency.upper()}."

    except requests.exceptions.RequestException as e:
        return f"Gagal mengambil data dari API: {str(e)}"


# 3. Tool 2: Mendapatkan Koin Trending
@mcp.tool()
def get_trending_coins() -> str:
    """
    Mendapatkan daftar 7 koin yang paling banyak dicari di CoinGecko dalam 24 jam terakhir.
    """
    try:
        url = f"{COINGECKO_API_BASE}/search/trending"
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()

        # Mengambil nama koin dari list trending
        trending_list = [coin["item"]["name"] for coin in data["coins"]]

        if not trending_list:
            return "Tidak ada koin trending saat ini."

        return "🔥 Koin yang sedang tren saat ini: " + ", ".join(trending_list)

    except Exception as e:
        return f"Terjadi kesalahan saat mengambil tren: {str(e)}"


if __name__ == "__main__":
    mcp.run()
