'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      image: '/images/1.jpg',
      title: 'Build the world',
      subtitle: 'in miniature',
      description: 'Precision crafted. Passion powered. Explore our exquisite collection.',
      gradient: 'from-indigo-900/60 to-sky-600/55'
    },
    {
      image: '/images/2.png',
      title: 'Masterpiece',
      subtitle: 'models await',
      description: 'Discover intricate details in every piece. Quality you can feel.',
      gradient: 'from-purple-900/60 to-pink-600/55'
    },
    {
      image: '/images/3.png',
      title: 'Craftsmanship',
      subtitle: 'meets artistry',
      description: 'Premium scale models for collectors and enthusiasts worldwide.',
      gradient: 'from-slate-900/60 to-cyan-600/55'
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="relative w-screen h-[75vh] md:h-[80vh] lg:h-[85vh] overflow-hidden group -mx-[50vw] left-[50%] right-[50%] pt-[72px]">
      {/* 🟢 Added pt-[72px] (equal to navbar height) to remove white gap */}

      {/* Image Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-105'
          }`}
        >
          <Image
            src={slide.image}
            alt={`Hero Background ${index + 1}`}
            fill
            priority={index === 0}
            className="object-cover"
            quality={100}
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto max-w-7xl px-6 py-10 text-left text-white w-full">
          <div className="max-w-2xl">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ${
                  index === currentSlide
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8 absolute'
                }`}
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold mb-4 leading-tight drop-shadow-[0_8px_18px_rgba(0,0,0,0.55)]">
                  {slide.title}
                  <br />
                  <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    {slide.subtitle}
                  </span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-white/95 mb-8 drop-shadow-lg">
                  {slide.description}
                </p>
                <div className="flex items-center gap-4 flex-wrap">
                  <Link href="/store" className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white px-8 py-3.5 rounded-full font-semibold shadow-2xl hover:shadow-sky-500/50 hover:scale-105 transition-all duration-300 inline-block">
                    Shop Now
                  </Link>
                  <a
                    href="#best-sellers"
                    className="text-white/95 hover:text-white transition-all font-medium group/link"
                  >
                    Explore best sellers
                    <span className="inline-block transition-transform group-hover/link:translate-x-1">→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 md:p-4 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 z-10"
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 md:p-4 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 z-10"
        aria-label="Next slide"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? 'bg-white w-12 h-2.5'
                : 'bg-white/40 hover:bg-white/60 w-2.5 h-2.5'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-all duration-300"
          style={{
            width: isAutoPlaying ? '100%' : '0%',
            transition: isAutoPlaying ? 'width 5000ms linear' : 'width 0.3s',
          }}
          key={currentSlide}
        />
      </div>
    </section>
  );
};

export default HeroSection;
