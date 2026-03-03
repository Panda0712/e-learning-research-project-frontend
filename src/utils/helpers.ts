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

export const bytesToGB = (bytes: number) =>
  (bytes / 1024 / 1024 / 1024).toFixed(2);

export const interceptorLoadingElements = (calling: boolean) => {
  const elements = document.querySelectorAll(".interceptor-loading");
  for (let i = 0; i < elements.length; i++) {
    (elements[i] as HTMLElement).style.opacity = calling ? "0.5" : "initial";
    (elements[i] as HTMLElement).style.pointerEvents = calling ? "none" : "initial";
  }
};
