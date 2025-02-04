import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-background text-foreground p-6">
      <div className="container mx-auto flex justify-between items-center gap-4">
        <p className="text-sm w-full text-left">
          © {new Date().getFullYear()} Simulasi Studio. All rights reserved.
        </p>
        <div className="flex  gap-2">
          <Link
            href="/privacy-policy"
            className="text-sm hover:text-primary transition"
          >
            Privacy Policy
          </Link>
          <Link
            href="/changelog"
            className="text-sm hover:text-primary transition"
          >
            Change Log
          </Link>
        </div>
      </div>
    </footer>
  );
}
