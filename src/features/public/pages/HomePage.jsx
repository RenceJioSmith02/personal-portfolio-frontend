import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    useLocation,
} from "react-router-dom";

import AboutSection
    from "../components/About/AboutSection";

import CapabilitySection
    from "../components/Capability/CapabilitySection";

import ContactSection
    from "../components/Contact/ContactSection";

import ExperienceSection
    from "../components/Experience/ExperienceSection";

import HeroSection
    from "../components/Hero/HeroSection";

import ProjectSection
    from "../components/Project/ProjectSection";

import ServiceSection
    from "../components/Service/ServiceSection";

import {
    loadHomePageData,
} from "../services/publicApiService";

import useReveal
    from "../../../shared/hooks/useReveal";

const EMPTY_PAGE_DATA = {
    experiences: [],
    services: [],
    capabilities: [],
    projects: [],
};

function getErrorMessage(
    exception
) {

    return (
        exception.response
            ?.data
            ?.message
        || exception.response
            ?.data
            ?.error
        || "Unable to load portfolio content."
    );
}

export default function HomePage() {

    const location =
    useLocation();

    const [
        pageData,
        setPageData,
    ] = useState(
        EMPTY_PAGE_DATA
    );

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

     useReveal(loading);

    const loadData =
        useCallback(
            async () => {

                setLoading(true);
                setError("");

                try {

                    const data =
                        await loadHomePageData();

                    setPageData({
                        experiences:
                            Array.isArray(
                                data.experiences
                            )
                                ? data.experiences
                                : [],

                        services:
                            Array.isArray(
                                data.services
                            )
                                ? data.services
                                : [],

                        capabilities:
                            Array.isArray(
                                data.capabilities
                            )
                                ? data.capabilities
                                : [],

                        projects:
                            Array.isArray(
                                data.projects
                            )
                                ? data.projects
                                : [],
                    });

                } catch (exception) {

                    setError(
                        getErrorMessage(
                            exception
                        )
                    );

                } finally {

                    setLoading(false);
                }
            },
            []
        );

        useEffect(() => {

            loadData();

        }, [
            loadData,
        ]);

        useEffect(() => {

            if (
                loading
                || !location.hash
            ) {
                return;
            }

            const sectionId =
                location.hash.slice(1);

            const section =
                document.getElementById(
                    sectionId
                );

            if (
                !section
            ) {
                return;
            }

            const frameId =
                window.requestAnimationFrame(
                    () => {

                        section.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                        });
                    }
                );

            return () => {

                window.cancelAnimationFrame(
                    frameId
                );
            };

        }, [
            loading,
            location.hash,
        ]);

    if (loading) {

        return (
            <section
                className={
                    "section public-loading"
                }
                aria-live="polite"
                aria-busy="true"
            >
                <div
                    className={
                        "container"
                    }
                >
                    <div
                        className={
                            "public-loading__content"
                        }
                    >
                        <span
                            className={
                                "public-loading__spinner"
                            }
                            aria-hidden="true"
                        />

                        <h2>
                            Loading portfolio
                        </h2>

                        <p>
                            Retrieving published
                            portfolio content.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {

        return (
            <section
                className={
                    "section public-error"
                }
                role="alert"
            >
                <div
                    className={
                        "container"
                    }
                >
                    <div
                        className={
                            "public-error__content card"
                        }
                    >
                        <span
                            className={
                                "eyebrow"
                            }
                        >
                            Unable to load
                        </span>

                        <h2>
                            Something went wrong
                        </h2>

                        <p>
                            {error}
                        </p>

                        <button
                            type="button"
                            className={
                                "btn btn--primary"
                            }
                            onClick={
                                loadData
                            }
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            <HeroSection />

            <CapabilitySection
                capabilities={
                    pageData.capabilities
                }
            />

            <AboutSection />

            <ServiceSection
                services={
                    pageData.services
                }
            />

            <ExperienceSection
                experiences={
                    pageData.experiences
                }
            />

            <ProjectSection
                projects={
                    pageData.projects
                }
            />

            <ContactSection />
        </>
    );
}

