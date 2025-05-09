// import { NextRequest, NextResponse } from "next/server";
// import pool from "@/app/lib/db";
// import jwt from "jsonwebtoken";

// export async function POST(req: NextRequest) {
//   try {
//     const { email, token, limit = 10, offset = 0 } = await req.json();

//     console.log("For notifications purposes", email, token);

//     // Ensure token is provided
//     if (!token) {
//       return NextResponse.json({ message: "Token is required" }, { status: 400 });
//     }

//     // Verify the token
//     let decodedToken;
//     try {
//       decodedToken = jwt.verify(token, process.env.JWT_SECRET || "suckmydick") as { userId: number; email: string };
//     } catch (error) {
//       return NextResponse.json({ message: error }, { status: 401 });
//     }

//     // Check if decoded token email matches the email passed in the request
//     if (decodedToken.email !== email) {
//       return NextResponse.json({ message: "Email does not match the token" }, { status: 400 });
//     }

//     // Query for user ID from the database
//     const userQuery = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
//     if (userQuery.rowCount === 0) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const userId = userQuery.rows[0].id;

//     // Query for notifications for the user with pagination (limit and offset)
//     const notificationsQuery = await pool.query(
//       `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
//       [userId, limit, offset]
//     );

//     const notifications = notificationsQuery.rows;

//     // Return the notifications
//     return NextResponse.json({ notifications });

//   } catch (error) {
//     console.error("Error processing request:", error);
//     return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
//   }
// }


// src/app/api/notifications/route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { email, token, limit = 10, offset = 0 } = await req.json();

    console.log("For notifications purposes", email, token);

    // Ensure token is provided
    if (!token) {
      return NextResponse.json({ message: "Token is required" }, { status: 400 });
    }

    // Verify the token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET || "suckmydick") as { userId: number; email: string };
    } catch (error) {
      return NextResponse.json({ message: error }, { status: 401 });
    }

    // Check if decoded token email matches the email passed in the request
    if (decodedToken.email !== email) {
      return NextResponse.json({ message: "Email does not match the token" }, { status: 400 });
    }

    // Query for user ID from Supabase
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = user.id;

    // Query for notifications for the user with pagination (limit and offset)
    const { data: notifications, error: notificationsError } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (notificationsError) {
      console.error("Error fetching notifications:", notificationsError);
      return NextResponse.json({ message: "Error fetching notifications" }, { status: 500 });
    }

    // Return the notifications
    return NextResponse.json({ notifications });

  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
