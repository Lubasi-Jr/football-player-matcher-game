"use client";

import { ChangeEvent } from "react";
import { HOME_CONTENT } from "../constants";

interface UsernameInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export function UsernameInput({
  value,
  onChange,
  error,
  disabled = false,
}: UsernameInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="w-full max-w-md">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={HOME_CONTENT.usernamePlaceholder}
        disabled={disabled}
        className={`input-field ${error ? "ring-2 ring-accent-red" : ""}`}
        maxLength={20}
      />
      {error && (
        <p className="mt-2 text-sm text-accent-red font-body">{error}</p>
      )}
    </div>
  );
}
