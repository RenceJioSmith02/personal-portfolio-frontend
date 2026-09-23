import {
    Braces,
    Code2,
    Database,
    Layers3,
    Layout,
    Monitor,
    Palette,
    Server,
    ShieldCheck,
    Smartphone,
    Wrench,
} from "lucide-react";

import "./service.css";

const ICON_MAP = {
    code2: Code2,
    monitor: Monitor,
    server: Server,
    database: Database,
    braces: Braces,
    palette: Palette,
    layout: Layout,
    layers3: Layers3,
    smartphone: Smartphone,
    shieldcheck: ShieldCheck,
    wrench: Wrench,
};

function getIconComponent(
    iconName
) {

    if (!iconName) {
        return Layout;
    }

    const normalizedIcon =
        iconName
            .replaceAll("-", "")
            .replaceAll("_", "")
            .toLowerCase();

    return (
        ICON_MAP[
            normalizedIcon
        ]
        || Layout
    );
}

export default function ServiceSection({
    services = [],
}) {

    if (!services.length) {

        return (
            <section
                id="services"
                className="
                    section
                    section--alt
                "
            >
                <div className="container">

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
                            Services
                        </span>

                        <h2>
                            How I can
                            contribute.
                        </h2>

                        <p>
                            No published
                            services available
                            yet.
                        </p>
                    </div>

                </div>
            </section>
        );
    }

    return (
        <section
            id="services"
            className="
                section
                section--alt
            "
        >
            <div className="container">

                <div
                    className="
                        section-heading
                        reveal
                    "
                >
                    <span
                        className="
                            eyebrow
                        "
                    >
                        Services
                    </span>

                    <h2>
                        How I can
                        contribute.
                    </h2>

                    <p>
                        Areas where I can
                        help design, build,
                        improve, and maintain
                        software solutions.
                    </p>
                </div>

                <div
                    className="
                        services
                        grid
                    "
                >
                    {
                        services.map(
                            (
                                service,
                                index
                            ) => {

                                const Icon =
                                    getIconComponent(
                                        service.icon
                                    );

                                return (
                                    <article
                                        key={`${service.title}-${index}`}
                                        className="
                                            card
                                            service-card
                                            reveal
                                        "
                                        data-delay={
                                            index
                                        }
                                    >
                                        <div
                                            className="
                                                service-card__icon
                                            "
                                        >
                                            <Icon
                                                size={
                                                    24
                                                }
                                            />
                                        </div>

                                        <h3>
                                            {
                                                service.title
                                            }
                                        </h3>

                                        <p>
                                            {
                                                service.description
                                            }
                                        </p>
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