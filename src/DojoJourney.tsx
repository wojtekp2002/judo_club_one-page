import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

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

// A stitched obi marks the visitor's chosen step, independently of page scroll.
const ribbon =
  "M 72 306 C 174 306 168 180 278 168 C 369 158 467 185 457 253 C 448 311 334 315 303 269 C 267 215 370 187 431 221 C 484 250 507 306 636 306";
const restingProgress = [0.12, 0.57, 1];

export default function DojoJourney({ onJoin }: { onJoin: () => void }) {
  const pathRef = useRef<SVGPathElement>(null);
  const markerRef = useRef<SVGGElement>(null);
  const progressRef = useRef(restingProgress[0]);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const length = path.getTotalLength();
    const start = progressRef.current;
    const target = restingProgress[step];
    const started = performance.now();
    let frame = 0;
    function draw(progress: number) {
      progressRef.current = progress;
      const point = path!.getPointAtLength(length * progress);
      markerRef.current?.setAttribute(
        "transform",
        `translate(${point.x} ${point.y})`,
      );
    }
    function animate(now: number) {
      const elapsed = Math.min(1, (now - started) / 440);
      draw(start + (target - start) * (1 - (1 - elapsed) ** 3));
      if (elapsed < 1) frame = requestAnimationFrame(animate);
    }
    function reduceMotion() {
      if (preference.matches) {
        cancelAnimationFrame(frame);
        draw(target);
      }
    }
    if (preference.matches || start === target) draw(target);
    else frame = requestAnimationFrame(animate);
    preference.addEventListener("change", reduceMotion);
    return () => {
      cancelAnimationFrame(frame);
      preference.removeEventListener("change", reduceMotion);
    };
  }, [step]);

  function selectStep(index: number) {
    setStep(index);
  }

  return (
    <section
      className="dojo-journey"
      id="pierwszy-trening"
      aria-labelledby="journey-title"
    >
      <div className="journey-panel">
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
              Wybierz krok. We własnym tempie.
            </p>
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
                <span className="journey-tab-label">{item.name}</span>
                <span className="journey-tab-mark" aria-hidden="true" />
              </button>
            ))}
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
                <path className="obi-guide" d={ribbon} ref={pathRef} />
                <g>
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
