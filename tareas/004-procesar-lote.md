# Requerimiento 004 · Procesar un lote de facturas

**Para:** Full stack · **Viene de:** regla 4 de CLAUDE.md ("leer archivos es de quien la llama")

## Qué pasa hoy

`extraer` funciona con una factura en texto, pero nadie la llama. Quien causa necesita pasar una carpeta y ver qué salió solo y qué necesita revisión.

## Qué se necesita

Un comando `node procesar.mjs <carpeta>` que:

- Lea cada `.txt` de la carpeta y llame a `extraer`.
- Escriba un `reporte.json` con el resultado de cada archivo.
- Imprima un resumen: cuántas salieron solas y cuáles van a revisión, con el motivo.

Si queda tiempo: una página `reporte.html` estática (sin dependencias) que muestre la cola de revisión.

## Preguntas que la spec debe resolver (o dejar como [FALTA])

- ¿Dónde se escribe el reporte? Nunca dentro de `facturas/`.
- ¿Qué pasa con un archivo que no es `.txt` o que no se puede leer?
- ¿El comando falla (código de salida ≠ 0) si hay facturas para revisión, o solo informa?

## Pistas

- `extraer.mjs` no cambia: toda la lectura de archivos vive en `procesar.mjs`.
- Para probar, crea una carpeta temporal en la prueba; no uses `facturas/` como salida.
- `.claude/settings.json` puede necesitar permitir `node procesar.mjs`. Esa decisión va en la spec.
