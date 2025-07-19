"use client"
import { useEffect, useState } from "react";
import { formatTime } from "@/lib/utils";

interface ClientTimeProps {
  date: string;
  refreshInterval?: number; // 可选，单位毫秒，默认不自动刷新
}

export default function ClientTime({ date, refreshInterval }: ClientTimeProps) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    setDisplay(formatTime(date));
    if (refreshInterval) {
      const timer = setInterval(() => {
        setDisplay(formatTime(date));
      }, refreshInterval);
      return () => clearInterval(timer);
    }
  }, [date, refreshInterval]);

  return <span>{display}</span>;
}
