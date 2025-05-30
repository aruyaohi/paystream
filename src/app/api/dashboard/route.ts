import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import jwt, { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ message: "Token is required" }, { status: 400 });
    }

    // Verify the JWT token
    const decodedToken = jwt.verify(token, "suckmydick") as { userId: number; email: string };

    // Get user from Supabase
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', decodedToken.email)
      .single();

    if (userError) {
      console.error("Supabase error:", userError);
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Get all investments for the user
    const { data: allInvestments, error: investmentsError } = await supabase
      .from('investments')
      .select('*')
      .eq('user_id', user.id)
      .order('id', { ascending: false });

    if (investmentsError) {
      console.error("Investments error:", investmentsError);
      return NextResponse.json({ message: "Error retrieving investments" }, { status: 500 });
    }

    // Get all notifications for the user
    const { data: allNotifications, error: notificationsError } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('id', { ascending: false });

    if (notificationsError) {
      console.error("Notifications error:", notificationsError);
      return NextResponse.json({ message: "Error retrieving notifications" }, { status: 500 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Investment created, balance updated, and notification sent.",
        user: user,
        investments: allInvestments,
        notifications: allNotifications,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error processing investment:", error);

    if (error instanceof TokenExpiredError) {
      return NextResponse.json({ message: 'Token expired' }, { status: 401 });
    }

    if (error instanceof JsonWebTokenError) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
