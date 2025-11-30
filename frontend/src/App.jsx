import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/NavBar";
import HomePage from "./pages/HomePage";
import CreateResultPage from "./pages/CreateResultPage";
import GalleryPage from "./pages/GalleryPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import GifTestPage from "./pages/GifTestPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pages without navbar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/gif-test" element={<GifTestPage />} />
        <Route path="/" element={<HomePage />} />
        
        {/* Pages with navbar */}
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/create" element={<CreateResultPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
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
