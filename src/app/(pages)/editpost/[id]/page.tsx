import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import EditPostForm from '@/components/EditPostForm';
import { getServerSession } from "next-auth/next"
import { redirect } from 'next/navigation'
import React from 'react'

const getPost = async (id: string) => {
    try {
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/posts/${id}`, { cache: "no-store" })
        if (res.ok) {
            const post = await res.json();
            return post.result;
        }
    } catch (error) {
        console.log(error)
    }
}

const page = async ({ params }: { params: { id: string } }) => {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login")
    }

    const id = params.id;

    const post = await getPost(id);
    return (
        <EditPostForm post={post} postId={id} />
    )
}

export default page