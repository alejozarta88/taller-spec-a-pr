---
name: spec
description: Convierte un requerimiento en una spec verificable en specs/NNN-nombre.md usando la plantilla. Usar antes de escribir código.
---

1. Lee `specs/_plantilla.md` y `CLAUDE.md`.
2. Haz máximo 5 preguntas sobre lo que no puedas deducir. Lo que quede sin respuesta va como `[FALTA]` en Supuestos.
3. Escribe `specs/001-nombre.md` con criterios **Dado / Cuando / Entonces** y una línea `Verifica:` por criterio. Usa las facturas de `facturas/` como casos.
4. Corre `node verificar-spec.mjs specs/001-nombre.md` hasta que pase.
5. No escribas código.
