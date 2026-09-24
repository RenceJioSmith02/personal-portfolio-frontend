import {
    Link,
} from "react-router-dom";

import "./footer.css";

const FOOTER_LINKS = [
    {
        to: "/#about",
        label: "About",
    },
    {
        to: "/#projects",
        label: "Projects",
    },
    {
        to: "/#services",
        label: "Services",
    },
    {
        to: "/#contact",
        label: "Contact",
    },
];

export default function Footer() {

    const currentYear =
        new Date().getFullYear();

    return (
        <footer
            className="footer"
        >
            <div
                className="
                    container
                    footer__inner
                "
            >
                <Link
                    to="/#home"
                    className="footer__logo"
                    aria-label="Go to homepage"
                >
                    <img
                        src="/logo/logo.png"
                        alt="RJ Smith Logo"
                        className="navbar__logo-image"
                    />
                </Link>

                <p>
                    Full Stack Java Developer
                </p>

                <nav
                    className="footer__links"
                    aria-label="Footer navigation"
                >
                    {
                        FOOTER_LINKS.map(
                            link => (
                                <Link
                                    key={
                                        link.to
                                    }
                                    to={
                                        link.to
                                    }
                                >
                                    {
                                        link.label
                                    }
                                </Link>
                            )
                        )
                    }
                </nav>

                <p>
                    © {currentYear}
                    {" "}
                    Rence Jio Smith D. Bal-ot.
                    All rights reserved.
                </p>
            </div>
        </footer>
    );
}