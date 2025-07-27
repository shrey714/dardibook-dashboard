import { PatientActivityLog } from "@/types/logTypes";
import { useLogStore } from "./useActivityLogStore";

export function logActivity(data: PatientActivityLog) {
    const { setLoading, setError } = useLogStore.getState();

    setLoading(true);
    setError(null);

    setTimeout(() => {
        fetch("/api/activity-logging", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Logging failed");
            })
            .catch((err) => {
                console.error("Logging error:", err);
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, 0);
}
