import { useState } from 'react';
import type { MouseEvent } from 'react';
import testbild from '../assets/testbild.jpg';
import apple from '../assets/Icons/apple.png';
import windows from '../assets/Icons/windows.png';
import star from '../assets/Icons/star.png';
import gul from '../assets/Icons/gul stjärna.png';
import './Card.css';

interface CardProps {
  title: string;
  imageUrl?: string;
  originalPrice?: number;
  currentPrice?: number;
  discountPercent?: number;
  genre: string;
  platforms?: {
    windows?: boolean;
    apple?: boolean;
  };
  tags?: string[];
  description: string;
  steamUrl?: string;
}

function Card({
  title,
  imageUrl,
  originalPrice,
  currentPrice,
  discountPercent,
  genre,
  platforms = { windows: true },
  tags = [],
  description,
  steamUrl
}: CardProps) {
  const [fav,setFav] = useState(false);
  
  // Truncate title to 20 characters
  const truncatedTitle = title.length > 20
    ? title.substring(0, 22) + '...'
    : title;
  
  const truncatedDescription = description.length > 290
    ? description.substring(0, 270) + '...'
    : description;
  
  function Favknapp(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    e.preventDefault();
    setFav(prev => !prev);
  }
    function steamsite() {
        if (steamUrl) {
          window.open(steamUrl, "_blank");
        }
    }
  return (
    <div
      onClick={steamsite}
      className="cursor-pointer hover:scale-[1.01] transition-transform mt-6 w-[85%] mx-auto max-w-[1600px] bg-[#1B2838] rounded-[1.5vw] grid gap-[1.2vw] sm:grid-cols-1 md:grid-cols-[16vw_1fr] lg:grid-cols-[16vw_1fr_20vw]"
      style={{ padding: '1vw' }}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] rounded-[1.4vw] overflow-hidden bg-black/30">
        <img src={imageUrl || testbild} alt={`${title} artwork`} className="w-full h-full object-cover" />
      </div>

      {/* Main content */}
      <div className="flex flex-col" style={{ gap: '0.8vw' }}>
        {/* Title + Favorite */}
        <div className="flex items-center" style={{ gap: '0.6vw' }}>
          <h2 className="bg-[#66C0F4] font-mono font-semibold rounded-[0.8vw] flex items-center w-max text-white shadow-sm" style={{ fontSize: '1.2vw', padding: '0.6vw 1vw', height: '2.8vw' }}>
            {truncatedTitle}
          </h2>
          <button
            onClick={Favknapp}
            aria-pressed={fav}
            className="inline-flex items-center justify-center p-0 rounded-[0.8vw] hover:scale-105 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#66C0F4]/60"
          >
            <img
              src={fav ? gul : star}
              alt={fav ? 'Favorited' : 'Add to favorites'}
              className="bg-[#66C0F4] hover:bg-[#2979A8] rounded-[0.8vw] object-contain drop-shadow-md"
              style={{ height: '2.8vw', width: '2.9vw' }}
            />
          </button>
        </div>

        {/* Pricing */}
        {(originalPrice !== undefined || currentPrice !== undefined) && (
          <div className="flex flex-row items-end" style={{ gap: '1.2vw' }}>
            {originalPrice !== undefined && discountPercent && (
              <span className="font-mono line-through opacity-70 tracking-wide" style={{ fontSize: '0.75vw' }}>{originalPrice.toFixed(2)}$</span>
            )}
            {currentPrice !== undefined && (
              <span className="font-mono text-white" style={{ fontSize: '1.3vw' }}>{currentPrice.toFixed(2)}$</span>
            )}
            {discountPercent && (
              <span className="font-mono bg-[#44CE3F] text-white rounded-md leading-none shadow" style={{ padding: '0.4vw 0.6vw', fontSize: '0.75vw' }}>
                -{discountPercent}%
              </span>
            )}
          </div>
        )}

        {/* Genre + Platforms */}
        <div className="flex flex-wrap items-center" style={{ gap: '0.8vw' }}>
          <div className="inline-flex items-center font-mono text-white bg-[#66C0F4] rounded-lg font-semibold w-max shadow" style={{ fontSize: '0.7vw', padding: '0.4vw 0.6vw' }}>
            {genre}
          </div>
          {platforms?.windows && <img src={windows} alt="Windows" className="object-contain" style={{ width: '1.5vw', height: '1.5vw' }} />}
          {platforms?.apple && <img src={apple} alt="Apple" className="object-contain" style={{ width: '1.5vw', height: '1.5vw' }} />}
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap" style={{ gap: '0.5vw' }}>
            {tags.map((tag, index) => (
              <span key={index} className="rounded-md bg-[#44CE3F]/15 text-[#44CE3F] font-mono tracking-wide" style={{ padding: '0.3vw 0.5vw', fontSize: '0.7vw' }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Description panel */}
      <div className="relative font-mono text-white/90 bg-[#66C0F4] backdrop-blur-sm border border-white/10 rounded-lg leading-relaxed shadow-inner shadow-black/40 overflow-auto scrollbar-thin scrollbar-thumb-[#66C0F4]/25 scrollbar-track-transparent" style={{ padding: '0.8vw', fontSize: '0.75vw', maxHeight: '20vw' }}>
        <div className="absolute inset-0 pointer-events-none rounded-lg bg-[#66C0F4]/5" />
        <p className="relative z-10">
          {truncatedDescription}
        </p>
      </div>
    </div>
  );

}

export default Card;
