// Cifra src/app.js en docs/data/app.enc. Ejecútalo cada vez que cambies los precios.
//   node tools/build.js
const crypto = require("crypto");
const fs = require("fs");
const { subtle, APP_ENC, APP_SRC, masterKey } = require("./common");

(async () => {
  const k = await subtle.importKey("raw", masterKey(), "AES-GCM", false, ["encrypt"]);
  const iv = crypto.randomBytes(12);
  const ct = await subtle.encrypt({ name: "AES-GCM", iv }, k, fs.readFileSync(APP_SRC));
  fs.writeFileSync(APP_ENC, Buffer.concat([iv, Buffer.from(ct)]).toString("base64"));
  console.log("Listo: docs/data/app.enc actualizado.");
})();
