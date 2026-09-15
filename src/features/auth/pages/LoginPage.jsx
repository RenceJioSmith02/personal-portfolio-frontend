import {
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    login as loginRequest
} from "../services/authService";

import {
    useAuth
} from "../context/AuthContext";

export default function LoginPage() {

    const navigate =
            useNavigate();

    const {
        login
    } = useAuth();

    const [username,
        setUsername] =
            useState("");

    const [password,
        setPassword] =
            useState("");

    const [error,
        setError] =
            useState("");

    const [loading,
        setLoading] =
            useState(false);

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
        <div>

            <h1>
                Portfolio CMS Login
            </h1>

            <form
                onSubmit={
                    handleSubmit
                }
            >

                <div>

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

                <br />

                <div>

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

                <br />

                <button
                    type="submit"
                    disabled={
                        loading
                    }
                >
                    {
                        loading
                            ? "Logging in..."
                            : "Login"
                    }
                </button>

                {
                    error && (
                        <p>
                            {error}
                        </p>
                    )
                }

            </form>

        </div>
    );
}
