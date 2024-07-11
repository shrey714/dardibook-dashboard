import { db } from "@/firebase/firebaseConfig";
import { doc, addDoc, collection } from "firebase/firestore";
import { NextResponse } from "next/server";

export const POST = async(req:Request)=>{
    try {
        const data = await req.json();
        const {uid} = data;
        // const docref = doc(db, "doctor", uid)
        await addDoc(collection(db, "doctor", uid,"patients"), {data});
        return NextResponse.json({status:"New Patient has been registered successfuly"});
    } catch (error) {
        return NextResponse.json({error:error});
    }

}