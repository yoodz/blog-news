import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import dayjs from 'dayjs';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(inputDate: string) {
  const date = dayjs(inputDate);
  const now = dayjs();

  const diffInMinutes = now.diff(date, 'minute');

  // 处理1小时内的分钟显示
  if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`;
  }

  const diffInHours = now.diff(date, 'hour');

  // 处理24小时内的小时+分钟显示
  if (diffInHours < 24) {
    const remainingMinutes = diffInMinutes % 60;
    // 当分钟数为0时只显示小时
    return remainingMinutes === 0 
      ? `${diffInHours}小时前`
      : `${diffInHours}小时${remainingMinutes}分钟前`;
  }

  // 计算实际天数（基于24小时周期）
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays <= 30) {
    return `${diffInDays}天前`;
  }

  // 超过30天显示完整日期时间
  return date.format('YYYY-MM-DD HH:mm:ss');
}