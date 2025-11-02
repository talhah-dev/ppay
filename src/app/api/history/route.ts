import { DBconnection } from "@/app/config/DBConection";
import { NextResponse } from "next/server";

DBconnection()

export async function GET() {
    try {

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "Error in getting history data"
        }, { status: 500 })
    }
}