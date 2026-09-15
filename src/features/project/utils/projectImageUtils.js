const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL
    || "http://localhost:8080/api/v1";

function removeTrailingSlash(
    value
) {

    return value.replace(
        /\/+$/,
        ""
    );
}

function getBackendOrigin() {

    const normalizedApiBaseUrl =
        removeTrailingSlash(
            API_BASE_URL
        );

    return normalizedApiBaseUrl.replace(
        /\/api\/v1$/,
        ""
    );
}

export function resolveProjectImageUrl(
    imageUrl
) {

    if (!imageUrl) {
        return "";
    }

    const normalizedImageUrl =
        imageUrl.trim();

    if (!normalizedImageUrl) {
        return "";
    }

    if (
        normalizedImageUrl.startsWith(
            "blob:"
        )
        || normalizedImageUrl.startsWith(
            "data:"
        )
        || normalizedImageUrl.startsWith(
            "http://"
        )
        || normalizedImageUrl.startsWith(
            "https://"
        )
    ) {
        return normalizedImageUrl;
    }

    const backendOrigin =
        getBackendOrigin();

    const normalizedPath =
        normalizedImageUrl.startsWith("/")
            ? normalizedImageUrl
            : `/${normalizedImageUrl}`;

    return (
        `${backendOrigin}${normalizedPath}`
    );
}