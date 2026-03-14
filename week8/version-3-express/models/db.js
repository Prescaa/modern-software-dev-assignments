const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "..", "data", "dcc.json");
const dataDir = path.join(__dirname, "..", "data");

// Pastikan folder 'data' ada
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Inisialisasi file JSON jika belum ada
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ categories: [], notes: [] }, null, 2));
}

const db = {
    read: () => {
        const data = fs.readFileSync(dbPath, "utf-8");
        return JSON.parse(data);
    },
    write: (data) => {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    }
};

module.exports = db;