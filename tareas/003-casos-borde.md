# Requerimiento 003 · Casos que no deben engañar

**Para:** Pruebas · **Viene de:** Informe del revisor de la spec 001

## Qué pasa hoy

El revisor de la 001 encontró que `$ 119.000,00` salía 100 veces más grande con confianza alta. Ya se corrigió, pero eso muestra que faltan casos. El riesgo no es fallar: es **acertar mal con confianza alta**.

## Qué se necesita

Una batería de pruebas que busque engaños, con esta regla: o el valor es correcto, o la confianza es < 0.8 y el campo va a revisión. Nunca un valor equivocado con confianza ≥ 0.8.

Casos para empezar:

- NIT del cliente antes que el del proveedor (pendiente en Hallazgos de la 001).
- Fechas: `oct 3, 2026`, `03-10-2026`, `2026/10/03`, y dos fechas en la misma línea.
- Totales: `$17.017.000` sin espacio, `17,017,000` con formato gringo, `Total en letras: diecisiete millones...`.
- Texto vacío, texto basura y una factura en inglés.

## Preguntas que la spec debe resolver (o dejar como [FALTA])

- ¿Qué casos se arreglan en el código y cuáles solo se documentan como "va a revisión"?
- ¿Las pruebas que hoy fallan se marcan con `todo` o se arreglan en esta misma spec?

## Pistas

- Escribe primero todas las pruebas en rojo y deja que la spec decida cuáles pasan a verde.
- Un archivo aparte: `casos-borde.test.mjs`. `node --test` lo toma solo.
