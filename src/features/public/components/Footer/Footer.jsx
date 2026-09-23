import "./footer.css";

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
                <a
                    href="#home"
                    className="footer__logo"
                    
                >
                    <img
                        src="/logo/logo.png"
                        alt="RJ Smith Logo"
                        className="footer__logo-image"
                    />
                </a>

                <p>
                    Full Stack Java Developer ·
                    Portfolio CMS
                </p>

                <div
                    className="
                        footer__links
                    "
                >
                    <a
                        href="#about"
                    >
                        About
                    </a>

                    <a
                        href="#projects"
                    >
                        Projects
                    </a>

                    <a
                        href="#services"
                    >
                        Services
                    </a>

                    <a
                        href="#contact"
                    >
                        Contact
                    </a>
                </div>

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