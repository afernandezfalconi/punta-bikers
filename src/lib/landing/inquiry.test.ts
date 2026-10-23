import { describe, it, expect } from "vitest";
import { buildInquiry, scooterLabel, scooters, whatsappShareUrl, type Inquiry } from "./inquiry";

const inquiry: Inquiry = { scooter: scooters[0], from: "", until: "", delivery: "meeting", hotel: "" };
describe("Punta Biker inquiry boundaries", () => {
  it("offers exactly the four actual rental vehicles", () => {
    expect(scooters).toEqual(["Italika WS150 Sport", "Italika D125 blanco-azul", "Italika WS150 azul", "Vento Reptile Xt 200"]);
  });
  it("labels the WS150 color in English without renaming the ATV", () => {
    expect(scooterLabel("Italika WS150 azul", "en")).toBe("Italika WS150 blue");
    expect(scooterLabel("Italika D125 blanco-azul", "en")).toBe("Italika D125 white-blue");
    expect(scooterLabel("Vento Reptile Xt 200", "en")).toBe("Vento Reptile Xt 200");
  });
  it("generates an inquiry rather than a reservation", () => {
    expect(buildInquiry(inquiry)).toContain("Consulta, no reserva.");
  });
  it("omits dates when they are not supplied", () => {
    expect(buildInquiry(inquiry)).not.toMatch(/Desde:|Hasta:/);
  });
  it("includes optional dates when supplied", () => {
    expect(buildInquiry({ ...inquiry, from: "2026-11-01", until: "2026-11-03" })).toContain("Desde: 2026-11-01.\nHasta: 2026-11-03.");
  });
  it("supports meeting-point delivery", () => {
    expect(buildInquiry(inquiry)).toContain("Entrega: punto de encuentro (por coordinar).");
  });
  it("supports hotel delivery", () => {
    expect(buildInquiry({ ...inquiry, delivery: "hotel", hotel: "Casa del Mar" })).toContain("Entrega: hotel — Casa del Mar.");
  });
  it("generates the English inquiry, still not a booking", () => {
    const text = buildInquiry({ ...inquiry, from: "2026-11-01" }, "en");
    expect(text).toContain("Inquiry, not a booking.");
    expect(text).toContain("From: 2026-11-01.");
  });
  it("shares text without inventing a business phone number", () => {
    const text = buildInquiry(inquiry);
    expect(whatsappShareUrl(text)).toBe(`https://wa.me/?text=${encodeURIComponent(text)}`);
  });
});
