import { NextResponse } from "next/server";
import uploadFileToS3 from "../_lib/aws-s3";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) throw new Error("File is required");

    const buffer = Buffer.from(await file.arrayBuffer());

    const filePath = await uploadFileToS3(buffer, file.name);

    return NextResponse.json({
      success: true,
      data: `File uploaded (${filePath})`,
    });
  } catch (error) {
    return NextResponse.json({ success: false, data: error.message });
  }
}
