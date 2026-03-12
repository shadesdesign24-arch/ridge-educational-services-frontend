import React, { useEffect, useRef } from "react";
import { animate, scroll, cubicBezier } from "framer-motion";
import { LOGO_URL, LOGO_NIGHT_URL } from "./constants";

// Dynamically import all images from assets/res-colleges
const collegeLogos = import.meta.glob("./assets/res-colleges/*.{png,jpg,jpeg,svg}", { eager: true, import: 'default' });
const collegeLogoUrls = Object.values(collegeLogos) as string[];

const Partners: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
    const triggerRef = useRef<HTMLDivElement>(null);
    const scalerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const logoRef = useRef<HTMLImageElement>(null);
    const layerRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) {
            layerRefs.current.forEach((l) => { if (l) l.style.opacity = "1"; });
            return;
        }

        const firstSection = triggerRef.current;
        const scalerInner = scalerRef.current;
        const textElement = textRef.current;
        const logoElement = logoRef.current;

        if (!firstSection || !scalerInner) return;

        // Measurement for the "zoom-out" effect
        const naturalWidth = scalerInner.offsetWidth;
        const naturalHeight = scalerInner.offsetHeight;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // 1. Container Animation (Viewport -> Card)
        scroll(
            animate(
                scalerInner,
                {
                    width: [`${viewportWidth}px`, `${naturalWidth}px`],
                    height: [`${viewportHeight}px`, `${naturalHeight}px`],
                    borderRadius: ["0rem", "3rem"],
                    padding: ["10vh", "3rem"],
                },
                {
                    width: { ease: cubicBezier(0.65, 0, 0.35, 1) },
                    height: { ease: cubicBezier(0.42, 0, 0.58, 1) },
                    borderRadius: { ease: "linear" },
                }
            ),
            {
                target: firstSection,
                offset: ["start start", "60% end"],
            }
        );

        // 2. Text Animation (Stable Scale + Subtle Move)
        if (textElement) {
            scroll(
                animate(
                    textElement,
                    {
                        y: [-80, 0],
                        scale: [2, 1],
                        opacity: [1, 1],
                    },
                    { ease: cubicBezier(0.42, 0, 0.58, 1) }
                ),
                {
                    target: firstSection,
                    offset: ["start start", "60% end"],
                }
            );
        }

        // 3. Logo Animation
        if (logoElement) {
            scroll(
                animate(
                    logoElement,
                    {
                        scale: [0.4, 0.85],
                    },
                    { ease: cubicBezier(0.42, 0, 0.58, 1) }
                ),
                {
                    target: firstSection,
                    offset: ["start start", "60% end"],
                }
            );
        }

        // 4. Surrounding Layers Animation
        const scaleEasings = [
            cubicBezier(0.42, 0, 0.58, 1),
            cubicBezier(0.76, 0, 0.24, 1),
            cubicBezier(0.87, 0, 0.13, 1),
        ];

        layerRefs.current.forEach((layer, index) => {
            if (!layer) return;
            const endPoint = 0.75 + index * 0.05;

            scroll(
                animate(
                    layer,
                    { opacity: [0, 0, 1] },
                    { times: [0, 0.4, 1], ease: "easeOut" }
                ),
                {
                    target: firstSection,
                    offset: ["start start", `${endPoint} end`],
                }
            );

            scroll(
                animate(
                    layer,
                    { scale: [0.2, 0.2, 1] },
                    { times: [0, 0.3, 1], ease: scaleEasings[index] }
                ),
                {
                    target: firstSection,
                    offset: ["start start", `${endPoint} end`],
                }
            );
        });
    }, []);

    // Distribute logos across layers 
    const layer1Logos = collegeLogoUrls.slice(0, 6);
    const layer2Logos = collegeLogoUrls.slice(6, 12);
    const layer3Logos = collegeLogoUrls.slice(12, 14);

    return (
        <div id="partners">
            <style>{`
        .content-wrap {
          overflow: clip;
        }
        .scroll-section {
          min-height: 400vh;
        }
        .sticky-content {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          place-items: center;
          position: sticky;
          top: 0;
          overflow: hidden;
        }
        
        /* Enhanced Pattern Backgrounds - Matching Hero Section */
        .pattern-container {
            position: absolute;
            inset: 0;
            pointer-events: none;
            z-index: 0;
        }
        
        /* Light Mode Pattern - White background with brighter texture */
        .light-pattern-layer {
            position: absolute;
            inset: 0;
            background-color: #b0a895ff;
        }
        
        .light-glow-layer {
            position: absolute;
            inset: 0;
            background: 
                radial-gradient(circle at 20% 30%, rgba(229, 160, 26, 0.25) 0%, transparent 60%),
                radial-gradient(circle at 80% 70%, rgba(229, 160, 26, 0.15) 0%, transparent 60%);
        }
        
        .light-texture-layer {
            position: absolute;
            inset: 0;
            opacity: 1.5;
            background-image: url("https://www.transparenttextures.com/patterns/cubes.png");
            color: #001f39ff;
            background-blend-mode: multiply;
        }
        
        /* Dark Mode Pattern - Dark background with brighter texture */
        .dark-pattern-layer {
            position: absolute;
            inset: 0;
            background-color: #041731ff;
        }
        
        .dark-glow-layer {
            position: absolute;
            inset: 0;
            background: 
                radial-gradient(circle at 20% 30%, rgba(1, 22, 58, 0.32) 0%, transparent 60%),
                radial-gradient(circle at 80% 70%, rgba(183, 136, 44, 0.1) 0%, transparent 60%);
        }
        
        .dark-texture-layer {
            position: absolute;
            inset: 0;
            opacity: 0.1;
            background-image: url("https://www.transparenttextures.com/patterns/cubes.png");
        }

        .grid-container {
          --offset: 0;
          --container-width: 1400px;
          --gap: clamp(20px, 5vw, 100px);
          width: var(--container-width);
          max-width: calc(100% - 4rem);
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          grid-template-rows: repeat(3, auto);
          gap: var(--gap);
          margin: 0 auto;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        @media (max-width: 900px) {
          .grid-container {
            grid-template-columns: repeat(3, 1fr);
            --offset: -1;
          }
          .layer-1 { display: none; }
        }
        .layer {
          display: grid;
          grid-column: 1 / -1;
          grid-row: 1 / -1;
          grid-template-columns: subgrid;
          grid-template-rows: subgrid;
          opacity: 0;
          pointer-events: none;
        }
        .layer-1 div:nth-of-type(odd) { grid-column: 1; }
        .layer-1 div:nth-of-type(even) { grid-column: -2; }
        .layer-2 div:nth-of-type(odd) { grid-column: calc(2 + var(--offset)); }
        .layer-2 div:nth-of-type(even) { grid-column: calc(-3 - var(--offset)); }
        .layer-3 div:first-of-type { grid-column: calc(3 + var(--offset)); grid-row: 1; }
        .layer-3 div:last-of-type { grid-column: calc(3 + var(--offset)); grid-row: -1; }

        .logo-card {
          width: 100%;
          aspect-ratio: 4 / 3;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: white;
          border-radius: 2rem;
          box-shadow: 0 10px 40px rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.05);
        }
        .dark .logo-card {
            background: rgba(30, 41, 59, 0.7);
            border-color: rgba(255, 255, 255, 0.1);
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        }
        .logo-card img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .scaler-wrapper {
          position: relative;
          grid-area: 2 / calc(3 + var(--offset));
          z-index: 10;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .scaler-inner {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 3rem;
          border-radius: 3rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 30px 60px rgba(0,0,0,0.12);
          width: 100%;
          height: 100%;
          z-index: 20;
        }
        .dark .scaler-inner {
            background: #0f172a;
            border: 1px solid rgba(255,255,255,0.1);
            box-shadow: 0 30px 60px rgba(0,0,0,0.4);
        }
      `}</style>

            <div className="content-wrap relative transition-colors duration-500">
                {/* Background Pattern Container - Matching Hero Section */}
                <div className="pattern-container">
                    {/* Light Mode: White background with radial gradients and texture */}
                    <div className="absolute inset-0 dark:hidden">
                        <div className="light-pattern-layer"></div>
                        <div className="light-glow-layer"></div>
                        <div className="light-texture-layer"></div>
                    </div>
                    
                    {/* Dark Mode: Dark background with radial gradients and texture */}
                    <div className="absolute inset-0 hidden dark:block">
                        <div className="dark-pattern-layer"></div>
                        <div className="dark-glow-layer"></div>
                        <div className="dark-texture-layer"></div>
                    </div>
                </div>

                <main>
                    <section ref={triggerRef} className="scroll-section">
                        <div className="sticky-content">
                            <div className="grid-container">
                                {/* Layers */}
                                <div className="layer layer-1" ref={(el) => (layerRefs.current[0] = el)}>
                                    {layer1Logos.map((url, i) => (
                                        <div key={`l1-${i}`} className="logo-card"><img src={url} alt={`College ${i}`} /></div>
                                    ))}
                                </div>
                                <div className="layer layer-2" ref={(el) => (layerRefs.current[1] = el)}>
                                    {layer2Logos.map((url, i) => (
                                        <div key={`l2-${i}`} className="logo-card"><img src={url} alt={`College ${i + 6}`} /></div>
                                    ))}
                                </div>
                                <div className="layer layer-3" ref={(el) => (layerRefs.current[2] = el)}>
                                    {layer3Logos.map((url, i) => (
                                        <div key={`l3-${i}`} className="logo-card"><img src={url} alt={`College ${i + 12}`} /></div>
                                    ))}
                                </div>

                                {/* Center scaler (RES Logo) */}
                                <div className="scaler-wrapper">
                                    <div className="scaler-inner" ref={scalerRef}>
                                        <h5
                                            ref={textRef}
                                            className="text-[#E5A01A] font-black tracking-[0.2em] uppercase text-sm mb-6 text-center opacity-100"
                                            style={{ transformOrigin: 'top center' }}
                                        >
                                            Associated Partners
                                        </h5>
                                        <img
                                            ref={logoRef}
                                            src={isDarkMode ? LOGO_NIGHT_URL : LOGO_URL}
                                            alt="Ridge Educational Logo"
                                            className="w-[80%] h-auto object-contain"
                                            style={{ transformOrigin: 'center center' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default Partners;
