import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import Card from './components/Card';
import Navbar from './components/Navbar';
import Profile from './Profile';
import Login from './Login'; // Lägg till denna rad
import Favorite from './Favorite';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className='place-items-center pt-40 max-w-[90%] mx-auto'>
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
              </div>
            </>
          }
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/favorite" element={<Favorite />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
