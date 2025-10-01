import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Card from "./components/Card";
import Navbar from "./components/Navbar";
import Profile from "./Profile";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <h1 className="text-red-500 underline">
                <Link to="/profile">Profile</Link>
              </h1>
              <h1 className="text-red-500 underline">Hello world!</h1>
              <Card />
            </>
          }
        />
      </Routes>
      <Routes>
        <Route path="/profile" element={<Profile />} />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;
