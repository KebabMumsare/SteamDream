import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'

import Card from './components/Card';
import Navbar from './components/Navbar';
import Profile from './Profile';

function App() {

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Card />
              <Card />
              <Card />
              <Card />
            </>
          }
        />
      </Routes>
      <Routes>
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
