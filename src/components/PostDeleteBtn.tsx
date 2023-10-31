"use client"
import React from 'react'
import { Button } from './ui/button';
import axios from 'axios';
import { useRouter } from "next/navigation"

interface DeletePropTypes {
    id: string;
}

const PostDeleteBtn = ({ id }: DeletePropTypes) => {

    const router = useRouter();

    const deleteImage = async (publicId: string) => {
        await axios.post(`/api/removeimage`, {
            publicId
        }).then((res) => {
            console.log(res.data.message)
        }).catch((err) => {
            console.log(err)
        })
    }

    const handleDelete = async (delId: string) => {
        await axios.delete(`/api/posts/${delId}`).then((res) => {
            console.log(res.data.message)
            deleteImage(res.data.result.publicId)
            router.refresh();
        }).catch((err) => {
            console.log(err)
        })
    }

    return (
        <Button variant="destructive" onClick={() => handleDelete(id)}>Delete</Button>
    )
}

export default PostDeleteBtn