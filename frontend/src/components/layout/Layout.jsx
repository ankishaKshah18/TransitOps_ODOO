import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="app-layout">
            <Sidebar
                open={sidebarOpen}
                setOpen={setSidebarOpen}
            />

            <div className="main-wrapper">
                <Navbar setSidebarOpen={setSidebarOpen} />

                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default Layout;