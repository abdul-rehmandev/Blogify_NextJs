"use client"
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useSession, signOut } from "next-auth/react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from './ui/button'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const Navbar = () => {

    const session = useSession();
    const router = useRouter();

    const [categories, setCategories] = useState<CategoryTypes[]>([])

    useEffect(() => {
        const getCategories = async () => {
            await axios.get("/api/categories").then((res) => {
                setCategories(res.data.result)
            }).catch((err) => {
                console.log(err)
            })
        }

        getCategories();
    }, [])

    return (
        <div className='container flex justify-between items-center p-1 py-3 sticky top-0 z-50 bg-white'>
            <div className="left">
                <Link href="/" className='flex items-center'>
                    <Image src="/logo.png" alt='logo' width={40} height={40} />
                    <h1 className='font-extrabold'>Blogify</h1>
                </Link>
            </div>
            <div className="middle w-[500px] flex items-center">
                <Select onValueChange={(value) => { router.push(`/category/${value}`) }}>
                    <SelectTrigger className="w-[230px]">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Categories</SelectLabel>
                            {categories.map((categoryItem, index) => (
                                <SelectItem value={categoryItem.catName} key={index}>{categoryItem.catName}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Input type="text" placeholder="Explore Topics" className='ml-1' />
            </div>
            {session.status === "authenticated" ?
                (
                    <div className="right flex items-center">
                        <Link href="/createpost" className='border flex items-center mr-2 px-3 py-1 rounded-full'>
                            <img width="30" height="30" src="https://img.icons8.com/ios/30/add--v1.png" alt="add--v1" className='mr-1' />
                            Create Post
                        </Link>
                        <DropdownMenu>
                            <DropdownMenuTrigger><img width="30" height="30" className='rounded-full' src={session.data.user?.image as string} alt="user-male-circle--v1" /></DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Hi! {session.data.user?.name}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem><Link href="/dashboard">Dashboard</Link></DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem><Button variant="destructive" className='w-full' size="sm" onClick={() => signOut()}>Sign out</Button></DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div>
                ) :
                (
                    <div className="right">
                        <Link href="/login">
                            <img width="30" height="30" src="https://img.icons8.com/ios/30/user-male-circle--v1.png" alt="user-male-circle--v1" />
                        </Link>
                    </div>
                )}
        </div>
    )
}

export default Navbar