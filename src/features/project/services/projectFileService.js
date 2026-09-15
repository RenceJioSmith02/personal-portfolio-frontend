import axiosClient
    from "../../../shared/api/axiosClient";

const FILE_ENDPOINT =
    "/admin/files";

export async function uploadProjectImage(
    file
) {

    const formData =
        new FormData();

    formData.append(
        "file",
        file
    );

    const response =
        await axiosClient.post(
            `${FILE_ENDPOINT}/upload`,
            formData,
            {
                headers: {
                    "Content-Type":
                        undefined,
                },
            }
        );

    return response.data;
}

export async function deleteProjectFile(
    fileName
) {

    if (!fileName) {
        return;
    }

    await axiosClient.delete(
        `${FILE_ENDPOINT}/${
            encodeURIComponent(
                fileName
            )
        }`
    );
}