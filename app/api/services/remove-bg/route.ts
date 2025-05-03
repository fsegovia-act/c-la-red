import { NextResponse } from "next/server";
import { removeBackgroundFromImageBase64 } from "remove.bg";

const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY;

type RemoveBgResponse = {
  base64img: string;
};

export async function POST(request) {
  try {
    if (!REMOVE_BG_API_KEY) throw new Error("Remove.bg API key not found");

    if (request.method !== "POST") throw new Error("Method not allowed");    

    const { image } = await request.json();

    if (!image) throw new Error("Image not found");

    const result = (await removeBackgroundFromImageBase64({
      base64img: image,
      apiKey: REMOVE_BG_API_KEY,
      size: "regular",
      type: "auto",
    })) as RemoveBgResponse;

    return NextResponse.json({
      image: result.base64img,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Error removing background",
    });
  }
}
