"use client";
import React, { useEffect, useState, JSX } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { BsPalette2 } from "react-icons/bs";

// Declare the theme types
type Theme = "light" | "dark" | "red" | "green" | "blue";

// Map the theme to its corresponding icon
const themeIcons: Record<Theme, JSX.Element> = {
  light: (
    <SunIcon className="w-6 h-6 text-yellow-500 hover:opacity-80 transition-opacity duration-200" />
  ),
  dark: (
    <MoonIcon className="w-6 h-6 text-gray-300 hover:opacity-80 transition-opacity duration-200" />
  ),
  red: (
    <BsPalette2 className="w-6 h-6 text-red-500 hover:opacity-80 transition-opacity duration-200" />
  ),
  green: (
    <BsPalette2 className="w-6 h-6 text-green-500 hover:opacity-80 transition-opacity duration-200" />
  ),
  blue: (
    <BsPalette2 className="w-6 h-6 text-blue-500 hover:opacity-80 transition-opacity duration-200" />
  ),
};

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>("light");

  // Function to update the CSS variable dynamically
  const updateThemeColor = (theme: Theme) => {
    switch (theme) {
      case "light":
        document.documentElement.style.setProperty(
          "--theme-primary-color",
          "#191919",
        );
        break;
      case "dark":
        document.documentElement.style.setProperty(
          "--theme-primary-color",
          "#fefdfa",
        );
        break;
      case "red":
        document.documentElement.style.setProperty(
          "--theme-primary-color",
          "#FF0000",
        );
        break;
      case "green":
        document.documentElement.style.setProperty(
          "--theme-primary-color",
          "##009900",
        );
        break;
      case "blue":
        document.documentElement.style.setProperty(
          "--theme-primary-color",
          "#0000FF",
        );
        break;
      default:
        document.documentElement.style.setProperty(
          "--theme-primary-color",
          "#f1c40f",
        ); // Default to light
    }
  };

  // Initialize theme from localStorage or default to light
  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as Theme) || "light";
    setTheme(savedTheme);
    updateThemeColor(savedTheme); // Set the theme color on load
    document.documentElement.className = savedTheme;
  }, []);

  // Cycle through themes
  const toggleTheme = () => {
    const themes: Theme[] = ["light", "dark", "red", "green", "blue"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length; // Loop back to 0 when we reach the end
    const nextTheme = themes[nextIndex];
    setTheme(nextTheme);
    updateThemeColor(nextTheme); // Update the theme color dynamically
    document.documentElement.className = nextTheme;
    localStorage.setItem("theme", nextTheme); // Save theme choice to localStorage
  };

  return (
    <div className="fixed top-4 left-4 z-10">
      <button
        onClick={toggleTheme}
        className="hover:bg-opacity-80 transition-colors duration-200 cursor-pointer"
      >
        {themeIcons[theme]}
      </button>
    </div>
  );
}
