"use client";

import { useEffect } from "react";

const REVEAL_TARGETS = [
  ".section-heading",
  ".menu-card",
  ".story-image",
  ".story-copy",
  ".location-row",
  ".location-card",
  ".info-card",
  ".contact-links",
  ".page-hero",
  ".checkout-layout",
  ".admin-layout",
  ".empty-results",
  ".hero-content",
  ".hero-showcase",
  ".feature-card",
  ".story-band",
  ".story-stat-card",
  ".story-chapter-card",
  ".story-quote-box",
  ".story-cta-box",
  ".review-card",
  ".menu-dietary-bar",
  ".menu-tools",
  ".menu-result-bar",
  ".catering-box",
  ".contact-form-wrapper",
  ".socials-and-info-card",
  ".faq-card",
  ".cart-lines",
  ".checkout-form",
  ".admin-stats > div",
  ".admin-form",
  ".admin-products",
  ".admin-login-box",
].join(", ");

export default function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.scrollRevealReady = "true";

    const pending = new Set<HTMLElement>();
    let animationFrame = 0;

    function revealInViewport() {
      animationFrame = 0;
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight || 800;

      pending.forEach((element) => {
        const bounds = element.getBoundingClientRect();
        // Element is in or comfortably near viewport (generous margin for mobile fast inertial scroll)
        if (bounds.top <= viewportHeight + 120 && bounds.bottom >= -100) {
          element.classList.add("is-visible");
          pending.delete(element);
          if (observer) observer.unobserve(element);
        }
      });
    }

    function scheduleReveal() {
      if (!animationFrame) {
        animationFrame = requestAnimationFrame(revealInViewport);
      }
    }

    const observer =
      typeof window !== "undefined" && "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries, obs) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                pending.delete(entry.target as HTMLElement);
                obs.unobserve(entry.target);
              });
            },
            { threshold: 0.01, rootMargin: "0px 0px 100px 0px" },
          )
        : null;

    function observeTargets(node: ParentNode) {
      if (node instanceof Element && node.matches(REVEAL_TARGETS)) {
        const target = node as HTMLElement;
        target.classList.add("scroll-reveal");
        pending.add(target);
        if (observer) observer.observe(node);
      }

      node
        .querySelectorAll<HTMLElement>(REVEAL_TARGETS)
        .forEach((element, index) => {
          element.classList.add("scroll-reveal");
          element.style.setProperty("--reveal-delay", `${(index % 4) * 60}ms`);
          pending.add(element);
          if (observer) observer.observe(element);
        });

      scheduleReveal();
    }

    observeTargets(document);

    // Initial triggers for immediately visible content (above the fold)
    scheduleReveal();
    const t1 = setTimeout(scheduleReveal, 50);
    const t2 = setTimeout(scheduleReveal, 200);
    const t3 = setTimeout(scheduleReveal, 600);

    // Event listeners for mobile inertial scroll, touches, and resizing
    window.addEventListener("scroll", scheduleReveal, { passive: true });
    window.addEventListener("touchmove", scheduleReveal, { passive: true });
    window.addEventListener("touchend", scheduleReveal, { passive: true });
    window.addEventListener("resize", scheduleReveal);

    const mutations = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node instanceof Element) observeTargets(node);
        });
      });
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      mutations.disconnect();
      if (observer) observer.disconnect();
      window.removeEventListener("scroll", scheduleReveal);
      window.removeEventListener("touchmove", scheduleReveal);
      window.removeEventListener("touchend", scheduleReveal);
      window.removeEventListener("resize", scheduleReveal);
      if (animationFrame) cancelAnimationFrame(animationFrame);
      delete root.dataset.scrollRevealReady;
    };
  }, []);

  return null;
}
