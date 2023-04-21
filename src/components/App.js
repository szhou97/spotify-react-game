import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";

import Home from "./Home";
import Game from "./Game";

const App = () => (
  <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </BrowserRouter>
  </div>
);

export default App;
