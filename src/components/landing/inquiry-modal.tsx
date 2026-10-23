"use client";

import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, Check, Copy, MapPin, Hotel, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/landing/ui/button";
import { buildInquiry, scooters, scooterLabel, whatsappShareUrl, type Inquiry, type Scooter, type Lang } from "@/lib/landing/inquiry";
import { dict } from "@/lib/landing/i18n";
const logoDark = { url: "/landing/punta-biker-logo-dark.png" };

export function InquiryModal({ open, onOpenChange, selected, lang = "es" }: { open: boolean; onOpenChange: (open: boolean) => void; selected: Scooter; lang?: Lang }) {
  const [data, setData] = useState<Inquiry>({ scooter: selected, from: "", until: "", delivery: "meeting", hotel: "" });
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const preview = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { if (open) { setData(d => ({ ...d, scooter: selected })); setCopied(false); setCopyError(false); } }, [open, selected]);
  const t = dict[lang].m;
  const message = buildInquiry(data, lang);
  const invalidDates = Boolean(data.from && data.until && data.until < data.from);
  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true); setCopyError(false);
    } catch {
      preview.current?.focus(); preview.current?.select(); setCopyError(true);
    }
  }
  return <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal container={typeof document === "undefined" ? undefined : document.querySelector<HTMLElement>(".pb-landing")}>
      <Dialog.Overlay className="inquiry-overlay" />
      <Dialog.Content className="inquiry-dialog">
        <div className="flex items-start justify-between gap-4">
          <div><img className="dialog-logo" src={logoDark.url} alt="Punta Biker" width={1320} height={702} /><span className="eyebrow">{t.eyebrow}</span><Dialog.Title className="dialog-title">{t.title}</Dialog.Title></div>
          <Dialog.Close asChild><Button variant="nav" size="icon" aria-label={t.close}><X /></Button></Dialog.Close>
        </div>
        <Dialog.Description className="dialog-description">{t.desc}</Dialog.Description>
        <form onSubmit={e => e.preventDefault()} className="inquiry-form">
          <label className="field">{t.scooter}<select value={data.scooter} onChange={e => setData({ ...data, scooter: e.target.value as Scooter })}>{scooters.map(s => <option key={s} value={s}>{scooterLabel(s, lang)}</option>)}</select></label>
          <fieldset><legend>{t.dates} <span className="optional">{t.optional}</span></legend><div className="date-fields">
            <label className="field">{t.from}<input type="date" value={data.from} onChange={e => setData({ ...data, from: e.target.value })} /></label>
            <label className="field">{t.until}<input type="date" min={data.from || undefined} value={data.until} onChange={e => setData({ ...data, until: e.target.value })} /></label>
          </div>{invalidDates && <p role="alert" className="form-error">{t.dateError}</p>}</fieldset>
          <fieldset><legend>{t.where}</legend><div className="delivery-options">
            <label><input type="radio" name="delivery" value="meeting" checked={data.delivery === "meeting"} onChange={() => setData({ ...data, delivery: "meeting" })} /><MapPin size={18} />{t.meeting}</label>
            <label><input type="radio" name="delivery" value="hotel" checked={data.delivery === "hotel"} onChange={() => setData({ ...data, delivery: "hotel" })} /><Hotel size={18} />{t.hotel}</label>
          </div></fieldset>
          {data.delivery === "hotel" && <label className="field">{t.hotelName} <span className="optional">{t.optional}</span><input placeholder={t.hotelPh} value={data.hotel} maxLength={180} onChange={e => setData({ ...data, hotel: e.target.value })} /></label>}
          <label className="field message-field">{t.message}<textarea ref={preview} readOnly value={message} rows={5} /></label>
          <div className="inquiry-actions"><Button variant="coastOutline" onClick={copy} disabled={invalidDates}>{copied ? <Check /> : <Copy />}{copied ? t.copied : t.copy}</Button><Button variant="coast" asChild={!invalidDates} disabled={invalidDates}>{invalidDates ? <span>{t.share}</span> : <a href={whatsappShareUrl(message)} target="_blank" rel="noopener noreferrer"><MessageCircle />WhatsApp<ArrowUpRight /></a>}</Button></div>
          <p className="copy-status" role="status">{copyError ? t.manual : copied ? t.ready : t.idle}</p>
        </form>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}