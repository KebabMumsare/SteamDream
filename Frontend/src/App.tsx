import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Card from './components/Card';
import Navbar from './components/Navbar';
import Profile from './Profile';
import Login from './Login'; // Lägg till denna rad
import Favorite from './Favorite';
import Game from './components/game';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="max-w-[90%] mx-auto">
                <div className='z-49 pt-[9vw] w-[100%]  bottom: [background:linear-gradient(to_bottom,#004E7B_0%,#004E7B_87%,rgba(0,78,123,0)_100%)] fixed left-1/2 transform -translate-x-1/2'>
                  <h1
                    className="text-white font-mono font-bold text-center mt-[2vw] mb-[4vw] underline"
                    style={{ fontSize: "1.9vw" }}
                  >
                    SteamDream
                  </h1>
                </div>
                <div className="pt-[15vw] space-y-12">
                  <Card />
                  <Game />
                  <Card />
                  <Card />
                  <Card />
                  <Card />
                </div>
              </div>
            </>
          }
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/favorite" element={<Favorite />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
