import {
    useEffect,
    useState,
} from "react";

import {
    Link,
} from "react-router-dom";

import {
    Menu,
    X,
} from "lucide-react";

import "./navbar.css";

const NAV_ITEMS = [
    {
        href: "#about",
        to: "/#about",
        label: "About",
    },
    {
        href: "#experience",
        to: "/#experience",
        label: "Experience",
    },
    {
        href: "#projects",
        to: "/#projects",
        label: "Projects",
    },
    {
        href: "#services",
        to: "/#services",
        label: "Services",
    },
];

export default function Navbar() {

    const [
        mobileMenuOpen,
        setMobileMenuOpen,
    ] = useState(false);

    const [
        isScrolled,
        setIsScrolled,
    ] = useState(false);

    const [
        activeSection,
        setActiveSection,
    ] = useState("");

    useEffect(() => {

        function handleScroll() {

            setIsScrolled(
                window.scrollY > 18
            );
        }

        window.addEventListener(
            "scroll",
            handleScroll,
            {
                passive: true,
            }
        );

        handleScroll();

        return () => {

            window.removeEventListener(
                "scroll",
                handleScroll
            );
        };

    }, []);

    useEffect(() => {

        const sectionIds = [
            "#home",
            ...NAV_ITEMS.map(
                item => item.href
            ),
            "#contact",
        ];

        const sections =
            sectionIds
                .map(
                    sectionId =>
                        document.querySelector(
                            sectionId
                        )
                )
                .filter(Boolean);

        if (!sections.length) {
            return;
        }

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                setActiveSection(
                                    `#${entry.target.id}`
                                );
                            }
                        }
                    );
                },
                {
                    rootMargin:
                        "-35% 0px -58%",
                }
            );

        sections.forEach(
            section =>
                observer.observe(
                    section
                )
        );

        return () => {

            observer.disconnect();
        };

    }, []);

    function handleLinkClick() {

        setMobileMenuOpen(
            false
        );
    }

    return (
        <header
            className={
                isScrolled
                    ? "navbar is-scrolled"
                    : "navbar"
            }
        >
            <div
                className="
                    container
                    navbar__inner
                "
            >
                <Link
                    to="/#home"
                    onClick={
                        handleLinkClick
                    }
                    className={
                        activeSection === "#home"
                            ? "is-active"
                            : ""
                    }
                    aria-label="Go to homepage"
                >
                    <img
                        src="/logo/logo.png"
                        alt="RJ Smith Logo"
                        className="navbar__logo-image"
                    />
                </Link>

                <button
                    type="button"
                    className="
                        nav-toggle
                    "
                    aria-expanded={
                        mobileMenuOpen
                    }
                    aria-controls={
                        "primary-nav"
                    }
                    aria-label={
                        mobileMenuOpen
                            ? "Close navigation"
                            : "Open navigation"
                    }
                    onClick={() =>
                        setMobileMenuOpen(
                            previous =>
                                !previous
                        )
                    }
                >
                    {
                        mobileMenuOpen
                            ? (
                                <X
                                    size={20}
                                    aria-hidden="true"
                                />
                            )
                            : (
                                <Menu
                                    size={20}
                                    aria-hidden="true"
                                />
                            )
                    }
                </button>

                <nav
                    id="primary-nav"
                    aria-label="
                        Primary navigation
                    "
                    className={
                        mobileMenuOpen
                            ? "nav is-open"
                            : "nav"
                    }
                >
                    {
                        NAV_ITEMS.map(
                            item => (
                                <Link
                                    key={
                                        item.href
                                    }
                                    to={
                                        item.to
                                    }
                                    onClick={
                                        handleLinkClick
                                    }
                                    className={
                                        activeSection
                                        === item.href
                                            ? "is-active"
                                            : ""
                                    }
                                >
                                    {
                                        item.label
                                    }
                                </Link>
                            )
                        )
                    }

                    <Link
                        to="/#contact"
                        onClick={
                            handleLinkClick
                        }
                        className={
                            activeSection
                            === "#contact"
                                ? "nav__cta is-active"
                                : "nav__cta"
                        }
                    >
                        Let's Talk
                    </Link>
                </nav>
            </div>
        </header>
    );
}