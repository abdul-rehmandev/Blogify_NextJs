import Post from '@/components/Post';
import React from 'react'

const getPosts = async (catName: string) => {
    try {
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/categories/${catName}`, { cache: "no-store" });

        if (res.ok) {
            const posts = await res.json();
            return posts.result.posts;
        }
    } catch (error) {
        console.log(error)
    }

    return null;
}

const page = async ({ params }: { params: { catName: string } }) => {
    const category = params.catName;
    const posts: PostTypes[] = await getPosts(category);
    return (
        <main className="container p-1 flex justify-center items-center flex-col">
            <h1 className="text-3xl my-2 font-extrabold"><b className='underline'>{decodeURIComponent(category)}</b> related posts</h1>
            {posts?.length > 0 ? posts?.map((post, index) => (
                <Post key={index} post={post} />
            )) : <p>No posts to display</p>}
        </main>
    )
}

export default page