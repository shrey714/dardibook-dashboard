import { db } from "@/firebase/firebaseConfig";
import { auth, currentUser } from "@clerk/nextjs/server";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { headers } from "next/headers";

export async function POST(req: Request) {
    try {
        const user = await currentUser();
        const { orgId, orgRole } = await auth();
        const headersList = await headers();
        if (!user || !orgId) return new Response("Unauthorized", { status: 401 });

        const ipAddress = headersList.get("x-forwarded-for") || null;
        const userAgent = headersList.get("user-agent") || null;
        const body = await req.json();

        const log = {
            time: Timestamp.now(),
            action: body.action,
            metadata: body.metadata || {},
            location: body.location || null,
            user: {
                userId: user.id,
                userName: user.fullName,
                userRole: orgRole,
            },
            ipAddress,
            userAgent,
        };

        await addDoc(collection(db, "doctor", orgId, "logs"), log);

        return new Response("Logged", { status: 200 });
    } catch (err) {
        console.error("Log error:", err);
        return new Response("Error", { status: 500 });
    }
}
