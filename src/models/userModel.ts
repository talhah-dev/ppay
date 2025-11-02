import mongoose, { Document, Schema } from "mongoose";

export interface Iuser extends Document {
    name: string;
    avatar: string;
    bio: string;
    email: string;
    password: string;
    role: string;
    isVerified: boolean;
    otp?: string;
    otpExpire?: Date;
}

const userSchema: Schema<Iuser> = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    avatar: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        default: "user"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
    },
    otpExpire: {
        type: Date,
    }
}, {
    timestamps: true
})

const User = mongoose.models.User || mongoose.model<Iuser>("User", userSchema);

export default User;