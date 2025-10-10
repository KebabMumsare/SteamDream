import { useState } from 'react';
import type { MouseEvent } from 'react';
import apple from '../assets/Icons/apple.png';
import windows from '../assets/Icons/windows.png';
import star from '../assets/Icons/star.png';
import gul from '../assets/Icons/gul stjärna.png';
import './Card.css';

type CardProps = {
  title: string;
  image: string;
  description: string;
  price?: number;
  discount?: number;
  discountedPrice?: number;
  genre?: string;
  platforms?: string[]; // e.g., ['Windows', 'Mac']
  tags?: string[]; // e.g., ['Co-op', 'FPS', 'Online']
  gamelink?: string;
  colors?: {
    background?: string;
    primaryBtn?: string;
    primaryBtnHover?: string;
  };
};

function Card({title, image, description, price, discount, discountedPrice, genre, platforms, tags, gamelink, colors}: CardProps) {
  const [fav,setFav] = useState(false);
  function Favknapp(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    e.preventDefault();
    setFav(prev => !prev);
  }
  function steamsite() {
    if (gamelink) {
      window.open(gamelink, "_blank");
    }
  }
  return (
    <div
      onClick={steamsite}
      className="cursor-pointer hover:scale-[1.01] transition-transform mt-6 w-[85%] mx-auto max-w-[1040px] rounded-[32px] p-4 md:p-5 grid gap-6 sm:grid-cols-1 md:grid-cols-[270px_1fr] lg:grid-cols-[270px_1fr_320px]"
      style={{ backgroundColor: colors?.background || '#1B2838' }}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] rounded-[26px] overflow-hidden bg-black/30">
        <img src={image} alt="Game artwork" className="w-full h-full object-cover" />
      </div>

      {/* Main content */}
      <div className="flex flex-col gap-4">
        {/* Title + Favorite */}
        <div className="flex items-center gap-2.5">
          <h2 className="font-mono font-semibold text-lg md:text-xl rounded-[14px] px-4 h-[46px] flex items-center w-max text-white shadow-sm" style={{ backgroundColor: colors?.primaryBtn || '#66C0F4' }}>
            {title}
          </h2>
          <button
            onClick={Favknapp}
            aria-pressed={fav}
            className="inline-flex bg-transparent items-center justify-center p-0 rounded-[14px] hover:scale-105 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#66C0F4]/60"
            onMouseEnter={(e) => e.currentTarget.querySelector('img')!.style.backgroundColor = colors?.primaryBtnHover || '#2979A8'}
            onMouseLeave={(e) => e.currentTarget.querySelector('img')!.style.backgroundColor = colors?.primaryBtn || '#66C0F4'}
          >
            <img
              src={fav ? gul : star}
              alt={fav ? 'Favorited' : 'Add to favorites'}
              className="h-[46px] w-[48px] rounded-[14px] object-contain drop-shadow-md transition-colors"
              style={{ backgroundColor: colors?.primaryBtn || '#66C0F4' }}
            />
          </button>
        </div>

        {/* Pricing */}
        <div className="flex flex-row items-end gap-6">
          <span className="font-mono line-through text-[11px] md:text-xs opacity-70 tracking-wide">{price}€</span>
          <span className="font-mono text-lg md:text-xl text-white">{discountedPrice}€</span>
          <span className="font-mono bg-[#44CE3F] text-white rounded-md px-2.5 py-1.5 text-[11px] md:text-xs leading-none shadow">
            -{discount}%
          </span>
        </div>

        {/* Genre + Platforms */}
        <div className="flex flex-wrap items-center gap-3.5">
          <div className="inline-flex items-center font-mono text-[9px] md:text-[11px] text-white rounded-lg px-2.5 py-1.5 font-semibold w-max shadow" style={{ backgroundColor: colors?.primaryBtn || '#66C0F4' }}>
            {genre}
          </div>
          {platforms?.map(platform => (
            <img key={platform} src={platform === 'Windows' ? windows : apple} alt={platform} className="w-6 h-6 object-contain" />
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags?.map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-md bg-[#44CE3F]/15 text-[#44CE3F] font-mono text-[9px] md:text-[11px] tracking-wide">
              {tag}
            </span>
          ))}
          <span className="px-2 py-0.5 rounded-md bg-[#44CE3F]/15 text-[#44CE3F] font-mono text-[9px] md:text-[11px] tracking-wide">FPS</span>
          <span className="px-2 py-0.5 rounded-md bg-[#44CE3F]/15 text-[#44CE3F] font-mono text-[9px] md:text-[11px] tracking-wide">Online</span>
        </div>
      </div>

      {/* Description panel */}
      <div className="relative font-mono text-white/90 backdrop-blur-sm border border-white/10 rounded-lg p-3.5 md:p-4 text-[11px] md:text-xs leading-relaxed shadow-inner shadow-black/40 max-h-[320px] overflow-auto scrollbar-thin scrollbar-thumb-[#66C0F4]/25 scrollbar-track-transparent" style={{ backgroundColor: colors?.primaryBtn || '#66C0F4' }}>
        <div className="absolute inset-0 pointer-events-none rounded-lg bg-[#66C0F4]/5" />
        <p className="relative z-10">
          {description}
        </p>
      </div>
    </div>
  );

}

export default Card;
