import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const chat = await prisma.chatHistory.findUnique({
      where: { id },
      include: { messages: true },
    });

    if (!chat) {
      return new Response(
        JSON.stringify({ error: "Chat not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ messages: chat.messages }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching chat:", error);
    return new Response(
      JSON.stringify({ error: "Unable to fetch chat" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
