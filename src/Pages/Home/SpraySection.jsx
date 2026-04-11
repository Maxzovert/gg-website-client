import React, { useState } from "react";

import Heading from "../../assets/Sprayelem/Header.webp";
import AmratDhara from "../../assets/Sprayelem/AmratDhara.webp";
import ChakraBalance from "../../assets/Sprayelem/ChakraBalance.webp";
import Maitri from "../../assets/Sprayelem/Maitri.webp";
import Shuddhi from "../../assets/Sprayelem/Shuddhi.webp";

const sprays = [
  {
    bg: AmratDhara,
    tag: "Aura Spray",
    title: "Amrat Dhara",
    accent: "#2283c7",
    heading: "#1a6ba0",
    btn: "#1a6ba0",
    btnHover: "#155a8a",
    description:
      "Amrat Dhara Lavender Aura Spray surrounds your space with a soft, calming floral fragrance that eases stress and restores balance. Perfect for relaxation, meditation, or winding down after a long day, it refreshes the air and creates a peaceful, soothing atmosphere instantly.",
    align: "right",
  },
  {
    bg: ChakraBalance,
    tag: "Aura Spray",
    title: "Chakra Balance",
    accent: "#582683",
    heading: "#582683",
    btn: "#582683",
    btnHover: "#47206b",
    description:
      "ChakraBalance Gurhal Aura Spray carries the vibrant, uplifting essence of hibiscus to energize your surroundings. Its refreshing floral notes inspire positivity, emotional harmony, and inner strength, making it ideal for yoga, spiritual rituals, and mindful living.",
    align: "left",
  },
  {
    bg: Maitri,
    tag: "Aura Spray",
    title: "Maitri",
    accent: "#E27BB1",
    heading: "#c9689a",
    btn: "#E27BB1",
    btnHover: "#c9689a",
    description:
      "Maitri Lavender Aura Spray spreads gentle warmth and serenity with its comforting floral aroma. Crafted to promote calmness and emotional connection, it refreshes your environment while creating a welcoming, tranquil vibe for your home or workspace.",
    align: "right",
  },
  {
    bg: Shuddhi,
    tag: "Aura Spray",
    title: "Shuddhi",
    accent: "#597B2C",
    heading: "#486323",
    btn: "#597B2C",
    btnHover: "#486323",
    description:
      "Shuddhi Aura Spray blends the rich sweetness of mogra with the fresh elegance of kewda to purify and elevate your space. Its divine fragrance refreshes the air, enhances spiritual focus, and leaves a lasting sense of clarity and positivity.",
    align: "left",
  },
];

const SpraySection = () => {
  const [openCard, setOpenCard] = useState(null);

  return (
    <section className="relative w-full">
      <img src={Heading} alt="" className="w-full" />

      <div className="w-full px-4 py-6 xs:px-5 sm:px-6 md:px-8 md:py-10 lg:px-10">
        <header className="mx-auto mb-6 max-w-7xl text-center sm:mb-8 md:mb-10">
          <p className="text-base font-semibold uppercase tracking-[0.3em] text-neutral-500 sm:text-lg md:text-xl">
            Launching soon
          </p>
          <h2 className="spray-hero mt-2 text-2xl text-neutral-900 sm:mt-3 sm:text-3xl md:text-4xl lg:text-5xl">
            Pre-order now
          </h2>
        </header>
        {/* Mobile & small tablet: single-column list; md+: 2×2 grid */}
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:gap-5 md:grid md:grid-cols-2 md:gap-6 lg:gap-8">
          {sprays.map((item, i) => {
            const isOpen = openCard === i;

            return (
              <article
                key={item.title}
                className="group relative w-full shrink-0 overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5 md:cursor-pointer"
                onClick={() => {
                  if (typeof window !== "undefined" && window.innerWidth >= 768) return;
                  setOpenCard((v) => (v === i ? null : i));
                }}
              >
                {/* Card height follows each image’s natural aspect ratio */}
                <img
                  src={item.bg}
                  alt={item.title}
                  className="block h-auto w-full align-middle"
                  loading="lazy"
                  decoding="async"
                />

                {/* Mobile: hint on each card */}
                <p
                  className={`pointer-events-none absolute inset-x-0 bottom-0 z-1 bg-linear-to-t from-black/70 via-black/35 to-transparent px-3 pb-3 pt-10 text-center text-xs font-medium tracking-wide text-white transition-opacity duration-300 md:hidden ${
                    isOpen ? "opacity-0" : "opacity-100"
                  }`}
                >
                  Tap to read more
                </p>

                {/* Text panel — hover on md+, tap on small screens */}
                <div
                  className={`absolute inset-0 z-2 flex items-center justify-center overflow-hidden p-2 sm:p-3 md:p-4 lg:p-6 transition-opacity duration-500 ease-out ${
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                  } md:opacity-0 md:pointer-events-none md:group-hover:opacity-100 md:group-hover:pointer-events-auto`}
                >
                  <div
                    className={`spray-text-panel max-h-full w-full max-w-xl overflow-y-auto rounded-xl px-4 py-5 sm:rounded-2xl sm:px-6 sm:py-6 md:max-w-xl md:px-10 md:py-10 lg:max-w-2xl lg:px-12 lg:py-12 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
                      item.align === "right" ? "text-right" : "text-left"
                    } ${item.align === "right" ? "ml-auto" : "mr-auto"} ${
                      isOpen ? "max-md:translate-y-0 max-md:scale-100" : "max-md:translate-y-3 max-md:scale-[0.94]"
                    } md:translate-y-4 md:scale-[0.92] md:group-hover:translate-y-0 md:group-hover:scale-100`}
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.96)" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className={`flex items-center gap-3 mb-4 md:mb-5 ${
                        item.align === "right" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {item.align === "left" && (
                        <div
                          className="spray-accent shrink-0 min-h-[52px] md:min-h-14 lg:min-h-16"
                          style={{ backgroundColor: item.accent }}
                        />
                      )}
                      <span
                        className="spray-tag text-sm sm:text-base md:text-xl lg:text-2xl"
                        style={{ color: `${item.heading}cc` }}
                      >
                        {item.tag}
                      </span>
                      {item.align === "right" && (
                        <div
                          className="spray-accent shrink-0 min-h-[52px] md:min-h-14 lg:min-h-16"
                          style={{ backgroundColor: item.accent }}
                        />
                      )}
                    </div>
                    <h3
                      className="spray-hero text-2xl leading-[1.1] sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl"
                      style={{ color: item.heading }}
                    >
                      {item.title}
                    </h3>
                    <p className="spray-body mt-3 text-[#333] text-sm leading-relaxed sm:mt-4 sm:text-base md:mt-6 md:text-xl lg:text-2xl">
                      {item.description}
                    </p>
                    <div
                      className={`mt-4 flex sm:mt-6 md:mt-10 ${item.align === "right" ? "justify-end" : "justify-start"}`}
                    >
                      <button
                        type="button"
                        className="rounded-full px-6 py-2.5 text-[10px] font-medium uppercase tracking-[0.15em] text-white shadow-md transition-colors duration-300 sm:px-10 sm:py-4 sm:text-sm sm:tracking-[0.2em] md:px-12 md:text-base"
                        style={{ backgroundColor: item.btn }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = item.btnHover;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = item.btn;
                        }}
                      >
                        Preorder Now
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SpraySection;
