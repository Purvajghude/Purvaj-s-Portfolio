import { motion, useReducedMotion } from 'motion/react';

/**
 * The one scroll-reveal in the project, so sections do not each invent one.
 * Justification (contract section 4: motion must be motivated): this animation
 * communicates hierarchy. Content arrives in reading order as it enters view.
 *
 * Under reduced motion it renders static at final state, no transition.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  className = '',
  as = 'div',
  amount = 0.3,
  ...rest
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] ?? motion.div;

  if (reduce) {
    const Tag = as;
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.62, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
