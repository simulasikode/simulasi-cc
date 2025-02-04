"use client";
import { useEffect, useState } from "react";

export default function ChangelogPage() {
  const [changelog, setChangelog] = useState("");

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/simulasikode/simulasi-cc/main/CHANGELOG.md",
    )
      .then((res) => res.text())
      .then((data) => setChangelog(data));
  }, []);

  return (
    <div className="prose p-16 max-w-5xl">
      <pre className="whitespace-pre-wrap">{changelog}</pre>
    </div>
  );
}
