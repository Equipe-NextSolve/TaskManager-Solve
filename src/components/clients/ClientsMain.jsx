"use client";

import { CircularProgress, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import { MdSearch } from "react-icons/md";
import { toast } from "sonner";
import { useClients } from "@/context/ClientsContext";
import { useRole } from "@/hooks/useRole";
import useIsMobile from "@/responsive/useIsMobile";
import ClientsHeader from "./ClientsHeader";
import ClientsTable from "./ClientsTable";
import ClientsCards from "./clientsCards/ClientsCards";
import ClientDeleteModal from "./modals/ClientDeleteModal";
import ClientForm from "./modals/ClientForm";

export default function ClientsMain() {
    const { clients, loading, deleteClient } = useClients();
    const { can } = useRole();
    const isMobile = useIsMobile();
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingClient, setDeletingClient] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const filteredClients = clients.filter(
        (client) =>
            client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleOpenModal = (client = null) => {
        setSelectedClient(client);
        setIsModalOpen(true);
    };

    const handleOpenDelete = (client) => {
        setDeletingClient(client);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        setDeleting(true);
        try {
            await deleteClient(deletingClient.id);
            toast.success("Cliente excluído!");
            setDeleteDialogOpen(false);
            setDeletingClient(null);
        } catch (err) {
            console.error(err);
            toast.error("Erro ao excluir cliente");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="space-y-8">
            <ClientsHeader
                clientsCount={clients.length}
                onCreate={
                    can("canManageClients") ? () => handleOpenModal() : null
                }
            />
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <TextField
                    placeholder="Buscar parceiros ou clientes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="small"
                    className={isMobile ? "w-full" : "w-full md:max-w-md"}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <MdSearch className="text-white/20 text-xl" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            color: "white",
                            backgroundColor: "rgba(255,255,255,0.02)",
                            borderRadius: "12px",
                            "& fieldset": {
                                borderColor: "rgba(255,255,255,0.05)",
                            },
                            "&:hover fieldset": {
                                borderColor: "rgba(255,255,255,0.1)",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "var(--color-brand-500)",
                            },
                        },
                    }}
                />
            </div>

            {loading ? (
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
                        {filteredClients.length === 0
                            ? "Nenhum cliente cadastrado ainda"
                            : "Nenhum cliente encontrado"}
                    </span>
                </div>
            ) : isMobile ? (
                <ClientsCards
                    clients={filteredClients}
                    onEdit={handleOpenModal}
                    onDelete={handleOpenDelete}
                />
            ) : (
                <ClientsTable
                    clients={filteredClients}
                    loading={loading}
                    onEdit={handleOpenModal}
                    onDelete={handleOpenDelete}
                />
            )}

            {isModalOpen && (
                <ClientForm
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    client={selectedClient}
                />
            )}

            <ClientDeleteModal
                open={deleteDialogOpen}
                onClose={() => {
                    setDeleteDialogOpen(false);
                    setDeletingClient(null);
                }}
                client={deletingClient}
                onConfirm={handleConfirmDelete}
                loading={deleting}
            />
        </div>
    );
}
