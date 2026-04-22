export const config = {
  domains: {
    prod: { url: "courses.chainguard.dev", id: "3glgawqmzatte" },
    stage: { url: "chainguard-test.skilljar.com", id: "ix1ljpxex6xd" },
  },
  partners: {
    "chainguard-discovery-partner-sales-foundations": {
      id: "53njmyk25y3v",
      checkout: "19bn1isfg4c3t",
    },
    "chainguard-advanced-partner-sales-accelerator": {
      id: "1w57muf27zdg1",
      checkout: "3em1yw57v5d30",
    },
  },
  confetti: {
    autoHideMs: 6000,
    particles: {
      stars: { count: 40, scalar: 1.2 },
      circles: { count: 10, scalar: 0.75 },
      logos: { count: 50, scalar: 3.0 },
    },
    defaults: {
      spread: 360,
      ticks: 50,
      gravity: 1,
      decay: 0.94,
      startVelocity: 40,
      shapes: ["star"],
      colors: ["#C6FF50", "#50FFE1"],
    },
    small: {
      decay: 1.02,
      gravity: 0.9,
      spread: 80,
      startVelocity: 35,
      ticks: 50
    }
  },
  codeTheme: "min-light", // Shiki theme to use for code blocks
};
