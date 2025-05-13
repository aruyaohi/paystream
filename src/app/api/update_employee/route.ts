import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { useUser } from "@civic/auth/react";

const {user} = useUser();

export async function POST(req:NextRequest){
    try {
        const body = await req.json();
        const {token} = await req.json()

        
        if (!user) {
        return NextResponse.json({ message: "User not Authenticated" }, { status: 400 });
        }

        //if user is present create new payroll column in payroll table

    } catch (error) {
        console.log(error)
    }
}