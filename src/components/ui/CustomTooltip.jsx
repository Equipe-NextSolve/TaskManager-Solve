export function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div
            className="rounded-xl px-4 py-3 text-sm shadow-2xl"
            style={{
                background: "#171C23",
                border: "1px solid rgba(255,255,255,0.08)",
            }}
        >
            <p className="text-white font-semibold mb-2">{label}</p>
            {payload.map((entry) => (
                <div key={entry.dataKey} className="flex items-center gap-2">
                    <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: entry.color }}
                    />
                    <span className="text-font-gray">{entry.name}:</span>
                    <span className="text-white font-bold">{entry.value}</span>
                </div>
            ))}
        </div>
    );
}
