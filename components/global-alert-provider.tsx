"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface Alert {
  id: string;
  level: string;
  message: string;
  source: string;
  timestamp: string;
  time: string;
  read: boolean;
  title: string;
  category: string;
  confidence?: number;
  target_ip?: string;
  target_port?: number;
  detection_method?: string;
}

interface GlobalAlertProviderProps {
  children: React.ReactNode;
}

export function GlobalAlertProvider({ children }: GlobalAlertProviderProps) {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("alertSoundEnabled");
      return saved !== null ? JSON.parse(saved) : true;
    }
    return true;
  });
  const [lastAlertCheck, setLastAlertCheck] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Enhanced audio notification system
  const playAlertSound = useCallback(
    (severity: string) => {
      if (!soundEnabled) return;

      try {
        // Create audio context for better browser compatibility
        const AudioContextClass =
          window.AudioContext ||
          (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) return;
        const audioContext = new AudioContextClass();

        // Create different tones for different severity levels
        const frequency = severity === "critical" ? 800 : severity === "high" ? 600 : 400;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = "sine";

        // Set volume based on severity
        const volume = severity === "critical" ? 0.3 : severity === "high" ? 0.2 : 0.1;
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      } catch {
        // Fallback: simple beep using data URL
        try {
          const audio = new Audio();
          audio.volume = 0.2;
          // Simple sine wave beep
          const sampleRate = 44100;
          const duration = 0.3;
          const freq = severity === "critical" ? 800 : severity === "high" ? 600 : 400;
          const samples = Math.floor(sampleRate * duration);
          const buffer = new ArrayBuffer(44 + samples * 2);
          const view = new DataView(buffer);

          // WAV header
          const writeString = (offset: number, string: string) => {
            for (let i = 0; i < string.length; i++) {
              view.setUint8(offset + i, string.charCodeAt(i));
            }
          };

          writeString(0, "RIFF");
          view.setUint32(4, 36 + samples * 2, true);
          writeString(8, "WAVE");
          writeString(12, "fmt ");
          view.setUint32(16, 16, true);
          view.setUint16(20, 1, true);
          view.setUint16(22, 1, true);
          view.setUint32(24, sampleRate, true);
          view.setUint32(28, sampleRate * 2, true);
          view.setUint16(32, 2, true);
          view.setUint16(34, 16, true);
          writeString(36, "data");
          view.setUint32(40, samples * 2, true);

          // Generate sine wave
          for (let i = 0; i < samples; i++) {
            const sample = Math.sin((2 * Math.PI * freq * i) / sampleRate) * 0.3 * 32767;
            view.setInt16(44 + i * 2, sample, true);
          }

          const blob = new Blob([buffer], { type: "audio/wav" });
          audio.src = URL.createObjectURL(blob);
          audio.play().catch(() => {});
        } catch (fallbackError) {
          console.warn("Audio notification failed:", fallbackError);
        }
      }
    },
    [soundEnabled]
  );

  const showAlertNotification = useCallback(
    (alert: Alert) => {
      const severity = alert.level.toLowerCase();
      const isCritical = severity === "critical" || severity === "high";

      // Dismiss older notifications to prevent screen overload
      toast.dismiss();

      // Play sound notification
      playAlertSound(severity);

      // Compact toast notification
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-in slide-in-from-right-3 fade-in" : "animate-out slide-out-to-right-3 fade-out"
            } max-w-xs w-full bg-gray-900/95 backdrop-blur-sm border-l-2 ${
              severity === "critical"
                ? "border-red-500"
                : severity === "high"
                ? "border-orange-500"
                : severity === "medium"
                ? "border-yellow-500"
                : "border-blue-500"
            } rounded-md shadow-lg pointer-events-auto ring-1 ring-gray-700/50 cursor-pointer hover:bg-gray-800/95 transition-all duration-150`}
            onClick={() => toast.dismiss(t.id)}
          >
            <div className="p-2">
              <div className="flex items-center gap-2">
                <div className="shrink-0">
                  <div
                    className={`h-6 w-6 rounded-full flex items-center justify-center text-sm ${
                      severity === "critical"
                        ? "bg-red-500/20 text-red-400"
                        : severity === "high"
                        ? "bg-orange-500/20 text-orange-400"
                        : severity === "medium"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {severity === "critical" ? "🚨" : severity === "high" ? "⚠️" : severity === "medium" ? "⚡" : "🔔"}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-white truncate">{alert.level} Alert</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.dismiss(t.id);
                      }}
                      className="text-gray-400 hover:text-gray-200 text-xs ml-1 px-1"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-xs text-gray-300 truncate mt-0.5">{alert.message}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.dismiss(t.id);
                        // Navigate to alerts page
                        window.location.href = "/alerts";
                      }}
                      className="text-xs px-2 py-0.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ),
        {
          duration: isCritical ? 5000 : 3000,
          position: "top-right",
        }
      );
    },
    [playAlertSound]
  );

  const checkForNewAlerts = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("Global Alert Provider: No token found");
        return;
      }

      const response = await fetch("http://localhost:8000/api/alerts/?limit=10", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const alerts: Alert[] = await response.json();
        const unreadAlerts = alerts.filter((alert) => !alert.read);

        console.log(`Global Alert Provider: Found ${alerts.length} total alerts, ${unreadAlerts.length} unread`);

        // Check for new alerts since last check
        if (unreadAlerts.length > 0) {
          const latestAlert = unreadAlerts[0];
          const latestTimestamp = latestAlert.timestamp;

          console.log(`Latest alert timestamp: ${latestTimestamp}, Last check: ${lastAlertCheck}`);

          // Show notification if this is a new alert
          if (!lastAlertCheck || latestTimestamp > lastAlertCheck) {
            console.log("New alert detected! Showing notification...");
            showAlertNotification(latestAlert);

            // Update last check timestamp to the latest alert
            setLastAlertCheck(latestTimestamp);
          } else {
            console.log("No new alerts since last check");
          }
        } else {
          console.log("No unread alerts found");
        }
      } else {
        console.error(`Global Alert Provider: API error ${response.status}:`, await response.text());
      }
    } catch (error) {
      console.warn("Failed to check for alerts:", error);
    }
  }, [lastAlertCheck, showAlertNotification]);

  // Initialize and start polling for alerts
  useEffect(() => {
    // Set up polling interval (will handle first check too)
    intervalRef.current = setInterval(checkForNewAlerts, 3000); // Check every 3 seconds

    // Initial check with timeout to avoid immediate setState
    const timeoutId = setTimeout(checkForNewAlerts, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      clearTimeout(timeoutId);
    };
  }, [checkForNewAlerts]);

  // Provide a way to toggle sound globally
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "alertSoundEnabled" && e.newValue !== null) {
        setSoundEnabled(JSON.parse(e.newValue));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "transparent",
            boxShadow: "none",
          },
        }}
      />
    </>
  );
}
