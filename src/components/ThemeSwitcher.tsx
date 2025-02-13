"use client";
import React, { useEffect, useState, useCallback, JSX } from "react";
import { BsPalette2 } from "react-icons/bs";

// --- Theme Definitions ---

type ThemeName = "light" | "dark" | "red" | "green" | "blue";

const themeIcons: Record<ThemeName, JSX.Element> = {
  light: (
    <BsPalette2 className="w-5 h-5 text-yellow-500 hover:opacity-80 transition-opacity duration-200" />
  ),
  dark: (
    <BsPalette2 className="w-5 h-5 text-gray-300 hover:opacity-80 transition-opacity duration-200" />
  ),
  red: (
    <BsPalette2 className="w-5 h-5 text-red-500 hover:opacity-80 transition-opacity duration-200" />
  ),
  green: (
    <BsPalette2 className="w-5 h-5 text-green-500 hover:opacity-80 transition-opacity duration-200" />
  ),
  blue: (
    <BsPalette2 className="w-5 h-5 text-blue-500 hover:opacity-80 transition-opacity duration-200" />
  ),
};

// --- Component ---

export default function ThemeSwitcher() {
  const [currentTheme, setTheme] = useState<ThemeName>("light");

  // Update the CSS variable for the primary theme color.
  const updateThemeColor = useCallback((theme: ThemeName) => {
    const colorMap: Record<ThemeName, string> = {
      light: "#191919",
      dark: "#fefdfa",
      red: "#FF0000",
      green: "#009900",
      blue: "#0000FF",
    };

    document.documentElement.style.setProperty(
      "--theme-primary-color",
      colorMap[theme] || "#191919",
    ); // Default to light
  }, []);

  // Load the saved theme from localStorage on component mount.
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("theme") as ThemeName | null;
      const validThemes: ThemeName[] = [
        "light",
        "dark",
        "red",
        "green",
        "blue",
      ];

      // Validate the saved theme, or default to "light".
      const initialTheme =
        savedTheme && validThemes.includes(savedTheme) ? savedTheme : "light";

      setTheme(initialTheme);
      updateThemeColor(initialTheme);
      document.documentElement.className = initialTheme; // Apply class for immediate styling
    } catch (error) {
      console.error("Error loading theme from localStorage:", error);
      // Fallback to light theme if localStorage fails.
      setTheme("light");
      updateThemeColor("light");
      document.documentElement.className = "light";
    }
  }, [updateThemeColor]); //  Dependency on updateThemeColor (important for useCallback)

  // Toggle to the next theme in the sequence.
  const toggleTheme = useCallback(() => {
    const themes: ThemeName[] = ["light", "dark", "red", "green", "blue"];
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];

    try {
      localStorage.setItem("theme", nextTheme);
      setTheme(nextTheme);
      updateThemeColor(nextTheme);
      document.documentElement.className = nextTheme;
    } catch (error) {
      console.error("Error saving theme to localStorage:", error);
      //  Optionally show a message to the user.
    }
  }, [currentTheme, updateThemeColor]); // Dependencies for useCallback

  return (
    <div className="fixed top-2 left-2 z-20">
      <button
        onClick={toggleTheme}
        className="hover:bg-opacity-80 transition-colors duration-200 cursor-pointer"
        aria-label={`Switch to ${currentTheme} theme`}
        title={`Switch to ${currentTheme} theme`}
      >
        {themeIcons[currentTheme]}
      </button>
    </div>
  );
}
