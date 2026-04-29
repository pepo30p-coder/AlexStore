import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Gallery', href: '#gallery' },
  { label: 'Collection', href: '#collection' },
  { label: 'Contact', href: '#contact' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 lg:px-12 transition-all duration-500 ${
          scrolled
            ? 'bg-[#050505]/80 backdrop-blur-xl border-b border-[#1a1a1a]'
            : 'bg-transparent'
        }`}
      >
        <Link
          to="/"
          className="font-body text-lg font-normal tracking-wide text-[#f5f5f0] hover:text-[#c8a45c] transition-colors duration-300"
        >
          AlexStore
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              className="text-eyebrow text-[#8a8a8a] hover:text-[#f5f5f0] transition-colors duration-300 gold-underline"
              style={{ fontSize: '0.75rem' }}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => navigate('/admin')}
            className="text-eyebrow text-[#555555] hover:text-[#c8a45c] transition-colors duration-300"
            style={{ fontSize: '0.75rem' }}
          >
            Admin
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[#f5f5f0]"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#050505]/98 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden">
          {navLinks.map((link, i) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              className="font-display text-3xl text-[#f5f5f0] hover:text-[#c8a45c] transition-all duration-300"
              style={{
                animationDelay: `${i * 100}ms`,
              }}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              setMobileOpen(false);
              navigate('/admin');
            }}
            className="font-display text-3xl text-[#555555] hover:text-[#c8a45c] transition-colors duration-300"
          >
            Admin
          </button>
        </div>
      )}
    </>
  );
}
