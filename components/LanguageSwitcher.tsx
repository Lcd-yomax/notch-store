'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { LANGUAGES, LANGUAGE_LABELS, type Language } from '@/lib/i18n/languages';

const MENU_LABEL = 'Langue / Language / اللغة';

/** Language menu styled like the site; follows the WAI-ARIA listbox pattern for keyboard use. */
export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Close when clicking or tapping anywhere else
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  // Keyboard focus follows the active option while the menu is open
  useEffect(() => {
    if (open) optionRefs.current[active]?.focus();
  }, [open, active]);

  const openMenu = () => {
    setActive(LANGUAGES.indexOf(language));
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  const choose = (lang: Language) => {
    setLanguage(lang);
    close();
  };

  const onButtonKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      openMenu();
    }
  };

  const onListKeyDown = (e: React.KeyboardEvent) => {
    const count = LANGUAGES.length;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActive((i) => (i + 1) % count);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActive((i) => (i - 1 + count) % count);
        break;
      case 'Home':
        e.preventDefault();
        setActive(0);
        break;
      case 'End':
        e.preventDefault();
        setActive(count - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        choose(LANGUAGES[active]);
        break;
      case 'Escape':
        e.preventDefault();
        close();
        break;
      case 'Tab':
        setOpen(false);
        break;
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${MENU_LABEL}: ${LANGUAGE_LABELS[language]}`}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onButtonKeyDown}
        className={`inline-flex items-center gap-1.5 h-10 ps-3 pe-2 rounded-xl text-sm font-bold transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
          open ? 'bg-slate-200 text-slate-900' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
        }`}
      >
        <span className="material-symbols-outlined text-[20px] text-slate-500" aria-hidden="true">language</span>
        <span className="hidden sm:inline whitespace-nowrap">{LANGUAGE_LABELS[language]}</span>
        <span className="sm:hidden uppercase">{language}</span>
        <span
          className={`material-symbols-outlined text-[18px] text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          expand_more
        </span>
      </button>

      <ul
        role="listbox"
        aria-label={MENU_LABEL}
        onKeyDown={onListKeyDown}
        className={`absolute end-0 top-full mt-2 z-[60] min-w-[190px] p-1.5 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-900/10 origin-top-right rtl:origin-top-left transition duration-150 ease-out ${
          open ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible pointer-events-none'
        }`}
      >
        {LANGUAGES.map((lang, index) => {
          const selected = lang === language;
          return (
            <li
              key={lang}
              ref={(el) => {
                optionRefs.current[index] = el;
              }}
              role="option"
              aria-selected={selected}
              tabIndex={-1}
              onClick={() => choose(lang)}
              onMouseEnter={() => setActive(index)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold cursor-pointer outline-none transition-colors ${
                selected ? 'bg-primary/10 text-primary' : 'text-slate-700 hover:bg-slate-50 focus:bg-slate-50'
              }`}
            >
              <span
                className={`w-8 h-6 shrink-0 rounded-md flex items-center justify-center text-[11px] font-black uppercase ${
                  selected ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
                }`}
                aria-hidden="true"
              >
                {lang}
              </span>
              <span lang={lang} className="flex-1 text-start">{LANGUAGE_LABELS[lang]}</span>
              {selected && (
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">check</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
