import { streamText, StreamingTextResponse } from "ai";
import { openai } from "@ai-sdk/openai";
import { type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: openai("gpt-4o"),
      messages,
      system: "You are WorkFlow AI, an intelligent support assistant...",
    });

    return new StreamingTextResponse(result);

  } catch (error) {
    console.error("❌ Error in /api/chat:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
