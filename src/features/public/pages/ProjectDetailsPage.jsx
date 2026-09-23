import {
    ArrowLeft,
    ExternalLink,
    GitBranch,
} from "lucide-react";

import {
    Link,
    useParams,
} from "react-router-dom";

import {
    useEffect,
    useState,
} from "react";

import {
    getPublishedProjectBySlug,
} from "../services/publicApiService";

import {
    resolveProjectImageUrl,
} from "../../project/utils/projectImageUtils";

import "./project-details.css";



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

export default function ProjectDetailsPage() {

    const {
        slug,
    } = useParams();

    const [
        project,
        setProject,
    ] = useState(null);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    useEffect(() => {

        async function loadProject() {

            try {

                setLoading(true);

                const response =
                    await getPublishedProjectBySlug(
                        slug
                    );

                setProject(
                    response
                );

            } catch (exception) {

                setError(
                    exception.response
                        ?.data
                        ?.message
                    || "Unable to load project."
                );

            } finally {

                setLoading(false);
            }
        }

        loadProject();

    }, [
        slug,
    ]);

    if (loading) {

        return (
            <section
                className="
                    section
                    public-loading
                "
            >
                <div className="container">
                    <h2>
                        Loading project...
                    </h2>
                </div>
            </section>
        );
    }

    if (error) {

        return (
            <section
                className="
                    section
                    public-error
                "
            >
                <div className="container">
                    <h2>
                        Project Not Found
                    </h2>

                    <p>
                        {error}
                    </p>

                    <Link
                        to="/"
                        className="
                            btn
                            btn--primary
                        "
                    >
                        Back Home
                    </Link>
                </div>
            </section>
        );
    }

    const techStack =
        buildTechStackArray(
            project.techStack
        );

    const imageSource =
    resolveProjectImageUrl(
        project.imageUrl
    );
    
    return (
        <section
            className="
                section
                project-details
            "
        >
            <div
                className="container"
            >
                <Link
                    to="/"
                    className="
                        project-back-link
                    "
                >
                    <ArrowLeft
                        size={18}
                    />

                    Back to Portfolio
                </Link>

                {
                    project.imageUrl && (
                        <div
                            className="
                                project-details__image
                            "
                        >
                            <img
                                src={imageSource}
                                alt={project.title}
                            />
                            
                        </div>
                    )
                }

                <div
                    className="
                        project-details__content
                    "
                >
                    <span
                        className="
                            eyebrow
                        "
                    >
                        Featured Project
                    </span>

                    <h1>
                        {
                            project.title
                        }
                    </h1>

                    <p
                        className="
                            project-summary
                        "
                    >
                        {
                            project.summary
                        }
                    </p>

                    <div
                        className="
                            cluster
                        "
                    >
                        {
                            techStack.map(
                                technology => (
                                    <span
                                        key={
                                            technology
                                        }
                                        className="
                                            tag
                                        "
                                    >
                                        {
                                            technology
                                        }
                                    </span>
                                )
                            )
                        }
                    </div>

                    <div
                        className="
                            project-links
                        "
                    >
                        {
                            project.liveUrl && (
                                <a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Live Demo"
                                >
                                    <ExternalLink
                                        size={18}
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
                                    aria-label="Source Code"
                                >
                                    <GitBranch
                                        size={18}
                                    />

                                    Source Code
                                </a>
                            )
                        }
                    </div>

                    <article
                        className="
                            project-description
                        "
                    >
                        <h2>
                            About This Project
                        </h2>

                        <p>
                            {
                                project.description
                            }
                        </p>
                    </article>
                </div>
            </div>
        </section>
    );
}