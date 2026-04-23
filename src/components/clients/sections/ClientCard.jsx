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
import useIsTablet from "@/hooks/responsive/useIsTablet";

export default function ClientCard({ client, onEdit, onDelete }) {
    const isTablet = useIsTablet();

    return (
        <div
            className={`
            bg-bg-card border border-white/5 rounded-2xl 
            ${isTablet ? "p-3 gap-2.5" : "p-4 gap-3"} 
            flex flex-col transition-all duration-200 hover:border-brand-500/20 group
        `}
        >
            {/* Top row: avatar + name/documento + actions */}
            <div
                className={`flex items-center ${isTablet ? "gap-2" : "gap-3"}`}
            >
                <div
                    className={`
                    rounded-full bg-brand-500/10 border border-brand-500/20 
                    flex items-center justify-center text-brand-500 font-bold
                    ${isTablet ? "w-9 h-9 text-sm" : "w-11 h-11 text-lg"}
                `}
                >
                    {client.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                    <p
                        className={`
                          text-white font-bold text-base group-hover:text-brand-500 transition-colors
                        ${isTablet ? "text-xs" : "text-sm"}
                    `}
                    >
                        {client.name}
                    </p>
                    {client.documento && (
                        <div className="flex items-center gap-1">
                            <MdFingerprint
                                size={11}
                                className="text-font-gray2 shrink-0"
                            />
                            <p
                                className={`
                                text-font-gray2 truncate
                                ${isTablet ? "text-[10px]" : "text-xs"}
                            `}
                            >
                                {client.documento}
                            </p>
                        </div>
                    )}
                </div>

                {/* Action buttons */}
                <CanDo permission="canManageClients">
                    <div className="flex gap-1.5 shrink-0">
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
            <div className="h-px bg-white/5" />

            {/* Bottom row: email + phone + status */}
            <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                    {client.email && (
                        <div
                            className={`
                            flex items-center gap-1 text-font-gray2
                            ${isTablet ? "text-[10px]" : "text-xs"}
                        `}
                        >
                            <MdEmail
                                size={isTablet ? 12 : 14}
                                className="text-brand-500"
                            />
                            <span>{client.email}</span>
                        </div>
                    )}
                    {client.contato && (
                        <div
                            className={`
                            flex items-center gap-1 text-font-gray2
                            ${isTablet ? "text-[10px]" : "text-xs"}
                        `}
                        >
                            <MdPhone
                                size={isTablet ? 12 : 14}
                                className="text-cyan-400"
                            />
                            <span>{client.contato}</span>
                        </div>
                    )}
                </div>

                <div>
                    <span
                        className={`
                        inline-flex items-center px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest
                        ${
                            client.status === "active"
                                ? "bg-brand-500/10 text-brand-500 border border-brand-500/30"
                                : "bg-white/5 text-white/30 border border-white/10"
                        }
                    `}
                    >
                        {client.status === "active" ? "Ativo" : "Inativo"}
                    </span>
                </div>
            </div>
        </div>
    );
}
