'use client'
import { useState } from 'react'
import Link from "next/link"
import { menuItems } from "./Icons"

import { BurgerButton } from './BurgerBtn';

export default function SideMenuItems() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div
            className={`overflow-hidden h-full fixed top-0 left-0 bg-linear-to-br from-bg-pure via-[#050505] to-bg-pure flex flex-col gap-3 py-10 transition-all duration-200 ease-in-out  ${isOpen ? 'w-53 items-start' : 'w-15 items-center'}  shadow-xl`}
            
        >
            
            FOto
            <div className={`flex  w-[95%] ] ${isOpen ? ' justify-end' : 'w-15 justify-center'}`}>
               <BurgerButton  isOpen={isOpen} onClick={() => setIsOpen(prev => !prev)}/>
            </div>

            <div style={{
                width: isOpen? '90%' : '70%',
                height: '1px',
                borderRadius:'5px',
                background: 'rgba(73, 73, 73, 0.41)',
                margin: '4px auto',
                
            }} 

            />
            {menuItems.map ((item)=>(
                <Link
                    key={item.label}
                    href={item.href}
                    onClick={()=>setIsOpen(true)}
                    
                    className={`h-11 flex items-center gap-2 bg-[--color-cyan-300]  text-[#6d6d6d] mx-1 hover:text-white  hover:bg-bg-hover w-[90%] justify-center rounded-lg p-2 ${isOpen ? 'justify-start' : 'justify-center'} transition-all duration-200 ease-in-out`}
                >   
                        <item.icon
                            className={`  text-2xl transition-transform duration-200 `}
                        />
                        <span className={`text-sm mt-0.50  ${isOpen ? 'block ' : 'hidden'}`}>{item.label}</span>
            
                </Link>
        
            ))}
        </div>
        
    )
}
