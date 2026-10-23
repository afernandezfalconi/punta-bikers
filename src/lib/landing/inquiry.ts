export const scooters = ["Italika WS150 Sport", "Italika D125 blanco-azul", "Italika WS150 azul", "Vento Reptile Xt 200"] as const;
export type Scooter = (typeof scooters)[number];
export type Lang = "es" | "en";
export type Inquiry = { scooter: Scooter; from: string; until: string; delivery: "meeting" | "hotel"; hotel: string };

export function scooterLabel(s: Scooter, lang: Lang = "es") {
  if (lang !== "en") return s;
  return s.replace("blanco-azul", "white-blue").replace(/azul$/, "blue");
}

const copy = {
  es: { hello: "¡Hola, Punta Biker! Me gustaría consultar por una scooter en Puerto Escondido.", scooter: "Scooter", from: "Desde", until: "Hasta", hotel: "Entrega: hotel", tbc: " (por confirmar)", meeting: "Entrega: punto de encuentro (por coordinar).", ask: "¿Me comparten disponibilidad y detalles?", note: "Consulta, no reserva." },
  en: { hello: "Hi, Punta Biker! I'd like to ask about a scooter in Puerto Escondido.", scooter: "Scooter", from: "From", until: "Until", hotel: "Delivery: hotel", tbc: " (to be confirmed)", meeting: "Delivery: meeting point (to be arranged).", ask: "Could you share availability and details?", note: "Inquiry, not a booking." },
};

export function buildInquiry(data: Inquiry, lang: Lang = "es") {
  const c = copy[lang];
  const lines = [c.hello, `${c.scooter}: ${scooterLabel(data.scooter, lang)}.`];
  if (data.from) lines.push(`${c.from}: ${data.from}.`);
  if (data.until) lines.push(`${c.until}: ${data.until}.`);
  lines.push(data.delivery === "hotel" ? `${c.hotel}${data.hotel.trim() ? ` — ${data.hotel.trim()}` : c.tbc}.` : c.meeting);
  lines.push(c.ask, c.note);
  return lines.join("\n");
}

export function whatsappShareUrl(message: string) {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
