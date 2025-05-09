import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
// import formidable from "formidable";
// import fs from 'fs';
import jwt from "jsonwebtoken";


export const config = {
  api: {
    bodyParser: false, // This is required for formidable to work
  },
};
export async function POST(req: NextRequest) {
  try {
    // console.log("This is the profile image", profile_image);
    console.log("This is the request", req);

    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Token is required" }, { status: 400 });
    }

    const decodedToken = jwt.verify(token, "suckmydick") as { userId: number; email: string };

    // Check if user exists using Supabase
    const {error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', decodedToken.email)
      .single();

    if (userError) {
      console.error("Error fetching user:", userError);
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // // Update user profile using Supabase
    // const { data: updatedUser, error: updateError } = await supabase
    //   .from('users')
    //   .update({
    //     firstname: firstname,
    //     lastname: lastname,
    //     email: email,
    //     mobile_number: mobile_number,
    //     date_of_birth: date_of_birth
    //   })
    //   .eq('email', decodedToken.email)
    //   .select('*')
    //   .single();

    // if (updateError) {
    //   console.error("Error updating user profile:", updateError);
    //   return NextResponse.json({ message: "Error updating profile" }, { status: 500 });
    // }

  //   console.log("This is the updated user", updatedUser);

  //  const {data: updateProfile, error: updateedProfileError} = await supabase.storage
  // .from('profileimages')
  // .upload(`users/${decodedToken.userId}profile.jpg`, profile_image,{
  //   cacheControl: '3600',
  //   upsert: true,
  // })

  // console.log("This is the updatedProfileImage", updateProfile);
  // return NextResponse.json({ success: true, data: updatedUser }, { status: 200 });

  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


