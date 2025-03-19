import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import dayjs from 'dayjs';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(inputDate: string) {
  const date = dayjs(inputDate);
  const now = dayjs();

  // 计算与当前时间的差异
  const diffInHours = now.diff(date, 'hour');
  const diffInDays = now.diff(date, 'day');

  if (diffInHours < 24 && diffInHours >= 0) {
    return `${diffInHours}小时前`;
  } else if (diffInDays <= 30 && diffInDays > 0) {
    return `${diffInDays}天前`;
  } else {
    // 原样返回原始日期
    return inputDate; // 或者根据需要调整返回格式，比如 date.format('YYYY-MM-DD')
  }
}