import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { catName: string } }) {

    try {
        const catName = params.catName;
        const posts = await prisma.category.findUnique({ where: { catName }, include: { posts: { include: { author: true }, orderBy: { createdAt: "desc" } } } });

        return NextResponse.json({ result: posts }, { status: 200 })
    } catch (error) {
        return NextResponse.json("Something went wrong")
    }
}