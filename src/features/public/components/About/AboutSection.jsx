import {
    BookOpen,
    Layers3,
} from "lucide-react";

import aboutWorkspace
    from "../../../../assets/images/about-workspace.svg";

import "./about.css";

export default function AboutSection() {

    return (
        <section
            id="about"
            className="
                section
                section--alt
            "
        >
            <div
                className="
                    container
                    about
                "
            >
                <div
                    className="
                        about__visual
                        reveal
                    "
                >
                    <img
                        src={aboutWorkspace}
                        alt="About Workspace"
                    />

                    <div
                        className="
                            about__badge
                        "
                    >
                        <strong>
                            Full Stack
                        </strong>

                        <span>
                            Java · React · MySQL
                        </span>
                    </div>
                </div>

                <div
                    className="
                        about__copy
                        reveal
                    "
                    data-delay="1"
                >
                    <span
                        className="
                            eyebrow
                        "
                    >
                        About Me
                    </span>

                    <h2>
                        Structured thinking,
                        human-centered
                        results.
                    </h2>

                    <p>
                        I enjoy transforming
                        requirements into
                        clear, maintainable,
                        and scalable software.

                        My development
                        approach combines a
                        layered Java backend
                        mindset with modern,
                        component-oriented
                        frontend development.

                        I continuously learn,
                        refine my architecture
                        skills, and build
                        projects that solve
                        real-world business
                        problems.
                    </p>

                    <div
                        className="
                            about__facts
                        "
                    >
                        <div>
                            <BookOpen
                                className="
                                    icon
                                "
                            />

                            <span>
                                <b>
                                    Continuous
                                    Learner
                                </b>

                                <small>
                                    Build,
                                    review,
                                    improve
                                </small>
                            </span>
                        </div>

                        <div>
                            <Layers3
                                className="
                                    icon
                                "
                            />

                            <span>
                                <b>
                                    Architecture
                                    Minded
                                </b>

                                <small>
                                    Modular
                                    and
                                    maintainable
                                    solutions
                                </small>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}