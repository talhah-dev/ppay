import { DBconnection } from "@/app/config/DBConection";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

DBconnection()

export async function POST(req: NextRequest) {
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

        const { name, username, avatar, bio } = await req.json();

        if (name) {
            user.name = name;
        }

        if (username) {
            user.username = username;
        }

        if (bio) {
            user.bio = bio;
        }

        if (avatar) {
            user.avatar = avatar;
        }

        await user.save();

        return NextResponse.json({ message: "Profile updated successfully", success: true, user }, { status: 200 });

    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Error while profile updating", success: false, error: error }, { status: 500 })
    }
}