'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface Announcement {
  id: string;
  title: string;
  body: string | null;
  image_url: string | null;
  cta_label: string | null;
  cta_url: string | null;
  display_delay_seconds: number;
  show_once: boolean;
  version: string;
}

// Pages where a pop-up would interrupt an order
const HIDDEN_ON = ['/checkout', '/success', '/cart'];

const seenKey = (a: Announcement) => `announcement-seen:${a.id}:${a.version}`;

function wasSeen(a: Announcement) {
  try {
    return localStorage.getItem(seenKey(a)) === '1';
  } catch {
    return false;
  }
}

function markSeen(a: Announcement) {
  try {
    localStorage.setItem(seenKey(a), '1');
  } catch {
    // Storage unavailable (private mode): the pop-up may show again next visit
  }
}

/** Full-screen announcement from the dashboard, shown after a delay, once per visitor if set. */
export default function AnnouncementPopup() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const hidden = HIDDEN_ON.some((path) => pathname.startsWith(path));

  useEffect(() => {
    let cancelled = false;
    fetch('/api/announcements')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: Announcement | null) => {
        if (!cancelled && data && !(data.show_once && wasSeen(data))) setAnnouncement(data);
      })
      .catch(() => null);
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!announcement || hidden || open) return;
    const timer = setTimeout(() => setOpen(true), Math.max(0, announcement.display_delay_seconds) * 1000);
    return () => clearTimeout(timer);
  }, [announcement, hidden, open]);

  const close = useCallback(() => {
    if (announcement?.show_once) markSeen(announcement);
    setOpen(false);
    setAnnouncement(null);
  }, [announcement]);

  // Keep keyboard focus inside the visible dialog and restore the page on close.
  useEffect(() => {
    if (!open || hidden || !announcement) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab') return;

      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )).filter((element) => element.tabIndex >= 0 && element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first || !last) {
        e.preventDefault();
        dialog.focus({ preventScroll: true });
      } else if (!dialog.contains(document.activeElement)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [open, hidden, announcement, close]);

  if (!open || !announcement || hidden) return null;

  const internal = announcement.cta_url?.startsWith('/');

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-300"
      onClick={close}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="announcement-title"
        tabIndex={-1}
        className="relative w-full max-w-md max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label={t.popup.close}
          className="absolute top-3 end-3 z-10 flex size-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md hover:bg-white cursor-pointer"
        >
          <X size={20} />
        </button>

        {announcement.image_url && (
          <div className="relative w-full aspect-square max-h-[55vh] bg-slate-100">
            <Image src={announcement.image_url} alt={announcement.title} fill sizes="(max-width: 480px) 100vw, 448px" className="object-cover" priority />
          </div>
        )}

        <div className="p-6 sm:p-8 text-center">
          <h2 id="announcement-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {announcement.title}
          </h2>
          {announcement.body && <p className="mt-3 text-slate-600 leading-relaxed whitespace-pre-line">{announcement.body}</p>}

          {announcement.cta_url && (
            internal ? (
              <Link
                href={announcement.cta_url}
                onClick={close}
                className="mt-6 flex w-full items-center justify-center rounded-xl bg-primary hover:bg-amber-500 text-white font-bold text-lg py-4 px-8 transition-colors"
              >
                {announcement.cta_label || t.popup.discover}
              </Link>
            ) : (
              <a
                href={announcement.cta_url}
                onClick={close}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex w-full items-center justify-center rounded-xl bg-primary hover:bg-amber-500 text-white font-bold text-lg py-4 px-8 transition-colors"
              >
                {announcement.cta_label || t.popup.discover}
              </a>
            )
          )}

          <button type="button" onClick={close} className="mt-4 text-sm font-medium text-slate-400 hover:text-slate-600 cursor-pointer">
            {t.popup.noThanks}
          </button>
        </div>
      </div>
    </div>
  );
}
