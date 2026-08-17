import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen((prev) => !prev);
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f5f6fa" }}>
            <Navbar onToggleSidebar={toggleSidebar} />

            <div style={{ display: "flex", flex: 1, position: "relative" }}>
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <main
                    style={{
                        flex: 1,
                        padding: "24px",
                        background: "#f5f6fa",
                        minHeight: "calc(100vh - 60px)",
                        boxSizing: "border-box",
                        overflowX: "hidden"
                    }}
                >
                    {children}
                </main>
            </div>
        </div>
    );
}

export default Layout;