import { useEffect, useState } from "react";

import Layout from "../components/layout/Layout";
import DashboardStats from "../components/dashboard/DashboardStats";

import { getDashboardStats } from "../services/dashboardService";

import SignalTable from "../components/signals/SignalTable";
import { getSignals } from "../services/signalService";

function Dashboard() {

    const [stats, setStats] = useState({
        total_signals: 0,
        active_signals: 0,
        inactive_signals: 0,
        total_users: 0
    });

    const [signals, setSignals] = useState([]);

    useEffect(() => {
        loadDashboard();
        loadSignals();
    }, []);

    async function loadDashboard() {
        try {
            const data = await getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error(error);
        }
    }

    async function loadSignals() {
        try {
            const data = await getSignals();
            setSignals(data);
        } catch (error) {
            console.error(error);
        }
    }

   return (
    <Layout>
        <h2>Dashboard</h2>

        <DashboardStats stats={stats} />

        <SignalTable signals={signals} />
    </Layout>
);
}

export default Dashboard;