import { useEffect, useState } from "react";

const StationClock = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const time = now.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const date = now.toLocaleDateString("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });

  return (
    <div className="flex items-baseline gap-2 font-mono">
      <span className="text-amber-flap text-lg tabular-nums tracking-wider">
        {time}
      </span>
      <span className="text-paper-400 text-xs uppercase tracking-widest hidden sm:inline">
        {date}
      </span>
    </div>
  );
};

export default StationClock;
