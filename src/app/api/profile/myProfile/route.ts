import { DBconnection } from "@/app/config/DBConection";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

DBconnection()

export async function GET(req: NextRequest) {
    try {

        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized — no token found", success: false }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        const userId = (decoded as { id: string }).id;

        const user = await User.findOne({ _id: userId }).select("-password");
        if (!user) {
            return NextResponse.json({ message: "User not found", success: false }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });

    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Error while getting profile", success: false, error: error }, { status: 500 })
    }
}