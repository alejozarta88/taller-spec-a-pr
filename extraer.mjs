// Extractor de facturas en texto plano. Recibe texto, devuelve datos: no lee archivos ni red.
// Spec: specs/001-extraer-nit-fecha-total.md

const UMBRAL = 0.8;

const MESES = {
  enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6,
  julio: 7, agosto: 8, septiembre: 9, setiembre: 9, octubre: 10, noviembre: 11, diciembre: 12,
};

const dos = (n) => String(n).padStart(2, "0");

/** "17.017.000" → 17017000 · "119.000,00" → 119000. Punto = miles, coma = decimales (uso colombiano). */
function aNumero(s) {
  const m = s.match(/\d[\d.]*(?:,\d+)?/);
  if (!m) return null;
  const [entero, decimales] = m[0].split(",");
  const n = Number(entero.replace(/\./g, ""));
  return decimales ? n + Number(`0.${decimales}`) : n;
}

function leerNit(texto) {
  const m = texto.match(/\bnit\b[\s.:#]*([\d.]+-\d)/i);
  if (m) return { valor: m[1].replace(/\./g, ""), confianza: 0.95 };
  if (/\bdocumento\b[\s:]*[\d.]+/i.test(texto)) {
    return { valor: null, confianza: 0, motivo: "nit: solo hay un documento de identidad, no un NIT" };
  }
  return { valor: null, confianza: 0, motivo: "nit: no aparece en la factura" };
}

function leerFecha(texto) {
  // Se ignoran líneas de vencimiento o pago: la fecha que importa es la de emisión.
  const lineasFecha = texto.split(/\r?\n/).filter((l) => !/venc|l[ií]mite|pago/i.test(l)).join("\n");
  const iso = lineasFecha.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
  if (iso) return { valor: `${iso[1]}-${iso[2]}-${iso[3]}`, confianza: 0.9 };

  const palabras = lineasFecha.match(/\b(\d{1,2}) de ([a-záéíóú]+) de (\d{4})\b/i);
  if (palabras && MESES[palabras[2].toLowerCase()]) {
    const mes = MESES[palabras[2].toLowerCase()];
    return { valor: `${palabras[3]}-${dos(mes)}-${dos(palabras[1])}`, confianza: 0.85 };
  }

  // dd/mm/aaaa junto a la etiqueta "Fecha": el formato es ambiguo (S1).
  const barra = lineasFecha.match(/\bfecha\b[^\n\d]*(\d{1,2})\/(\d{1,2})\/(\d{4})/i);
  if (barra) {
    return {
      valor: `${barra[3]}-${dos(barra[2])}-${dos(barra[1])}`,
      confianza: 0.6,
      motivo: "fecha: formato dd/mm/aaaa ambiguo, confirmar día y mes",
    };
  }
  return { valor: null, confianza: 0, motivo: "fecha: no aparece en la factura" };
}

function leerTotal(texto) {
  const lineas = texto.split(/\r?\n/);
  const lineaTotal = lineas.find((l) => /^\s*total\b/i.test(l) && !/^\s*total\s+(iva|impuesto|retenci)/i.test(l));
  if (!lineaTotal) {
    const motivo = /\bsaldo\b/i.test(texto)
      ? "total: no hay TOTAL, solo un saldo con anticipo"
      : "total: no aparece en la factura";
    return { valor: null, confianza: 0, motivo };
  }
  const total = aNumero(lineaTotal.replace(/^[^\d]*/, ""));
  if (total === null) return { valor: null, confianza: 0, motivo: "total: la línea de total no tiene valor" };

  const sub = lineas.find((l) => /^\s*(subtotal|valor antes de iva)\b/i.test(l));
  const iva = lineas.find((l) => /^\s*iva\b/i.test(l));
  if (sub && iva) {
    const suma = aNumero(sub.replace(/^[^\d]*/, "")) + aNumero(iva.replace(/^[^\d%]*(\d+\s*%)?[^\d]*/, ""));
    if (suma === total) return { valor: total, confianza: 0.95 };
    return { valor: total, confianza: 0.5, motivo: `total: no cuadra con subtotal + IVA (${suma})` };
  }
  return { valor: total, confianza: 0.9 };
}

export function extraer(texto) {
  const campos = { nit: leerNit(texto), fecha: leerFecha(texto), total: leerTotal(texto) };
  const revisionHumana = Object.values(campos)
    .filter((c) => c.confianza < UMBRAL)
    .map((c) => c.motivo);
  for (const c of Object.values(campos)) delete c.motivo;
  return { campos, revisionHumana };
}
