import {
    ArrowRight,
    Download,
    GitBranch,
    LinkIcon,
    Mail,
    Code2,
} from "lucide-react";

import developerPortrait
    from "../../../../assets/images/developer-portrait.svg";

import "./hero.css";

export default function HeroSection() {

    return (
        <section
            id="home"
            className="hero"
        >
            <div
                className="
                    container
                    hero__grid
                "
            >
                <div
                    className="
                        hero__copy
                    "
                >
                    <span
                        className="
                            eyebrow
                        "
                    >
                        Java + React Developer
                    </span>

                    <h1>
                        Building useful
                        software with{" "}

                        <span>
                            clarity.
                        </span>
                    </h1>

                    <p>
                        I’m Rence Jio Smith D. Bal-ot,
                        a Full Stack Java
                        Developer focused on
                        clean architecture,
                        accessible user
                        experiences, and
                        reliable business
                        applications.
                    </p>

<div
    className="
        cluster
        hero__actions
    "
>
    <a
        href="#projects"
        className="
            btn
            btn--primary
        "
    >
        View My Work
    </a>

    <a
        href="/resume/resume.pdf"
        className="
            btn
            btn--secondary
        "
    >
        <Download
            size={18}
        />

        Resume
    </a>
</div>

                    <div
                        className="
                            hero__socials
                        "
                    >
                        <a
                            href="https://github.com"
                            aria-label="GitHub"
                        >
                            <GitBranch
                                size={18}
                            />
                        </a>

                        <a
                            href="https://linkedin.com"
                            aria-label="LinkedIn"
                        >
                            <LinkIcon
                                size={18}
                            />
                        </a>

                        <a
                            href="mailto:your-email@example.com"
                            aria-label="Email"
                        >
                            <Mail
                                size={18}
                            />
                        </a>
                    </div>
                </div>

                <div
                    className="
                        hero__visual
                        reveal
                    "
                >
                    <div
                        className="
                            hero__ring
                        "
                    />

                    <img
                        src="/profile_image/profile.png"
                        alt="Hero Workspace"
                    />

                    <div
                        className="
                            floating-card
                            floating-card--top
                        "
                    >
                        <Code2
                            size={16}
                        />

                        <span>
                            Clean Code
                        </span>
                    </div>

                    <div
                        className="
                            floating-card
                            floating-card--bottom
                        "
                    >
                        <i />

                        <span>
                            Open to
                            Opportunities
                        </span>
                    </div>
                </div>
            </div>

            <a
                href="#about"
                aria-label="Scroll to About section"
                className="scroll-down"
            >
                <span />
            </a>
        </section>
    );
}