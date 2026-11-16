import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";

const steps = [
  {
    name: "Poznajmy się",
    title: "Najpierw rozmowa",
    text: "Powiedz nam, ile lat ma dziecko i która sala jest Wam po drodze. Wspólnie wybierzemy grupę i ustalimy termin pierwszej wizyty.",
    detail: "515 100 603 · zapisy przez cały rok",
  },
  {
    name: "Wejdź na matę",
    title: "Nie musisz umieć judo",
    text: "Wygodny strój, woda i trochę ciekawości. Na początku poznajesz trenera, salę i zasady wspólnego treningu. Na technikę przyjdzie czas.",
    detail: "Na macie ćwiczymy boso",
  },
  {
    name: "Znajdź swój rytm",
    title: "Dalej trenujemy razem",
    text: "Trener pomoże dobrać grupę do wieku i doświadczenia. Kolejne zajęcia to czas na naukę, kolegów i własne małe postępy.",
    detail: "Każdy zaczyna od pierwszych zajęć",
  },
];

// A single flat ribbon loops into an obi knot. It illustrates joining the club,
// rather than a grading scale or instructions for a judo technique.
const ribbon =
  "M 72 306 C 174 306 168 180 278 168 C 369 158 467 185 457 253 C 448 311 334 315 303 269 C 267 215 370 187 431 221 C 484 250 507 306 636 306";
const restingProgress = [0.12, 0.57, 1];

export default function DojoJourney({ onJoin }: { onJoin: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const markerRef = useRef<SVGGElement>(null);
  const maskRef = useRef<SVGPathElement>(null);
  const [step, setStep] = useState(0);
  const [manualMode, setManualMode] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!section) return;
    let frame = 0;
    const usesManualMode = () =>
      preference.matches ||
      window.innerHeight < (window.innerWidth <= 640 ? 800 : 880);

    function draw(progress: number) {
      const path = pathRef.current;
      if (!path) return;
      const visible = 0.08 + progress * 0.92;
      maskRef.current?.setAttribute("stroke-dashoffset", String(1 - visible));
      const point = path.getPointAtLength(path.getTotalLength() * visible);
      markerRef.current?.setAttribute(
        "transform",
        `translate(${point.x} ${point.y})`,
      );
      section!.style.setProperty("--journey-progress", String(visible));
      section!.style.setProperty(
        "--knot-opacity",
        String(Math.min(1, Math.max(0, (progress - 0.58) / 0.18))),
      );
    }

    function update() {
      frame = 0;
      if (usesManualMode()) return;
      const rect = section!.getBoundingClientRect();
      const stickyTop = window.innerWidth <= 640 ? 72 : 88;
      const travel = Math.max(1, rect.height - window.innerHeight + stickyTop);
      const progress = Math.min(
        1,
        Math.max(0, (stickyTop - rect.top) / travel),
      );
      draw(progress);
      setStep(progress < 0.3 ? 0 : progress < 0.7 ? 1 : 2);
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    function preferenceChanged() {
      const manual = usesManualMode();
      setManualMode(manual);
      if (manual) {
        draw(1);
        setStep(0);
        const path = pathRef.current;
        if (path) {
          const point = path.getPointAtLength(
            path.getTotalLength() * restingProgress[0],
          );
          markerRef.current?.setAttribute(
            "transform",
            `translate(${point.x} ${point.y})`,
          );
        }
      } else schedule();
    }

    preferenceChanged();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", preferenceChanged);
    preference.addEventListener("change", preferenceChanged);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", preferenceChanged);
      preference.removeEventListener("change", preferenceChanged);
    };
  }, []);

  function selectStep(index: number) {
    if (manualMode) {
      setStep(index);
      const path = pathRef.current;
      if (path) {
        const point = path.getPointAtLength(
          path.getTotalLength() * restingProgress[index],
        );
        markerRef.current?.setAttribute(
          "transform",
          `translate(${point.x} ${point.y})`,
        );
      }
      return;
    }
    const section = sectionRef.current;
    if (!section) return;
    const stickyTop = window.innerWidth <= 640 ? 72 : 88;
    const travel = section.offsetHeight - window.innerHeight + stickyTop;
    const top =
      section.getBoundingClientRect().top + window.scrollY - stickyTop;
    window.scrollTo({
      top: top + travel * [0, 0.5, 0.98][index],
      behavior: "smooth",
    });
  }

  return (
    <section
      className="dojo-journey"
      ref={sectionRef}
      id="pierwszy-trening"
      data-static={manualMode}
      aria-labelledby="journey-title"
    >
      <div className="journey-sticky">
        <div className="shell journey-shell">
          <div className="journey-heading">
            <div>
              <p className="journey-eyebrow">Od telefonu do tatami</p>
              <h2 id="journey-title">
                Pierwszy trening.
                <br />
                Bez niewiadomych.
              </h2>
            </div>
            <p className="journey-instruction">
              <ArrowDown />
              Przewijaj i poznaj kolejne kroki
            </p>
          </div>
          <div className="journey-layout">
            <div className="obi-canvas">
              <div className="obi-canvas-meta">
                <span>Obi / pas judo</span>
                <span>Polonia Rybnik</span>
              </div>
              <svg
                className="obi-illustration"
                viewBox="0 100 720 300"
                aria-hidden="true"
              >
                <defs>
                  <mask
                    id="obi-draw-mask"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="720"
                    height="440"
                  >
                    <path
                      ref={maskRef}
                      d={ribbon}
                      fill="none"
                      stroke="white"
                      strokeWidth="40"
                      pathLength="1"
                      strokeDasharray="1"
                      strokeDashoffset="0.92"
                    />
                  </mask>
                </defs>
                <path className="obi-guide" d={ribbon} ref={pathRef} />
                <g mask="url(#obi-draw-mask)">
                  <path className="obi-edge" d={ribbon} />
                  <path className="obi-band" d={ribbon} />
                  <path className="obi-seam-edge" d={ribbon} />
                  <path className="obi-seam-inner" d={ribbon} />
                  <path
                    className="obi-label"
                    d="M 84 289 L 98 286 L 104 315 L 90 319 Z"
                  />
                </g>
                <g className="obi-knot-group">
                  <path
                    className="obi-knot"
                    d="M 414 205 L 458 220 L 447 253 L 405 238 Z"
                  />
                  <path
                    className="obi-knot-seam"
                    d="M 420 215 L 447 224 M 415 232 L 442 242"
                  />
                </g>
                <g
                  ref={markerRef}
                  className="obi-marker"
                  transform="translate(72 306)"
                >
                  <circle r="8" />
                  <circle r="2" />
                </g>
                <text x="66" y="365" className="obi-note">
                  Pierwszy kontakt
                </text>
                <text x="604" y="365" className="obi-note" textAnchor="end">
                  Wspólna mata
                </text>
              </svg>
              <div className="obi-caption">
                <span>Każdy pas zaczyna się od jednego ruchu</span>
                <span className="obi-signature">RYB / 1991</span>
              </div>
            </div>
            <div className="journey-copy">
              <div className="journey-count">
                <span>0{step + 1}</span>
                <span>/ 03</span>
              </div>
              <div
                className="journey-step-copy"
                key={step}
                id="journey-step"
                role="tabpanel"
                aria-labelledby={`journey-tab-${step}`}
              >
                <h3>{steps[step].title}</h3>
                <p>{steps[step].text}</p>
                <span className="journey-detail">{steps[step].detail}</span>
              </div>
              <div
                className="journey-tabs"
                role="tablist"
                aria-label="Kroki przed pierwszym treningiem"
              >
                {steps.map((item, index) => (
                  <button
                    id={`journey-tab-${index}`}
                    key={item.name}
                    role="tab"
                    aria-selected={step === index}
                    aria-controls="journey-step"
                    tabIndex={step === index ? 0 : -1}
                    onClick={() => selectStep(index)}
                    onKeyDown={(event) => {
                      if (
                        [
                          "ArrowRight",
                          "ArrowDown",
                          "ArrowLeft",
                          "ArrowUp",
                          "Home",
                          "End",
                        ].includes(event.key)
                      ) {
                        event.preventDefault();
                        const next =
                          event.key === "Home"
                            ? 0
                            : event.key === "End"
                              ? 2
                              : (index +
                                  (["ArrowLeft", "ArrowUp"].includes(event.key)
                                    ? 2
                                    : 1)) %
                                3;
                        selectStep(next);
                        document
                          .getElementById(`journey-tab-${next}`)
                          ?.focus({ preventScroll: true });
                      }
                    }}
                  >
                    <span>0{index + 1}</span>
                    {item.name}
                    <span className="journey-tab-mark" aria-hidden="true" />
                  </button>
                ))}
              </div>
              <button className="journey-join" onClick={onJoin}>
                Porozmawiajmy o pierwszych zajęciach
                <ArrowUpRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
