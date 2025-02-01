"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { X } from "lucide-react";
import { FaInstagram, FaTwitter, FaGithub, FaYoutube } from "react-icons/fa";
import RGBBackground from "@/components/RGBBackground";

const socialLinks = [
  {
    name: "Twitter",
    url: "https://twitter.com",
    icon: <FaTwitter size={24} />,
  },
  {
    name: "Youtube",
    url: "https://youtube.com",
    icon: <FaYoutube size={24} />,
  },
  {
    name: "Instagram",
    url: "https://instagram.com/simulasi.studio",
    icon: <FaInstagram size={24} />,
  },
  { name: "GitHub", url: "https://github.com", icon: <FaGithub size={24} /> },
];

// Menu sections with links
const menuSections = [
  {
    title: "Studio",
    items: [
      { name: "Home", link: "/" },
      { name: "About Us", link: "/about" },
      { name: "Careers", link: "/careers" },
      { name: "Contact", link: "/contact" },
    ],
  },
  {
    title: "Services",
    items: [
      { name: "Web Development", link: "/services/web-development" },
      { name: "UI/UX Design", link: "/services/ui-ux" },
      { name: "SEO", link: "/services/seo" },
      { name: "Marketing", link: "/services/marketing" },
    ],
  },
  {
    title: "Resources",
    items: [
      { name: "Blog", link: "/blog" },
      { name: "Case Studies", link: "/case-studies" },
      { name: "E-books", link: "/ebooks" },
      { name: "Webinars", link: "/webinars" },
    ],
  },
];

const extraLinks = {
  title: "More",
  items: [
    { name: "Privacy Policy", link: "/privacy-policy" },
    { name: "Changelog", link: "/changelog" },
  ],
};

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<(HTMLLIElement | null)[]>([]);
  const socialIconsRef = useRef<(HTMLAnchorElement | null)[]>([]); // Fixed Ref Type

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (isOpen) {
      tl.to(menuRef.current, { y: "0%", opacity: 1, duration: 0.5 });

      tl.fromTo(
        menuItemsRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.08,
        },
        "-=0.2",
      );

      // Add animation for social icons when menu opens
      tl.fromTo(
        socialIconsRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.08,
        },
        "-=0.2", // Starts slightly before previous animations finish
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
        menuRef.current,
        { y: "-100%", opacity: 1, duration: 0.4 },
        "-=0.4",
      );

      // Reverse animation for social icons when menu closes
      tl.to(
        socialIconsRef.current,
        {
          opacity: 0,
          y: -8,
          scale: 0.95,
          duration: 0.3,
          stagger: 0.05,
        },
        "-=0.4",
      );
    }
  }, [isOpen]);

  return (
    <>
      {/* Menu Toggle Button */}
      {!isOpen && (
        <button
          className="fixed top-2 right-2 z-50 transition"
          onClick={() => setIsOpen(true)}
        >
          ☰ Menu
        </button>
      )}
      {/* Full-Screen Menu */}
      <div
        ref={menuRef}
        className="fixed top-0 left-0 z-50 h-full w-full bg-background/78 text-foreground transform -translate-y-full transition-transform duration-500 backdrop-blur-xl p-10 opacity-0 items-center"
      >
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-foreground hover:text-gray-400 transition"
          onClick={() => setIsOpen(false)}
        >
          <X size={32} />
        </button>

        {/* 4 Sections Menu Items */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-5xl text-left">
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-4">
              <h3 className="text-xl font-bold">{section.title}</h3>
              <ul className="space-y-2">
                {section.items.map((item, index) => {
                  const refIndex = sectionIndex * section.items.length + index;
                  return (
                    <li
                      key={item.name}
                      ref={(el) => {
                        if (el) {
                          menuItemsRef.current[refIndex] = el;
                        }
                      }}
                      className="text-lg hover:text-gray-400 transition-colors cursor-pointer"
                    >
                      <Link href={item.link} onClick={() => setIsOpen(false)}>
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Media Links */}
        <div className="mt-12 flex space-x-6">
          {socialLinks.map((social, index) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              aria-label={social.name}
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
              ref={(el) => {
                if (el) {
                  socialIconsRef.current[index] = el; // Properly accessing index
                }
              }}
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="absolute bottom-6 text-sm text-foreground">
          © {new Date().getFullYear()} Simulasi Studio. All rights reserved.
        </p>
        <div className="absolute bottom-6 right-4 flex items-center gap-2 ">
          <ul className="space-y-2">
            {extraLinks.items.map((item) => (
              <li
                key={item.name}
                className="text-sm hover:text-gray-400 transition-colors cursor-pointer"
              >
                <Link href={item.link} onClick={() => setIsOpen(false)}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <RGBBackground />
      </div>
    </>
  );
}
