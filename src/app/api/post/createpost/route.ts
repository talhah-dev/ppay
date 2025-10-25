import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { DBconnection } from "@/app/config/DBConection";
import Post from "@/models/postModels";

await DBconnection();

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized — no token found", success: false },
                { status: 401 }
            );
        }

        // 2️⃣ Verify & decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        const userId = (decoded as { id: string }).id;

        // 3️⃣ Parse request body
        const { title, description, content, label, image, tags, status } =
            await request.json();

        if (!title || !description) {
            return NextResponse.json(
                { message: "Title, summary and image are required", success: false },
                { status: 400 }
            );
        }

        // 4️⃣ Create new post automatically linked to logged-in user
        const post = await Post.create({
            title,
            description,
            content,
            label,
            author: userId, // ✅ Automatically assigned
            image: image || "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-1.svg",
            tags,
            status,
        });

        return NextResponse.json(
            { message: "Post created successfully", success: true, post },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Create post error:", error);
        return NextResponse.json(
            {
                message: "Something went wrong while creating post",
                success: false,
                error: error.message,
            },
            { status: 500 }
        );
    }
}
