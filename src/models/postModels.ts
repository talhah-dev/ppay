import { Document, Schema, models, model, Types } from "mongoose";

export interface IPost extends Document {
    title: string;
    description: string;
    content?: string;
    label: string;
    author: Types.ObjectId;
    image: string;
    tags?: string[];
    status: string;
}

const PostSchema: Schema<IPost> = new Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            minlength: 3,
            maxlength: 150,
            index: true,
        },
        description: {
            type: String,
            required: [true, "Summary is required"],
            trim: true,
            maxlength: 500,
        },
        content: {
            type: String, // markdown or HTML
            default: "",
        },
        label: {
            type: String,
            default: "News",
            index: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Author is required"],
            index: true,
        },
        image: {
            type: String,
            required: [true, "Image URL is required"],
            trim: true,
        },
        tags: {
            type: [String],
            default: [],
            index: true,
        },
        status: {
            type: String,
            default: "draft",
            index: true,
        }
    },
    { timestamps: true }
);

const Post = models.Post || model<IPost>("Post", PostSchema);
export default Post;
