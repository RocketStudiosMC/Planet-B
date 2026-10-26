// Utilidades compartidas. master.key y roster.json NO se suben a Git.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const { subtle } = crypto.webcrypto;
const ROOT = path.join(__dirname, "..");
const KEY_FILE = path.join(__dirname, "master.key");
const ROSTER_FILE = path.join(__dirname, "roster.json");
const USERS_FILE = path.join(ROOT, "docs", "data", "users.json");
const APP_ENC = path.join(ROOT, "docs", "data", "app.enc");
const APP_SRC = path.join(ROOT, "src", "app.js");
const ITER = 600000;

function masterKey() {
  if (!fs.existsSync(KEY_FILE)) {
    fs.writeFileSync(KEY_FILE, crypto.randomBytes(32).toString("base64"), { mode: 0o600 });
    console.log("Clave maestra creada en tools/master.key (no la subas a Git ni la pierdas).");
  }
  return Buffer.from(fs.readFileSync(KEY_FILE, "utf8").trim(), "base64");
}
// Identificador público de un usuario: SHA-256 del correo. El correo no aparece en users.json.
function emailId(email) {
  return crypto.createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
}
function loadUsers() {
  try { return JSON.parse(fs.readFileSync(USERS_FILE, "utf8")); }
  catch { return { users: [] }; }
}
function saveUsers(db) {
  fs.mkdirSync(path.dirname(USERS_FILE), { recursive: true });
  fs.writeFileSync(USERS_FILE, JSON.stringify(db, null, 2));
}
// Lista local de correos y nombres (solo para ti, no se publica).
function loadRoster() {
  try { return JSON.parse(fs.readFileSync(ROSTER_FILE, "utf8")); }
  catch { return {}; }
}
function saveRoster(r) {
  fs.writeFileSync(ROSTER_FILE, JSON.stringify(r, null, 2));
}
module.exports = { subtle, ITER, APP_ENC, APP_SRC, masterKey, emailId, loadUsers, saveUsers, loadRoster, saveRoster };
