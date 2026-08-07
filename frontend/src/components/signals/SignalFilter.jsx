function SignalFilter({
    search,
    setSearch,
    status,
    setStatus,
    onSearch,
    onFilter
}) {

    return (

        <div
            style={{
                display: "flex",
                gap: "20px",
                marginTop: "30px",
                marginBottom: "20px"
            }}
        >

            <input
                type="text"
                placeholder="Search Location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <button onClick={onSearch}>
                Search
            </button>

            <select
                value={status}
                onChange={(e) => {
                    setStatus(e.target.value);
                    onFilter(e.target.value);
                }}
            >

                <option value="">
                    All
                </option>

                <option value="ACTIVE">
                    ACTIVE
                </option>

                <option value="INACTIVE">
                    INACTIVE
                </option>

            </select>

        </div>

    );

}

export default SignalFilter;