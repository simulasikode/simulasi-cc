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
    <div className="prose mx-auto p-4">
      <h1>Changelog</h1>
      <pre className="whitespace-pre-wrap">{changelog}</pre>
    </div>
  );
}
