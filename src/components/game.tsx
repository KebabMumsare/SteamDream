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
      className="cursor-pointer hover:scale-[1.01] transition-transform"
      style={{ 
        backgroundColor: cardBg,
        marginTop: '0.5vw',
        width: '95vw',
        maxWidth: '52vw',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: '0.8vw',
        padding: '0.5vw',
        display: 'flex',
        flexDirection: 'row',
        gap: '0.5vw'
      }}
    >
      {/* Image - shows beside description on all screens */}
      <div 
        className="relative overflow-hidden bg-black/30 flex-shrink-0"
        style={{
          width: '15.9vw',
          height: '10.7vw',
          borderRadius: '0.8vw'
        }}
      >
        <img src={headerImage} alt="Game artwork" className="w-full h-full object-cover" onError={(e) => {
            e.currentTarget.src = iconImage;
        }} />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0" style={{ gap: '0.3vw' }}>
        {/* Title */}
        <div className="flex items-center" style={{ gap: '0.2vw' }}>
          <h2 
            className="font-mono font-semibold flex items-center shadow-sm"
            style={{ 
              backgroundColor: titleBg, 
              color: textColor,
              borderRadius: '0.5vw',
              padding: '0.3vw 0.5vw',
              fontSize: '0.9vw',
              height: '1.9vw',
              width: 'max-content'
            }}
          >
            {name}
          </h2>
        </div>

        {/* Description panel */}
        <div 
          className="relative font-mono backdrop-blur-sm border border-white/10 overflow-auto scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-white/10"
          style={{ 
            backgroundColor: descriptionBg, 
            color: textColor,
            borderRadius: '0.4vw',
            padding: '0.5vw',
            fontSize: '0.6vw',
            lineHeight: '1.5',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4)',
            maxHeight: '10.4vw',
            maxWidth: '32.8vw'
          }}
        >
          <div className="absolute inset-0 pointer-events-none opacity-5" style={{ backgroundColor: descriptionBg, borderRadius: '0.4vw' }} />
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
  );
}

export default Game;
