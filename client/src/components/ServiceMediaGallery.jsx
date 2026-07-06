import React from 'react';
import { Link } from 'react-router-dom';
import { resolveImageUrl } from '../services/api';

// Project-aligned fallback images for Indian women entrepreneur categories
// Order matters: these fill gallery slots left-to-right after real business images
const FALLBACK_GALLERY = [
  {
    // Slot 2: Beauty & Wellness (replaces the pink sari real image)
    src: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&q=85&w=800',
    alt: 'Professional beauty and wellness salon treatment',
    label: 'Beauty & Wellness',
  },
  {
    // Slot 3: Tiffin Service
    src: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=85&w=800',
    alt: 'Indian woman preparing home-cooked tiffin meals',
    label: 'Tiffin Service',
  },
  {
    // Slot 4: Tailoring & Fashion (fabrics, not a saree)
    src: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=85&w=800',
    alt: 'Close-up of vibrant fabrics and thread for tailoring',
    label: 'Tailoring & Fashion',
  },
  {
    src: 'https://images.unsplash.com/photo-1619451050621-83cb7aada2d7?auto=format&fit=crop&q=85&w=800',
    alt: 'Handmade Indian pottery and clay handicrafts',
    label: 'Handicrafts',
  },
  {
    src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=85&w=800',
    alt: 'Women conducting a tutoring and coaching session',
    label: 'Tuition & Coaching',
  },
  {
    src: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&q=85&w=800',
    alt: 'Artisan home decor and interior styling',
    label: 'Home Decor',
  },
];

const ServiceMediaGallery = ({ images = [], title = 'Gallery of Work' }) => {
  const categories = [
    {
      id: 1,
      name: 'Tiffin Services',
      description: 'Home-cooked, nutritious meals delivered with love.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBK9QrhVlVPBJby_nxxyb7mbM47Fvh_FVdFGRXTvZk3nXGVojkGj516938QNeuFni5dxUkDjnNjt9YtyzWop2ncniT3ZArLN5nbXnb_p53_Su45rJUcYAiNEqXBGyWx-VYYrF5Gvoq2Q9H8BHvLNAcM1zfoGIqEM5wTUiiVD1yRTXM-MVL1mX-OzmgKJs5UfyIOC2RpkoimB1vcSftfQiTovxym3rAMJUYqIzAQldLrpFBCXLXjdfvLea26SIYM8_WXOA0I_V1ZO2k',
      large: true
    },
    {
      id: 2,
      name: 'Tailoring & Boutique',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqNvL-TndE-hbpDRV3p6ALSLy0rseMIY0Tc0WumlaQUlrH97ZSJ8ipXVAhB736ThduLzpDkTeKE4y7v3ZAOHzKpjs-u9alX3lKf7XuYDG9-Nalm4Bh_KqSjPzOP0wYIxKpfU74SuNf4m0jBAWMW3k-wsII8VmORTBdqOlf8r-W817TK0eAoisSd1GRSicBil5KErYkxEPFT1G2q8HxCblUkMD3pCfKjqKbWcvlk3DuNL9DBcGF20Qoldb45Bjo3N6qpqcGmj4fbPk',
      large: false
    },
    {
      id: 3,
      name: 'Handicrafts',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDeReJIt1v6ksffvt1AM92JrTaKvSB4_FMTvEzNx96GtYZIrvPb5RB-veuOmdkgvvTJBIHnv5Gfi_M2YDoZ1-48l22mg5KKL0GUDsGEQv9Uqw-lI408RLULLxH9IZBt-X4wD1Zamd98scH2BNPAJPJwCwnn_b4l-lBv1DygrEb--iPnY4MTnwWY2JdROdoOt9z0-S11CEa3DbLjozFcUc1gLIVNDPghTUyuou5FV9QZ3Wm2zMx2LtPcPnpRmefTHHZLff7mh3SwcY',
      large: false
    },
    {
      id: 4,
      name: 'Teaching',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdTQnHN3f67_Ld4C9O6rRI24yUsc-W7rARx8UFd-pPjyvH1dg6cluAAb-gH6aZhY5A-PWZzywjBKpGk6vyeWHuzwxg5klAB7lwRaUMj0w8BGzZy7unI3FPHTKJ2WXTGaZtU28QRAJG-6P8CEoJu1LwbsSrponbP13b6VyFcUHlu-x0YFl2X1zP9bqVlBV8FUa4d02j5UfRNwjzJokasZ0z3vRbBbXbnS3178mSyLYS9vFwK-p3tXq_-vS0i5gxKr-eAKzAUw5YOhc',
      large: false
    }
  ];

  if (!images.length) {
    return (
      <section className="py-20 px-margin-mobile md:px-margin-desktop max-w-[1140px] mx-auto">
        <div className="flex justify-between items-end mb-12 gap-4 flex-col md:flex-row">
          <div>
            <span className="font-label-lg text-label-lg text-terracotta-clay uppercase tracking-widest">Explore Services</span>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-on-surface mt-2">What are you looking for today?</h2>
          </div>
          <Link to="/marketplace" className="font-button-text text-button-text text-secondary underline decoration-2 hover:text-primary transition-all whitespace-nowrap">
            View all categories →
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[500px]">
          {categories.map((category) => (
            <Link
              key={category.id}
              to="/marketplace"
              className={`group relative overflow-hidden rounded-lg md:rounded-xl liquid-glass border border-white/20 cursor-pointer transition-all hover:shadow-2xl ${
                category.large ? 'md:col-span-2 md:row-span-2' : 'md:col-span-1'
              }`}
            >
              <img
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                src={resolveImageUrl(category.image)}
                alt={category.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4 md:p-8 text-white">
                <h3 className="font-headline-md text-headline-md">{category.name}</h3>
                {category.description && (
                  <p className="font-body-md text-body-md text-white/80 mt-2 hidden md:block">{category.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  // Deduplicate real business images by URL
  const uniqueRealUrls = [...new Set(images)];
  const resolvedReal = uniqueRealUrls.slice(0, 4).map((url) => ({
    src: resolveImageUrl(url),
    alt: 'Business portfolio image',
    label: null,
  }));

  // Fill remaining slots with unique project-relevant fallback images
  const needed = 4 - resolvedReal.length;
  const fallbacks = FALLBACK_GALLERY.slice(0, needed);
  const display = [...resolvedReal, ...fallbacks];

  return (
    <section className="py-12">
      <h2 className="text-3xl md:text-5xl font-serif text-black mb-10 text-center md:text-left tracking-tight">{title}</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-4 sm:grid-rows-2 gap-4 md:gap-6 h-auto sm:h-[600px]">
        {/* Large featured slot */}
        <div className="sm:col-span-2 sm:row-span-2 h-[300px] sm:h-auto rounded-2xl overflow-hidden shadow-2xl relative group">
          <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={display[0].src} alt={display[0].alt} loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80 transition-opacity duration-500"></div>
          {display[0].label && (
            <div className="absolute bottom-6 left-6">
              <span className="inline-block bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-full text-white font-bold text-xs tracking-widest uppercase shadow-lg">
                {display[0].label}
              </span>
            </div>
          )}
        </div>

        {/* Top-right */}
        <div className="sm:col-span-2 sm:row-span-1 h-[250px] sm:h-auto rounded-2xl overflow-hidden shadow-2xl relative group">
          <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={display[1].src} alt={display[1].alt} loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80 transition-opacity duration-500"></div>
          {display[1].label && (
            <div className="absolute bottom-5 left-5">
              <span className="inline-block bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white font-bold text-[11px] tracking-widest uppercase shadow-lg">
                {display[1].label}
              </span>
            </div>
          )}
        </div>

        {/* Bottom-right small 1 */}
        <div className="sm:col-span-1 sm:row-span-1 h-[200px] sm:h-auto rounded-2xl overflow-hidden shadow-2xl relative group">
          <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={display[2].src} alt={display[2].alt} loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity duration-500"></div>
          {display[2].label && (
            <div className="absolute bottom-4 left-4">
              <span className="inline-block bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full text-white font-bold text-[9px] tracking-widest uppercase shadow-lg">
                {display[2].label}
              </span>
            </div>
          )}
        </div>

        {/* Bottom-right small 2 */}
        <div className="sm:col-span-1 sm:row-span-1 h-[200px] sm:h-auto rounded-2xl overflow-hidden shadow-2xl relative group">
          <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={display[3].src} alt={display[3].alt} loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity duration-500"></div>
          {display[3].label && (
            <div className="absolute bottom-4 left-4">
              <span className="inline-block bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full text-white font-bold text-[9px] tracking-widest uppercase shadow-lg">
                {display[3].label}
              </span>
            </div>
          )}
          {uniqueRealUrls.length > 4 && (
            <span className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-3xl font-serif">
              +{uniqueRealUrls.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Additional real images beyond first 4 */}
      {uniqueRealUrls.length > 4 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 mt-4 md:mt-6">
          {uniqueRealUrls.slice(4).map((url, i) => (
            <div key={i} className="aspect-square rounded-2xl overflow-hidden shadow-xl">
              <img
                src={resolveImageUrl(url)}
                alt={`Gallery ${i + 5}`}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ServiceMediaGallery;
