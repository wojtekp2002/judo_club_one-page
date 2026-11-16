import { useEffect } from "react";

export default function usePageMotion() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(
      (entries) => {
        if (preference.matches) return;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const image = entry.target.getAttribute("data-reveal") === "image";
          const animation = entry.target.animate(
            image
              ? [
                  { clipPath: "inset(0 0 100% 0)" },
                  { clipPath: "inset(0 0 0% 0)" },
                ]
              : [
                  { opacity: 0.35, transform: "translateY(12px)" },
                  { opacity: 1, transform: "translateY(0)" },
                ],
            {
              duration: image ? 850 : 560,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            },
          );
          animations.add(animation);
          animation.finished
            .then(() => animations.delete(animation))
            .catch(() => {});
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.18 },
    );
    document
      .querySelectorAll("[data-reveal]")
      .forEach((element) => observer.observe(element));

    function update() {
      frame = 0;
      const length = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty(
        "--page-progress",
        String(Math.max(0, Math.min(1, window.scrollY / Math.max(1, length)))),
      );
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    function reduceMotion() {
      if (preference.matches)
        for (const animation of animations) animation.cancel();
    }
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    preference.addEventListener("change", reduceMotion);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      for (const animation of animations) animation.cancel();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      preference.removeEventListener("change", reduceMotion);
      document.documentElement.style.removeProperty("--page-progress");
    };
  }, []);
}
