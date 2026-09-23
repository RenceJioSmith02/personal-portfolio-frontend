import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import LoginPage
    from "../../features/auth/pages/LoginPage";

import DashboardPage
    from "../../features/dashboard/pages/DashboardPage";

import ExperiencePage
    from "../../features/experience/pages/ExperiencePage";

import ServicePage
    from "../../features/service/pages/ServicePage";

import CapabilityPage
    from "../../features/capability/pages/CapabilityPage";

import ProjectPage
    from "../../features/project/pages/ProjectPage";

import HomePage
    from "../../features/public/pages/HomePage";

import PublicLayout
    from "../../features/public/layouts/PublicLayout";

import ProjectDetailsPage
    from "../../features/public/pages/ProjectDetailsPage";

import ProtectedRoute
    from "../../shared/components/ProtectedRoute";

import AdminLayout
    from "../../shared/layouts/AdminLayout";

export default function AppRouter() {

    return (
        <BrowserRouter>

            <Routes>

                {/* ==========================
                   PUBLIC WEBSITE
                ========================== */}

                <Route
                    element={
                        <PublicLayout />
                    }
                >
                    <Route
                        path="/"
                        element={
                            <HomePage />
                        }
                    />

                    <Route
                        path="/projects/:slug"
                        element={
                            <ProjectDetailsPage />
                        }
                    />

                </Route>

                {/* ==========================
                   AUTH
                ========================== */}

                <Route
                    path="/login"
                    element={
                        <LoginPage />
                    }
                />

                {/* ==========================
                   ADMIN CMS
                ========================== */}

                <Route
                    element={
                        <ProtectedRoute>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route
                        path="/dashboard"
                        element={
                            <DashboardPage />
                        }
                    />

                    <Route
                        path="/experiences"
                        element={
                            <ExperiencePage />
                        }
                    />

                    <Route
                        path="/services"
                        element={
                            <ServicePage />
                        }
                    />

                    <Route
                        path="/capabilities"
                        element={
                            <CapabilityPage />
                        }
                    />

                    <Route
                        path="/projects"
                        element={
                            <ProjectPage />
                        }
                    />
                </Route>

                {/* ==========================
                   FALLBACK
                ========================== */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}