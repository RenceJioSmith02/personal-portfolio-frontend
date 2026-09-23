import {
    useEffect,
} from "react";

export default function useReveal(
    loading
) {

    useEffect(() => {

        if (
            loading
        ) {
            return;
        }

        const elements =
            document.querySelectorAll(
                ".reveal"
            );

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "is-visible"
                                );
                            }
                        }
                    );

                },
                {
                    threshold: 0.1,
                }
            );

        elements.forEach(
            element =>
                observer.observe(
                    element
                )
        );

        return () => {

            elements.forEach(
                element =>
                    observer.unobserve(
                        element
                    )
            );
        };

    }, [
        loading,
    ]);
}