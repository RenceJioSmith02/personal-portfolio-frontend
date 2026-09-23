import {
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    Lock,
    User,
    ArrowRight,
} from "lucide-react";

import {
    login as loginRequest,
} from "../services/authService";

import {
    useAuth,
} from "../context/AuthContext";

import "./login.css";

export default function LoginPage() {

    const navigate =
        useNavigate();

    const {
        login,
    } = useAuth();

    const [
        username,
        setUsername,
    ] = useState("");

    const [
        password,
        setPassword,
    ] = useState("");

    const [
        error,
        setError,
    ] = useState("");

    const [
        loading,
        setLoading,
    ] = useState(false);

    async function handleSubmit(
        event
    ) {

        event.preventDefault();

        try {

            setLoading(true);
            setError("");

            const response =
                await loginRequest({
                    username,
                    password,
                });

            login(
                response.accessToken,
                response.refreshToken
            );

            navigate(
                "/dashboard"
            );

        } catch {

            setError(
                "Invalid username or password"
            );

        } finally {

            setLoading(false);
        }
    }

    return (
        <section
            className="login-page"
        >
            <div
                className="login-glow"
            />

            <div
                className="
                    login-floating
                    login-floating--top
                "
            >
                Secure Access
            </div>

            <div
                className="
                    login-floating
                    login-floating--bottom
                "
            >
                Portfolio CMS
            </div>

            <div
                className="login-ring"
            />

            <div
                className="
                    login-card
                "
            >
                <span
                    className="
                        login-eyebrow
                    "
                >
                    Portfolio CMS
                </span>

                <h1>
                    Welcome Back
                </h1>

                <p>
                    Sign in to manage
                    your portfolio,
                    projects, services,
                    and experiences.
                </p>

                <form
                    className="
                        login-form
                    "
                    onSubmit={
                        handleSubmit
                    }
                >
                    <div
                        className="
                            login-field
                        "
                    >
                        <User
                            size={18}
                        />

                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(
                                event
                            ) =>
                                setUsername(
                                    event.target.value
                                )
                            }
                        />
                    </div>

                    <div
                        className="
                            login-field
                        "
                    >
                        <Lock
                            size={18}
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(
                                event
                            ) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                        />
                    </div>

                    {
                        error && (
                            <div
                                className="
                                    login-error
                                "
                            >
                                {error}
                            </div>
                        )
                    }

                    <button
                        type="submit"
                        disabled={
                            loading
                        }
                        className="
                            login-button
                        "
                    >
                        {
                            loading
                                ? "Signing In..."
                                : "Sign In"
                        }

                        {
                            !loading && (
                                <ArrowRight
                                    size={18}
                                />
                            )
                        }
                    </button>
                </form>
            </div>
        </section>
    );
}