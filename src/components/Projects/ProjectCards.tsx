import type { ComponentType } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  DiBootstrap, DiDjango, DiFirebase, DiHeroku, DiJavascript1, DiJqueryLogo,
  DiPhotoshop, DiSwift,
} from 'react-icons/di';
import {
  FaApple, FaAws, FaBootstrap, FaChevronLeft, FaChevronRight, FaCreditCard,
  FaDatabase, FaEthereum, FaGamepad, FaGit, FaGithub, FaGitlab, FaJava,
  FaMicrochip, FaNewspaper, FaNode, FaNpm, FaPhp, FaPython, FaRaspberryPi,
  FaReact, FaSass, FaSearchPlus, FaServer, FaSlack, FaStripe, FaSwift,
  FaTwitter, FaWindows, FaWordpress,
} from 'react-icons/fa';
import { IoMdAnalytics, IoMdCloud } from 'react-icons/io';
import { SiGraphql, SiOracle, SiRedux } from 'react-icons/si';
import { formatProjectStatusLabel, type ProjectRecord } from '../../lib/projects';
import AnimatedSection from '../AnimatedSection';
import './projects.scss';

function formatDateRange(project: ProjectRecord) {
  const formatMonth = (value: string) => new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}-01T00:00:00Z`));
  const start = formatMonth(project.start);
  if (project.end?.present) return `${start} - Present`;
  if (project.end?.date) return `${start} - ${formatMonth(project.end.date)}`;
  return start;
}

function getGallery(project: ProjectRecord) {
  const gallery = project.galleryImageUrls.filter(Boolean);
  return gallery.length ? gallery : [project.imageUrl];
}

async function decodeGalleryImage(imageUrl: string, createImage = () => new Image()) {
  const image = createImage();
  image.src = imageUrl;

  if (typeof image.decode === 'function') {
    try {
      await image.decode();
      return;
    } catch {
      // Some browsers reject decode() while still completing the image normally.
    }
  }

  if (image.complete && image.naturalWidth > 0) return;

  await new Promise<void>((resolve, reject) => {
    image.addEventListener('load', () => resolve(), { once: true });
    image.addEventListener('error', () => reject(new Error(`Unable to load ${imageUrl}`)), { once: true });
  });
}

const technologyIcons: Record<string, {
  Icon: ComponentType<{ size?: number | string }>;
  label: string;
}> = {
  DiBootstrap: { Icon: DiBootstrap, label: 'Bootstrap' },
  DiDjango: { Icon: DiDjango, label: 'Django' },
  DiFirebase: { Icon: DiFirebase, label: 'Firebase' },
  DiHeroku: { Icon: DiHeroku, label: 'Heroku' },
  DiJavascript1: { Icon: DiJavascript1, label: 'JavaScript' },
  DiJqueryLogo: { Icon: DiJqueryLogo, label: 'jQuery' },
  DiPhotoshop: { Icon: DiPhotoshop, label: 'Adobe Photoshop' },
  DiSwift: { Icon: DiSwift, label: 'Swift' },
  FaApple: { Icon: FaApple, label: 'Apple' },
  FaAws: { Icon: FaAws, label: 'Amazon Web Services' },
  FaBootstrap: { Icon: FaBootstrap, label: 'Bootstrap' },
  FaCreditCard: { Icon: FaCreditCard, label: 'Payments' },
  FaDatabase: { Icon: FaDatabase, label: 'Database' },
  FaEthereum: { Icon: FaEthereum, label: 'Ethereum' },
  FaGamepad: { Icon: FaGamepad, label: 'Game Development' },
  FaGit: { Icon: FaGit, label: 'Git' },
  FaGithub: { Icon: FaGithub, label: 'GitHub' },
  FaGitlab: { Icon: FaGitlab, label: 'GitLab' },
  FaJava: { Icon: FaJava, label: 'Java' },
  FaMicrochip: { Icon: FaMicrochip, label: 'Embedded Systems' },
  FaNewspaper: { Icon: FaNewspaper, label: 'News API' },
  FaNode: { Icon: FaNode, label: 'Node.js' },
  FaNpm: { Icon: FaNpm, label: 'npm' },
  FaPhp: { Icon: FaPhp, label: 'PHP' },
  FaPython: { Icon: FaPython, label: 'Python' },
  FaRaspberryPi: { Icon: FaRaspberryPi, label: 'Raspberry Pi' },
  FaReact: { Icon: FaReact, label: 'React' },
  FaSass: { Icon: FaSass, label: 'Sass' },
  FaServer: { Icon: FaServer, label: 'Backend Services' },
  FaSlack: { Icon: FaSlack, label: 'Slack' },
  FaStripe: { Icon: FaStripe, label: 'Stripe' },
  FaSwift: { Icon: FaSwift, label: 'Swift' },
  FaTwitter: { Icon: FaTwitter, label: 'X / Twitter API' },
  FaWindows: { Icon: FaWindows, label: 'Windows' },
  FaWordpress: { Icon: FaWordpress, label: 'WordPress' },
  IoMdAnalytics: { Icon: IoMdAnalytics, label: 'Analytics' },
  IoMdCloud: { Icon: IoMdCloud, label: 'Cloud Services' },
  SiGraphql: { Icon: SiGraphql, label: 'GraphQL' },
  SiOracle: { Icon: SiOracle, label: 'Oracle' },
  SiRedux: { Icon: SiRedux, label: 'Redux' },
};

function getTechnologyIcons(project: ProjectRecord) {
  return Object.values(project.icons ?? {}).flatMap((iconNames) => {
    if (!iconNames) return [];
    return iconNames
      .map((iconName) => ({ name: iconName, ...technologyIcons[iconName] }))
      .filter((icon): icon is {
        name: string;
        Icon: ComponentType<{ size?: number | string }>;
        label: string;
      } => Boolean(icon.Icon));
  });
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

type Props = {
  projects: ProjectRecord[];
  title: string;
  subtitle: string;
};

export default function ProjectCards({ projects, title, subtitle }: Props) {
  const isFeatured = title === 'Featured Work';
  const [activeProjectSlug, setActiveProjectSlug] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const indicatorContainerRef = useRef<HTMLDivElement | null>(null);
  const indicatorRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const decodedImagesRef = useRef(new Set<string>());
  const imageDecodePromisesRef = useRef(new Map<string, Promise<void>>());
  const imageNavigationRequestRef = useRef(0);

  const activeProject = useMemo(
    () => projects.find((project) => project.slug === activeProjectSlug) ?? null,
    [projects, activeProjectSlug],
  );

  const activeGallery = useMemo(
    () => (activeProject ? getGallery(activeProject) : []),
    [activeProject],
  );
  const activeTechnologyIcons = useMemo(
    () => (activeProject ? getTechnologyIcons(activeProject) : []),
    [activeProject],
  );
  const activeDescriptionText = useMemo(
    () => (activeProject ? stripHtml(activeProject.description) : ''),
    [activeProject],
  );
  const shouldCollapseDescription = activeDescriptionText.length > 200;
  const visibleDescription = shouldCollapseDescription && !descriptionExpanded
    ? `${activeDescriptionText.slice(0, 200).trim()}...`
    : activeDescriptionText;

  const openProject = (project: ProjectRecord, imageIndex = 0) => {
    setActiveProjectSlug(project.slug);
    setActiveImageIndex(imageIndex);
    setLightboxOpen(false);
    setDescriptionExpanded(false);
  };

  const closeProject = () => {
    imageNavigationRequestRef.current += 1;
    setLightboxOpen(false);
    setActiveProjectSlug(null);
    setActiveImageIndex(0);
    setLoadedImages({});
    setDescriptionExpanded(false);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const ensureImageDecoded = useCallback((imageUrl: string) => {
    if (decodedImagesRef.current.has(imageUrl)) {
      setLoadedImages((images) => (
        images[imageUrl] ? images : { ...images, [imageUrl]: true }
      ));
      return Promise.resolve();
    }

    const existingPromise = imageDecodePromisesRef.current.get(imageUrl);
    if (existingPromise) return existingPromise;

    const decodePromise = decodeGalleryImage(imageUrl)
      .then(() => {
        decodedImagesRef.current.add(imageUrl);
        setLoadedImages((images) => ({ ...images, [imageUrl]: true }));
      })
      .finally(() => {
        imageDecodePromisesRef.current.delete(imageUrl);
      });

    imageDecodePromisesRef.current.set(imageUrl, decodePromise);
    return decodePromise;
  }, []);

  const showImage = async (index: number) => {
    const imageUrl = activeGallery[index];
    if (!imageUrl || index === activeImageIndex) return;

    const requestId = imageNavigationRequestRef.current + 1;
    imageNavigationRequestRef.current = requestId;

    try {
      await ensureImageDecoded(imageUrl);
    } catch {
      // Preserve navigation for a recoverable decode failure; the in-slide
      // loading state remains until the actual image element reports ready.
    }

    // Give React one paint to mount the decoded destination at opacity 0 before
    // activating it. Keeping that node mounted avoids AnimatePresence's exit
    // cleanup remount, which reset the incoming slide near the end of the fade.
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });

    if (imageNavigationRequestRef.current === requestId) {
      setActiveImageIndex(index);
    }
  };

  const showPreviousImage = () => {
    if (!activeGallery.length) return;
    void showImage(activeImageIndex === 0 ? activeGallery.length - 1 : activeImageIndex - 1);
  };

  const showNextImage = () => {
    if (!activeGallery.length) return;
    void showImage((activeImageIndex + 1) % activeGallery.length);
  };

  useEffect(() => {
    if (activeGallery.length < 2) return;

    const previousIndex = activeImageIndex === 0 ? activeGallery.length - 1 : activeImageIndex - 1;
    const nextIndex = (activeImageIndex + 1) % activeGallery.length;
    void ensureImageDecoded(activeGallery[previousIndex]).catch(() => undefined);
    void ensureImageDecoded(activeGallery[nextIndex]).catch(() => undefined);
  }, [activeGallery, activeImageIndex, ensureImageDecoded]);

  useEffect(() => {
    if (!activeProject && !lightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (lightboxOpen) {
          closeLightbox();
          return;
        }
        closeProject();
        return;
      }

      if (!activeProject) return;

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        showPreviousImage();
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        showNextImage();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeProject, lightboxOpen, activeGallery.length, activeImageIndex]);

  useEffect(() => {
    const activeIndicator = indicatorRefs.current[activeImageIndex];
    const container = indicatorContainerRef.current;
    if (!activeIndicator || !container) return;

    const indicatorCenter = activeIndicator.offsetLeft + activeIndicator.offsetWidth / 2;
    const targetScrollLeft = indicatorCenter - container.clientWidth / 2;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    container.scrollTo({
      left: Math.max(0, Math.min(targetScrollLeft, maxScrollLeft)),
      behavior: 'smooth',
    });
  }, [activeImageIndex]);

  return (
    <section className={`projects${title === 'Featured Work' ? ' projects--featured' : ''}`}>
      <div className="container">
        <AnimatedSection rootMargin="0px" threshold={0} trackViewportEdges>
          <div className="projects__intro">
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
        </AnimatedSection>
        <div className="card-grid">
          {projects.map((project, index) => (
            <AnimatedSection
              key={project.slug}
              className="project-card-motion"
              delay={isFeatured ? index * 0.1 : 0}
              initialViewportDelay={isFeatured ? index * 0.1 : 0}
              rootMargin="0px"
              threshold={0}
              trackViewportEdges
            >
              <article
                className="project-card"
                role="button"
                tabIndex={0}
                onClick={() => openProject(project)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openProject(project);
                  }
                }}
              >
                <div className="project-card__media" aria-hidden="true">
                  <img src={project.imageUrl} alt={project.title} loading="lazy" />
                </div>
                <div className="project-card__body">
                  <h3>{project.title}</h3>
                  <div className="project-card__meta-row">
                    <p>{project.subtitle}</p>
                    {project.status ? (
                      <span className="project-card__badge">
                        {project.status === 'live' ? <span className="project-card__badge-dot" aria-hidden="true" /> : null}
                        {formatProjectStatusLabel(project.status)}
                      </span>
                    ) : null}
                  </div>
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>

      {activeProject ? (
        <div
          className="project-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          onClick={closeProject}
        >
          <div
            className={`project-modal__shell${shouldCollapseDescription ? ' project-modal__shell--expandable' : ''}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="project-modal__topbar">
              <h3 id="project-modal-title">{activeProject.title}</h3>
              <button type="button" className="project-modal__close" onClick={closeProject} aria-label="Close project">
                x
              </button>
            </div>

            <div className="project-modal__gallery">
              <button
                type="button"
                className="project-modal__image-button"
                onClick={() => setLightboxOpen(true)}
                aria-label={`Expand ${activeProject.title} image`}
              >
                {activeGallery.map((imageUrl, index) => (
                  index === activeImageIndex || loadedImages[imageUrl] ? (
                    <div
                      key={imageUrl}
                      className={`project-modal__slide${index === activeImageIndex ? ' is-active' : ''}`}
                      aria-hidden={index !== activeImageIndex}
                    >
                      {!loadedImages[imageUrl] ? (
                        <div className="project-modal__image-loading" aria-hidden="true" />
                      ) : null}
                      <img
                        className="project-modal__image-backdrop"
                        src={imageUrl}
                        alt=""
                        aria-hidden="true"
                      />
                      <img
                        className="project-modal__image"
                        src={imageUrl}
                        alt={index === activeImageIndex ? activeProject.title : ''}
                        loading="eager"
                        decoding="async"
                        onLoad={async (event) => {
                          const image = event.currentTarget;
                          try {
                            await image.decode();
                          } catch {
                            // The load event still confirms a drawable fallback.
                          }
                          decodedImagesRef.current.add(imageUrl);
                          setLoadedImages((images) => ({ ...images, [imageUrl]: true }));
                        }}
                      />
                    </div>
                  ) : null
                ))}
              </button>

              {activeGallery.length > 1 ? (
                <>
                  <button
                    type="button"
                    className="project-modal__nav project-modal__nav--prev"
                    onClick={(event) => {
                      event.stopPropagation();
                      showPreviousImage();
                    }}
                    aria-label="Previous image"
                  >
                    <FaChevronLeft aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="project-modal__nav project-modal__nav--next"
                    onClick={(event) => {
                      event.stopPropagation();
                      showNextImage();
                    }}
                    aria-label="Next image"
                  >
                    <FaChevronRight aria-hidden="true" />
                  </button>
                  <div className="project-modal__dots" ref={indicatorContainerRef}>
                    {activeGallery.map((imageUrl, index) => (
                      <button
                        key={imageUrl}
                        ref={(element) => {
                          indicatorRefs.current[index] = element;
                        }}
                        type="button"
                        className={index === activeImageIndex ? 'is-active' : ''}
                        onClick={(event) => {
                          event.stopPropagation();
                          showImage(index);
                        }}
                        aria-label={`Show image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              ) : null}

              <button
                type="button"
                className="project-modal__zoom"
                onClick={(event) => {
                  event.stopPropagation();
                  setLightboxOpen(true);
                }}
                aria-label="Open image lightbox"
              >
                <FaSearchPlus aria-hidden="true" />
              </button>
            </div>

            <div className="project-modal__content">
              <div className="project-modal__body">
                <div className="project-modal__meta-header">
                  <div className="project-modal__title-row">
                    <h4>{activeProject.subtitle}</h4>
                    <div className="project-modal__side-meta">
                      <span>{formatDateRange(activeProject)}</span>
                      <div className="project-modal__technology-status-row">
                        {activeTechnologyIcons.length ? (
                          <ul className="project-modal__icons" aria-label="Technologies used">
                            {activeTechnologyIcons.map(({ name, label, Icon }) => (
                              <li key={name} title={label} aria-label={label}>
                                <Icon size={20} aria-hidden="true" />
                              </li>
                            ))}
                          </ul>
                        ) : null}
                        {activeProject.status ? (
                          <span className="project-modal__status">
                            {activeProject.status === 'live' ? <span className="project-modal__status-dot" aria-hidden="true" /> : null}
                            {formatProjectStatusLabel(activeProject.status)}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="project-modal__description">
                  <p>{visibleDescription}</p>
                  {shouldCollapseDescription ? (
                    <button
                      type="button"
                      className="project-modal__read-more"
                      onClick={() => setDescriptionExpanded((expanded) => !expanded)}
                    >
                      {descriptionExpanded ? 'Read Less ▲' : 'Read More ▼'}
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="project-modal__actions">
                <div className="project-modal__footer-divider">
                  <div className="project-modal__footer-actions">
                    {activeProject.sourceLink ? (
                      <a href={activeProject.sourceLink} className="btn-text">
                        <FaGithub size={16} /> Source
                      </a>
                    ) : null}
                    <a href={activeProject.postSlug} className="btn-ghost">
                      Read Post
                    </a>
                    {activeProject.link ? <a href={activeProject.link} className="btn-primary">View Project</a> : null}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {lightboxOpen ? (
            <div className="project-lightbox" onClick={closeLightbox}>
              <div className="project-lightbox__shell" onClick={(event) => event.stopPropagation()}>
                <button type="button" className="project-lightbox__close" onClick={closeLightbox} aria-label="Close image">
                  x
                </button>
                <img src={activeGallery[activeImageIndex]} alt={activeProject.title} />
                {activeGallery.length > 1 ? (
                  <>
                    <button
                      type="button"
                      className="project-lightbox__nav project-lightbox__nav--prev"
                      onClick={(event) => {
                        event.stopPropagation();
                        showPreviousImage();
                      }}
                      aria-label="Previous image"
                    >
                      <FaChevronLeft aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="project-lightbox__nav project-lightbox__nav--next"
                      onClick={(event) => {
                        event.stopPropagation();
                        showNextImage();
                      }}
                      aria-label="Next image"
                    >
                      <FaChevronRight aria-hidden="true" />
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

export const __test__ = {
  decodeGalleryImage,
  formatStatusLabel: formatProjectStatusLabel,
  getTechnologyIcons,
  getGallery,
};
