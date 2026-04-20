import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { CustomTooltip } from "../HomeSubComponents";
import { format, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ProjectsWeek({weeklyData, today}) {

    return (
        <div
            className="xl:col-span-2 p-5 rounded-2xl"
            style={{
                background: "#121212",
                border: "1px solid rgba(255,255,255,0.06)",
            }}
        >
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-base font-bold text-white">
                        Projetos por Semana
                    </h2>
                    <p className="text-xs text-font-gray2 mt-0.5">
                        {format(startOfMonth(today), "MMMM 'de' yyyy", {
                            locale: ptBR,
                        })}
                    </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-font-gray2">
                    {[
                        ["#19CA68", "Concluídos"],
                        ["#22d3ee", "Em Andamento"],
                        ["#f59e0b", "Em Suporte"],
                    ].map(([bg, label]) => (
                        <span
                            key={label}
                            className="flex items-center gap-1.5"
                        >
                            <span
                                className="w-2.5 h-2.5 rounded-sm inline-block"
                                style={{ background: bg }}
                            />
                            {label}
                        </span>
                    ))}
                </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
                <BarChart
                    data={weeklyData}
                    barGap={4}
                    barCategoryGap="30%"
                >
                    <CartesianGrid
                        vertical={false}
                        stroke="rgba(255,255,255,0.04)"
                    />
                    <XAxis
                        dataKey="semana"
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        width={28}
                        allowDecimals={false}
                    />
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: "rgba(255,255,255,0.03)" }}
                    />
                    <Bar
                        dataKey="concluidos"
                        name="Concluídos"
                        fill="#19CA68"
                        radius={[4, 4, 0, 0]}
                    />
                    <Bar
                        dataKey="em_andamento"
                        name="Em Andamento"
                        fill="#22d3ee"
                        radius={[4, 4, 0, 0]}
                    />
                    <Bar
                        dataKey="suporte"
                        name="Em Suporte"
                        fill="#f59e0b"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
