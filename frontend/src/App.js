import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/common/Layout";
import Home from "./components/user/Home";
import Login from "./components/user/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Register from "./components/user/Register";
import Dashboard from "./components/user/Dashboard";
import AdminLogin from "./components/admin/AdminLogin";
import AdminRegister from "./components/admin/AdminRegister";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminDepartmentPage from "./components/admin/AdminDepartmentPage"; // ✅
import DepartmentListPage from "./pages/DepartmentListPage";
import DepartmentDetailPage from "./pages/DepartmentDetailPage";
import HelpdeskPage from "./pages/HelpdeskPage";
import AdminHelpdeskPage from "./pages/AdminHelpdeskPage";
import UserHelpdeskPage from "./pages/UserHelpdeskPage";
import SyllabusHomePage from "./pages/SyllabusHomePage";
import SyllabusDepartmentPage from "./pages/SyllabusDepartmentsPages";
import SyllabusYearPage from "./pages/SyllabusYearsPage";
import SyllabusSubjectPage from "./pages/SyllabusSubjectPage";
import AdminArticleReviewPage from "./pages/AdminArticleReviewPage";
import ArticleSubmitPage from "./pages/ArticleSubmitPage";
import ArticleListPage from "./pages/ArticleListPage";
import UserArticlesPage from "./pages/UserArticlesPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/departments" element={<AdminDepartmentPage />} />
        <Route path="/departments" element={<DepartmentListPage />} />
        <Route path="/departments/:id" element={<DepartmentDetailPage />} />
        <Route path="/helpdesk" element={<HelpdeskPage />} />
        <Route path="/admin/helpdesk" element={<AdminHelpdeskPage />} />
        <Route path="/helpdesk/my" element={<UserHelpdeskPage />} />
        <Route path="/syllabus" element={<SyllabusHomePage />} />
        <Route path="/syllabus/:scheme" element={<SyllabusDepartmentPage />} />
        <Route path="/syllabus/:scheme/:department" element={<SyllabusYearPage />}/>
        <Route path="/syllabus/:scheme/:department/:year" element={<SyllabusSubjectPage />}/>
        <Route path="/admin/articles" element={<AdminArticleReviewPage />} />
        <Route path="/articles" element={<UserArticlesPage />} />
        <Route path="/articles/new" element={<ArticleSubmitPage />} />
        <Route path="/articles" element={<ArticleListPage />} />
        


      </Routes>
    </Router>
  );
}

export default App;
