import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const RATE_LIMIT_WINDOW = 60;
const MAX_REQUESTS = 190;

export async function middleware(request: NextRequest) {
  const ip = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for") || "unknown";

  try {
    const currentRequests = parseInt(await redis.get(`rate_limit:${ip}`) || "0", 10);

    if (currentRequests >= MAX_REQUESTS) {
      const ttl = await redis.ttl(`rate_limit:${ip}`);
      const remainingTime = ttl > 0 ? ttl : 0;
      return NextResponse.json(
        { message: "Rate limit exceeded. Please try again later.", remainingTime },
        { status: 429 }
      );
    }

    await redis.incr(`rate_limit:${ip}`);

    if (currentRequests === 0) {
      await redis.expire(`rate_limit:${ip}`, RATE_LIMIT_WINDOW);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Error during rate limit check:", error);
    return NextResponse.json(
      { message: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
