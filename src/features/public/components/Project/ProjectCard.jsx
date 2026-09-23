import {
    ExternalLink,
    GitBranch,
    ImageOff,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

import {
    useState,
} from "react";

import {
    resolveProjectImageUrl,
} from "../../../project/utils/projectImageUtils";

function buildTechStackArray(
    techStack
) {

    if (!techStack) {
        return [];
    }

    return techStack
        .split(",")
        .map(
            item =>
                item.trim()
        )
        .filter(Boolean);
}

export default function ProjectCard({
    project,
    delay = 0,
}) {

    const [
        imageFailed,
        setImageFailed,
    ] = useState(false);

    const techStack =
        buildTechStackArray(
            project.techStack
        );

    const imageSource =
        resolveProjectImageUrl(
            project.imageUrl
        );

    return (
        <article
            className={
                "card project-card reveal"
            }
            data-delay={delay}
        >
            <div
                className={
                    "project-card__image"
                }
            >
                {
                    imageSource
                    && !imageFailed
                        ? (
                            <img
                                src={imageSource}
                                alt={project.title}
                                onError={() =>
                                    setImageFailed(
                                        true
                                    )
                                }
                            />
                        )
                        : (
                            <div
                                className={
                                    "project-card__image-fallback"
                                }
                            >
                                <ImageOff
                                    size={28}
                                    aria-hidden="true"
                                />

                                <span>
                                    Preview unavailable
                                </span>
                            </div>
                        )
                }
            </div>

            <div
                className={
                    "project-card__body"
                }
            >
                <h3>
                    <Link
                        to={
                            `/projects/${project.slug}`
                        }
                    >
                        {project.title}
                    </Link>
                </h3>

                <p>
                    {project.summary}
                </p>

                {
                    techStack.length > 0 && (
                        <div
                            className={
                                "cluster"
                            }
                            aria-label={
                                "Technology stack"
                            }
                        >
                            {
                                techStack.map(
                                    technology => (
                                        <span
                                            key={
                                                technology
                                            }
                                            className={
                                                "tag"
                                            }
                                        >
                                            {technology}
                                        </span>
                                    )
                                )
                            }
                        </div>
                    )
                }

                <div
                    className={
                        "project-card__actions"
                    }
                >
                    <Link
                        to={
                            `/projects/${project.slug}`
                        }
                    >
                        View Details
                    </Link>

                    {
                        project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <ExternalLink
                                    size={16}
                                    aria-hidden="true"
                                />

                                Live Demo
                            </a>
                        )
                    }

                    {
                        project.repositoryUrl && (
                            <a
                                href={project.repositoryUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <GitBranch
                                    size={16}
                                    aria-hidden="true"
                                />

                                Source
                            </a>
                        )
                    }
                </div>
            </div>
        </article>
    );
}