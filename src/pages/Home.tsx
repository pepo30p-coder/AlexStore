import Navigation from '@/sections/Navigation';
import Hero from '@/sections/Hero';
import Gallery from '@/sections/Gallery';
import Contact from '@/sections/Contact';
import Footer from '@/sections/Footer';
import { loadLaptops } from '@/data/laptops';

export default function Home() {
  const laptops = loadLaptops();

  return (
    <div className="min-h-screen bg-[#050505]">
      <Navigation />
      <Hero />
      <Gallery laptops={laptops} />
      <Contact />
      <Footer />
    </div>
  );
}
