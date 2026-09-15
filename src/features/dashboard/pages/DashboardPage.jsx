import useAuth
    from "../../auth/hooks/useAuth";

export default function DashboardPage() {

    const {
        user,
        logout,
    } = useAuth();

    async function handleLogout() {

        await logout();

        window.location.href =
            "/login";
    }

    return (
        <div>

            <h1>
                Dashboard
            </h1>

            <p>
                Welcome:
                {" "}
                {user?.username}
            </p>

            <p>
                Role:
                {" "}
                {user?.role}
            </p>

            <button
                onClick={
                    handleLogout
                }
            >
                Logout
            </button>

        </div>
    );
}