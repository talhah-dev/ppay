import { NextRequest, NextResponse } from "next/server";
import { DBconnection } from "@/app/config/DBConection";

await DBconnection()

export async function GET(request: NextRequest) {
    try {

        const token = request.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "No active session found.", success: false },
                { status: 400 }
            );
        }

        const response = NextResponse.json(
            {
                message: `Lougout successfully.`,
                success: true,
            }, { status: 200 });


        response.cookies.set("token", "", {
            httpOnly: false,
            secure: false,
            sameSite: "lax",
            expires: new Date(0),
        })

        return response;

    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { message: "Something went wrong during logout.", success: false },
            { status: 500 }
        );
    }
}