"use client"
import React from 'react'
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { useSession } from "next-auth/react"
import { redirect } from 'next/navigation'

const page = () => {

    const session = useSession();

    if (session.data?.user) {
        redirect("/dashboard")
    }

    return (
        <div className='w-full h-[80vh] flex justify-center items-center'>
            <Button variant="outline" onClick={() => signIn("google")}>
                <img width="24" height="24" src="https://img.icons8.com/color/24/google-logo.png" alt="google-logo" className='mr-1' />Continue with google
            </Button>
        </div>
    )
}

export default page