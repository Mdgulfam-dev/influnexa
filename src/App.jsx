import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import Blog from "./pages/Blog";
import RegisterBrand from "./pages/RegisterBrand";
import RegisterInfluencer from "./pages/RegisterInfluencer";
import { Analytics } from "@vercel/analytics/react";

function App() {
  const path = window.location.pathname;

  if (path === "/register/brand") {
    return <RegisterBrand />;
  }

  if (path === "/register/influencer") {
    return <RegisterInfluencer />;
  }

  if (path === "/admin") {
    return <AdminDashboard />;
  }

  if (path === "/blog" || path.startsWith("/blog/")) {
    return <Blog />;
  }

  return <Home />;
}

export default App;
