import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { DBconnection } from "@/app/config/DBConection";
import Project from "@/models/projectModel";

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
        const { title, status, deadline, amount, framework, time, isActive } =
            await request.json();

        if (!title || !deadline || !amount || !framework) {
            return NextResponse.json(
                { message: "All fields are required", success: false },
                { status: 400 }
            );
        }

        const project = await Project.create({
            author: userId, title, status, deadline, amount, time, framework, isActive
        });

        return NextResponse.json(
            { message: "Project created successfully", success: true },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Create project error:", error);
        return NextResponse.json(
            {
                message: "Something went wrong while project post",
                success: false,
                error: error.message,
            },
            { status: 500 }
        );
    }
}
