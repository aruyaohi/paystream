// import { NextRequest, NextResponse } from "next/server";
// import pool from "@/app/lib/db";
// import jwt from "jsonwebtoken";

// export async function POST(req: NextRequest) {
//   try {
//     const { email, token, id } = await req.json();

//     console.log(email,token,id);

//     if (!token || !email || !id) {
//       return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
//     }

//     // Verify token
//     let decodedToken;
//     try {
//       decodedToken = jwt.verify(token, process.env.JWT_SECRET || "suckmydick") as { userId: number; email: string };
//     } catch (err) {
//       return NextResponse.json({ message: err }, { status: 401 });
//     }

//     if (decodedToken.email !== email) {
//       return NextResponse.json({ message: "Email does not match the token" }, { status: 400 });
//     }

//     // Fetch user ID
//     const userQuery = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
//     if (userQuery.rowCount === 0) {
//       return NextResponse.json({ message: "User not found" }, { status: 404 });
//     }

//     const userId = userQuery.rows[0].id;

//     // Update the notification's read status
//     const updateQuery = await pool.query(
//       "UPDATE notifications SET status = 'read' WHERE id = $1 AND user_id = $2 RETURNING *",
//       [id, userId]
//     );

//     if (updateQuery.rowCount === 0) {
//       return NextResponse.json({ message: "Notification not found or not owned by user" }, { status: 404 });
//     }

//     const updatedNotification = updateQuery.rows[0];

//     return NextResponse.json({
//       message: "Notification updated successfully",
//       notification: updatedNotification,
//     });
//   } catch (error) {
//     console.error("Error updating notification:", error);
//     return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
//   }
// }


// src/app/api/updatenotification/route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { email, token, id } = await req.json();

    console.log(email, token, id);

    if (!token || !email || !id) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Verify token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET || "suckmydick") as { userId: number; email: string };
    } catch (err) {
      return NextResponse.json({ message: err }, { status: 401 });
    }

    if (decodedToken.email !== email) {
      return NextResponse.json({ message: "Email does not match the token" }, { status: 400 });
    }

    // Fetch user ID from Supabase
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const userId = user.id;

    // Update the notification's read status in Supabase
    await supabase
    .from('notifications')
    .update({ status: 'read' })
    .match({ id, user_id: userId });

    const { data: updatedNotification, error: fetchError } = await supabase
  .from('notifications')
  .select('*')
  .match({ id, user_id: userId })
  .single();

    if (fetchError || !updatedNotification) {
      console.log("There was an error:", fetchError)
      return NextResponse.json({ message: "Notification not found or not owned by user" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Notification updated successfully",
      notification: updatedNotification,
    });
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
