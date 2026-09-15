import EmptyState
    from "../EmptyState/EmptyState";

import "./DataTable.css";

function getCellContent(
    row,
    column
) {

    if (
        typeof column.render
        === "function"
    ) {
        return column.render(row);
    }

    if (column.accessor) {
        return row[column.accessor];
    }

    return null;
}

export default function DataTable({
    columns,
    rows,
    getRowKey,
    loading = false,
    emptyTitle = "No records found",
    emptyDescription =
        "There are no records to display.",
    emptyActionLabel,
    onEmptyAction,
    ariaLabel = "Data table",
}) {

    if (loading) {
        return (
            <div
                className={
                    "ui-data-table__loading"
                }
                role="status"
            >
                Loading records...
            </div>
        );
    }

    if (rows.length === 0) {
        return (
            <EmptyState
                title={emptyTitle}
                description={
                    emptyDescription
                }
                actionLabel={
                    emptyActionLabel
                }
                onAction={
                    onEmptyAction
                }
            />
        );
    }

    return (
        <div
            className={
                "ui-data-table-wrapper"
            }
        >
            <table
                className={
                    "ui-data-table"
                }
                aria-label={ariaLabel}
            >
                <thead>
                    <tr>
                        {
                            columns.map(
                                column => (
                                    <th
                                        key={
                                            column.id
                                        }
                                        className={
                                            column.align
                                                ? `ui-data-table__cell--${column.align}`
                                                : undefined
                                        }
                                        scope="col"
                                    >
                                        {
                                            column.header
                                        }
                                    </th>
                                )
                            )
                        }
                    </tr>
                </thead>

                <tbody>
                    {
                        rows.map(row => {

                            const rowKey =
                                getRowKey
                                    ? getRowKey(row)
                                    : row.id;

                            if (
                                rowKey === null
                                || rowKey === undefined
                            ) {
                                throw new Error(
                                    "DataTable requires each row "
                                    + "to have an id or a "
                                    + "getRowKey function."
                                );
                            }

                            return (
                                <tr key={rowKey}>
                                    {
                                        columns.map(
                                            column => (
                                                <td
                                                    key={
                                                        column.id
                                                    }
                                                    className={
                                                        column.align
                                                            ? `ui-data-table__cell--${column.align}`
                                                            : undefined
                                                    }
                                                >
                                                    {
                                                        getCellContent(
                                                            row,
                                                            column
                                                        )
                                                    }
                                                </td>
                                            )
                                        )
                                    }
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
        </div>
    );
}