// src/components/ScrollableContainer.tsx
import React, { useState, useEffect, useRef, ReactNode } from "react";

interface ScrollableContainerProps {
  children: ReactNode;
  className?: string; // Optional CSS class for the container
  id?: string; // Optional ID for the container
}

const ScrollableContainer: React.FC<ScrollableContainerProps> = ({
  children,
  className = "",
  id,
}) => {
  const [scrollbarHidden, setScrollbarHidden] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateScrollbarVisibility = () => {
      if (!containerRef.current) return;

      const element = containerRef.current;
      const hasVerticalScroll = element.scrollHeight > element.clientHeight;
      const hasHorizontalScroll = element.scrollWidth > element.clientWidth;
      const shouldHideScrollbar = !(hasVerticalScroll || hasHorizontalScroll);

      setScrollbarHidden(shouldHideScrollbar);
    };

    updateScrollbarVisibility(); // Initial check

    const resizeObserver = new ResizeObserver(updateScrollbarVisibility);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    const mutationObserver = new MutationObserver(updateScrollbarVisibility);
    if (containerRef.current) {
      mutationObserver.observe(containerRef.current, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    // Clean up the observer on unmount
    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <div
      id={id}
      ref={containerRef}
      className={`
        overflow-auto
        ${scrollbarHidden ? "scrollbar-hidden" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default ScrollableContainer;
