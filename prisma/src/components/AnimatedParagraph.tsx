import { motion, MotionValue, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface AnimatedParagraphProps {
  text: string;
  className?: string;
}

export default function AnimatedParagraph({ text, className = '' }: AnimatedParagraphProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);

  // useScroll on the paragraph element with target offset ['start 0.8', 'end 0.2']
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  const chars = text.split('');
  const totalChars = chars.length;

  return (
    <p ref={containerRef} className={`flex flex-wrap justify-center leading-relaxed ${className}`}>
      {chars.map((char, index) => {
        // Stagger range calculation based on letter index
        const charProgress = index / totalChars;
        const start = Math.max(0, charProgress - 0.1);
        const end = Math.min(1, charProgress + 0.05);

        return (
          <AnimatedLetter
            key={index}
            char={char}
            progress={scrollYProgress}
            range={[start, end]}
          />
        );
      })}
    </p>
  );
}

interface AnimatedLetterProps {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
}

function AnimatedLetter({ char, progress, range }: AnimatedLetterProps) {
  // Transform opacity from 0.2 to 1 based on scroll position in the character's active range
  const opacity = useTransform(progress, range, [0.2, 1]);

  return (
    <motion.span style={{ opacity }} className="inline-block">
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  );
}
