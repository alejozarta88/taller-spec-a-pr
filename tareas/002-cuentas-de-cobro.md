# Requerimiento 002 · Cuentas de cobro de persona natural

**Para:** Back · **Viene de:** Hallazgos de la spec 001

## Qué pasa hoy

`f3-ambigua.txt` es una cuenta de cobro, no una factura electrónica. Hoy `extraer` manda todo a revisión humana: es seguro, pero no ayuda a quien causa.

## Qué se necesita

Que `extraer` reconozca una cuenta de cobro y devuelva lo que sí aplica:

- Tipo de documento: `factura` o `cuenta_de_cobro`.
- Cédula de quien cobra (no es un NIT).
- Valor del servicio, anticipo y saldo, cada uno por separado.

## Preguntas que la spec debe resolver (o dejar como [FALTA])

- ¿Qué valor se causa: el del servicio o el saldo? (Es el S3 pendiente de la 001.)
- ¿Cuál fecha cuenta: la del documento o la del servicio prestado?
- ¿Cambia el contrato de salida de `extraer`? Si cambia, que las pruebas de la 001 sigan en verde.

## Pistas

- No se toca `facturas/`. Los casos nuevos van como texto dentro de las pruebas.
- Una función nueva por campo, igual que `leerNit`, `leerFecha` y `leerTotal`.
