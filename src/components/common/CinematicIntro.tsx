import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CinematicIntroProps {
  onComplete: () => void;
  startMusic: () => void;
}

type Phase = "black" | "white-lceteam" | "white-esrb" | "out";

const TIMINGS = {
  black: 800,
  "white-lceteam": 3000,
  "white-esrb": 3000,
  out: 800,
};

export function CinematicIntro({ onComplete, startMusic }: CinematicIntroProps) {
  const [phase, setPhase] = useState<Phase>("black");

  useEffect(() => {
    startMusic();

    const run = async () => {
      await new Promise((r) => setTimeout(r, TIMINGS.black));
      setPhase("white-lceteam");

      await new Promise((r) => setTimeout(r, TIMINGS["white-lceteam"]));
      setPhase("white-esrb");

      await new Promise((r) => setTimeout(r, TIMINGS["white-esrb"]));
      setPhase("out");

      await new Promise((r) => setTimeout(r, TIMINGS.out));
      onComplete();
    };

    run();
  }, [onComplete, startMusic]);

  return (
    <div className="absolute inset-0 z-50 bg-black">
      <AnimatePresence initial={false}>
        {phase === "black" && (
          <motion.div
            key="black"
            className="absolute inset-0 bg-black"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        )}

        {(phase === "white-lceteam" || phase === "white-esrb" || phase === "out") && (
          <motion.div
            key="white-bg"
            className="absolute inset-0 bg-white flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "out" ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: phase === "out" ? 0.8 : 0.6 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {phase === "white-lceteam" && (
                <motion.img
                  key="lceteam"
                  src="/images/LCE Team.png"
                  className="max-w-xl object-contain"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                />
              )}

              {(phase === "white-esrb" || phase === "out") && (
                <motion.img
                  key="esrb"
                  src="/images/esrb_warning.png"
                  className="max-w-xl object-contain"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
