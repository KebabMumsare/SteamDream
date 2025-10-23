import { useState, useEffect } from 'react';
import type { MouseEvent } from 'react';
import apple from '../assets/Icons/apple.png';
import windows from '../assets/Icons/windows.png';
import linux from '../assets/Icons/linux.png';
import star from '../assets/Icons/star.png';
import gul from '../assets/Icons/gul stjärna.png';
import './Card.css';

interface CardProps {
  title: string;
  appid?: number;
  imageUrl?: string;
  originalPrice?: number;
  currentPrice?: number;
  discountPercent?: number;
  genre: string;
  platforms?: {
    windows?: boolean;
    mac?: boolean;
    linux?: boolean;
  };
  tags?: string[];
  description: string;
  steamUrl?: string;
  isFavorite?: boolean;
  onFavoriteToggle?: (appid: number, isFavorite: boolean) => Promise<boolean>;
  colors?: {
    background: string;
    primaryBtn: string;
    primaryBtnHover: string;
  };
}

function Card({
  title,
  appid,
  imageUrl,
  originalPrice,
  currentPrice,
  discountPercent,
  genre,
  platforms = { windows: true },
  tags = [],
  description,
  steamUrl,
  isFavorite = false,
  onFavoriteToggle,
  colors = {
    background: '#1B2838',
    primaryBtn: '#66C0F4',
    primaryBtnHover: '#2979A8'
  }
}: CardProps) {
  const [fav, setFav] = useState(isFavorite);
  
  // Sync favorite state with prop changes
  useEffect(() => {
    setFav(isFavorite);
  }, [isFavorite]);
  
  // Truncate title to 22 characters
  const truncatedTitle = title.length > 22
    ? title.substring(0, 22) + '...'
    : title;
  
  const truncatedDescription = description.length > 290
    ? description.substring(0, 270) + '...'
    : description;
  
  async function Favknapp(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    e.preventDefault();
    
    if (appid && onFavoriteToggle) {
      const newFavState = !fav;
      // Optimistically update UI
      setFav(newFavState);
      
      // Call the toggle function and check if it succeeded
      const success = await onFavoriteToggle(appid, newFavState);
      
      // If it failed, revert the UI change
      if (!success) {
        setFav(!newFavState);
      }
    }
  }
    function steamsite() {
        if (steamUrl) {
          window.open(steamUrl, "_blank");
        }
    }
  return (
    <div
      onClick={steamsite}
      className="cursor-pointer hover:scale-[1.01] transition-transform w-[90%] mx-auto rounded-[1.5vw]"
      style={{ 
        padding: '1vw', 
        backgroundColor: colors.background, 
        marginTop: '1.5vw', 
        maxWidth: '100vw',
        display: 'grid',
        gap: '1.2vw',
        gridTemplateColumns: 'minmax(16vw, 16vw) 1fr minmax(20vw, 20vw)'
      }}
    >
      {/* Image */}
      <div className="relative aspect-[18/12] rounded-[1.4vw] overflow-hidden bg-black/30">
        <img src={imageUrl} alt={`${title} artwork`} className="w-full h-full object-fill" />
      </div>

      {/* Main content */}
      <div className="flex flex-col" style={{ gap: '0.8vw' }}>
        {/* Title + Favorite */}
        <div className="flex items-center" style={{ gap: '0.6vw' }}>
          <h2 className="font-semibold rounded-[0.8vw] flex items-center w-max text-white shadow-sm" style={{ fontSize: '1.2vw', padding: '0.6vw 1vw', height: '2.8vw', backgroundColor: colors.primaryBtn }}>
            {truncatedTitle}
          </h2>
          <button
            onClick={Favknapp}
            aria-pressed={fav}
            className="inline-flex items-center justify-center p-0 rounded-[0.8vw] hover:scale-105 transition focus:outline-none focus-visible:ring-2"
            style={{ backgroundColor: colors.primaryBtn } as any}
          >
            <img
              src={fav ? gul : star}
              alt={fav ? 'Favorited' : 'Add to favorites'}
              className="rounded-[0.8vw] object-contain drop-shadow-md transition-colors"
              style={{ height: '2.8vw', width: '2.9vw', backgroundColor: colors.primaryBtn }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtnHover}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtn}
            />
          </button>
        </div>

        {/* Pricing */}
        {currentPrice !== undefined && currentPrice !== null && (
          <div className="flex flex-row items-end" style={{ gap: '1.2vw' }}>
            {/* Original Price (strikethrough) - only show if there's a real discount */}
            {originalPrice !== undefined && originalPrice > 0 && discountPercent !== undefined && discountPercent > 0 && (
              <span className="line-through opacity-70 tracking-wide" style={{ fontSize: '0.75vw' }}>{originalPrice.toFixed(2)}€</span>
            )}
            
            {/* Current Price or "Free" */}
            {currentPrice === 0 || currentPrice === null ? (
              <span className="text-[#44CE3F] font-bold" style={{ fontSize: '1.3vw' }}>Free</span>
            ) : (
              <span className="text-white" style={{ fontSize: '1.3vw' }}>{currentPrice.toFixed(2)}€</span>
            )}
            
            {/* Discount Badge - only show if discount is greater than 0 */}
            {discountPercent !== undefined && discountPercent > 0 && (
              <span className="bg-[#44CE3F] text-white leading-none shadow" style={{ padding: '0.4vw 0.6vw', fontSize: '0.75vw', borderRadius: '0.4vw' }}>
                -{discountPercent}%
              </span> 
            )}
          </div>
        )}

        {/* Genre + Platforms */}
        <div className="flex flex-wrap items-center" style={{ gap: '0.8vw' }}>
          <div className="inline-flex items-center text-white font-semibold w-max shadow" style={{ fontSize: '0.7vw', padding: '0.4vw 0.6vw', backgroundColor: colors.primaryBtn, borderRadius: '0.5vw' }}>
            {genre}
          </div>
          {platforms?.windows && <img src={windows} alt="Windows" className="object-contain" style={{ width: '1.5vw', height: '1.5vw' }} />}
          {platforms?.mac && <img src={apple} alt="Mac" className="object-contain" style={{ width: '1.5vw', height: '1.5vw' }} />}
          {platforms?.linux && <img src={linux} alt="Linux" className="object-contain" style={{ width: '1.5vw', height: '1.5vw' }} />}
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap" style={{ gap: '0.5vw' }}>
            {tags.map((tag, index) => (
              <span key={index} className="bg-[#44CE3F]/15 text-[#44CE3F] tracking-wide" style={{ padding: '0.3vw 0.5vw', fontSize: '0.7vw', borderRadius: '0.4vw' }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Description panel */}
      <div className="relative text-white/90 backdrop-blur-sm border border-white/10 leading-relaxed shadow-inner shadow-black/40 overflow-auto scrollbar-thin scrollbar-track-transparent" style={{ padding: '0.8vw', fontSize: '0.75vw', maxHeight: '20vw', backgroundColor: colors.primaryBtn, scrollbarColor: `${colors.primaryBtn}40 transparent`, borderRadius: '0.5vw' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: `${colors.primaryBtn}0D`, borderRadius: '0.5vw' }} />
        <p className="relative z-10">
          {truncatedDescription}
        </p>
      </div>
    </div>
  );

}

export default Card;
