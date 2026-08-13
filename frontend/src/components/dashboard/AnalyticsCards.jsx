import DashboardCard from "./DashboardCard";

function AnalyticsCards({ analytics }) {
    if (!analytics) return null;

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
                title="Total Green Time"
                value={`${analytics.total_green_time ?? 0}s`}
            />

            <DashboardCard
                title="Avg Green Time"
                value={`${analytics.average_green_time ?? 0}s`}
            />

            <DashboardCard
                title="Max Green Time"
                value={`${analytics.maximum_green_time ?? 0}s`}
            />

            <DashboardCard
                title="Active Signal Rate"
                value={`${analytics.active_percentage ?? 0}%`}
            />
        </div>
    );
}

export default AnalyticsCards;
