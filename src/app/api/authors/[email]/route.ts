import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { email: string } }) {

    try {
        const email = params.email;
        const posts = await prisma.user.findUnique({ where: { email }, include: { posts: { include: { author: { select: { name: true } } }, orderBy: { createdAt: "desc" } } } });

        return NextResponse.json({ result: posts }, { status: 200 })
    } catch (error) {
        return NextResponse.json("Something went wrong")
    }
}