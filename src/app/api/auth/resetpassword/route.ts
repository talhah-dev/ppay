import { DBconnection } from "@/app/config/DBConection";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

await DBconnection()

export async function POST(request: NextRequest) {
    try {
        const { password, email } = await request.json();

        if (!password || !email ) {
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

        const hashPassword = await bcrypt.hash(password, 10);

        user.password = hashPassword;
        user.otp = undefined;
        user.otpExpire = undefined;

        await user.save();

        return NextResponse.json(
            {
                message: "Password reset successfully.",
                success: true,
            }, { status: 201 });

    } catch (error) {
        console.error("Reset password error: ", error);
        return NextResponse.json(
            {
                message: "Something went wrong in the reset password server",
                success: false,
            }, { status: 500 });
    }
}