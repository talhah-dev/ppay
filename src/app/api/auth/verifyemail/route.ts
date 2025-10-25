import { DBconnection } from "@/app/config/DBConection";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

await DBconnection()

export async function POST(request: NextRequest) {
    try {
        const { otp, email } = await request.json();

        if (!otp || !email) {
            return NextResponse.json(
                {
                    message: "All fields are required",
                    success: false,
                }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                {
                    message: "User doesn't exists",
                    success: false,
                }, { status: 400 });
        }

        if (user.otp !== otp || user.otpExpire < new Date()) {
            return NextResponse.json(
                {
                    message: "Invalid OTP",
                    success: false,
                }, { status: 400 });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpire = undefined;

        await user.save();

        return NextResponse.json(
            {
                message: "User verify successfully.",
                success: true,
            }, { status: 201 });

    } catch (error) {
        console.error("Verify error: ", error);
        return NextResponse.json(
            {
                message: "Something went wrong in the verify server",
                success: false,
            }, { status: 500 });
    }
}