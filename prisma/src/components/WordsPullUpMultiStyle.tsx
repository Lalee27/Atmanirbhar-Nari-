import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface TextSegment {
  text: string;
  className?: string;
}

interface WordsPullUpMultiStyleProps {
  segments: TextSegment[];
  className?: string;
}

export default function WordsPullUpMultiStyle({ segments, className = '' }: WordsPullUpMultiStyleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  // Flatten segments into individual words with their respective classNames
  const wordsWithStyles = segments.flatMap((segment) => {
    // Split by space, but keep track of spaces if needed. Split and filter empty items.
    const words = segment.text.split(' ');
    return words
      .filter((word) => word !== '')
      .map((word) => ({
        word,
        className: segment.className || '',
      }));
  });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const wordVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={`inline-flex flex-wrap justify-center ${className}`}
    >
      {wordsWithStyles.map((item, idx) => (
        <span key={idx} className="relative inline-block mr-[0.22em] overflow-hidden py-[0.1em] -my-[0.1em]">
          <motion.span
            variants={wordVariants}
            className={`inline-block ${item.className}`}
          >
            {item.word}
          </motion.span>
        </span>
      ))}
    </motion.div>
  );
}
