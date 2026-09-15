import {
    Link,
} from "react-router-dom";

import useAuth
    from "../../features/auth/hooks/useAuth";

export default function Sidebar() {

    const {
        logout,
    } = useAuth();

    async function handleLogout() {

        await logout();

        window.location.href =
            "/login";
    }

    return (
        <aside
            style={{
                width: "250px",
                padding: "20px",
                borderRight:
                    "1px solid #ddd",
                minHeight: "100vh",
            }}
        >
            <h2>
                Portfolio CMS
            </h2>

            <nav>

                <p>
                    <Link
                        to="/dashboard"
                    >
                        Dashboard
                    </Link>
                </p>

                <p>
                    <Link
                        to="/experiences"
                    >
                        Experiences
                    </Link>
                </p>

                <p>
                    <Link
                        to="/services"
                    >
                        Services
                    </Link>
                </p>

                <p>
                    <Link
                        to="/capabilities"
                    >
                        Capabilities
                    </Link>
                </p>

                <p>
                    <Link
                        to="/projects"
                    >
                        Projects
                    </Link>
                </p>

            </nav>

            <hr />

            <button
                onClick={
                    handleLogout
                }
            >
                Logout
            </button>
        </aside>
    );
}