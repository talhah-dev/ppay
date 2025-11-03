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

export async function createProject(input: { title: string; status?: string; deadline: Date; time: string, amount: number, framework: string, isActive: boolean }) {
    const res = await axios.post("/api/project/createproject", input);
    if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to create project");
    }
    return res.data;
}

export async function getProjects(isPaid?: boolean, isCompleted?: boolean) {
    const url = isPaid === undefined
        ? "/api/project/getproject" : isCompleted === undefined
            ? `/api/project/getproject?isCompleted=${isCompleted}`
            : `/api/project/getproject?isPaid=${isPaid}`;

    const res = await axios.get(url);
    return res.data;
}


export async function deleteProject(input: { id: string }) {
    const res = await axios.delete(`/api/project/${input.id}`);
    if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to delete project");
    }
    return res.data;
}

export async function getSingleProject(input: { id: string }) {
    const res = await axios.get(`/api/project/${input.id}`);
    if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to get project");
    }
    return res.data;
}

export async function editProject(input: { id: string, title?: string, isActive?: boolean, status?: string, deadline?: Date, time?: string, amount?: number, framework?: string }) {
    const res = await axios.put(`/api/project/${input.id}`, input);
    if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to edit project");
    }
    return res.data;
}