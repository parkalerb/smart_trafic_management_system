import { useEffect, useState } from "react";

import Layout from "../components/layout/Layout";
import DashboardStats from "../components/dashboard/DashboardStats";

import { getDashboardStats } from "../services/dashboardService";

import SignalTable from "../components/signals/SignalTable";
import SignalFilter from "../components/signals/SignalFilter";

import {
    getSignals,
    searchSignals,
    filterSignals
} from "../services/signalService";
function Dashboard() {

    const [stats, setStats] = useState({
        total_signals: 0,
        active_signals: 0,
        inactive_signals: 0,
        total_users: 0
    });

    const [signals, setSignals] = useState([]);
    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("");

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
    async function handleSearch() {

    try {

        if (search.trim() === "") {

            loadSignals();

            return;

        }

        const data = await searchSignals(search);

        setSignals(data);

    } catch (error) {

        console.error(error);

    }

}

  async function handleFilter(selectedStatus) {

    console.log("Selected Status:", selectedStatus);

    if (selectedStatus === "") {
        await loadSignals();
        return;
    }

    try {

        const data = await filterSignals(selectedStatus);

        console.log("Response:", data);

        setSignals(data);

    } catch (error) {

        console.error(error);

    }

}
  return (
    <Layout>

        <h2>Dashboard</h2>

        <DashboardStats stats={stats} />

        <SignalFilter
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            onSearch={handleSearch}
            onFilter={handleFilter}
        />

        <SignalTable signals={signals} />

    </Layout>
);
}

export default Dashboard;