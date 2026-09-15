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

import ProtectedRoute
    from "../../shared/components/ProtectedRoute";

import AdminLayout
    from "../../shared/layouts/AdminLayout";

export default function AppRouter() {

    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

                <Route
                    path="/login"
                    element={
                        <LoginPage />
                    }
                />

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

            </Routes>

        </BrowserRouter>
    );
}