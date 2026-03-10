import RegisterForm from "./RegisterForm";


export default function LoginMain() {
    return (
        <main className="flex min-h-screen items-center justify-between w-full">
            <div className="min-h-screen flex flex-col gap-6 items-center justify-center overflow-hidden  flex-1">
                    <h2 className="flex items-start w-full max-w-100 text-4xl font-bold text-center">Crie sua Conta</h2>
                    <RegisterForm/>
            </div>
            <div className=" h-screen w-full max-w-250 bg-linear-to-br from-neutral-500 to-neutral-900">
                <div className="bg-geometric bg-cover bg-no-repeat w-full h-full z-999">
                    <p className="text-black">Bem vindo</p>
                </div>
            </div>
        </main>
    )
}
