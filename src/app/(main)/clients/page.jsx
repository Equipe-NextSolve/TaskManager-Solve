"use client";

import ProtectedRoutes from "@/components/auth/ProtectedRoutes";
import ClientsMain from "@/components/clients/ClientsMain";

export default function ClientsPage() {
    return (
        <ProtectedRoutes permission="canViewClients">
            <div className="p-6">
                <ClientsMain />
            </div>
        </ProtectedRoutes>
    );
}
