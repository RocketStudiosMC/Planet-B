# Planet-B

Cotizador de builds de Minecraft con acceso privado, publicado como página estática (GitHub Pages).

## Cómo funciona
- Los precios (`src/app.js`) se cifran con AES-GCM y se publican como `docs/data/app.enc`.
- Cada persona tiene una contraseña. Su copia de la clave maestra y su nombre van cifrados con PBKDF2 (600 000 iteraciones) en `docs/data/users.json`.
- En `users.json` el correo aparece solo como hash SHA-256, así que no se lee a simple vista.
- Hay 5 temas (Planet, Océano, Atardecer, Bosque y Noche). La elección se guarda en el navegador de cada persona.

## Primeros pasos (en tu computadora)
1. Requisito: Node.js 18 o superior.
2. Da de alta a cada persona:

       node tools/user.js add-user ana@correo.com "Ana" "contraseña-larga"

   La primera vez se crea `tools/master.key`. **Respáldalo** fuera del proyecto.
3. Cifra los precios:

       node tools/build.js

## Publicar en GitHub Pages
Repo público, luego **Settings → Pages → Deploy from a branch → main / docs**.

Antes de subir, revisa que **no** aparezcan `tools/master.key`, `tools/roster.json` ni `src/` (están en `.gitignore`).

    git add .
    git commit -m "Actualización"
    git push

## Administrar usuarios
    node tools/user.js list-users
    node tools/user.js add-user correo "Nombre" "nueva-contraseña"   # cambia la contraseña si ya existe
    node tools/user.js remove-user correo

Después de cualquier cambio de usuarios o precios: `build` (si cambiaron precios), luego `git add`, `commit` y `push`.

`list-users` lee `tools/roster.json`, la lista local de correos y nombres. Si la borras, los usuarios siguen funcionando, pero `list-users` no los mostrará.

## Límites
- **Quitar a alguien no le quita lo que ya descargó.** Puede seguir usando la copia cifrada que tenía. Para revocarlo de verdad hay que cambiar la clave maestra y volver a dar de alta a los demás con su contraseña. Quitarlo sí evita que reciba la versión nueva.
- El hash del correo se puede comparar contra una lista de correos conocidos. Por eso sigue siendo importante una contraseña larga (mínimo 12 caracteres).
- Esto protege los precios con un nivel razonable para un negocio pequeño, pero no es un sistema bancario.

## Temas
- **Color:** Planet, Océano, Atardecer, Bosque y Rocket. Se eligen con los puntos de colores.
- **Modo:** claro u oscuro, con el botón sol/luna. Si no eliges, sigue la configuración del sistema.
- Las preferencias se guardan en el navegador de cada persona.

## Logos
- `docs/assets/planetb.png`: logo de Planet-B (cabecera, pantalla de acceso e icono de la pestaña).
- `docs/assets/rocket-studios.png`: logo de Rocket Studios (pie de página).
- Los logos son máscaras: toman el color del tema, así que se ven bien en cualquier paleta.
