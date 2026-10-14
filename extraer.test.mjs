import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { extraer } from "./extraer.mjs";

// Las pruebas leen las facturas; extraer solo recibe el texto (regla 4).
const factura = (n) => readFileSync(new URL(`./facturas/${n}`, import.meta.url), "utf8");

test("CA1 factura limpia", () => {
  const r = extraer(factura("f1-limpia.txt"));
  assert.equal(r.campos.nit.valor, "900123456-7");
  assert.equal(r.campos.fecha.valor, "2026-09-15");
  assert.equal(r.campos.total.valor, 17017000);
  for (const c of Object.values(r.campos)) assert.ok(c.confianza >= 0.8);
  assert.deepEqual(r.revisionHumana, []);
});

test("CA2 factura con variaciones", () => {
  const r = extraer(factura("f2-variaciones.txt"));
  assert.equal(r.campos.nit.valor, "830555210-1");
  assert.equal(r.campos.fecha.valor, "2026-10-03");
  assert.equal(r.campos.total.valor, 4998000);
  for (const c of Object.values(r.campos)) assert.ok(c.confianza >= 0.8);
  assert.deepEqual(r.revisionHumana, []);
});

test("CA3 cuenta de cobro ambigua", () => {
  const r = extraer(factura("f3-ambigua.txt"));
  assert.equal(r.campos.nit.valor, null);
  assert.equal(r.campos.nit.confianza, 0);
  assert.equal(r.campos.total.valor, null);
  assert.equal(r.campos.total.confianza, 0);
  assert.ok(r.campos.fecha.confianza < 0.8);
  assert.equal(r.revisionHumana.length, 3);
  assert.ok(r.revisionHumana.some((m) => m.startsWith("nit:")));
  assert.ok(r.revisionHumana.some((m) => m.startsWith("fecha:")));
  assert.ok(r.revisionHumana.some((m) => m.startsWith("total:")));
});

test("CA4 total contra subtotal más IVA", () => {
  const cuadra = extraer(factura("f1-limpia.txt"));
  assert.ok(cuadra.campos.total.confianza >= 0.95);

  const descuadrada = "NIT: 900.123.456-7\nFecha: 2026-09-15\nSubtotal: $ 100.000\nIVA 19%: $ 19.000\nTOTAL: $ 150.000";
  const r = extraer(descuadrada);
  assert.equal(r.campos.total.valor, 150000);
  assert.ok(r.campos.total.confianza < 0.8);
  assert.ok(r.revisionHumana.some((m) => m.startsWith("total:")));
});

test("CA5 extraer no lee archivos ni red", () => {
  const fuente = readFileSync(new URL("./extraer.mjs", import.meta.url), "utf8");
  assert.doesNotMatch(fuente, /\bimport\b/);
  assert.doesNotMatch(fuente, /require\(|fetch\(|node:fs|node:http/);
  const r = extraer("");
  assert.equal(r.revisionHumana.length, 3);
});

test("CA6 formatos que no deben engañar", () => {
  const conDecimales = extraer("NIT: 900.123.456-7\nFecha: 2026-09-15\nSubtotal: $ 100.000,00\nIVA 19%: $ 19.000,00\nTOTAL: $ 119.000,00");
  assert.equal(conDecimales.campos.total.valor, 119000);

  const conTotalIva = extraer("NIT: 900.123.456-7\nFecha: 2026-09-15\nTotal IVA: $ 19.000\nTOTAL A PAGAR: $ 119.000");
  assert.equal(conTotalIva.campos.total.valor, 119000);

  const conVencimiento = extraer("NIT: 900.123.456-7\nFecha de vencimiento: 2026-10-15\nFecha de emisión: 2026-09-15\nTOTAL: $ 119.000");
  assert.equal(conVencimiento.campos.fecha.valor, "2026-09-15");
});
