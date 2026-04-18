"use client";

import { IconButton } from "@mui/material";
import {
    MdDelete,
    MdEdit,
    MdEmail,
    MdFingerprint,
    MdPhone,
} from "react-icons/md";
import CanDo from "@/components/auth/CanDo";
import useIsTablet from "@/responsive/useIsTablet";

export function ClientCard({ client, onEdit, onDelete }) {
    const isTablet = useIsTablet();

    return (
        <div
            style={{
                background: "#121212",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 16,
                padding: isTablet ? "12px" : "16px",
                display: "flex",
                flexDirection: "column",
                gap: isTablet ? 10 : 12,
                transition: "border-color 0.2s",
            }}
        >
            {/* Top row: avatar + name/documento + actions */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: isTablet ? 8 : 12,
                }}
            >
                <div
                    className="rounded-full"
                    style={{
                        width: isTablet ? 36 : 44,
                        height: isTablet ? 36 : 44,
                        background: "rgba(25, 202, 104, 0.1)",
                        border: "1px solid rgba(25, 202, 104, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#19CA68",
                        fontWeight: 700,
                        fontSize: isTablet ? 14 : 18,
                    }}
                >
                    {client.name.charAt(0).toUpperCase()}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                        style={{
                            color: "#f1f5f9",
                            fontWeight: 700,
                            fontSize: isTablet ? 12 : 14,
                            margin: 0,
                            marginBottom: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {client.name}
                    </p>
                    {client.documento && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                            }}
                        >
                            <MdFingerprint
                                size={11}
                                style={{ color: "#4b5563", flexShrink: 0 }}
                            />
                            <p
                                style={{
                                    color: "#6b7280",
                                    fontSize: isTablet ? 10 : 12,
                                    margin: 0,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {client.documento}
                            </p>
                        </div>
                    )}
                </div>

                {/* Action buttons */}
                <CanDo permission="canManageClients">
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        <IconButton
                            onClick={() => onEdit(client)}
                            sx={{
                                color: "var(--color-cyan-400)",
                                backgroundColor: "rgba(34,211,238,0.05)",
                                border: "1px solid rgba(34,211,238,0.1)",
                                borderRadius: "10px",
                                p: 1,
                                "&:hover": {
                                    backgroundColor: "rgba(34,211,238,0.15)",
                                    borderColor: "var(--color-cyan-400)",
                                },
                            }}
                        >
                            <MdEdit size={18} />
                        </IconButton>
                        <IconButton
                            onClick={() => onDelete(client)}
                            sx={{
                                color: "var(--color-error)",
                                backgroundColor: "rgba(239,68,68,0.05)",
                                border: "1px solid rgba(239,68,68,0.1)",
                                borderRadius: "10px",
                                p: 1,
                                "&:hover": {
                                    backgroundColor: "rgba(239,68,68,0.15)",
                                    borderColor: "var(--color-error)",
                                },
                            }}
                        >
                            <MdDelete size={18} />
                        </IconButton>
                    </div>
                </CanDo>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

            {/* Bottom row: email + phone + status */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                }}
            >
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {client.email && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                color: "#9ca3af",
                                fontSize: isTablet ? 10 : 12,
                            }}
                        >
                            <MdEmail
                                size={isTablet ? 12 : 14}
                                style={{ color: "#19CA68" }}
                            />
                            <span>{client.email}</span>
                        </div>
                    )}
                    {client.contato && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                color: "#9ca3af",
                                fontSize: isTablet ? 10 : 12,
                            }}
                        >
                            <MdPhone
                                size={isTablet ? 12 : 14}
                                style={{ color: "#22d3ee" }}
                            />
                            <span>{client.contato}</span>
                        </div>
                    )}
                </div>

                <div>
                    <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                            client.status === "active"
                                ? "bg-brand-500/10 text-brand-500 border border-brand-500/30"
                                : "bg-white/5 text-white/30 border border-white/10"
                        }`}
                    >
                        {client.status === "active" ? "Ativo" : "Inativo"}
                    </span>
                </div>
            </div>
        </div>
    );
}
