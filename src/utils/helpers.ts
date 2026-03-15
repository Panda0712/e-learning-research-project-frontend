type BirthParts = {
  birthDay: number;
  birthMonth: number;
  birthYear: number;
};

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  }).format(date);
};

export const formatDateTime = (date: Date) => {
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatVideoDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export const getLearnedAgo = (value?: Date | string | null): string => {
  if (!value) return "";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const secDiff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (secDiff < 0) return "Learned just now";

  const units = [
    { name: "year", limit: 60 * 60 * 24 * 365, divisor: 60 * 60 * 24 * 365 },
    { name: "month", limit: 60 * 60 * 24 * 30, divisor: 60 * 60 * 24 * 30 },
    { name: "day", limit: 60 * 60 * 24, divisor: 60 * 60 * 24 },
    { name: "hour", limit: 60 * 60, divisor: 60 * 60 },
    { name: "minute", limit: 60, divisor: 60 },
  ];

  for (const unit of units) {
    if (secDiff >= unit.limit) {
      const count = Math.floor(secDiff / unit.divisor);
      return `Learned ${count} ${unit.name}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "Learned just now";
};

export const parseDateOfBirth = (value?: string | Date | null | undefined) => {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return {
    birthDay: date.getDate(),
    birthMonth: date.getMonth() + 1,
    birthYear: date.getFullYear(),
  };
};

export const buildDateOfBirth = (parts: BirthParts): Date | null => {
  const { birthDay, birthMonth, birthYear } = parts;

  // validate simple (nên mở rộng theo cần thiết)
  if (
    !Number.isInteger(birthDay) ||
    !Number.isInteger(birthMonth) ||
    !Number.isInteger(birthYear) ||
    birthMonth < 1 ||
    birthMonth > 12 ||
    birthDay < 1 ||
    birthYear < 0
  ) {
    return null;
  }

  // JS Date constructor: month index 0-11
  const date = new Date(Date.UTC(birthYear, birthMonth - 1, birthDay, 0, 0, 0));

  // kiểm tra nằm đúng ngày (ví dụ 31/2 -> invalid)
  if (
    date.getUTCFullYear() !== birthYear ||
    date.getUTCMonth() !== birthMonth - 1 ||
    date.getUTCDate() !== birthDay
  ) {
    return null;
  }

  return date;
};

export const bytesToGB = (bytes: number) =>
  (bytes / 1024 / 1024 / 1024).toFixed(2);

export const interceptorLoadingElements = (calling: boolean) => {
  const elements = document.querySelectorAll(".interceptor-loading");
  for (let i = 0; i < elements.length; i++) {
    (elements[i] as HTMLElement).style.opacity = calling ? "0.5" : "initial";
    (elements[i] as HTMLElement).style.pointerEvents = calling
      ? "none"
      : "initial";
  }
};
