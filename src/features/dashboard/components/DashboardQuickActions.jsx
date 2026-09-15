import {
    Briefcase,
    FolderGit2,
    Layers3,
    Sparkles,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

const QUICK_ACTIONS = [
    {
        id:
            "experiences",

        title:
            "Manage Experiences",

        description:
            "Review, create, publish, or update "
            + "your professional timeline.",

        linkTo:
            "/experiences",

        icon:
            Briefcase,
    },
    {
        id:
            "services",

        title:
            "Manage Services",

        description:
            "Maintain the services offered on "
            + "your public portfolio.",

        linkTo:
            "/services",

        icon:
            Layers3,
    },
    {
        id:
            "capabilities",

        title:
            "Manage Capabilities",

        description:
            "Organize technical skills, tools, "
            + "and proficiency levels.",

        linkTo:
            "/capabilities",

        icon:
            Sparkles,
    },
    {
        id:
            "projects",

        title:
            "Manage Projects",

        description:
            "Add portfolio work, images, links, "
            + "and technology stacks.",

        linkTo:
            "/projects",

        icon:
            FolderGit2,
    },
];

export default function DashboardQuickActions() {

    return (
        <section
            className={
                "dashboard-quick-actions"
            }
            aria-labelledby={
                "dashboard-quick-actions-title"
            }
        >
            <header
                className={
                    "dashboard-quick-actions__header"
                }
            >
                <div>
                    <h2
                        id={
                            "dashboard-quick-actions-title"
                        }
                        className={
                            "dashboard-quick-actions__title"
                        }
                    >
                        Quick Actions
                    </h2>

                    <p
                        className={
                            "dashboard-quick-actions__description"
                        }
                    >
                        Jump directly to any content
                        management module.
                    </p>
                </div>
            </header>

            <div
                className={
                    "dashboard-quick-actions__grid"
                }
            >
                {
                    QUICK_ACTIONS.map(
                        action => {

                            const IconComponent =
                                action.icon;

                            return (
                                <Link
                                    key={
                                        action.id
                                    }
                                    to={
                                        action.linkTo
                                    }
                                    className={
                                        "dashboard-quick-action"
                                    }
                                >
                                    <span
                                        className={
                                            "dashboard-quick-action__icon"
                                        }
                                        aria-hidden="true"
                                    >
                                        <IconComponent
                                            size={22}
                                            strokeWidth={
                                                2
                                            }
                                        />
                                    </span>

                                    <span
                                        className={
                                            "dashboard-quick-action__content"
                                        }
                                    >
                                        <strong>
                                            {
                                                action.title
                                            }
                                        </strong>

                                        <span>
                                            {
                                                action.description
                                            }
                                        </span>
                                    </span>

                                    <span
                                        className={
                                            "dashboard-quick-action__arrow"
                                        }
                                        aria-hidden="true"
                                    >
                                        →
                                    </span>
                                </Link>
                            );
                        }
                    )
                }
            </div>
        </section>
    );
}