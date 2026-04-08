'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSuccess(false);
    setIsError(false);

    const formData = new FormData(e.currentTarget);
    
    // Replace this with your actual Web3Forms Access Key
    // You can get one for free at https://web3forms.com
    formData.append("access_key", "YOUR_ACCESS_KEY_HERE");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        (e.target as HTMLFormElement).reset();
      } else {
        console.error("Error from Web3Forms:", data);
        setIsError(true);
      }
    } catch (error) {
      console.error("Submission failed:", error);
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-grow bg-white py-10">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">{t.contact.title}</h1>
            <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">{t.contact.desc}</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            {/* Contact Info */}
            <div className="flex flex-col gap-8">
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex items-start gap-6 hover:border-primary/30 transition-colors">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-3xl">location_on</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{t.contact.addressTitle}</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Boulevard Hassan II<br />
                    Casablanca, 20000<br />
                    Maroc
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex items-start gap-6 hover:border-primary/30 transition-colors">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-3xl">call</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{t.contact.phoneTitle}</h3>
                  <p className="text-slate-500 leading-relaxed mb-2">
                    Lundi - Vendredi, 9h00 - 18h00
                  </p>
                  <a href="tel:+212667018042" className="text-lg font-bold text-primary hover:underline" dir="ltr">+212 667-018042</a>
                </div>
              </div>
              
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex items-start gap-6 hover:border-primary/30 transition-colors">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-3xl">mail</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{t.contact.emailTitle}</h3>
                  <p className="text-slate-500 leading-relaxed mb-2">
                    Nous vous répondrons dans les 24 heures.
                  </p>
                  <a href="mailto:contact@notchmaroc.ma" className="text-lg font-bold text-primary hover:underline">contact@notchmaroc.ma</a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 lg:p-12 shadow-sm relative overflow-hidden">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">{t.contact.formTitle}</h2>
              
              {isSuccess && (
                <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-600 p-4 rounded-xl flex items-center gap-3">
                  <span className="material-symbols-outlined">check_circle</span>
                  <p className="font-medium">Message envoyé avec succès ! Nous vous contacterons bientôt.</p>
                </div>
              )}

              {isError && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-center gap-3">
                  <span className="material-symbols-outlined">error</span>
                  <p className="font-medium">Une erreur s'est produite. Veuillez réessayer plus tard ou nous contacter directement par email.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm font-bold text-slate-700">{t.contact.nameLabel}</label>
                    <input type="text" id="name" name="name" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder={t.contact.nameLabel} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-bold text-slate-700">{t.contact.emailLabel}</label>
                    <input type="email" id="email" name="email" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder="votre@email.com" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="subject" className="text-sm font-bold text-slate-700">{t.contact.subjectLabel}</label>
                  <input type="text" id="subject" name="subject" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder={t.contact.subjectLabel} />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-sm font-bold text-slate-700">{t.contact.messageLabel}</label>
                  <textarea id="message" name="message" required rows={6} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none" placeholder={t.contact.messageLabel}></textarea>
                </div>
                
                {/* Honeypot Spam Protection */}
                <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full bg-primary text-white font-bold text-lg py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 mt-4 ${
                    isSubmitting 
                      ? 'opacity-75 cursor-wait' 
                      : 'hover:bg-amber-500 shadow-[0_8px_30px_rgb(254,165,29,0.3)] hover:shadow-[0_8px_30px_rgb(254,165,29,0.5)]'
                  }`}
                >
                  {isSubmitting ? 'Envoi en cours...' : t.contact.sendButton}
                  {!isSubmitting && <span className="material-symbols-outlined rtl:rotate-180">send</span>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
