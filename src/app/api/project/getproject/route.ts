import { DBconnection } from "@/app/config/DBConection";
import Project from "@/models/projectModel";
import { NextResponse } from "next/server";

DBconnection()

export async function GET() {
    try {
        const [projects, summaryArr] = await Promise.all([
            Project.find(),
            Project.aggregate([
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: { $cond: [{ $eq: ["$isPaid", false] }, "$amount", 0] } },
                        activeProject: { $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] } },
                        inactiveProject: { $sum: { $cond: [{ $eq: ["$isActive", false] }, 1, 0] } },
                        completedProject: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
                    }
                }
            ])
        ])


        const summary = summaryArr[0] ?? { totalAmount: 0, activeProject: 0, inactiveProject: 0, completedProject: 0 };

        return NextResponse.json({ projects, summary }, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Error while getting profile", success: false, error: error }, { status: 500 })
    }
}