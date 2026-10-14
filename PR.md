## Qué cambia y para quién

<!-- Una línea: qué cambia para el usuario u operador. -->

**Spec:** `specs/NNN-...md`

## Criterios

| Criterio | Verificación | Resultado |
|---|---|---|
| CA1 | `pnpm prueba-...` · nombre | pasa / falla |

## Checklist con ADN Trycore

Cada casilla se marca **con evidencia** (comando y salida, archivo y línea), no con opinión.

- [ ] **Hablaremos de lo que estamos seguros.** Cada afirmación de este PR tiene su comando y salida. Pega aquí la salida resumida de `node --test`.
- [ ] **Haremos a un lado prejuicios y suposiciones.** Los supuestos están escritos en la spec; los `[FALTA]` están resueltos o explicados.
- [ ] **Nunca dejaremos de lado la experiencia de nuestros usuarios.** Arriba dice qué cambia para quien usa o opera el sistema.
- [ ] **Somos personas, no máquinas.** El cambio pasó por el subagente `revisor` (informe adjunto) y lo fusiona una persona. Ningún agente aprueba su propio trabajo.
- [ ] **Hacemos la tecnología simple y para todos.** Sin dependencias nuevas, o justificadas en la spec. Ninguna pieza ganó una segunda responsabilidad.
- [ ] **Seremos la solución, no el problema.** Todo lo que pasaba antes sigue pasando. Compuertas en verde.
- [ ] **Transparencia.** Lo que quedó por fuera o la deuda nueva está en "Hallazgos" de la spec.

## Informe del revisor

<!-- Pega el informe de /revisar tal como salió. -->

## Hallazgos y deuda
