type LogData = {
  action: string;
  metadata?: Record<string, any>;
  location?: string;
};

export function logActivity(data: LogData) {
  setTimeout(() => {
    fetch("/api/activity-logging", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    }).catch((err) => console.error("Logging error:", err));
  }, 0);
}