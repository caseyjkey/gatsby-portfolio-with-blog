import React, { useEffect, useRef, useState } from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  type PanInfo,
} from 'motion/react';

type PolaroidPhoto = {
  src: string;
  alt: string;
  caption: string;
};

const photos: PolaroidPhoto[] = [
  {
    src: '/images/about-polaroids/casey-dog.webp',
    alt: 'Casey crouching beside a brown bulldog on a sunny sidewalk',
    caption: 'new best friend',
  },
  {
    src: '/images/about-polaroids/casey-coffee-shop.webp',
    alt: 'Casey working on a laptop in a sunlit coffee shop',
    caption: 'building somewhere new',
  },
  {
    src: '/images/about-polaroids/casey-coast-v2.webp',
    alt: 'Casey hiking above a rocky coastline at golden hour',
    caption: 'take the scenic route',
  },
  {
    src: '/images/about-polaroids/casey-dinner.webp',
    alt: 'Casey laughing with friends over dinner',
    caption: 'good people, good food',
  },
  {
    src: '/images/about-polaroids/casey-motorcycle.webp',
    alt: 'Casey standing beside a motorcycle at a scenic overlook',
    caption: 'weekend therapy',
  },
  {
    src: '/images/about-polaroids/casey-concert.webp',
    alt: 'Casey enjoying a small live music show',
    caption: 'always near the speakers',
  },
  {
    src: '/images/about-polaroids/casey-city-night.webp',
    alt: 'Casey exploring a city street after dark',
    caption: 'after-hours wandering',
  },
];

const desktopRotations = [-13, -8, -4, 1, 5, 9, 13];
const mobileRotations = [-11, -6, -2, 3, 8, 12, 15];
function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function useCompactLayout() {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 520px)');
    const update = () => setIsCompact(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return isCompact;
}

type PolaroidCardProps = {
  photo: PolaroidPhoto;
  index: number;
  isCompact: boolean;
  isFocused: boolean;
  isDimmed: boolean;
  neighborShift: number;
  isActive: boolean;
  onActivate: (index: number) => void;
  onFocusPhoto: (index: number | null) => void;
  onHoverPhoto: (index: number | null) => void;
};

function PolaroidCard({
  photo,
  index,
  isCompact,
  isFocused,
  isDimmed,
  neighborShift,
  isActive,
  onActivate,
  onFocusPhoto,
  onHoverPhoto,
}: PolaroidCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const baseRotation = shouldReduceMotion
    ? 0
    : (isCompact ? mobileRotations : desktopRotations)[index];
  const rotation = useMotionValue(baseRotation);
  const dragDistance = useRef(0);
  const grabY = useRef(0);

  useEffect(() => {
    animate(rotation, baseRotation, {
      type: 'spring',
      stiffness: 220,
      damping: 24,
    });
  }, [baseRotation, rotation]);

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    grabY.current = (event.clientY - bounds.top) / bounds.height - 0.5;
    dragDistance.current = 0;
    onActivate(index);
  };

  const handleDrag = (_event: PointerEvent, info: PanInfo) => {
    dragDistance.current = Math.max(
      dragDistance.current,
      Math.hypot(info.offset.x, info.offset.y)
    );

    if (!shouldReduceMotion) {
      const offCenterTorque = grabY.current * info.offset.x * 0.11;
      const travelTilt = info.offset.x * 0.025;
      rotation.set(baseRotation + offCenterTorque + travelTilt);
    }
  };

  const handleDragEnd = (_event: PointerEvent, info: PanInfo) => {
    if (!shouldReduceMotion) {
      const restingTilt = clamp(info.velocity.x * 0.008, -9, 9);
      animate(rotation, baseRotation + restingTilt, {
        type: 'spring',
        stiffness: 130,
        damping: 16,
        velocity: info.velocity.x * 0.01,
      });
    }
  };

  const toggleFocus = () => {
    if (dragDistance.current > 4) return;
    onFocusPhoto(isFocused ? null : index);
    onActivate(index);
  };

  return (
    <motion.div
      className={`polaroid-stack__slot polaroid-stack__slot--${index + 1}`}
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: neighborShift }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{
        opacity: { duration: 0.35, delay: index * 0.055 },
        y: {
          type: 'spring',
          stiffness: 230,
          damping: 22,
          delay: shouldReduceMotion ? 0 : index * 0.055,
        },
      }}
      style={{
        zIndex: isFocused ? 100 : isActive ? 60 : index + 1,
      }}
    >
      <motion.button
        type="button"
        className="polaroid-stack__card"
        data-polaroid-card
        drag
        dragElastic={0.08}
        dragMomentum={!shouldReduceMotion}
        onPointerDown={handlePointerDown}
        onDragStart={() => onActivate(index)}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        onClick={toggleFocus}
        onHoverStart={() => onHoverPhoto(index)}
        onHoverEnd={() => onHoverPhoto(null)}
        animate={{
          scale: isFocused ? (isCompact ? 1.24 : 1.4) : 1,
          opacity: isDimmed ? 0.28 : 1,
          y: isFocused ? (isCompact ? -8 : -14) : 0,
        }}
        whileHover={isFocused ? undefined : { scale: 1.035, y: -4 }}
        whileDrag={{ scale: 1.055, cursor: 'grabbing' }}
        transition={{ type: 'spring', stiffness: 260, damping: 23 }}
        style={{ rotate: rotation }}
        aria-label={`${photo.caption}. Drag to move this photo or press to enlarge it.`}
        aria-pressed={isFocused}
      >
        <span className="polaroid-stack__image-wrap">
          <picture>
            <source srcSet={photo.src.replace('.webp', '.avif')} type="image/avif" />
            <img
              src={photo.src}
              alt={photo.alt}
              width={400}
              height={500}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              draggable={false}
            />
          </picture>
        </span>
        <span className="polaroid-stack__caption">{photo.caption}</span>
      </motion.button>
    </motion.div>
  );
}

export default function PolaroidStack() {
  const isCompact = useCompactLayout();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focusedIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFocusedIndex(null);
    };
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-polaroid-card]')) setFocusedIndex(null);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [focusedIndex]);

  return (
    <div className="polaroid-stack" ref={rootRef}>
      <div className="polaroid-stack__intro">
        <p className="polaroid-stack__eyebrow">Life outside the terminal</p>
        <p className="polaroid-stack__hint">
          Drag the photos around. Tap one for a closer look.
        </p>
      </div>
      <div className="polaroid-stack__stage" aria-label="A draggable stack of photos from Casey's life">
        {photos.map((photo, index) => {
          const distanceFromHover = hoveredIndex === null ? 99 : index - hoveredIndex;
          const neighborShift =
            distanceFromHover === -1 ? -9 : distanceFromHover === 1 ? 9 : 0;

          return (
            <PolaroidCard
              key={photo.src}
              photo={photo}
              index={index}
              isCompact={isCompact}
              isFocused={focusedIndex === index}
              isDimmed={focusedIndex !== null && focusedIndex !== index}
              neighborShift={neighborShift}
              isActive={activeIndex === index || hoveredIndex === index}
              onActivate={setActiveIndex}
              onFocusPhoto={setFocusedIndex}
              onHoverPhoto={setHoveredIndex}
            />
          );
        })}
      </div>
    </div>
  );
}
