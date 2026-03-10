"use client"
import { toast } from "sonner"
import { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { db, auth } from "@/lib/firebaseConfig"
import { setDoc, doc } from "firebase/firestore"
import { TextField, CircularProgress, InputAdornment} from "@mui/material"
import { IoMdLock } from "react-icons/io";
import { AiOutlineUser } from "react-icons/ai";
import { MdOutlineEmail } from "react-icons/md"
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function RegisterForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] =  useState("")
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [seePassword, setSeePassword] = useState(false)

    async function handleRegister(e) {
        e.preventDefault()

        if (!name || !email || !password) {
            toast.warning("Preencha todos os campos !")
            return
        }

        setLoading(true)

        try{
            const create = await createUserWithEmailAndPassword(auth, email, password)

            await setDoc(doc(db, "users", create.user.uid),{
                name: name.trim(),
                email,
                createdAt: new Date()
            })
            toast.success("Conta criada com sucesso!", {
                description: "Bem-vindo! Você já está logado.",
            })
        } catch (error) {
            const messages = {
                "auth/email-already-in-use": "Este e-mail já está cadastrado.",
                "auth/weak-password": "A senha deve ter pelo menos 6 caracteres.",
                "auth/invalid-email": "E-mail inválido.",
            }

            toast.error("Erro ao criar conta", {
                description: messages[error.code] ?? "Tente novamente mais tarde.",
            })
        } finally {
            setLoading(false)
        }
    }

    const fieldSx = {
        "& .MuiOutlinedInput-root": {

            borderRadius: "10px",
            color: "white",
            "& fieldset": { borderColor: "var(--color-bg-hover)" },
            "&:hover fieldset": { borderColor: "var(--color-bg-hover2)" },
            "&.Mui-focused fieldset": { borderColor: "var(--color-primary)", borderWidth: "1.5px" },
        },
        "& .MuiInputLabel-root": { color: "#666" },
        "& .MuiInputLabel-root.Mui-focused": { color: "var(--color-primary)" },

        "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active": {
            transition: "background-color 50000s ease-in-out 0s",
            WebkitTextFillColor: "white !important",
            caretColor: "white",
        },
    }

    function handlePassword(){
        setSeePassword(!seePassword)
    }

    return (
        <form onSubmit={handleRegister} className="relative flex flex-col gap-10 overflow-hidden rounded-2xl mx-auto w-full max-w-120 p-8 pb-32">
            <div className="flex flex-col gap-5">
                <TextField
                    label="Nome"
                    variant="outlined"
                    value={name}
                    onChange={(e)=> setName(e.target.value)}
                    sx={fieldSx}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AiOutlineUser color="var(--color-primary)" size={20} />
                            </InputAdornment>
                        )
                    }}
                />
                <TextField
                    label="E-mail"
                    variant="outlined"
                    type="email"
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}
                    sx={fieldSx}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <MdOutlineEmail color="var(--color-primary)" size={20} />
                            </InputAdornment>
                        )
                    }}
                />
                <div className="flex w-full relative items-center">
                    <TextField
                        label="Senha"
                        variant="outlined"
                        type={seePassword ? "text" : "password"}
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)}
                        sx={fieldSx}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IoMdLock color="var(--color-primary)" size={20} />
                                </InputAdornment>
                            )
                        }}
                        className="w-full"
                    
                    />
                    <button type="button" className="absolute right-2" onClick={handlePassword}>{seePassword ? <FaEyeSlash size={20} className="cursor-pointer text-bg-hover hover:text-bg-hover2"/> : <FaEye size={20} className="cursor-pointer text-bg-hover hover:text-bg-hover2"/>}</button>
                </div>
                <p className="text-bg-hover2 cursor-pointer hover:text-brand-700">Já tem conta criada? clique aqui</p>
            </div>
            <button
                type="submit"
                disabled={loading}
                className="
                    mt-1 h-12 w-full rounded-lg
                    font-semibold text-xl tracking-wide
                    bg-brand-600 hover:bg-brand-700
                    text-white
                    shadow-[0_0_20px_var(--color-surface-green-md)]
                    cursor-pointer
                    hover:shadow-[0_0_28px_var(--color-surface-green-alt)]
                    disabled:opacity-50 disabled:cursor-not-allowed
                    active:scale-95 active:brightness-90 transition-all duration-150
                "
            >
                {loading ?<CircularProgress size={24} color="inherit" /> : "Criar conta"}
            </button>
            {/* <div className="absolute bottom-0 left-0 w-full">
                
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 1600 900"
                    style={{
                        width: "100%",
                        height: "100vh",
                        transform: "scaleY(0.35) scaleX(2.25)",
                        transformOrigin: "bottom",
                        display: "block",
                        pointerEvents: "none",
                    }}
                >
                    <defs>
                        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.7" />
                        </linearGradient>
                        <path
                            id="wave"
                            fill="url(#bgGradient)"
                            d="M-363.852,502.589c0,0,236.988-41.997,505.475,0
                            s371.981,38.998,575.971,0s293.985-39.278,505.474,5.859s493.475,48.368,716.963-4.995v560.106H-363.852V502.589z"
                        />
                    </defs>
                    <g>
                        <use xlinkHref="#wave" opacity=".3">
                            <animateTransform attributeName="transform" attributeType="XML" type="translate"
                                dur="8s" calcMode="spline" values="270 230; -334 180; 270 230"
                                keyTimes="0; .5; 1" keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0" repeatCount="indefinite" />
                        </use>
                        <use xlinkHref="#wave" opacity=".5">
                            <animateTransform attributeName="transform" attributeType="XML" type="translate"
                                dur="6s" calcMode="spline" values="-270 230;243 220;-270 230"
                                keyTimes="0; .6; 1" keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0" repeatCount="indefinite" />
                        </use>
                        <use xlinkHref="#wave" opacity=".7">
                            <animateTransform attributeName="transform" attributeType="XML" type="translate"
                                dur="4s" calcMode="spline" values="0 230;-140 200;0 230"
                                keyTimes="0; .4; 1" keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0" repeatCount="indefinite" />
                        </use>
                    </g>
                </svg>
            </div> */}
        </form>
    )
}
