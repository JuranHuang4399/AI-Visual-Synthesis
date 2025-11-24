import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/common/NavBar";
import HomePage from "./pages/HomePage";
import CreateResultPage from "./pages/CreateResultPage";
import ResultPage from "./pages/ResultPage";
import GalleryPage from "./pages/GalleryPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";

function AppContent() {
  const location = useLocation();
  const showNavbar = location.pathname !== "/login";

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateResultPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
