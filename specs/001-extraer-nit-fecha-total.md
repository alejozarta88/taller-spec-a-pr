# 001 · Extraer NIT, fecha y total de una factura

> Estado: implementada · Autor: Mario Zarta · Fecha: 2026-10-14

## Problema y valor

Quien causa las facturas de proveedores copia a mano el NIT, la fecha y el total de cada una. Es lento y los errores se descubren tarde, al conciliar. Se nota resuelto cuando las facturas limpias salen solas y solo llegan a una persona las que tienen un campo dudoso, con el motivo escrito.

**Principio Trycore que toca:** "Hablaremos de lo que estamos seguros". Un campo que no se puede leer con seguridad no se adivina: sale con confianza baja y va a revisión humana.

## Criterios de aceptación

- [x] **CA1** · Dado la factura limpia `f1-limpia.txt`, cuando se llama `extraer(texto)`, entonces devuelve NIT `900123456-7`, fecha `2026-09-15` y total `17017000`, todos con confianza ≥ 0.8, y `revisionHumana` vacía.
  Verifica: `node --test` · CA1 factura limpia

- [x] **CA2** · Dado la factura con variaciones de formato `f2-variaciones.txt` ("Nit" en minúscula, fecha escrita en palabras, total con "COP" y puntos), cuando se llama `extraer(texto)`, entonces devuelve NIT `830555210-1`, fecha `2026-10-03` y total `4998000`, todos con confianza ≥ 0.8, y `revisionHumana` vacía.
  Verifica: `node --test` · CA2 factura con variaciones

- [x] **CA3** · Dado la cuenta de cobro ambigua `f3-ambigua.txt` (cédula en vez de NIT, fecha dd/mm/aaaa y un saldo con anticipo en vez de un total), cuando se llama `extraer(texto)`, entonces no inventa: NIT y total salen con valor `null` y confianza 0, la fecha sale con confianza < 0.8, y los tres campos aparecen en `revisionHumana` con su motivo.
  Verifica: `node --test` · CA3 cuenta de cobro ambigua

- [x] **CA4** · Dado una factura cuyo total no cuadra con subtotal + IVA, cuando se llama `extraer(texto)`, entonces el total baja a confianza < 0.8 y va a `revisionHumana`; y dado una factura donde sí cuadra, la confianza del total es ≥ 0.95.
  Verifica: `node --test` · CA4 total contra subtotal más IVA

- [x] **CA5** · Dado el módulo `extraer.mjs`, cuando se revisa su código, entonces no importa módulos de archivos ni de red, y `extraer` recibe texto y devuelve datos (regla 4).
  Verifica: `node --test` · CA5 extraer no lee archivos ni red

- [x] **CA6** · Dado una factura con decimales (`$ 119.000,00`), una línea "Total IVA" o una fecha de vencimiento antes de la de emisión, cuando se llama `extraer(texto)`, entonces el total es `119000` y no 100 veces más, "Total IVA" no se toma como total, y la fecha es la de emisión.
  Verifica: `node --test` · CA6 formatos que no deben engañar

## Fuera de alcance

- Leer las facturas desde disco, PDF u OCR. Eso es de quien llama a `extraer`.
- Validar el dígito de verificación del NIT contra la DIAN.
- Extraer ítems, IVA como campo propio o datos del cliente.
- Monedas distintas de COP.

## Diseño

- Un solo módulo nuevo: `extraer.mjs`, con una responsabilidad: texto de factura → campos con confianza. Sin estado ni efectos.
- Cada campo tiene su función (`leerNit`, `leerFecha`, `leerTotal`) que devuelve `{ valor, confianza, motivo }`. `extraer` las junta y arma `revisionHumana` con todo lo que quede por debajo de 0.8.
- El total se contrasta con subtotal + IVA cuando ambos aparecen: si cuadra, sube la confianza; si no, la baja.
- "Subtotal" no se confunde con "Total": la búsqueda exige que la línea empiece por "Total".
- Regla 4 de CLAUDE.md: `extraer` no lee archivos ni red. Las pruebas leen las facturas y le pasan el texto.
- Dependencias nuevas: ninguna.

## Supuestos

- S1 · Las fechas `dd/mm/aaaa` siguen el uso colombiano (día primero), pero como el formato es ambiguo, la confianza queda en 0.6 y va a revisión.
- S2 · Un "Documento" con número sin dígito de verificación es una cédula, no un NIT. No se usa como NIT.
- S3 · En una cuenta de cobro con anticipo, el "Saldo" no es el total de la factura. No se toma como total. `[FALTA]` confirmar con contabilidad qué valor se causa en estos casos.
- S4 · El umbral de revisión es confianza < 0.8, como dice CLAUDE.md.

## Verificación

Comandos que deben quedar en verde antes del PR:

```
node --test && node verificar-spec.mjs specs/001-*.md
```

## Hallazgos

- `f3-ambigua.txt` es una cuenta de cobro de persona natural, no una factura electrónica. Vale la pena una spec aparte para cuentas de cobro: qué campos aplican y qué se causa.
- Revisión independiente (`/revisar`): encontró que los decimales `,00` multiplicaban el total por 100 con confianza alta. Se corrigió con CA6, junto con "Total IVA" y la fecha de vencimiento.
- Pendiente: si la factura muestra el NIT del cliente antes que el del proveedor, se toma el primero. Hoy se asume que el proveedor va arriba; vale una spec que distinga emisor y adquiriente.
- La fecha en palabras solo cubre el formato "3 de octubre de 2026". Otros formatos ("oct 3, 2026") salen sin fecha y a revisión, que es el comportamiento seguro.
