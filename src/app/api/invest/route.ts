import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabase } from "@/app/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, plan, roi } = body;
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Token is required" }, { status: 400 });
    }

    const decodedToken = jwt.verify(token, "suckmydick") as { userId: number; email: string };

    // Get user by email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', decodedToken.email)
      .single();

    if (userError) {
      console.error("Error fetching user:", userError);
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const newBalance = parseFloat(user.invested_amount) + parseFloat(amount);

    // Update user's invested amount
    const {error: updateUserError } = await supabase
      .from('users')
      .update({ invested_amount: newBalance })
      .eq('email', decodedToken.email);

    if (updateUserError) {
      console.error("Error updating user:", updateUserError);
      return NextResponse.json({ message: "Error updating user balance" }, { status: 500 });
    }

    // Get the updated user data
    const { data: updatedUserData, error: fetchUserError } = await supabase
      .from('users')
      .select('*')
      .eq('email', decodedToken.email)
      .single();

    if (fetchUserError) {
      console.error("Error fetching updated user:", fetchUserError);
      return NextResponse.json({ message: "Error fetching updated user" }, { status: 500 });
    }

    // Insert new investment
    const {error: insertInvestmentError } = await supabase
      .from('investments')
      .insert([
        {
          plan,
          amount,
          roi_percentage: roi.percentage,
          roi_profit: roi.profit,
          duration: '6 months',
          user_id: user.id,
          status: false,
        }
      ]);

    if (insertInvestmentError) {
      console.error("Error inserting investment:", insertInvestmentError);
      return NextResponse.json({ message: "Error creating investment" }, { status: 500 });
    }

    // Create notification for the new investment
    const investmentNotification = {
      message: `You've successfully invested $${amount} in our ${plan} plan`,
      details: `Congratulations on your new investment in our ${plan} plan! Your portfolio is now strengthened with an additional $${amount}, offering an expected ROI of ${roi.percentage}%. This investment is projected to yield a profit of $${roi.profit} over the 6-month duration. Your total invested amount is now $${newBalance}. We're excited to help you grow your wealth!`,
      status: 'unread',
      type: 'success',
      title: 'New Investment Confirmed',
      time: new Date().toISOString(),
      user_id: user.id,
    };

    const {error: insertNotificationError } = await supabase
      .from('notifications')
      .insert([investmentNotification]);

    if (insertNotificationError) {
      console.error("Error inserting notification:", insertNotificationError);
      return NextResponse.json({ message: "Error creating notification" }, { status: 500 });
    }

    // Get all investments for this user
    const { data: allInvestments, error: investmentsError } = await supabase
      .from('investments')
      .select('*')
      .eq('user_id', user.id)
      .order('id', { ascending: false });

    if (investmentsError) {
      console.error("Error fetching investments:", investmentsError);
      return NextResponse.json({ message: "Error fetching investments" }, { status: 500 });
    }

    // Get all notifications for this user
    const { data: allNotifications, error: notificationsError } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('id', { ascending: false });

    if (notificationsError) {
      console.error("Error fetching notifications:", notificationsError);
      return NextResponse.json({ message: "Error fetching notifications" }, { status: 500 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Investment created and balance updated",
        updatedUser: updatedUserData,
        investments: allInvestments,
        notifications: allNotifications,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing investment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
