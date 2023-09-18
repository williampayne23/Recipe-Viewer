"use client";
import React, { useState, useEffect } from "react";

export function Timer() {
  const [minutes, setMinutes] = useState(
    Number(window.localStorage.getItem("minutes")) ?? 0,
  );
  const [seconds, setSeconds] = useState(
    Number(window.localStorage.getItem("seconds")) ?? 0,
  );

  const addMinutes = (increment: number) => {
    setMinutes(minutes + increment);
  };

  const resetTimer = () => {
    setMinutes(0);
    setSeconds(0);
  };

  useEffect(() => {
    window.localStorage.setItem("minutes", minutes.toString());
    window.localStorage.setItem("seconds", seconds.toString());
  }, [minutes, seconds]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [minutes, seconds]);

  return (
    <>
      <div className="rounded-xl bg-white p-4 shadow-lg">
        <p className="text-center text-2xl font-bold">
          {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </p>
        <div className="mt-4 flex flex-row justify-center">
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
          <button
            className="ml-4 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-700"
            onClick={resetTimer}
          >
            Reset
          </button>
        </div>
      </div>
    </>
  );
}
