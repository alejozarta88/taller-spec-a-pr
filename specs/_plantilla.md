# NNN · Título corto en verbo

> Estado: borrador | aprobada | implementada · Autor: · Fecha:

## Problema y valor

Máximo 3 líneas. Quién tiene el problema, qué le cuesta hoy y cómo se nota que se resolvió.

**Principio Trycore que toca:** (ej. "Hablaremos de lo que estamos seguros")

## Criterios de aceptación

- [ ] **CA1** · Dado ..., cuando ..., entonces ...
  Verifica: `node --test` · nombre de la verificación
- [ ] **CA2** · Dado ..., cuando ..., entonces ...
  Verifica: ...

## Fuera de alcance

- Lo que tentaría hacer en este cambio y no se hará.

## Diseño

- Qué módulo cambia y qué responsabilidad gana. Si toca más de uno, por qué.
- Reglas de arquitectura que podría tocar (regla 4 de CLAUDE.md).
- Dependencias nuevas: ninguna | cuál y por qué.

## Supuestos

- S1 · Lo que asumimos sin confirmar. Si no se sabe: `[FALTA]`.

## Verificación

Comandos que deben quedar en verde antes del PR:

```
node --test && node verificar-spec.mjs specs/001-*.md
```

## Hallazgos

Lo que apareció durante la implementación y quedó fuera de alcance.
