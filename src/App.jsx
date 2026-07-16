import { Analytics } from "@vercel/analytics/react";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import Blog from "./pages/Blog";
import RegisterBrand from "./pages/RegisterBrand";
import RegisterInfluencer from "./pages/RegisterInfluencer";

function App() {
  const path = window.location.pathname;

  if (path === "/register/brand") {
    return (
      <>
        <RegisterBrand />
        <Analytics />
      </>
    );
  }

  if (path === "/register/influencer") {
    return (
      <>
        <RegisterInfluencer />
        <Analytics />
      </>
    );
  }

  if (path === "/admin") {
    return (
      <>
        <AdminDashboard />
        <Analytics />
      </>
    );
  }

  if (path === "/blog" || path.startsWith("/blog/")) {
    return (
      <>
        <Blog />
        <Analytics />
      </>
    );
  }

  return (
    <>
      <Home />
      <Analytics />
    </>
  );
}

export default App;
