import { NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const fd = new FormData();
    fd.append("image", buffer, file.name);

    const { data } = await axios.post("https://hiraaaku.site/ocr", fd, {
      headers: {
        ...fd.getHeaders(),
      },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error("OCR API Error:", err.message);
    return NextResponse.json(
      { error: err.message || "Failed to process OCR" },
      { status: 500 }
    );
  }
}
