import { NextRequest, NextResponse } from "next/server";

import { TeamPlanQuota } from "@/config/team";
import { getUserSendEmailCount, saveUserSendEmail } from "@/lib/dto/email";
import { checkUserStatus } from "@/lib/dto/user";
import { resend } from "@/lib/email";
import { getCurrentUser } from "@/lib/session";
import { restrictByTimeRange } from "@/lib/team";
import { isValidEmail } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    // check limit
    const limit = await restrictByTimeRange({
      model: "userSendEmail",
      userId: user.id,
      limit: TeamPlanQuota[user.team].EM_SendEmails,
      rangeType: "month",
    });
    if (limit)
      return NextResponse.json(limit.statusText, { status: limit.status });

    const { from, to, subject, html } = await req.json();

    if (!from || !to || !subject || !html) {
      return NextResponse.json("Missing required fields", { status: 400 });
    }

    if (!isValidEmail(from) || !isValidEmail(to)) {
      return NextResponse.json("Invalid email address", { status: 403 });
    }

    // 处理模拟 Resend 客户端和实际 Resend 客户端返回的不同结构
    const result = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });
    
    // 检查是否有错误（兼容两种返回结构）
    const error = 'error' in result ? result.error : null;

    if (error) {
      console.log("Resend error:", error);
      return NextResponse.json("Failed to send email", { status: 500 });
    }

    await saveUserSendEmail(user.id, from, to, subject, html);

    return NextResponse.json("success", { status: 200 });
  } catch (error) {
    console.log("Error sending email:", error);
    return NextResponse.json("Internal server error", { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") || "false";

    const count = await getUserSendEmailCount(
      user.id,
      user.role === "ADMIN" && all === "true",
    );
    return NextResponse.json(count);
  } catch (error) {
    return NextResponse.json("Internal server error", { status: 500 });
  }
}
