import mongoose, { Document, Schema, Types } from "mongoose";

export interface Iproject extends Document {
    author: Types.ObjectId;
    title: string;
    status: string;
    deadline: Date;
    cost: number;
    collaborators: Types.ObjectId[];

}

const ProjectSchema: Schema<Iproject> = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    status: { type: String, default: 'draft' },
    deadline: { type: Date, default: Date.now },
    cost: { type: Number, default: 0 },
    collaborators: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, {
    timestamps: true
})

const Project = mongoose.models.Project || mongoose.model<Iproject>("Project", ProjectSchema);

export default Project;