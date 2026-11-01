"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = { className?: string; children: ReactNode };

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const range = (t: number, [a, b]: readonly [number, number]) => clamp((t - a) / (b - a));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeBack = (t: number) => {
  const c = 1.7;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};

/*
 * Timeline over the whole section: t = 0 when its top enters the bottom of
 * the screen, t = 1 when the pinned part ends.
 */
const T = {
  words: [0.08, 0.3], //       headline appears word by word
  pills: [0.3, 0.52], //       doubt pills pop in one by one
  //                            0.52 – 0.58: everything visible, rest
  gather: [0.58, 0.74], //     pills fly together into one messy pile
  wordsOut: [0.58, 0.68], //   headline fades away meanwhile
  //                            0.74: pile complete -> the hand video plays (time-based,
  //                            not scroll-based) and flicks the pile off to the left
  reset: 0.7, //                scrolling back above this resets the hand + pile
} as const;
const POP = 0.03;

/** Where the pile gathers, as a fraction of the stage height (vertical centre). */
const PILE_Y = 0.5;

/* Hand video (public/videos/hand-flick.mp4), in seconds of the clip. */
const FLICK = 1.47; //   fingers release
const THROW = 0.7; //    how long the pile takes to leave the screen
const HAND_OUT = 1.85; // hand starts fading out

/** Small, stable per-pill offsets so the pile looks tossed together. */
const pileJitter = (i: number) => ({
  x: Math.sin(i * 12.9898) * 26,
  y: Math.cos(i * 78.233) * 18,
  rotate: Math.sin(i * 3.7) * 14,
});

export default function DoubtsScroller({ className, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = ref.current;
    const section = stage?.closest("section");
    if (!stage || !section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const words = Array.from(stage.querySelectorAll<HTMLElement>("[data-word]"));
    const pills = Array.from(stage.querySelectorAll<HTMLElement>("[data-doubt]"));
    const heading = stage.querySelector<HTMLElement>("h2");
    const eyebrow = stage.querySelector<HTMLElement>("[data-eyebrow]");
    const hand = stage.querySelector<HTMLVideoElement>("video[data-hand]");
    stage.dataset.animated = "true";

    // Hand sequence state. clipTime() follows the real video so the throw lands
    // exactly on the flick; if the video can't play it falls back to a clock.
    let handStarted = 0;
    let videoPlaying = false;
    const clipTime = () =>
      !handStarted ? 0 : videoPlaying && hand ? hand.currentTime : (performance.now() - handStarted) / 1000;

    // The hand plays on its own clock; scrolling stays free meanwhile.
    let handDone = false;

    const startHand = () => {
      handStarted = performance.now();
      videoPlaying = false;
      if (!hand) return;
      hand.dataset.state = "in";
      hand.currentTime = 0;
      hand
        .play()
        .then(() => (videoPlaying = true))
        .catch(() => (videoPlaying = false));
    };

    const resetHand = () => {
      handDone = false;
      handStarted = 0;
      videoPlaying = false;
      if (!hand) return;
      hand.pause();
      hand.currentTime = 0;
      delete hand.dataset.state;
    };

    // Distance from each pill's resting spot to the centre of the stage.
    let toCenter: { x: number; y: number }[] = [];
    let throwDistance = 0;
    const measure = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      toCenter = pills.map((p) => ({
        x: w / 2 - (p.offsetLeft + p.offsetWidth / 2),
        y: h * PILE_Y - (p.offsetTop + p.offsetHeight / 2),
      }));
      const widest = Math.max(0, ...pills.map((p) => p.offsetWidth));
      throwDistance = w / 2 + widest + 120;
    };

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let frame = 0;
    let inView = false;
    let lastT: number | null = null;

    const render = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const rawT = (window.innerHeight - rect.top) / rect.height;
      const t = clamp(rawT);

      if (!handStarted && t >= T.gather[1]) {
        if (lastT !== null && lastT < T.gather[1]) {
          // Scrolled down past the full pile: the hand plays it out while the
          // page keeps scrolling.
          startHand();
        } else {
          // Arrived from elsewhere (reload, link): just show the end state.
          startHand();
          handStarted -= 10_000;
          videoPlaying = false;
          hand?.pause();
        }
      } else if (handStarted && t < T.reset) resetHand();
      lastT = t;
      const clip = clipTime();
      if (hand && handStarted && clip >= HAND_OUT) hand.dataset.state = "out";
      if (handStarted && clip >= HAND_OUT + 0.3) handDone = true;

      // Headline: words appear in turn, then the whole headline fades out.
      const wordsOut = easeInOut(range(t, T.wordsOut));
      const wSpan = (T.words[1] - T.words[0]) / words.length;
      words.forEach((w, i) => {
        const k = easeOut(clamp((t - T.words[0] - i * wSpan) / (wSpan * 2.2)));
        w.style.opacity = String(0.08 + 0.92 * k);
        w.style.transform = `translateY(${(1 - k) * 0.35}em)`;
      });
      if (heading) {
        heading.style.opacity = String(1 - wordsOut);
        heading.style.transform = `scale(${1 - 0.06 * wordsOut})`;
        heading.style.filter = wordsOut > 0 ? `blur(${wordsOut * 6}px)` : "";
      }
      if (eyebrow) eyebrow.style.opacity = String(range(t, [T.words[0], T.words[0] + 0.06]) * (1 - wordsOut));

      // Pills: pop in, drift toward the mouse, gather into a pile, get thrown left.
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;
      const gather = easeInOut(range(t, T.gather));
      const parallax = 1 - gather;
      const pSpan = (T.pills[1] - T.pills[0] - POP) / Math.max(1, pills.length - 1);

      pills.forEach((pill, i) => {
        const pop = clamp((t - T.pills[0] - i * pSpan) / POP);
        // Flicked by the hand; later pills leave a moment after earlier ones.
        const lag = (i / pills.length) * 0.12;
        // A flick: full speed straight away, easing off as it leaves the screen.
        const thrown = handStarted ? easeOut(clamp((clip - FLICK - lag) / THROW)) : 0;
        const jitter = pileJitter(i);
        const depth = 6 + (i % 3) * 5;

        const x =
          mouse.x * depth * parallax +
          (toCenter[i]?.x ?? 0) * gather +
          jitter.x * gather -
          throwDistance * thrown;
        const y =
          mouse.y * depth * parallax +
          (1 - easeOut(pop)) * 40 +
          (toCenter[i]?.y ?? 0) * gather +
          jitter.y * gather -
          60 * thrown;
        const rotate = jitter.rotate * gather - 18 * thrown;
        const scale = 0.75 + 0.25 * easeBack(pop) - 0.04 * gather;

        pill.style.opacity = String(easeOut(pop));
        pill.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${scale})`;
      });

      // Keep animating while the mouse eases or the hand sequence is running.
      const easing = Math.abs(mouse.tx - mouse.x) > 0.001 || Math.abs(mouse.ty - mouse.y) > 0.001;
      const handRunning = handStarted > 0 && !handDone;
      if (inView && (easing || handRunning)) frame = requestAnimationFrame(render);
    };

    const request = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    const onResize = () => {
      measure();
      request();
    };

    const onMouse = (e: MouseEvent) => {
      if (!inView) return;
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
      request();
    };

    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) request();
    });
    visibility.observe(section);

    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouse, { passive: true });
    measure();
    render();

    return () => {
      visibility.disconnect();
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
      if (frame) cancelAnimationFrame(frame);
      hand?.pause();
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
