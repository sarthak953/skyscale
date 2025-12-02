'use client';

import HeroSection from '@/components/home/HeroSection';
import BestSellers from '@/components/home/BestSellers';
import Categories from '@/components/home/Categories';
import FAQ from '@/components/home/FAQ';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />
      <BestSellers />
      <Categories />
      <FAQ />
    </main>
  );
}