import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { DBconnection } from "@/app/config/DBConection";

await DBconnection()

export async function POST(request: NextRequest) {
    try {

        const { password, email } = await request.json();

        if (!password || !email) {
            return NextResponse.json(
                {
                    message: "All fields are required",
                    success: false,
                }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user || !user.isVerified) {
            return NextResponse.json(
                {
                    message: "User doesn't exists",
                    success: false,
                }, { status: 400 });
        }

        const comparePassword = await bcrypt.compare(password, user.password);

        if (!comparePassword) {
            return NextResponse.json(
                {
                    message: "Invalid password",
                    success: false,
                }, { status: 400 });
        }

        const tokenObj = {
            id: user._id,
            email: user.email,
            role: user.role
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }

        const token = jwt.sign(tokenObj, process.env.JWT_SECRET!, { expiresIn: "1y" });

        const response = NextResponse.json(
            {
                message: `Login successfully. Welcome ${user.username}`,
                success: true,
            }, { status: 200 });

        response.cookies.set("token", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 365, // 1 year
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        })

        return response;

    } catch (error) {
        console.error("Reset password error: ", error);
        return NextResponse.json(
            {
                message: "Something went wrong in the reset password server",
                success: false,
            }, { status: 500 });
    }
}