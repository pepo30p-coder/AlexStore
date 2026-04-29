import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Phone, MapPin, Clock, Facebook, Instagram, Send } from 'lucide-react';
import { loadStoreConfig } from '@/data/laptops';

export default function Contact() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const config = loadStoreConfig();

  const handleWhatsApp = () => {
    const url = `https://wa.me/${config.whatsapp.replace(/\+/g, '')}`;
    window.open(url, '_blank');
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-24 lg:py-32 px-6 lg:px-12 max-w-[1280px] mx-auto"
    >
      {/* Header */}
      <div
        className={`mb-16 transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.19, 1, 0.22, 1)' }}
      >
        <span
          className="text-eyebrow text-[#c8a45c] block mb-4"
          style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}
        >
          GET IN TOUCH
        </span>
        <h2 className="font-display text-4xl lg:text-5xl text-[#f5f5f0]">
          Let's Talk Tech
        </h2>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
        {/* Left Column - 60% */}
        <div
          className={`lg:col-span-3 transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{
            transitionDelay: '100ms',
            transitionTimingFunction: 'cubic-bezier(0.19, 1, 0.22, 1)',
          }}
        >
          <p className="font-body text-base text-[#8a8a8a] leading-relaxed mb-10 max-w-[480px]">
            Have questions about a specific device? Looking for something not in
            our collection? Reach out directly — we're here to help you find the
            perfect machine.
          </p>

          {/* WhatsApp CTA */}
          <button
            onClick={handleWhatsApp}
            className="bg-[#c8a45c] text-[#050505] px-10 py-5 text-eyebrow uppercase flex items-center gap-4 hover:bg-[#d4b76a] transition-colors duration-300 mb-10"
            style={{ fontSize: '0.75rem', letterSpacing: '0.08em' }}
          >
            <MessageCircle size={20} />
            Chat on WhatsApp
          </button>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <a
              href={config.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#555555] hover:text-[#f5f5f0] transition-colors duration-300"
            >
              <Facebook size={20} />
            </a>
            <a
              href={config.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#555555] hover:text-[#f5f5f0] transition-colors duration-300"
            >
              <Instagram size={20} />
            </a>
            <a
              href={config.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#555555] hover:text-[#f5f5f0] transition-colors duration-300"
            >
              <Send size={20} />
            </a>
          </div>
        </div>

        {/* Right Column - 40% */}
        <div
          className={`lg:col-span-2 flex flex-col gap-4 transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{
            transitionDelay: '200ms',
            transitionTimingFunction: 'cubic-bezier(0.19, 1, 0.22, 1)',
          }}
        >
          <ContactCard
            icon={<Phone size={18} />}
            label="Phone"
            value={config.phone}
          />
          <ContactCard
            icon={<MapPin size={18} />}
            label="Location"
            value={config.location}
          />
          <ContactCard
            icon={<Clock size={18} />}
            label="Hours"
            value={config.hours}
          />
        </div>
      </div>
    </section>
  );
}

function ContactCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-5 flex items-start gap-4 hover:border-[#2a2a2a] transition-colors duration-300">
      <span className="text-[#555555] mt-0.5">{icon}</span>
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
