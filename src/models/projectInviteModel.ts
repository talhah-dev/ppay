import mongoose, { Document, Schema, Types } from "mongoose";

export interface IprojectInvite extends Document {
    inviter: Types.ObjectId;
    invitee: Types.ObjectId;
    status: string;
}

const ProjectInviteSchema: Schema<IprojectInvite> = new Schema({
    inviter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    invitee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, default: 'pending' },
}, {
    timestamps: true
})

const ProjectInvite = mongoose.models.ProjectInvite || mongoose.model<IprojectInvite>("ProjectInvite", ProjectInviteSchema);

export default ProjectInvite;