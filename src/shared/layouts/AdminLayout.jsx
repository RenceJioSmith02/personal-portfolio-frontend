import {
    Outlet,
} from "react-router-dom";

import Sidebar
    from "./Sidebar";

import "./AdminLayout.css";

export default function AdminLayout() {

    return (
        <div
            className={
                "admin-layout"
            }
        >
            <Sidebar />

            <main
                className={
                    "admin-layout__main"
                }
            >
                <div
                    className={
                        "admin-layout__content"
                    }
                >
                    <Outlet />
                </div>
            </main>
        </div>
    );
}