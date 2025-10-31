import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/NavBar";
import HomePage from "./pages/HomePage";
import CreateResultPage from "./pages/CreateResultPage";
import GalleryPage from "./pages/GalleryPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <BrowserRouter>
      {/* Navbar appears on all pages */}
      <Navbar />

      {/* Page Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateResultPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
