import Post from '@/components/Post'
import React from 'react'
import { getServerSession } from "next-auth/next"
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const getPosts = async (email: string) => {
    try {
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/authors/${email}`, { cache: "no-store" });

        if (res.ok) {
            const { result } = await res.json();
            return result.posts;
        }
    } catch (error) {
        console.log(error)
    }

    return null;
}

const page = async () => {

    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login")
    }

    const email = session?.user?.email;

    let posts: PostTypes[] = [];

    if (email) {
        posts = await getPosts(email);
    }

    return (
        <main className="container p-1 flex justify-center items-center flex-col">
            <h1 className="text-3xl my-2 font-extrabold">My Posts</h1>
            {posts?.length > 0 ? posts?.map((post, index) => (
                <Post key={index} post={post} />
            )) : <p>No posts to display</p>}
        </main>
    )
}

export default page