import Link from "next/link";

export default function Home() {
  return (
    <div className="relative">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <section className="relative w-full min-h-[70vh] flex flex-col items-center justify-center text-center px-4 sm:px-8 bg-background">
          <h1 className="text-3xl sm:text-[65px] leading-[80%] tracking-tighter font-bold text-foreground">
            THE SCREEN PRINTING JOURNAL
            <br />
            <span className="text-primary">FROM SIMULASI STUDIO</span>
          </h1>
          <p className="mt-3 text-regular text-sm text-muted-foreground max-w-xl">
            Tradition meets innovation—bringing unique prints to life with
            precision and passion.
          </p>
          <div className="mt-5 flex gap-3">
            <Link
              href="/portfolio"
              className="px-5 py-2.5 text-sm sm:text-base font-medium bg-primary text-background rounded-md hover:opacity-90 transition"
            >
              View Portfolio
            </Link>
            <Link
              href="/contact"
              className="px-5 py-2.5 text-sm sm:text-base font-medium border border-primary text-primary rounded-md hover:bg-primary hover:text-background transition"
            >
              Get a Quote
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
