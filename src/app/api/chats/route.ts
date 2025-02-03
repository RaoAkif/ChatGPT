import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: Request): Promise<Response> {
  try {
    const chats = await prisma.chatHistory.findMany({
      include: {
        messages: true,
      },
    });

    return new Response(
      JSON.stringify({ chats }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching chats:", error);
    return new Response(
      JSON.stringify({ error: "Unable to fetch chats" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
