import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ProductNotFound() {
  return (
    <>
      <Header />
      <main className="flex-grow bg-white py-10 flex flex-col items-center justify-center text-center min-h-[60vh]">
        <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">search_off</span>
        <h1 className="text-2xl font-bold mb-4 text-slate-900">Produit introuvable</h1>
        <Link href="/shop" className="text-primary hover:underline">Retour à la boutique</Link>
      </main>
      <Footer />
    </>
  );
}
