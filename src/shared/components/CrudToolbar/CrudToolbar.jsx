import Button
    from "../Button/Button";

import "./CrudToolbar.css";

export default function CrudToolbar({
    searchValue,
    searchPlaceholder =
        "Search records...",
    onSearchChange,
    filters = [],
    onRefresh,
    refreshing = false,
    resultCount,
}) {

    return (
        <section
            className={
                "ui-crud-toolbar"
            }
            aria-label={
                "List controls"
            }
        >
            <div
                className={
                    "ui-crud-toolbar__controls"
                }
            >
                <div
                    className={
                        "ui-crud-toolbar__search"
                    }
                >
                    <label
                        htmlFor={
                            "crud-search"
                        }
                    >
                        Search
                    </label>

                    <input
                        id="crud-search"
                        type="search"
                        value={
                            searchValue
                        }
                        placeholder={
                            searchPlaceholder
                        }
                        onChange={
                            event =>
                                onSearchChange(
                                    event.target.value
                                )
                        }
                    />
                </div>

                {
                    filters.map(
                        filter => (
                            <div
                                key={
                                    filter.id
                                }
                                className={
                                    "ui-crud-toolbar__filter"
                                }
                            >
                                <label
                                    htmlFor={
                                        filter.id
                                    }
                                >
                                    {
                                        filter.label
                                    }
                                </label>

                                <select
                                    id={
                                        filter.id
                                    }
                                    value={
                                        filter.value
                                    }
                                    onChange={
                                        event =>
                                            filter.onChange(
                                                event.target.value
                                            )
                                    }
                                >
                                    {
                                        filter.options.map(
                                            option => (
                                                <option
                                                    key={
                                                        option.value
                                                    }
                                                    value={
                                                        option.value
                                                    }
                                                >
                                                    {
                                                        option.label
                                                    }
                                                </option>
                                            )
                                        )
                                    }
                                </select>
                            </div>
                        )
                    )
                }
            </div>

            <div
                className={
                    "ui-crud-toolbar__summary"
                }
            >
                {
                    Number.isInteger(
                        resultCount
                    ) && (
                        <span
                            aria-live={
                                "polite"
                            }
                        >
                            {
                                resultCount === 1
                                    ? "1 result"
                                    : `${resultCount} results`
                            }
                        </span>
                    )
                }

                <Button
                    type="button"
                    variant="secondary"
                    onClick={
                        onRefresh
                    }
                    loading={
                        refreshing
                    }
                    loadingLabel={
                        "Refreshing..."
                    }
                >
                    Refresh
                </Button>
            </div>
        </section>
    );
}