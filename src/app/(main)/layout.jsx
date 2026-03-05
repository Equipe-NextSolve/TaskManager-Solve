import SideMenu from "@/layout/sideMenu/SideMenu";

export default function MainLayout ({ children }) {
    return (
        <div className="flex min-h-screen">
            <SideMenu/>
            <main className="flex-1 p-4">
                {children}
            </main>
        </div>
    )
}