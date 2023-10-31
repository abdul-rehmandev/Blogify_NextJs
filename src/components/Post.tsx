import Image from 'next/image'
import React from 'react'
import "../styles/post.scss";
import { Badge } from "@/components/ui/badge"
import { Button } from './ui/button';
import Link from 'next/link';
import moment from 'moment';
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import PostDeleteBtn from './PostDeleteBtn';

interface PostPropsTypes {
    post: PostTypes
}

const Post = async ({ post }: PostPropsTypes) => {

    const session = await getServerSession(authOptions)

    return (
        <div className='border w-[900px] h-[550px] my-2 postBox'>
            {post.imageUrl == "" ? (
                <div className='w-full h-full flex justify-center items-start'>
                    <img width="100" height="100" src="https://img.icons8.com/plasticine/100/no-image.png" alt="no-image" />
                </div>
            ) : (
                <Image src={post.imageUrl as string} alt='post' fill={true} className='postImage' />
            )}
            <div className={`postContent w-[700px] ${post.imageUrl == "" ? "text-black" : "text-white"}`}>
                <h1 className='text-3xl font-extrabold'>{post.title}</h1>
                <h2>{post.content}</h2>
                <h3>Posted By: <b>{post.author.name}</b>, {moment(post.createdAt).calendar()}<span className='text-sm text-gray-400'>({moment(post.createdAt).fromNow()})</span></h3>
                <div className="tags">
                    <Badge>{post.catName}</Badge>
                </div>
                <div className="links">
                    {post.links?.map((link, index) => (
                        <a href={link} key={index} className='flex' target='_blank'><img className='mr-1' width="24" height="24" src={`https://img.icons8.com/ios-filled/24${post.imageUrl != "" && '/FFFFFF'}/link--v1.png`} alt="link--v1" /> {link}</a>
                    ))}
                </div>
                {session && session?.user?.email === post.authorEmail ? (
                    <div className="postActions">
                        <Link href={`/editpost/${post.id}`}>
                            <Button className='mr-1'>Edit</Button>
                        </Link>
                        <PostDeleteBtn id={post.id} />
                    </div>
                ) : ""}
            </div>
        </div>
    )
}

export default Post