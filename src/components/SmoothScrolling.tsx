"use client";
import { ReactNode } from "react";
import { useLenis } from "@/hooks/useLenis";

interface SmoothScrollingProps {
  children: ReactNode;
}

export default function SmoothScrolling({ children }: SmoothScrollingProps) {
  useLenis();
  return (
    <>
      <div>{children}</div>
      {/* Wrap children inside a <div> to ensure proper typing */}
    </>
  );
}
