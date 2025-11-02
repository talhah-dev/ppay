import mongoose, { Document, Schema, Types } from "mongoose";

export interface Iproject extends Document {
    author: Types.ObjectId;
    title: string;
    status: string;
    time: string;
    deadline: Date;
    amount: number;
    framework: string;
    isActive: boolean;
    isPaid: boolean;
}

const ProjectSchema: Schema<Iproject> = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    status: { type: String, default: 'pending' },
    deadline: { type: Date, default: Date.now },
    time: { type: String, default: "00:00" },
    amount: { type: Number, default: 0 },
    framework: { type: String, default: "none" },
    isActive: { type: Boolean, default: true },
    isPaid: { type: Boolean, default: false }
}, {
    timestamps: true
})

const Project = mongoose.models.Project || mongoose.model<Iproject>("Project", ProjectSchema);

export default Project;