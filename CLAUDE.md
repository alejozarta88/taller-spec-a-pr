# Taller · Extractor de facturas

Ejercicio del semillero. Node 22, JavaScript con módulos (`.mjs`), **sin dependencias**: nada de `npm install`.

## Comandos

- Pruebas: `node --test`
- Compuerta de spec: `node verificar-spec.mjs specs/001-*.md`

## Qué construimos

Una función `extraer(texto)` que lee una factura en texto plano y devuelve:

```js
{
  campos: {
    nit:   { valor: "900123456-7", confianza: 0.95 },
    fecha: { valor: "2026-09-15", confianza: 0.9 },
    total: { valor: 17017000,     confianza: 0.9 }
  },
  revisionHumana: ["campo con confianza < 0.8", ...]
}
```

## Reglas

1. Sin spec no hay código. La spec va en `specs/` con `specs/_plantilla.md`.
2. Prueba roja primero, un criterio a la vez.
3. Si un campo no se puede leer con seguridad, **no se inventa**: confianza baja y va a `revisionHumana`.
4. `extraer` no lee archivos ni red: recibe texto, devuelve datos. Leer archivos es de quien la llama.
5. Quien escribe no califica: antes del PR, `/revisar`.
6. `facturas/` es de solo lectura.
