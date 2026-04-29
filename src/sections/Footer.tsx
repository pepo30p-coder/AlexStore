export default function Footer() {
  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-[#1a1a1a] px-6 lg:px-12 py-12">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left */}
        <div className="text-center md:text-left">
          <span className="font-body text-base text-[#f5f5f0] tracking-wide">
            AlexStore
          </span>
          <p
            className="text-eyebrow text-[#555555] mt-2"
            style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}
          >
            © 2025 AlexStore. All rights reserved.
          </p>
        </div>

        {/* Center */}
        <div className="flex items-center gap-6">
          {['Gallery', 'Collection', 'Contact'].map((label) => (
            <button
              key={label}
              onClick={() => handleNavClick(`#${label.toLowerCase()}`)}
              className="text-eyebrow text-[#555555] hover:text-[#f5f5f0] transition-colors duration-300"
              style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Right */}
        <p
          className="text-eyebrow text-[#555555]"
          style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}
        >
          Crafted with precision
        </p>
      </div>
    </footer>
  );
}
