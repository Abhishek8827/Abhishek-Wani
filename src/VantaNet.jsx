import React, { useEffect, useRef } from "react";

const VantaNet = ({ theme, opacity = 1.0, hero = false }) => {
  const containerRef = useRef(null);
  const vantaRef = useRef(null);

  // Convert hex (#rrggbb) to number (0xrrggbb)
  const hexToNum = (hex) => parseInt(hex.replace("#", ""), 16);

  useEffect(() => {
    let canceled = false;

    (async () => {
      const THREE = (await import("three")).default || (await import("three"));
      const NET = (await import("vanta/dist/vanta.net.min")).default;

      if (!containerRef.current || canceled) return;

      const isDark = theme?.mode === "dark";

      // theme colors tuned for your design
      const primary = isDark ? "#7c3aed" : "#6366f1";      // violet/indigo
      const bg = isDark ? "#0a0a0f" : "#f8fafc";           // background

      vantaRef.current = NET({
        el: containerRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        scale: 1.0,
        scaleMobile: 1.0,

        backgroundColor: hexToNum(bg),
        color: hexToNum(primary),

        // NET fine-tuned options
        points: Math.floor(14 * opacity) + 8,     // node count
        maxDistance: 22 * opacity,                // line linking distance
        spacing: 18 * opacity,                    // grid spacing
        showDots: true,
      });
    })();

    return () => {
      canceled = true;
      if (vantaRef.current) vantaRef.current.destroy();
    };
  }, [theme, opacity, hero]);

  const style = hero
    ? {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: -2,
      }
    : {
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: -2,
      };

  return <div ref={containerRef} style={style} />;
};

export default VantaNet;
