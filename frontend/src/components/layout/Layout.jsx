import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ children }) {
    return (
        <>
            <Navbar />

            <div style={{ display: "flex" }}>
                <Sidebar />

                <main
                    style={{
                        flex: 1,
                        padding: "20px",
                        background: "#f5f6fa",
                        minHeight: "100vh"
                    }}
                >
                    {children}
                </main>
            </div>
        </>
    );
}

export default Layout;