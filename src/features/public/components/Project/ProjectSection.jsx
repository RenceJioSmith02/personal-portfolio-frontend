import "./project.css";

import ProjectCard
    from "./ProjectCard";

export default function ProjectSection({
    projects = [],
}) {

    if (!projects.length) {

        return (
            <section
                id="projects"
                className="section"
            >
                <div
                    className="container"
                >
                    <div
                        className="
                            section-heading
                        "
                    >
                        <span
                            className="
                                eyebrow
                            "
                        >
                            Selected Work
                        </span>

                        <h2>
                            Projects made
                            around real
                            problems.
                        </h2>

                        <p>
                            No published
                            projects available
                            yet.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            id="projects"
            className="section"
        >
            <div
                className="container"
            >
                <div
                    className="
                        projects__head
                        reveal
                    "
                >
                    <div
                        className="
                            section-heading
                        "
                    >
                        <span
                            className="
                                eyebrow
                            "
                        >
                            Selected Work
                        </span>

                        <h2>
                            Projects made
                            around real
                            problems.
                        </h2>
                    </div>
                </div>

                <div
                    className="
                        projects
                        grid
                    "
                >
                {
                    projects.map(
                        (
                            project,
                            index
                        ) => (
                            <ProjectCard
                                key={
                                    project.slug
                                }
                                project={
                                    project
                                }
                                delay={
                                    index % 2
                                }
                            />
                        )
                    )
                }
                </div>
            </div>
        </section>
    );
}