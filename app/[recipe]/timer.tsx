"use client";
import React, { useState, useEffect } from "react";

export function Timer() {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const addMinutes = (increment: number) => {
    setMinutes(minutes + increment);
  };

  useEffect(() => {
    const savedMinutes = window.localStorage.getItem("minutes");
    const savedSeconds = window.localStorage.getItem("seconds");

    console.log(savedMinutes);
    if (savedMinutes) {
      setMinutes(Number(savedMinutes));
    }

    if (savedSeconds) {
      setSeconds(Number(savedSeconds));
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
        window.localStorage.setItem("seconds", (seconds - 1).toString());
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        window.localStorage.setItem("minutes", (minutes - 1).toString());
        setSeconds(59);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [minutes, seconds]);

  return (
    <>
      <div className="m-2 rounded-xl bg-white p-10 shadow-lg">
        <p className="text-center text-2xl font-bold">
          {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </p>
        <div className="mt-4 flex flex-row justify-between">
          <button
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
            onClick={() => addMinutes(1)}
          >
            + 1 min
          </button>
          <button
            className="ml-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
            onClick={() => addMinutes(5)}
          >
            + 5 mins
          </button>
          <button
            className="ml-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
            onClick={() => addMinutes(10)}
          >
            + 10 mins
          </button>
        </div>
      </div>
    </>
  );
}
