"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function RateLimited() {
  const router = useRouter();
  const { remainingTime } = router.query;
  const [timeLeft, setTimeLeft] = useState<number>(Number(remainingTime));
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const countdown = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    setTimer(countdown);

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeLeft, timer]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setTimeLeft(0);
      clearInterval(timer!);
    }
  }, [timeLeft, timer]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#212121] text-gray-100">
      <h1 className="text-2xl font-bold text-white mb-4">Rate Limit Exceeded</h1>
      <p className="text-lg">Please wait for {timeLeft} seconds before trying again.</p>
    </div>
  );
}
