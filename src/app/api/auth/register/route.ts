import { DBconnection } from "@/app/config/DBConection";
import { sendEmail } from "@/helpers/sendEmail";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

await DBconnection()

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                {
                    message: "All fields are required",
                    success: false,
                }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            if (!existingUser.isVerified && existingUser.otpExpire > new Date()) {
                const otp = String(Math.floor(100000 + Math.random() * 900000));
                const otpExpire = new Date(Date.now() + 5 * 60 * 1000);

                existingUser.otp = otp;
                existingUser.otpExpire = otpExpire;
                await existingUser.save();

                await sendEmail(otp, email);

                return NextResponse.json(
                    {
                        message: "OTP sent again. Please check your email to verify your account.",
                        success: true,
                    }, { status: 200 });
            }

            if (existingUser.isVerified) {
                return NextResponse.json(
                    {
                        message: "User already exists and is verified. Proceed to login.",
                        success: true,
                    }, { status: 200 });
            }

            if (existingUser.otpExpire < new Date()) {
                return NextResponse.json(
                    {
                        message: "OTP has expired. Please request a new one.",
                        success: false,
                    }, { status: 400 });
            }
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        const otpExpire = new Date(Date.now() + 5 * 60 * 1000);

        const newUser = new User({
            email,
            password: hashPassword,
            otp,
            otpExpire,
            isVerified: false,
        });

        const savedUser = await newUser.save();
        await sendEmail(otp, email);

        return NextResponse.json(
            {
                message: "User created successfully. Please check your email for OTP",
                success: true,
                user: {
                    _id: savedUser._id,
                    username: savedUser.username,
                    email: savedUser.email,
                }
            }, { status: 201 });

    } catch (error) {
        console.error("Registration error: ", error);
        return NextResponse.json(
            {
                message: "Something went wrong in the register server",
                success: false,
            }, { status: 500 });
    }
}
