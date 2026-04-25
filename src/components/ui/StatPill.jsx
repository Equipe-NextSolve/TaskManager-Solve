// componente visual usado para mostrar números resumidos (totais, contagens)
export function StatPill({ icon: Icon, label, value, color, bg, border }) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 16px",
                borderRadius: 24,
                background: bg,
                border: `1px solid ${border}`,
                fontSize: 13,
                userSelect: "none",
            }}
        >
            {Icon && <Icon style={{ color, fontSize: 15 }} />}
            <span
                style={{ fontSize: 18, fontWeight: 800, color, lineHeight: 1 }}
            >
                {value}
            </span>
            <span className="text-text-secondary font-medium">{label}</span>
        </div>
    );
}
