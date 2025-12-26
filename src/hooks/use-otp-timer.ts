"use client";

import { useCallback, useEffect, useState } from "react";

interface UseOtpTimerOptions {
  duration?: number;
  onResend: () => void | Promise<void>;
  onCount?: (info: { current: number; count: number }) => void;
}

export function useOtpTimer({
  duration = 60,
  onResend,
  onCount,
}: UseOtpTimerOptions) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isResending, setIsResending] = useState(false);

  // Countdown effect
  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        onCount?.({ current: next, count: duration });
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, duration, onCount]);

  const resend = useCallback(async () => {
    if (isResending) return;

    setIsResending(true);
    await onResend();
    setTimeLeft(duration);
    onCount?.({ current: duration, count: duration });
    setIsResending(false);
  }, [onResend, duration, onCount, isResending]);

  const reset = useCallback(() => {
    setTimeLeft(duration);
    onCount?.({ current: duration, count: duration });
  }, [duration, onCount]);

  return {
    timeLeft,
    isWaiting: timeLeft > 0,
    isResending,
    resend,
    reset,
  };
}
