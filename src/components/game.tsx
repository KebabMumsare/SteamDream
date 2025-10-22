interface GameProps {
  appid: number;
  name: string;
  playtime_forever: number;
  img_icon_url?: string;
  img_logo_url?: string;
  rtime_last_played?: number;
  has_community_visible_stats?: boolean;
  colors?: {
    cardBg?: string;
    titleBg?: string;
    descriptionBg?: string;
    textColor?: string;
  };
}


function Game({ appid, name, playtime_forever, img_icon_url, colors }: GameProps) {

  const headerImage = `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/header.jpg`;
  const iconImage = img_icon_url 
    ? `https://media.steampowered.com/steamcommunity/public/images/apps/${appid}/${img_icon_url}.jpg`
    : headerImage;

  const hoursPlayed = Math.floor(playtime_forever / 60);
  const minutesPlayed = playtime_forever % 60;

  // Default colors if not provided
  const cardBg = colors?.cardBg || '#1B2838';
  const titleBg = colors?.titleBg || '#66C0F4';
  const descriptionBg = colors?.descriptionBg || '#66C0F4';
  const textColor = colors?.textColor || 'white';

   function steamsite() {
    window.open(`https://store.steampowered.com/app/${appid}/PAYDAY_3/`, "_blank");
  }
 
  
  return (
    
    <div
      onClick={steamsite}
      className="cursor-pointer hover:scale-[1.01] transition-transform mt-4 w-full max-w-[95%] sm:max-w-[90%] md:max-w-[85%] min-[1000px]:max-w-[1000px] mx-auto rounded-[16px] p-3 md:p-4 flex flex-col md:flex-row gap-3 md:gap-4"
      style={{ backgroundColor: cardBg }}
    >
      {/* Image - shows at top on mobile/tablet, left on desktop < 1000px */}
      <div className="relative w-full md:w-[250px] min-[1000px]:hidden aspect-[3/2] md:aspect-auto md:h-[170px] rounded-[16px] overflow-hidden bg-black/30 flex-shrink-0">
        <img src={headerImage} alt="Game artwork" className="w-full h-full object-cover" onError={(e) => {
            e.currentTarget.src = iconImage;}} />
      </div>

      {/* Main content */}
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        {/* Description and Image wrapper for > 1000px */}
        <div className="flex flex-col min-[1000px]:flex-row gap-3 min-[1000px]:gap-4">
          {/* Image - shows beside description on screens > 1000px (LEFT SIDE) */}
          <div className="hidden min-[1000px]:block relative w-[305px] h-[205px] rounded-[16px] overflow-hidden bg-black/30 flex-shrink-0">
            <img src={headerImage} alt="Game artwork" className="w-full h-full object-cover" onError={(e) => {
                e.currentTarget.src = iconImage;
            }} />
          </div>

          {/* Title and Description wrapper */}
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            {/* Title */}
            <div className="flex items-center gap-1.5">
              <h2 
                className="font-mono font-semibold text-sm md:text-base lg:text-lg rounded-[10px] px-3 py-2 md:h-[36px] flex items-center w-max shadow-sm"
                style={{ backgroundColor: titleBg, color: textColor }}
              >
                {name}
              </h2>
            </div>

            {/* Description panel */}
            <div 
              className="relative font-mono backdrop-blur-sm border border-white/10 rounded-lg p-3 md:p-4 text-[11px] md:text-xs lg:text-sm leading-relaxed shadow-inner shadow-black/40 max-h-[150px] sm:max-h-[180px] md:max-h-[200px] max-w-[630px] overflow-auto scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-white/10 md:scrollbar-none"
              style={{ backgroundColor: descriptionBg, color: textColor }}
            >
              <div className="absolute inset-0 pointer-events-none rounded-lg opacity-5" style={{ backgroundColor: descriptionBg }} />
              <p className="relative z-10">
                <strong>Hours played:</strong> {hoursPlayed}h {minutesPlayed}m
                <br />
                <strong>App ID:</strong> {appid}
                <br />
                Click to view more about the game on Steam!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;
