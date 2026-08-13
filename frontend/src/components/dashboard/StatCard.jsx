function StatsCard({ title, value, fullWidth = false }) {

    return (
        <div className={`stats-card ${fullWidth ? "full-width" : ""}`}>

            <div className="stats-title">
                {title}
            </div>

            <div className="stats-value">
                {value}
            </div>

        </div>
    );
}

export default StatsCard;