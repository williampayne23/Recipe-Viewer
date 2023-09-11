"use client";
import { useState } from "react";
import { api } from "~/utils/trpc";

export function Instruction({ text, id }: { text: string; id: number }) {
  const updateInstruction = api.example.updateInstruction.useMutation();
  const [textState, setText] = useState(text);
  return (
    <textarea
      onChange={(e) => {
        updateInstruction.mutate({
          id,
          instruction: e.target.value,
        });
        setText(e.target.value);
      }}
      className="h-full w-full bg-transparent focus:outline-none"
      value={textState}
    ></textarea>
  );
}
