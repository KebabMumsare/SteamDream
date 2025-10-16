import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Card from './components/Card';
import Navbar from './components/Navbar';
import Profile from './Profile';
import Login from './Login';
import Favorite from './Favorite';
import { useEffect, useState } from 'react';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [colors, setColors] = useState({
    background: '#1B2838',
    drawerBg: '#1B2838',
    primaryBtn: '#66C0F4',
    primaryBtnHover: '#2979A8',
    ownedGamesHeader: '#004E7B',
    overlayBg: 'rgba(0, 0, 0, 0.4)',
    headerBg: '#004E7B',
  });

  const swapColors = () => {
    const variants = [
      {ownedGamesHeader: `#66007B`, background: '#1B2838', drawerBg: '#1B2838', primaryBtn: '#D866F4', primaryBtnHover: '#8A3F9C', overlayBg: 'rgba(0, 0, 0, 0.4)', headerBg: '#66007B'},
      {ownedGamesHeader: `#6E6D6E`, background: '#434343', drawerBg: '#434343', primaryBtn: '#B4ADB6', primaryBtnHover: '#747175', overlayBg: 'rgba(0, 0, 0, 0.4)', headerBg: '#6E6D6E'},
      {ownedGamesHeader: `#F6965B`, background: '#B95223', drawerBg: '#B95223', primaryBtn: '#F47246', primaryBtnHover: '#9B2913', overlayBg: 'rgba(0, 0, 0, 0.4)', headerBg: '#F6965B'},
      {ownedGamesHeader: `#76E391`, background: '#22551F', drawerBg: '#22551F', primaryBtn: '#76E391', primaryBtnHover: '#2BAE2D', overlayBg: 'rgba(0, 0, 0, 0.4)', headerBg: '#76E391'},
      {background: '#1B2838', drawerBg: '#1B2838', primaryBtn: '#66C0F4', primaryBtnHover: '#2979A8', ownedGamesHeader: '#004E7B', overlayBg: 'rgba(0, 0, 0, 0.4)', headerBg: '#004E7B'},
      {ownedGamesHeader: `#2A16FF`, background: '#EAFF03', drawerBg: '#800079', primaryBtn: '#FF7301', primaryBtnHover: '#2A16FF', overlayBg: 'rgba(0, 0, 0, 0.4)', headerBg: '#76E391'},
    ];
    const randomVariant = variants[Math.floor(Math.random() * variants.length)];
    setColors(randomVariant);
    document.documentElement.style.setProperty('--body-bg', randomVariant.headerBg);
  };

  const [font, setFont] = useState({font: 'font-mono'});

  const swapFont = () => {
    const fonts = ["font-mono", "font-sans", "font-serif"];
    const randomfonts = fonts[Math.floor(Math.random() * fonts.length)];
    setFont({font: randomfonts});
  };

  // Removed getApplist call – endpoint does not exist on backend and caused JSON parse errors
  useEffect(() => {
    // no-op
  }, []);

  return (
    <BrowserRouter>
      <div className={font.font}>
        <Navbar colors={colors} searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="max-w-[90%] mx-auto min-h-screen">
                <div className='z-49 pt-0 pb-[3vw] w-[90vw] fixed top-0 left-0 right-0 mx-auto' style={{ background: `linear-gradient(to bottom, ${colors.headerBg} 0%, ${colors.headerBg} 70%, rgba(0,78,123,0) 100%)`, paddingTop: '10vw' }}>
                  <h1
                    className="text-white font-bold text-center underline"
                    style={{ fontSize: "1.9vw" }}
                  >
                    SteamDream
                  </h1>
                </div>
                <div className="pt-[14vw] space-y-12 flex flex-col items-start">
                  {[
                    {
                      title: "PAYDAY 3",
                      genre: "Strategy & Action",
                      originalPrice: 19.99,
                      currentPrice: 10.00,
                      discountPercent: 50,
                      platforms: { windows: true, apple: true },
                      tags: ['Co-op', 'FPS', 'Online'],
                      description: "Payday 3 är ett förstapersonsskjutspel med starkt fokus på samarbete och strategi, där du tillsammans med upp till tre andra spelare utför avancerade rån. Spelet är en direkt uppföljare till Payday 2 och fortsätter berättelsen om det ökända Payday-gänget, som efter att ha försökt lämna det kriminella livet tvingas tillbaka in i brottets värld. Handlingen utspelar sig i en modern miljö, främst i New York, där nya säkerhetssystem, övervakning och teknologi spelar en större roll än i tidigare delar.",
                      steamUrl: "https://store.steampowered.com/app/1272080/PAYDAY_3/"
                    },
                    {
                      title: "Counter-Strike 2",
                      genre: "FPS & Competitive",
                      currentPrice: 0,
                      platforms: { windows: true },
                      tags: ['Multiplayer', 'Shooter', 'Tactical'],
                      description: "Counter-Strike 2 är nästa generation av världens mest populära taktiska skjutspel. Med helt nytt grafiksystem, förbättrad fysik och uppdaterad gameplay tar CS2 serien till nya höjder.",
                      steamUrl: "https://store.steampowered.com/app/730/CounterStrike_2/"
                    },
                    {
                      title: "Cyberpunk 2077",
                      genre: "RPG & Action",
                      originalPrice: 59.99,
                      currentPrice: 29.99,
                      discountPercent: 50,
                      platforms: { windows: true },
                      tags: ['Sci-fi', 'Open World', 'Cyberpunk'],
                      description: "Cyberpunk 2077 är ett actionrollspel i öppen värld som utspelar sig i Night City - en megalopolis full av makt, glamour och kroppsmodifikationer. Du spelar som V, en cyberpunk som jagar efter ett unikt implantat som är nyckeln till odödlighet.",
                      steamUrl: "https://store.steampowered.com/app/1091500/Cyberpunk_2077/"
                    }
                  ]
                    .filter(game => 
                      game.title.toLowerCase().startsWith(searchTerm.toLowerCase())
                    )
                    .map((game, index) => (
                      <Card 
                        key={index}
                        title={game.title}
                        genre={game.genre}
                        originalPrice={game.originalPrice}
                        currentPrice={game.currentPrice}
                        discountPercent={game.discountPercent}
                        platforms={game.platforms}
                        tags={game.tags}
                        description={game.description}
                        steamUrl={game.steamUrl}
                      />
                    ))
                  }
                </div>
              </div>
            </>
          }
        />
        <Route path="/profile" element={<Profile colors={colors} swapColors={swapColors} swapFont={swapFont} />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/favorite" element={<Favorite colors={colors} searchTerm={searchTerm} />} />
      </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
