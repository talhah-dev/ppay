import { DBconnection } from "@/app/config/DBConection";
import Post from "@/models/postModels";
import { NextResponse } from "next/server";

DBconnection()
export async function GET() {
    try {
        const post = await Post.find({})
        return NextResponse.json(post, { status: 200 })
    } catch (error: any) {
        console.error("get post error:", error);
        return NextResponse.json(
            {
                message: "Something went wrong while getting post",
                success: false,
                error: error.message,
            },
            { status: 500 }
        );
    }

}