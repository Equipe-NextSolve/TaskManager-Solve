"use client";

import { CircularProgress } from "@mui/material";
import { useClients } from "@/context/ClientsContext";
import { ClientCard } from "./ClientCard";

export default function ClientsCards({ clients, onEdit, onDelete }) {
    const { loading } = useClients();

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "60px 0",
                    gap: 12,
                }}
            >
                <CircularProgress size={24} style={{ color: "#19CA68" }} />
                <span style={{ color: "#6b7280", fontSize: 14 }}>
                    Carregando clientes...
                </span>
            </div>
        );
    }

    if (!clients || clients.length === 0) return null;

    return (
        <>
            {!loading && (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                    }}
                >
                    {clients.map((client) => (
                        <ClientCard
                            key={client.id}
                            client={client}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </>
    );
}
