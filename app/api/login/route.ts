import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { data } = await axios(`${process.env.NEXT_APP_BASE_URL}users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
  });

  return NextResponse.json(data, { status: 200 });
}
