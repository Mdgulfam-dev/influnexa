import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import Blog from "./pages/Blog";
import RegisterBrand from "./pages/RegisterBrand";
import RegisterInfluencer from "./pages/RegisterInfluencer";
import About from "./pages/About";
import Careers from "./pages/Careers";
import JobDetail from "./pages/JobDetail";
import Industries from "./pages/Industries";
import ShareExperience from "./pages/ShareExperience";
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

  if (path === "/about") {
    return <About />;
  }

  if (path === "/careers") {
    return <Careers />;
  }

  if (path.startsWith("/careers/")) {
    return <JobDetail />;
  }

  if (path === "/blog" || path.startsWith("/blog/")) {
    return <Blog />;
  }
  if (path === "/industries") {
  return <Industries />;
}
 if (path === "/share-experience") {
  return <ShareExperience/>;
 }

  return <Home />;
}

export default App;
