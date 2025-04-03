import React from "react";
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Characters from "../../pages/character/components/characters";
import CharacterDetails from "../../pages/character/components/characterDetails";

export const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/characters" replace/>}/>
        <Route path="/characters" element={<Characters/>}/>
        <Route path="/character/:id" element={<CharacterDetails/>}/>
      </Routes>
    </Router>
  );
};
