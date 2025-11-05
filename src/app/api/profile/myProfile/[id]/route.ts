import { DBconnection } from "@/app/config/DBConection";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

DBconnection()

export async function GET(req: NextRequest) {
    try {

        const params = req.nextUrl.searchParams;
        const id = params.get("id");

        if (!id) {
            return NextResponse.json({ message: "User not found", success: false }, { status: 404 });
        }

        const user = await User.findOne({ _id: id }).select("-password");
        if (!user) {
            return NextResponse.json({ message: "User not found", success: false }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });

    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Error while getting profile", success: false, error: error }, { status: 500 })
    }
}