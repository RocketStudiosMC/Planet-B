// Alta, baja y lista de usuarios.
//   node tools/user.js add-user correo "Nombre" contraseña
//   node tools/user.js remove-user correo
//   node tools/user.js list-users
const crypto = require("crypto");
const { subtle, ITER, masterKey, emailId, loadUsers, saveUsers, loadRoster, saveRoster } = require("./common");

const b64 = b => Buffer.from(b).toString("base64");

async function passKey(password, salt, usage) {
  const base = await subtle.importKey("raw", Buffer.from(password, "utf8"), "PBKDF2", false, ["deriveBits"]);
  const bits = await subtle.deriveBits({ name: "PBKDF2", salt, iterations: ITER, hash: "SHA-256" }, base, 256);
  return subtle.importKey("raw", bits, "AES-GCM", false, usage);
}
// Cifra con la contraseña de la persona: la clave maestra y su nombre.
async function wrap(password, name) {
  const salt = crypto.randomBytes(16), iv = crypto.randomBytes(12);
  const k = await passKey(password, salt, ["encrypt"]);
  const payload = Buffer.from(JSON.stringify({ mk: masterKey().toString("base64"), name }), "utf8");
  const ct = await subtle.encrypt({ name: "AES-GCM", iv }, k, payload);
  return { salt: b64(salt), iterations: ITER, iv: b64(iv), data: b64(ct) };
}

(async () => {
  const [cmd, ...a] = process.argv.slice(2);
  const db = loadUsers();
  const roster = loadRoster();
  if (cmd === "add-user") {
    const [email, name, password] = a;
    if (!email || !name || !password) {
      console.log('Uso: node tools/user.js add-user correo "Nombre" contraseña');
      process.exit(1);
    }
    const key = email.trim().toLowerCase(), id = emailId(key);
    db.users = db.users.filter(u => u.id !== id);
    db.users.push({ id, ...(await wrap(password, name)) });
    saveUsers(db);
    roster[key] = name;
    saveRoster(roster);
    console.log(`Usuario guardado: ${key} (si ya existía, se actualizó su contraseña)`);
  } else if (cmd === "remove-user") {
    const key = (a[0] || "").trim().toLowerCase(), id = emailId(key);
    const n = db.users.length;
    db.users = db.users.filter(u => u.id !== id);
    if (n === db.users.length) console.log("No existe ese usuario.");
    else {
      saveUsers(db);
      delete roster[key];
      saveRoster(roster);
      console.log(`Usuario quitado: ${key}`);
    }
  } else if (cmd === "list-users") {
    const lines = Object.entries(roster).map(([e, n]) => `${e} (${n})`);
    console.log(lines.join("\n") || "No hay usuarios.");
  } else {
    console.log("Comandos: add-user | remove-user | list-users");
  }
})();
