import axios from "axios";

export type BlogPost = {
    title: string;
    description: string;
    image: string;
    author: string;
};

export async function getPosts(): Promise<BlogPost[]> {
    const res = await axios.get<BlogPost[]>("/api/post/getpost");
    return res.data;
}

export async function createPost(input: { title: string; description: string; image?: string }) {
    const res = await axios.post("/api/post/createpost", input);
    // Adjust to your API’s response shape if needed
    if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to create post");
    }
    return res.data; // often contains { success, message, post }
}

export async function getProfile() {
    const res = await axios.get("/api/profile/myProfile");
    return res.data;
}

export async function EditProfile(input: { name?: string; username?: string; avatar?: string; bio?: string }) {
    const res = await axios.post("/api/profile/editProfile", input);
    if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to create post");
    }
    return res.data;
}

export async function logout() {
    const res = await axios.get("/api/auth/logout");
    return res.data;
}