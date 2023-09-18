"use client";
import { useState } from "react";
import { updateInstruction } from "~/actions/api";

export function Instruction({ text, id }: { text: string; id: number }) {
  const [textState, setText] = useState(text);
  return (
    <textarea
      onChange={(e) => {
        setText(e.target.value);
        updateInstruction(id, e.target.value).catch(console.error);
      }}
      className="h-full w-full rounded-md border-4 border-stone-100 bg-transparent p-2 focus:outline-none"
      value={textState}
    ></textarea>
  );
}
