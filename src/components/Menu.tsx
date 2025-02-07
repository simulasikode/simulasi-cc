"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { X } from "lucide-react";
import { FaInstagram, FaGithub, FaYoutube } from "react-icons/fa";
import { TbMenu } from "react-icons/tb";
import Image from "next/image";
import dynamic from "next/dynamic";

const RGBBackground = dynamic(() => import("@/components/RGBBackground"), {
  ssr: false,
});

const ThemeSwitcher = dynamic(() => import("@/components/ThemeSwitcher"), {
  ssr: false,
});

const socialLinks = [
  {
    name: "Instagram",
    url: "https://instagram.com/simulasi.studio",
    icon: <FaInstagram size={24} />,
  },
  {
    name: "Youtube",
    url: "https://www.youtube.com/@simulasistudio",
    icon: <FaYoutube size={24} />,
  },
  {
    name: "GitHub",
    url: "https://github.com/simulasikode",
    icon: <FaGithub size={24} />,
  },
];

const menuSections = [
  {
    title: "Studio",
    items: [
      { name: "About Us", link: "/about" },
      { name: "Case Studies", link: "/case-studies" },
      { name: "Portfolio", link: "/portfolio" },
    ],
  },
  {
    title: "Services",
    items: [
      { name: "Price", link: "/service/price" },
      { name: "Process CC", link: "/service/process-cc" },
      {
        name: "Request",
        link: "https://forms.fillout.com/t/pFE4XxyiXGus",
        isExternal: true,
      },
      { name: "Product", link: "/product" },
    ],
  },
  {
    title: "Pre-Press",
    items: [
      { name: "Foreword", link: "/foreword" },
      { name: "Color", link: "/color" },
      { name: "Paper", link: "/paper" },
      { name: "Printing", link: "/printing" },
    ],
  },
];

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<(HTMLLIElement | null)[]>([]);
  const socialIconsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuTextRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    gsap.set(menuTextRef.current, { opacity: 0, x: -10 });
  }, []);

  const handleHover = (show: boolean) => {
    gsap.to(menuTextRef.current, {
      opacity: show ? 1 : 0,
      x: show ? 0 : 10,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  // Automatically hide "Menu" text when menu closes
  useEffect(() => {
    if (!isOpen) {
      gsap.to(menuTextRef.current, {
        opacity: 0,
        x: -10,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [isOpen]);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (isOpen) {
        tl.to(menuRef.current, { y: "0%", opacity: 1, duration: 0.5 });
        tl.fromTo(
          menuItemsRef.current,
          { opacity: 0, y: 50, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08 },
          "-=0.2",
        );
        tl.fromTo(
          socialIconsRef.current,
          { opacity: 0, y: 50, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08 },
          "-=0.2",
        );
      } else {
        tl.to(menuItemsRef.current, {
          opacity: 0,
          y: -10,
          scale: 0.95,
          duration: 0.3,
          stagger: 0.05,
        });
        tl.to(
          socialIconsRef.current,
          { opacity: 0, y: -8, scale: 0.95, duration: 0.3, stagger: 0.05 },
          "-=0.2",
        );
        tl.to(
          menuRef.current,
          { y: "-100%", opacity: 0, duration: 0.4 },
          "-=0.3",
        );
      }
    },
    { dependencies: [isOpen], scope: menuRef },
  );

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return (
    <>
      <ThemeSwitcher />
      <div className="sticky top-3 flex justify-center mx-auto text-xs z-10 mix-blend-difference text-white">
        <Link href="/" className="hover:underline">
          Simulasi Studio • Screen printing service
        </Link>
      </div>
      {!isOpen && (
        <button
          ref={menuButtonRef}
          className="fixed top-2 right-2 z-40 flex items-center gap-2 text-lg cursor-pointer transition"
          onClick={() => setIsOpen(true)}
          onMouseEnter={() => handleHover(true)}
          onMouseLeave={() => handleHover(false)}
          aria-label="Open menu"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setIsOpen(true)}
        >
          <span ref={menuTextRef} className="text-base transition-opacity">
            Menu
          </span>
          <TbMenu size={24} />
        </button>
      )}
      <div
        ref={menuRef}
        className="fixed inset-0 z-50 h-full w-full bg-background/78 text-foreground transform -translate-y-full transition-transform duration-500 backdrop-blur-xl p-6 opacity-0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-foreground hover:text-primary transition cursor-pointer"
          onClick={() => setIsOpen(false)}
          aria-label="Close menu"
        >
          <X size={32} />
        </button>
        <div className="top-0 mb-16">
          <Link href="/" onClick={() => setIsOpen(false)}>
            <Image
              className="dark:invert"
              src="/simulasi.svg"
              alt="Simulasi Studio Logo"
              width={42}
              height={42}
              priority
            />
          </Link>{" "}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-md sm:max-w-lg md:max-w-5xl text-left">
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-3">
              <h3 className="text-lg sm:text-xl font-bold">{section.title}</h3>
              <ul className="space-y-1 sm:space-y-2">
                {section.items.map((item, index) => {
                  const refIndex = sectionIndex * section.items.length + index;
                  return (
                    <li
                      key={item.name}
                      ref={(el) => {
                        if (el) menuItemsRef.current[refIndex] = el;
                      }}
                      className="text-base sm:text-lg hover:text-primary transition-colors cursor-pointer"
                    >
                      {item.isExternal ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </a>
                      ) : (
                        <Link href={item.link} onClick={() => setIsOpen(false)}>
                          {item.name}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex justify-start space-x-4 sm:space-x-6">
          {socialLinks.map((social, index) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              aria-label={social.name}
              rel="noopener noreferrer"
              className="hover:text-primary transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              ref={(el) => {
                if (el) socialIconsRef.current[index] = el;
              }}
            >
              {social.icon}
            </a>
          ))}
        </div>

        <div className="absolute bottom-4 left-0 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between w-full text-sm text-muted-foreground">
          <span>
            © {new Date().getFullYear()} Simulasi Studio. All rights reserved.
          </span>
          <div className="flex space-x-4">
            <Link
              href="/privacy-policy"
              className="hover:text-primary transition"
              onClick={() => setIsOpen(false)}
            >
              Privacy Policy
            </Link>
            <Link
              href="/changelog"
              className="hover:text-primary transition"
              onClick={() => setIsOpen(false)}
            >
              Changelog
            </Link>
          </div>
        </div>
        <RGBBackground />
      </div>
    </>
  );
}
