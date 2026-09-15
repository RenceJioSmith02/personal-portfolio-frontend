import {
    NavLink,
    useNavigate,
} from "react-router-dom";

import useAuth
    from "../../features/auth/hooks/useAuth";

import Button
    from "../components/Button/Button";

import "./Sidebar.css";

const NAVIGATION_ITEMS = [
    {
        path: "/dashboard",
        label: "Dashboard",
    },
    {
        path: "/experiences",
        label: "Experiences",
    },
    {
        path: "/services",
        label: "Services",
    },
    {
        path: "/capabilities",
        label: "Capabilities",
    },
    {
        path: "/projects",
        label: "Projects",
    },
];

export default function Sidebar() {

    const navigate =
        useNavigate();

    const {
        user,
        logout,
    } = useAuth();

    async function handleLogout() {

        await logout();

        navigate(
            "/login",
            {
                replace: true,
            }
        );
    }

    return (
        <aside
            className={
                "admin-sidebar"
            }
        >
            <div
                className={
                    "admin-sidebar__brand"
                }
            >
                <span
                    className={
                        "admin-sidebar__eyebrow"
                    }
                >
                    Admin Portal
                </span>

                <h1>
                    Portfolio CMS
                </h1>
            </div>

            <nav
                className={
                    "admin-sidebar__navigation"
                }
                aria-label={
                    "Admin navigation"
                }
            >
                {
                    NAVIGATION_ITEMS.map(
                        item => (
                            <NavLink
                                key={
                                    item.path
                                }
                                to={
                                    item.path
                                }
                                className={({
                                    isActive,
                                }) =>
                                    isActive
                                        ? "admin-sidebar__link admin-sidebar__link--active"
                                        : "admin-sidebar__link"
                                }
                            >
                                {item.label}
                            </NavLink>
                        )
                    )
                }
            </nav>

            <div
                className={
                    "admin-sidebar__footer"
                }
            >
                {
                    user && (
                        <div
                            className={
                                "admin-sidebar__user"
                            }
                        >
                            <span>
                                Signed in as
                            </span>

                            <strong>
                                {
                                    user.username
                                }
                            </strong>

                            <small>
                                {
                                    user.role
                                }
                            </small>
                        </div>
                    )
                }

                <Button
                    variant="secondary"
                    fullWidth
                    onClick={
                        handleLogout
                    }
                >
                    Logout
                </Button>
            </div>
        </aside>
    );
}