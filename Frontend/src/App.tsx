import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import Card from './components/Card';
import Navbar from './components/Navbar';
import Profile from './Profile';
import Login from './Login';
import Favorite from './Favorite';
import { test, getApplist } from './service/steamApi';
import { useEffect, useState } from 'react';


function App() {
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
    // Update CSS variable for body background
    document.documentElement.style.setProperty('--body-bg', randomVariant.headerBg);
  };

  const [font, setFont] = useState({font: 'font-mono'});

  const swapFont = () => {
    const fonts = ["font-mono", "font-sans", "font-serif"];
    
  const randomfonts = fonts[Math.floor(Math.random() * fonts.length)];
  setFont({font: randomfonts});
  };

  
  useEffect(() => {
   getApplist();
  }, []);

 

  return (
    <BrowserRouter>
      <div className={font.font}>
        <Navbar colors={colors} />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="max-w-[90%] mx-auto">
                  <div className='z-49 pt-[9vw] w-[100%] fixed left-1/2 transform -translate-x-1/2' style={{ background: `linear-gradient(to bottom, ${colors.headerBg} 0%, ${colors.headerBg} 87%, rgba(0,78,123,0) 100%)` }}>
                    <h1
                      className="text-white font-bold text-center mt-[2vw] mb-[4vw] underline"
                      style={{ fontSize: "1.9vw" }}
                    >
                      SteamDream
                    </h1>
                  </div>
                
                <div className="pt-[15vw] space-y-12">
                  
                </div>

              </div>
            </>
          }
        />
        <Route path="/profile" element={<Profile colors={colors} swapColors={swapColors} swapFont={swapFont} />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/favorite" element={<Favorite colors={colors} />} />
      </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
