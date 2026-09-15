import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
} from "react";

import "./Toast.css";

const ToastContext =
    createContext(null);

const TOAST_DURATION_MS = 4000;

export function ToastProvider({
    children,
}) {

    const [
        toasts,
        setToasts,
    ] = useState([]);

    const nextToastId =
        useRef(1);

    const removeToast =
        useCallback(
            toastId => {

                setToasts(
                    currentToasts =>
                        currentToasts.filter(
                            toast =>
                                toast.id
                                !== toastId
                        )
                );
            },
            []
        );

    const showToast =
        useCallback(
            (
                message,
                type = "success"
            ) => {

                const toastId =
                    nextToastId.current;

                nextToastId.current += 1;

                setToasts(
                    currentToasts => [
                        ...currentToasts,
                        {
                            id: toastId,
                            message,
                            type,
                        },
                    ]
                );

                window.setTimeout(
                    () => {
                        removeToast(
                            toastId
                        );
                    },
                    TOAST_DURATION_MS
                );

                return toastId;
            },
            [
                removeToast,
            ]
        );

    const value =
        useMemo(
            () => ({
                showToast,
                removeToast,
            }),
            [
                showToast,
                removeToast,
            ]
        );

    return (
        <ToastContext.Provider
            value={value}
        >
            {children}

            <div
                className={
                    "ui-toast-viewport"
                }
                aria-live="polite"
                aria-atomic="false"
            >
                {
                    toasts.map(
                        toast => (
                            <div
                                key={
                                    toast.id
                                }
                                className={
                                    "ui-toast "
                                    + `ui-toast--${toast.type}`
                                }
                                role={
                                    toast.type
                                    === "error"
                                        ? "alert"
                                        : "status"
                                }
                            >
                                <div
                                    className={
                                        "ui-toast__content"
                                    }
                                >
                                    <strong>
                                        {
                                            toast.type
                                            === "error"
                                                ? "Error"
                                                : toast.type
                                                === "info"
                                                    ? "Information"
                                                    : "Success"
                                        }
                                    </strong>

                                    <p>
                                        {
                                            toast.message
                                        }
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className={
                                        "ui-toast__close"
                                    }
                                    aria-label={
                                        "Dismiss notification"
                                    }
                                    onClick={
                                        () =>
                                            removeToast(
                                                toast.id
                                            )
                                    }
                                >
                                    ×
                                </button>
                            </div>
                        )
                    )
                }
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {

    const context =
        useContext(
            ToastContext
        );

    if (!context) {

        throw new Error(
            "useToast must be used "
            + "inside ToastProvider."
        );
    }

    return context;
}