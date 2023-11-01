import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route";
import nodemailer from "nodemailer"

export async function POST(req: Request) {

    const session = await getServerSession(authOptions);

    if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { title, content, links, selectedCategory, imageUrl, publicId } = await req.json();

    const authorEmail = session?.user?.email as string

    if (!title || !content) return NextResponse.json({ message: "Title and content are required" }, { status: 500 })

    try {
        const newPost = await prisma.post.create({
            data: {
                title,
                content,
                links,
                imageUrl,
                publicId,
                catName: selectedCategory,
                authorEmail
            }
        });

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PASSWORD
            }
        });

        await transporter.sendMail({
            from: "Blogify - Blogging beyond boundaries",
            to: authorEmail,
            subject: "Post Creation On Blogify",
            html: `Hi ${session?.user?.name}, Congratulations on your new post : ${newPost.title}`
        })

        return NextResponse.json({ message: "Post created", result: newPost }, { status: 201 })
    } catch (error) {
        return NextResponse.json("Something went wrong")
    }
}

export async function GET() {
    try {
        const posts = await prisma.post.findMany({ include: { author: { select: { name: true } } }, orderBy: { createdAt: "desc" } });
        return NextResponse.json({ result: posts }, { status: 200 })
    } catch (error) {
        return NextResponse.json("Something went wrong")
    }
}