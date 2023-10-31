import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: Request, { params }: { params: { id: string } }) {

    try {
        const id = params.id;
        const post = await prisma.post.findUnique({ where: { id } });

        return NextResponse.json({ result: post }, { status: 200 })
    } catch (error) {
        return NextResponse.json("Something went wrong")
    }
}


export async function PUT(req: Request, { params }: { params: { id: string } }) {

    const session = await getServerSession(authOptions);

    if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { title, content, links, selectedCategory, imageUrl, publicId } = await req.json();
    const id = params.id;
    try {
        const post = await prisma.post.update({
            where: { id },
            data: {
                title, content, links, catName: selectedCategory, imageUrl, publicId
            }
        })

        return NextResponse.json({ message: "Post updated", result: post }, { status: 200 })
    } catch (error) {
        return NextResponse.json("Something went wrong")
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {

    const session = await getServerSession(authOptions);

    if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const id = params.id;
    try {
        const post = await prisma.post.delete({ where: { id } })
        return NextResponse.json({ message: "Post deleted", result: post }, { status: 200 })
    } catch (error) {
        return NextResponse.json("Something went wrong")
    }
}