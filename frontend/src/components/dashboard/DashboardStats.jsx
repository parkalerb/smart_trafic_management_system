import DashboardCard from "./DashboardCard";

function DashboardStats({ stats }) {
    return (
        <div
            style={{
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
                marginTop: "20px"
            }}
        >
            <DashboardCard
                title="Total Signals"
                value={stats.total_signals}
            />

            <DashboardCard
                title="Active Signals"
                value={stats.active_signals}
            />

            <DashboardCard
                title="Inactive Signals"
                value={stats.inactive_signals}
            />

            <DashboardCard
                title="Total Users"
                value={stats.total_users}
            />
        </div>
    );
}

export default DashboardStats;