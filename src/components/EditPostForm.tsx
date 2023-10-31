"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from 'next/navigation'
import axios from "axios"
import { useRouter } from "next/navigation"
import { CldUploadButton, CldUploadWidgetResults } from 'next-cloudinary';
import Image from 'next/image'

interface PostPropsTypes {
    post: PostTypes;
    postId: string
}

const EditPostForm = ({ post, postId }: PostPropsTypes) => {
    const session = useSession();
    const router = useRouter();

    if (!session.data?.user) {
        redirect("/login")
    }

    const [links, setLinks] = useState<string[]>([])
    const [linkInput, setLinkInput] = useState<string>("")

    const handleLinksArray = () => {
        if (linkInput.trim() !== "") {
            setLinks((prev) => [...prev, linkInput]);
            setLinkInput("")
        }
    }

    const deleteLink = (index: number) => {
        setLinks((prev) => prev.filter((_, i) => i !== index));
    }

    const [categories, setCategories] = useState<CategoryTypes[]>([])

    const handleImageUpload = (result: CldUploadWidgetResults) => {
        const info = result.info as object;

        if ("secure_url" in info && "public_id" in info) {
            const url = info.secure_url as string;
            const public_id = info.public_id as string;

            setImageUrl(url)
            setPublicId(public_id)

        }
    }

    const removeImage = async () => {
        await axios.post("/api/removeimage", {
            publicId
        }).then((res) => {
            console.log(res.data.message)
            setImageUrl("")
        }).catch((err) => {
            console.log(err)
        })
    }

    useEffect(() => {
        const getCategories = async () => {
            await axios.get("/api/categories").then((res) => {
                setCategories(res.data.result)
            }).catch((err) => {
                console.log(err)
            })
        }

        getCategories();

        const initialValues = () => {
            setTitle(post.title)
            setContent(post.content)
            setImageUrl(post.imageUrl || "")
            setPublicId(post.publicId || "")
            setSelectedCategory(post.catName || "")
            setLinks(post.links || [])
        }

        initialValues();
    }, [post.title, post.content, post.imageUrl, post.publicId, post.catName, post.links])

    //create post 

    const [title, setTitle] = useState<string>("")
    const [content, setContent] = useState<string>("")
    const [selectedCategory, setSelectedCategory] = useState<string>("")
    const [imageUrl, setImageUrl] = useState<string>("")
    const [publicId, setPublicId] = useState<string>("")

    const handlePostUpdate = async () => {
        if (!title || !content) {
            return alert("Title and content are required")
        }

        await axios.put(`/api/posts/${postId}`, {
            title,
            content,
            links,
            selectedCategory,
            imageUrl,
            publicId
        }).then((res) => {
            console.log(res.data)
            router.refresh()
            router.push("/dashboard")
        }).catch((err) => {
            console.log(err)
        })
    }

    return (
        <div className='container p-1'>
            <h1 className='my-2 text-3xl font-extrabold'>Edit post</h1>
            <Input type="text" placeholder="Title" className='mb-5' defaultValue={title} onChange={(e) => setTitle(e.target.value)} />
            <Textarea placeholder="Type your content here." maxLength={300} defaultValue={content} onChange={(e) => setContent(e.target.value)} />
            <p className="text-sm text-muted-foreground mb-5">
                The maximum limit of characters is <b>300</b>.
            </p>
            <div className='mb-5'>
                <div className="linksInput flex">
                    <Input type="text" placeholder="Paste link" value={linkInput} onChange={(e) => setLinkInput(e.target.value)} />
                    <Button className='ml-2 w-[150px]' onClick={handleLinksArray}>Add</Button>
                </div>
                {links && links.map((link, index) => (
                    <div key={index} className='flex items-center gap-1'><img width="24" height="24" src="https://img.icons8.com/ios-filled/24/link--v1.png" alt="link--v1" />{link}<img className='cursor-pointer' width="24" height="24" src="https://img.icons8.com/material-outlined/24/filled-trash.png" alt="filled-trash" onClick={() => deleteLink(index)} /></div>
                ))}
            </div>
            <div className='mb-5'>
                <CldUploadButton uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET} className='h-48 w-full border-2 border-dotted grid place-items-center bg-slate-100 relative' onUpload={handleImageUpload}>
                    <div>
                        <img width="64" height="64" src="https://img.icons8.com/pastel-glyph/64/image-file-add.png" alt="image-file-add" />
                    </div>
                    {imageUrl && <Image src={imageUrl} fill={true} className='absolute object-cover inset-0' alt={title} />}
                </CldUploadButton>
                {imageUrl && <Button onClick={removeImage} className='rounded-full' size="icon" variant="destructive"><img width="24" height="24" src="https://img.icons8.com/material-rounded/24/FFFFFF/filled-trash.png" alt="filled-trash" /></Button>}
            </div>
            <Select defaultValue={selectedCategory} onValueChange={(value) => setSelectedCategory(value)}>
                <SelectTrigger className='mb-5'>
                    <SelectValue placeholder={selectedCategory} />
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
            <Button className='w-full' onClick={handlePostUpdate}>Update</Button>
        </div>
    )
}

export default EditPostForm