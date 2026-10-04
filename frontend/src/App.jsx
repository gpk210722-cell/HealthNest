import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import BlogDetails from "./pages/BlogDetails";
import Categories from "./pages/Categories";
import Community from "./pages/Community";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import CreateBlog from "./pages/CreateBlog";
import MyBlogs from "./pages/MyBlogs";
import SavedBlogs from "./pages/SavedBlogs";
import HealthTracker from "./pages/HealthTracker";
import Recommendations from "./pages/Recommendations";
import Admin from "./pages/Admin";
import Reels from "./pages/Reels";


function App() {
  return (
    <BrowserRouter>

      {/* =========================
                NAVBAR
            ========================= */}

      <Navbar />


      {/* =========================
                ROUTES
            ========================= */}

      <Routes>

        {/* Main Pages */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/blogs"
          element={<Blogs />}
        />

        <Route
          path="/blog/:id"
          element={<BlogDetails />}
        />

        <Route
          path="/categories"
          element={<Categories />}
        />

        <Route
          path="/community"
          element={<Community />}
        />

        <Route
          path="/about"
          element={<About />}
        />


        {/* Authentication */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* User */}

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/create-blog"
          element={<CreateBlog />}
        />

        <Route
          path="/my-blogs"
          element={<MyBlogs />}
        />

        <Route
          path="/saved-blogs"
          element={<SavedBlogs />}
        />


        {/* Health Features */}

        <Route
          path="/health-tracker"
          element={<HealthTracker />}
        />

        <Route
          path="/recommendations"
          element={<Recommendations />}
        />


        {/* Health Reels */}

        <Route
          path="/reels"
          element={<Reels />}
        />


        {/* Admin */}

        <Route
          path="/admin"
          element={<Admin />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;