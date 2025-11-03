import { DBconnection } from "@/app/config/DBConection";
import Project from "@/models/projectModel";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

DBconnection()

export async function POST(req: NextRequest) {
    try {

        const { ids } = await req.json();

        if (!Array.isArray(ids) || ids.length == 0) {
            return NextResponse.json({ message: "Select at least one project to mark as paid", success: false }, { status: 400 })
        }

        const validId = ids.filter((id) => mongoose.isValidObjectId(id));

        const updated = await Project.updateMany(
            { _id: { $in: validId } },
            { $set: { isPaid: true } }
        );

        return NextResponse.json({ message: "Projects marked as paid", success: true, updatedCount: updated.modifiedCount }, { status: 200 })
        

    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Error while marking project as paid", success: false, error: error }, { status: 500 })
    }
}