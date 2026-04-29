import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Cpu, Monitor, HardDrive, MemoryStick } from 'lucide-react';
import type { Laptop } from '@/types/laptop';
import { loadStoreConfig } from '@/data/laptops';

interface GalleryProps {
  laptops: Laptop[];
}

const filters = ['All', 'Gaming', 'Business', 'Budget', 'New', 'Used'];

function getShortSpecs(laptop: Laptop): string {
  const cpu = laptop.processor.split(' ').slice(0, 3).join(' ');
  const ram = laptop.memory;
  const gpuShort = laptop.graphics.includes('RTX')
    ? laptop.graphics.match(/RTX \d+/)?.[0] || ''
    : laptop.graphics.includes('GTX')
    ? laptop.graphics.match(/GTX \d+/)?.[0] || ''
    : '';
  return `${cpu} · ${ram}${gpuShort ? ' · ' + gpuShort : ''}`;
}

function getConditionColor(condition: string): string {
  if (condition.toLowerCase().includes('new')) return 'text-emerald-400';
  if (condition.toLowerCase().includes('good')) return 'text-amber-400';
  return 'text-[#555555]';
}

function formatPrice(price: number | null): string {
  if (price === null) return 'Inquire';
  return price.toLocaleString() + ' EGP';
}

export default function Gallery({ laptops }: GalleryProps) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedLaptop, setSelectedLaptop] = useState<Laptop | null>(null);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const filteredLaptops = laptops.filter((l) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'New') return l.condition.toLowerCase().includes('new');
    if (activeFilter === 'Used')
      return (
        l.condition.toLowerCase().includes('good') ||
        l.condition === '-' ||
        l.condition === ''
      );
    return l.category === activeFilter;
  });

  const setCardRef = useCallback(
    (el: HTMLDivElement | null, index: number) => {
      cardRefs.current[index] = el;
    },
    []
  );

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = Number((entry.target as HTMLElement).dataset.id);
          if (entry.isIntersecting) {
            setVisibleCards((prev) => new Set(prev).add(id));
          }
        });
      },
      { threshold: 0.15 }
    );

    cardRefs.current.forEach((el) => {
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [filteredLaptops]);

  const handleWhatsApp = (laptop: Laptop) => {
    const config = loadStoreConfig();
    const message = `Hi AlexStore, I'm interested in the ${laptop.model}. Can you provide more details?`;
    const url = `https://wa.me/${config.whatsapp.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      <section id="gallery" className="py-24 lg:py-32 px-6 lg:px-12 max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div className="mb-12">
          <span
            className="text-eyebrow text-[#c8a45c] block mb-4"
            style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}
          >
            THE COLLECTION
          </span>
          <h2 className="font-display text-4xl lg:text-5xl text-[#f5f5f0] mb-4">
            25 Pieces. Zero Compromise.
          </h2>
          <p className="font-body text-sm text-[#8a8a8a] max-w-[600px]">
            Browse our curated selection of performance laptops. Click any device
            to view specifications and inquire via WhatsApp.
          </p>
        </div>

        {/* Filter Bar */}
        <div id="collection" className="flex flex-wrap gap-3 mb-10">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`text-eyebrow px-5 py-2.5 transition-all duration-300 border ${
                activeFilter === filter
                  ? 'bg-[#c8a45c] text-[#050505] border-[#c8a45c]'
                  : 'bg-[#0a0a0a] text-[#8a8a8a] border-[#1a1a1a] hover:border-[#2a2a2a]'
              }`}
              style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLaptops.map((laptop, index) => (
            <div
              key={laptop.id}
              ref={(el) => setCardRef(el, index)}
              data-id={laptop.id}
              onClick={() => setSelectedLaptop(laptop)}
              className={`group relative bg-[#0a0a0a] border border-[#1a1a1a] overflow-hidden cursor-pointer transition-all duration-500 hover:border-[#c8a45c]/30 ${
                visibleCards.has(laptop.id)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
              style={{
                transitionDelay: `${(index % 6) * 80}ms`,
                transitionTimingFunction: 'cubic-bezier(0.19, 1, 0.22, 1)',
                transitionProperty: 'opacity, transform, border-color',
              }}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#0d0d0d] to-[#1a1a1a] p-6 flex items-center justify-center">
                <img
                  src={laptop.image}
                  alt={laptop.model}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Condition badge */}
                {laptop.condition && laptop.condition !== '-' && (
                  <span
                    className={`absolute top-4 right-4 text-eyebrow px-3 py-1 bg-[#050505]/80 backdrop-blur-sm ${getConditionColor(laptop.condition)}`}
                    style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}
                  >
                    {laptop.condition}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-5 transition-transform duration-400 group-hover:-translate-y-1">
                <span
                  className="text-eyebrow text-[#555555] block mb-2"
                  style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}
                >
                  {laptop.brand.toUpperCase()}
                </span>
                <h3 className="font-display text-lg text-[#f5f5f0] mb-3 line-clamp-2 leading-snug">
                  {laptop.model}
                </h3>
                <p
                  className="text-eyebrow text-[#555555] mb-4 line-clamp-1"
                  style={{ fontSize: '0.7rem' }}
                >
                  {getShortSpecs(laptop)}
                </p>
                <span
                  className="text-eyebrow text-[#c8a45c]"
                  style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}
                >
                  {formatPrice(laptop.price)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Detail Panel Overlay */}
      <AnimatePresence>
        {selectedLaptop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-[#050505]/90 backdrop-blur-sm flex justify-end"
            onClick={() => setSelectedLaptop(null)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
              className="w-full max-w-[520px] bg-[#0a0a0a] border-l border-[#1a1a1a] overflow-y-auto h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={() => setSelectedLaptop(null)}
                className="absolute top-6 right-6 z-10 text-[#8a8a8a] hover:text-[#f5f5f0] transition-colors"
              >
                <X size={24} />
              </button>

              {/* Image */}
              <div className="aspect-square bg-gradient-to-br from-[#0d0d0d] to-[#1a1a1a] p-8 flex items-center justify-center">
                <img
                  src={selectedLaptop.image}
                  alt={selectedLaptop.model}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Details */}
              <div className="p-6 lg:p-8">
                <span
                  className="text-eyebrow text-[#c8a45c] block mb-3"
                  style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}
                >
                  {selectedLaptop.brand.toUpperCase()}
                </span>
                <h2 className="font-display text-3xl text-[#f5f5f0] mb-6">
                  {selectedLaptop.model}
                </h2>

                {/* Specs Grid */}
                <div className="grid grid-cols-1 gap-4 mb-8">
                  <SpecRow icon={<Cpu size={16} />} label="Processor" value={selectedLaptop.processor} />
                  <SpecRow icon={<Monitor size={16} />} label="Graphics" value={selectedLaptop.graphics} />
                  {selectedLaptop.display && selectedLaptop.display !== '-' && (
                    <SpecRow icon={<Monitor size={16} />} label="Display" value={selectedLaptop.display} />
                  )}
                  <SpecRow icon={<MemoryStick size={16} />} label="Memory" value={selectedLaptop.memory} />
                  <SpecRow icon={<HardDrive size={16} />} label="Storage" value={selectedLaptop.storage} />
                  {selectedLaptop.os && selectedLaptop.os !== '-' && (
                    <SpecRow label="OS" value={selectedLaptop.os} />
                  )}
                  {selectedLaptop.color && selectedLaptop.color !== '-' && (
                    <SpecRow label="Color" value={selectedLaptop.color} />
                  )}
                  {selectedLaptop.condition && selectedLaptop.condition !== '-' && (
                    <SpecRow label="Condition" value={selectedLaptop.condition} />
                  )}
                  {selectedLaptop.notes && selectedLaptop.notes !== '-' && (
                    <SpecRow label="Notes" value={selectedLaptop.notes} />
                  )}
                </div>

                {/* Price */}
                <div className="mb-8">
                  <span className="font-display text-3xl text-[#c8a45c]">
                    {selectedLaptop.price
                      ? selectedLaptop.price.toLocaleString() + ' EGP'
                      : 'Price on Request'}
                  </span>
                </div>

                {/* WhatsApp CTA */}
                <button
                  onClick={() => handleWhatsApp(selectedLaptop)}
                  className="w-full bg-[#c8a45c] text-[#050505] py-4 px-6 text-eyebrow uppercase flex items-center justify-center gap-3 hover:bg-[#d4b76a] transition-colors duration-300"
                  style={{ fontSize: '0.75rem', letterSpacing: '0.08em' }}
                >
                  <MessageCircle size={18} />
                  Inquire on WhatsApp
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function SpecRow({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 pb-3 border-b border-[#1a1a1a]">
      {icon && <span className="text-[#555555] mt-0.5 shrink-0">{icon}</span>}
      <div>
        <span
          className="text-eyebrow text-[#555555] block mb-1"
          style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}
        >
          {label.toUpperCase()}
        </span>
        <span className="font-body text-sm text-[#8a8a8a]">{value}</span>
      </div>
    </div>
  );
}
