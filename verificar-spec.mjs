// Compuerta de spec del taller: secciones, Dado/Cuando/Entonces y "Verifica:" por criterio.
import { readFileSync } from "node:fs";
const SECCIONES = ["## Problema y valor", "## Criterios de aceptación", "## Fuera de alcance", "## Diseño", "## Supuestos", "## Verificación"];
let fallas = 0;
for (const archivo of process.argv.slice(2)) {
  const t = readFileSync(archivo, "utf8");
  for (const s of SECCIONES) if (!t.includes(s)) { console.log(`FALLA ${archivo}: falta "${s}"`); fallas++; }
  const bloques = t.split(/^\s*-\s*\[[ x]\]\s*\*\*CA\d+/gim).slice(1);
  if (!bloques.length) { console.log(`FALLA ${archivo}: sin criterios "- [ ] **CA1** ..."`); fallas++; }
  bloques.forEach((b, i) => {
    const c = b.split(/^\s*-\s*\[|^## /m)[0];
    if (!/Dado/i.test(c) || !/Cuando/i.test(c) || !/Entonces/i.test(c)) { console.log(`FALLA CA${i + 1}: sin Dado/Cuando/Entonces`); fallas++; }
    if (!/Verifica:/i.test(c)) { console.log(`FALLA CA${i + 1}: sin "Verifica:"`); fallas++; }
  });
}
console.log(fallas ? `${fallas} falla(s). La spec no entra a código.` : "PASA: la spec es verificable.");
process.exit(fallas ? 1 : 0);
