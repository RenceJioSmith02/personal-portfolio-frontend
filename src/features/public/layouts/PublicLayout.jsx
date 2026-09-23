import {
    Outlet,
} from "react-router-dom";

import {
    useEffect,
    useRef,
} from "react";

import Footer
    from "../components/Footer/Footer";

import Navbar
    from "../components/Navbar/Navbar";

export default function PublicLayout() {

    const glowRef =
        useRef(null);

    useEffect(() => {

        function handleMove(
            event
        ) {

            if (
                !glowRef.current
            ) {
                return;
            }

            glowRef.current.style.left =
                `${event.clientX}px`;

            glowRef.current.style.top =
                `${event.clientY}px`;
        }

        window.addEventListener(
            "pointermove",
            handleMove
        );

        return () => {

            window.removeEventListener(
                "pointermove",
                handleMove
            );
        };

    }, []);

    return (
        <div className="public-site">

            <a
                href="#main-content"
                className="skip-to-content"
            >
                Skip to content
            </a>

            <Navbar />

            <main
                id="main-content"
            >
                <Outlet />
            </main>

            <Footer />

            <div
                ref={glowRef}
                className="cursor-glow"
                aria-hidden="true"
            />
        </div>
    );
}