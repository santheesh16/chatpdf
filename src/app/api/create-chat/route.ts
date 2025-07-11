import { NextResponse } from "next/server";
import { loadS3IntoPinecone } from "../../../lib/pinecone"; // Import from the correct path
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { getS3Url } from "@/lib/db/s3";
import { auth } from "@clerk/nextjs/server";

// /api/create-chat
export async function POST(req: Request) {
    const {userId} = await auth()
    if (!userId){
        return NextResponse.json({error: "unauthorized"}, {status: 401})
    }
    try {
        const body = await req.json();
        const { file_key, file_name } = body;

        console.log(file_key, file_name);

        // Call loadS3IntoPinecone function with the file_key
        await loadS3IntoPinecone(file_key);
        const chat_id = await db.insert(chats).values({
            fileKey: file_key,
            pdfName: file_name,
            pdfUrl: getS3Url(file_key),
            userId: userId
        }).returning(
            {
                insertedId: chats.id
            })
        return NextResponse.json({
            chat_id: chat_id[0].insertedId
        },{status: 200});
        
    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json(
            { error: "Response server error" },
            { status: 500 }
        );
    }
}