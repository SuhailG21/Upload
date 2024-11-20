import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProofOfAddress from './components/ProofOfAddress';
import IdentityDocuments from './components/IdentityDocuments';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/proof-of-address" element={<ProofOfAddress />} />
        <Route path="/identity-documents" element={<IdentityDocuments />} />
      </Routes>
    </Router>
  );
};

export default App;

