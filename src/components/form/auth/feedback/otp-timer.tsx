"use client";

import { Button } from "@/components/ui/button";
import { ReactNode, useEffect, useState } from "react";


interface OtpTimerProps extends React.ComponentProps<"div"> {
  duration?: number; // Countdown duration in seconds
  onResend: () => void | Promise<void>; // Called when user clicks resend
  isWaiting?: (timeLeft: number) => ReactNode; // What to render during countdown
  action?: ReactNode; // What to render after countdown
  onCount?: (info: { current: number; count: number }) => void; // Notify parent
}

export default function OtpTimer({
  duration = 60,
  onResend,
  isWaiting,
  onCount,
  action,
  ...props
}: OtpTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isResending, setIsResending] = useState(false);

  // Count down timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;

        // Call parent with current value and total count
        onCount?.({ current: next, count: duration });

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, duration, onCount]);

  const handleRedo = async () => {
    setIsResending(true);
    await onResend();
    setTimeLeft(duration);

    // Reset count callback
    onCount?.({ current: duration, count: duration });

    setIsResending(false);
  };

  return (
    <div {...props}>
      {timeLeft > 0 ? (
        isWaiting ? (
          isWaiting(timeLeft)
        ) : (
          <p className="text-primary">Resend available in {timeLeft}s</p>
        )
      ) : action ? (
        <div onClick={isResending ? undefined : handleRedo} className="outline-dotted">
          {isResending ? <p>Action in Progress...</p> : action}
        </div>
      ) : (
        <Button onClick={handleRedo} disabled={isResending}>
          {isResending ? "Retrying..." : "Retry"}
        </Button>
      )}
    </div>
  );
}
