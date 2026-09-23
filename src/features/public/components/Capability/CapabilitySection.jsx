import {
    Code2,
    Cloud,
    Database,
    GitBranch,
    Layers3,
    Monitor,
    Server,
    ShieldCheck,
    Wrench,
} from "lucide-react";

import "./capability.css";

const ICON_MAP = {
    code2: Code2,
    monitor: Monitor,
    server: Server,
    database: Database,
    gitbranch: GitBranch,
    cloud: Cloud,
    layers3: Layers3,
    wrench: Wrench,
    shieldcheck: ShieldCheck,
};

function getIconComponent(
    iconName
) {

    if (!iconName) {
        return Code2;
    }

    const normalizedIcon =
        iconName
            .replaceAll(
                "-",
                ""
            )
            .replaceAll(
                "_",
                ""
            )
            .toLowerCase();

    return (
        ICON_MAP[
            normalizedIcon
        ]
        || Code2
    );
}

export default function CapabilitySection({
    capabilities = [],
}) {

    if (
        !capabilities.length
    ) {

        return (
            <section
                id="skills"
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
                            Capabilities
                        </span>

                        <h2>
                            A focused
                            full-stack toolkit.
                        </h2>

                        <p>
                            No published
                            capabilities
                            available yet.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
<section
    className="
        tech-marquee
    "
>
    <div
        className="
            tech-marquee__fade-left
        "
    />

    <div
        className="
            tech-marquee__fade-right
        "
    />

    <div
        className="
            marquee
        "
    >

        {/* Track 1 */}

        <div
            className="
                marquee__track
            "
        >
            {
                capabilities.map(
                    (
                        capability,
                        index
                    ) => {

                        const Icon =
                            getIconComponent(
                                capability.icon
                            );

                        return (
                            <article
                                key={`${capability.name}-${index}`}
                                className="
                                    tech-pill
                                "
                            >
                                <Icon
                                    size={18}
                                />

                                <span>
                                    {
                                        capability.name
                                    }
                                </span>
                            </article>
                        );
                    }
                )
            }
        </div>

        {/* Track 2 */}

        <div
            className="
                marquee__track
            "
        >
            {
                capabilities.map(
                    (
                        capability,
                        index
                    ) => {

                        const Icon =
                            getIconComponent(
                                capability.icon
                            );

                        return (
                            <article
                                key={`duplicate-${capability.name}-${index}`}
                                className="
                                    tech-pill
                                "
                            >
                                <Icon
                                    size={18}
                                />

                                <span>
                                    {
                                        capability.name
                                    }
                                </span>
                            </article>
                        );
                    }
                )
            }
        </div>

    </div>
</section>

    );
}