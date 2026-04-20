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

export function ProgressBar({ value, color }) {
    return (
        <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(value, 100)}%`, background: color }}
            />
        </div>
    );
}

export function LoadingState() {
    return (
        <div className="min-h-screen bg-background-page flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
                <p className="text-sm text-font-gray2">Carregando dashboard…</p>
            </div>
        </div>
    );
}