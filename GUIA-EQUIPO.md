# Guía del equipo · De requerimiento a PR con Claude Code

La spec 001 quedó cerrada (ver `PR-001.md`). Sus hallazgos se convierten en tres tareas, una por persona, según su fuerte:

| Tarea | Para | Requerimiento |
|---|---|---|
| 002 · Cuentas de cobro | Back | `tareas/002-cuentas-de-cobro.md` |
| 003 · Casos que no deben engañar | Pruebas | `tareas/003-casos-borde.md` |
| 004 · Procesar un lote de facturas | Full stack | `tareas/004-procesar-lote.md` |

Las tres son independientes: pueden avanzar en paralelo sin pisarse.

## El flujo (igual para todos)

Una tarea es una spec, una rama y un PR.

```
git checkout main && git pull
git checkout -b spec/00N-nombre
claude
```

Dentro de Claude Code:

1. **`/spec tareas/00N-....md`**: Claude hace hasta 5 preguntas y escribe `specs/00N-nombre.md`. Tú respondes y decides. Lo que nadie sepa queda como `[FALTA]` en Supuestos, sin inventarlo.
2. **Compuerta:** `node verificar-spec.mjs specs/00N-*.md` debe decir PASA. Si no pasa, no hay código.
3. **Modo plan** (Shift+Tab dos veces): pide el plan, léelo y apruébalo o corrígelo. Aquí manda la persona.
4. **`/implementar specs/00N-....md`**: un criterio a la vez, con la prueba en rojo primero y luego en verde.
5. **`/revisar specs/00N-....md`**: el subagente `revisor` revisa sin haber visto cómo se escribió. Los bloqueantes se corrigen con un criterio nuevo y su prueba.
6. **PR:** `git push -u origin spec/00N-nombre`. Llena `PR.md` con evidencia, no con opinión. Otra persona del equipo aprueba y fusiona.

`.claude/settings.json` ya pone los límites: `facturas/` no se toca, no hay `npm install` y el commit pide confirmación.

## Cómo ser ágiles con esto

- **Timebox de un día por tarea.** Si no cabe, la spec es muy grande: pártela, por ejemplo en 002a y 002b.
- **El incremento es el PR.** Lo que no está en un PR en verde no está hecho.
- **Definición de hecho:** el checklist ADN Trycore de `PR.md` marcado con evidencia.
- **Daily asíncrono:** un comentario en el PR propio (qué hice, qué sigue, qué me bloquea). Dos minutos.
- **Revisión cruzada:** Back revisa a Full stack, Full stack revisa a Pruebas y Pruebas revisa a Back. Además del subagente, siempre lo mira una persona.
- **Retro de 15 minutos al cerrar las tres:** qué pregunta del `/spec` faltó hacer, qué atrapó el revisor y qué cambiamos en `CLAUDE.md` o en las skills para la próxima.

## Reglas que no cambian

Las de `CLAUDE.md`: sin spec no hay código, prueba roja primero, no se inventa, `extraer` no hace I/O, quien escribe no califica y `facturas/` es de solo lectura.
