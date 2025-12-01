import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/NavBar";
import HomePage from "./pages/HomePage";
import CreateResultPage from "./pages/CreateResultPage";
import CharactersPage from "./pages/CharactersPage";
import CharacterDetailPage from "./pages/CharacterDetailPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pages without navbar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
        
        {/* Pages with navbar */}
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/create" element={<CreateResultPage />} />
                <Route path="/characters" element={<CharactersPage />} />
                <Route path="/characters/:id" element={<CharacterDetailPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
