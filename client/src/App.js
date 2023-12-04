import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { Navbar } from "./components/navbar";
import { Auth } from "./pages/auth";
import { CreateHeroList } from "./pages/create-herolist";
import { Home } from "./pages/home";
import { SavedHeroLists } from "./pages/saved-herolists";
import { AdminDashboard } from "./pages/admin-dashboard";
import { About } from "./pages/about";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/home" element={<Home />} />
          <Route path="/create-herolist" element={<CreateHeroList />} />
          <Route path="/saved-herolists" element={<SavedHeroLists />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
