---
name: implementar
description: Implementa una spec aprobada criterio por criterio, con prueba roja primero. Usar después de aprobar el plan.
---

Para cada criterio de la spec ($ARGUMENTS), en orden:

1. Escribe la prueba en `extraer.test.mjs` con `node:test`. Córrela con `node --test` y muestra que falla.
2. Escribe el mínimo código en `extraer.mjs` para que pase.
3. Corre `node --test` completo. Todo en verde antes del siguiente criterio.
4. Marca el criterio con `- [x]` en la spec.

Al final muestra `git diff --stat` y sugiere `/revisar`. No hagas commit.
