import DashboardCard from "./DashboardCard";

function TrafficSummaryCards({ summary }) {
    const totalDetections = summary?.total_detections ?? 0;
    const totalVehicles = summary?.total_vehicles ?? 0;
    const avgVehicles = summary?.average_vehicle_count ?? 0;
    const avgGreenTime = summary?.average_green_time ?? 0;

    return (
        <div style={styles.container}>
            <DashboardCard title="Total Detections" value={totalDetections} />
            <DashboardCard title="Vehicles Analyzed" value={totalVehicles} />
            <DashboardCard title="Avg Vehicle Density" value={`${avgVehicles} / scan`} />
            <DashboardCard title="Avg Green Duration" value={`${avgGreenTime} sec`} />
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        gap: "16px",
        flexWrap: "wrap",
        marginTop: "16px"
    }
};

export default TrafficSummaryCards;
