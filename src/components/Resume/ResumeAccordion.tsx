import { useState, useRef, useEffect, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { GiGraduateCap } from 'react-icons/gi';
import { AiOutlineTeam } from 'react-icons/ai';
import { TbCertificate } from 'react-icons/tb';
import { GoStar } from 'react-icons/go';
import { MdWork } from 'react-icons/md';
import { BsSave } from 'react-icons/bs';
import { experienceData } from '../../data/experience';
import AnimatedSection from '../AnimatedSection';
import { ACCORDION, SECONDARY_DELAYS } from '../../animations/config';
import { fadeInUpVariants } from '../../animations';
import { useInViewAnimation } from '../../animations/hooks/useInViewAnimation';
import ResumeFile from '../Introduction/resume.pdf';
import './resume.scss';

// --- Sub-components ---

type EntryProps = {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  date?: string;
  children: ReactNode;
  className?: string;
};

function Entry({ icon: Icon, date, title, subtitle, children, className }: EntryProps) {
  return (
    <div className={`resume__entry ${className || ''}`}>
      <div className="resume__entry-icon">
        <span><Icon /></span>
      </div>
      {date && <span className="resume__entry-date">{date}</span>}
      <h2>{title}</h2>
      <span className="resume__entry-subtitle">{subtitle}</span>
      <div className="resume__entry-description">{children}</div>
    </div>
  );
}

type AccordionSection = {
  id: string;
  headerId: string;
  label: string;
  children: ReactNode;
};

// --- Accordion body with staggered AnimatedSection entries ---

function AccordionAnimatedBody({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: ReactNode;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;

    if (isOpen) {
      // Measure content height
      el.style.maxHeight = el.scrollHeight + 'px';
      el.classList.add('open');
    } else {
      el.style.maxHeight = '0px';
      el.classList.remove('open');
    }
  }, [isOpen]);

  return (
    <div ref={bodyRef} className="resume__accordion-body">
      {isOpen && (
        <>
          {Array.isArray(children)
            ? children.map((child, index) => (
                <AnimatedSection
                  key={index}
                  delay={index * ACCORDION.staggerDelay}
                  once={false}
                >
                  {child}
                </AnimatedSection>
              ))
            : <AnimatedSection delay={0} once={false}>{children}</AnimatedSection>
          }
        </>
      )}
    </div>
  );
}

// --- Main component ---

export default function ResumeAccordion() {
  const { ref: headerRef, isInView: isHeaderVisible } = useInViewAnimation({ once: true });
  const { ref: buttonRef, isInView: isButtonVisible } = useInViewAnimation({ once: true });
  const { ref: accordionRef, isInView: isAccordionVisible } = useInViewAnimation({ once: true });

  const [open, setOpen] = useState<string | null>('1');

  const handleToggle = (id: string) => {
    const isOpening = open !== id;
    setOpen(open === id ? null : id);

    if (!isOpening) return;

    const headerIdMap: Record<string, string> = {
      '1': 'accordion-education',
      '2': 'accordion-experience',
      '3': 'accordion-awards',
      '4': 'accordion-leadership',
    };

    setTimeout(() => {
      const headerId = headerIdMap[id];
      if (headerId) {
        const element = document.getElementById(headerId);
        if (element) {
          const currentScrollY = window.pageYOffset;
          const elementPosition = element.getBoundingClientRect().top;
          const targetY = elementPosition + currentScrollY;
          const isScrollingUp = targetY < currentScrollY;

          if (isScrollingUp) {
            const headerOffset = 80;
            window.scrollTo({
              top: targetY - headerOffset,
              behavior: 'smooth',
            });
          } else {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    }, ACCORDION.expansionDelay);
  };

  const sections: AccordionSection[] = [
    {
      id: '1',
      headerId: 'accordion-education',
      label: 'Education',
      children: (
        <>
          <Entry
            icon={GiGraduateCap}
            className="entry-first"
            title="University of Southern California"
            subtitle="Master's of Science in Computer Science"
          >
            Specializing in Artificial Intelligence
          </Entry>
          <Entry
            icon={TbCertificate}
            title="Certified DevOps Engineer - Professional"
            subtitle="AWS Certification"
            date="April 2025"
          >
            Validates technical expertise in developing and maintaining applications on the AWS platform
          </Entry>
          <Entry
            icon={GiGraduateCap}
            className="entry-last"
            title="Colorado State University"
            subtitle="Bachelor's of Science in Computer Science"
            date="May 2021"
          >
            Minor in Entrepreneurship and Innovation
          </Entry>
        </>
      ),
    },
    {
      id: '2',
      headerId: 'accordion-experience',
      label: 'Experience',
      children: (
        <>
          {experienceData.map((entry, index) => (
            <Entry
              key={index}
              icon={MdWork}
              date={entry.year}
              title={entry.company}
              subtitle={entry.title}
              className={
                index === 0
                  ? 'entry-first'
                  : index === experienceData.length - 1
                  ? 'entry-last'
                  : undefined
              }
            >
              <ul>
                {entry.bullets.map((bullet, bulletIndex) => (
                  <li key={bulletIndex}>{bullet}</li>
                ))}
              </ul>
            </Entry>
          ))}
        </>
      ),
    },
    {
      id: '3',
      headerId: 'accordion-awards',
      label: 'Awards',
      children: (
        <>
          <Entry
            icon={GoStar}
            className="entry-first"
            date="July 2022"
            title="Phoenix Award"
            subtitle="Capital One"
          >
            <ul>
              <li>A monthly award given by the Capital One FS Data Team.</li>
              <li>The award is given to selected individuals/team after nomination and careful committee consideration.</li>
              <li>This award was given as part of Data Catalog Chrome Extension Development.</li>
            </ul>
          </Entry>
          <Entry
            icon={GoStar}
            date="Fall 2020"
            title="Social Impact Award"
            subtitle="HackCU 007"
          >
            <ul>
              <li>Lead development of a Missing and Murdered Indigenous Women reporting system</li>
              <li>Deployed database and web application for viewing and modifying reports</li>
              <li>Built IoT device for filing reports via GSM cellular signal for rural areas</li>
              <li>Created Alexa skill for filing reports via Alexa voice recognition</li>
            </ul>
          </Entry>
          <Entry
            icon={GoStar}
            date="Fall 2018 - Fall 2021"
            title="Dean's List"
            subtitle="College of Natural Science"
          >
            <ul>
              <li>Recognized as a high-achieving student for earning over a 3.75 GPA while working part-time.</li>
            </ul>
          </Entry>
          <Entry
            icon={GoStar}
            date="September 2019"
            title="SingularDTV Challenge"
            subtitle="WyoHackathon"
          >
            <ul>
              <li>Spearheaded a trip to San Francisco by developing a token-curated music billboard.</li>
            </ul>
          </Entry>
          <Entry
            icon={GoStar}
            className="entry-last"
            date="October 2017"
            title="Best Artistry Award"
            subtitle="RamHack at Colorado State University"
          >
            <ul>
              <li>Led the development of a VR solarsystem classroom within 48 hours.</li>
            </ul>
          </Entry>
        </>
      ),
    },
    {
      id: '4',
      headerId: 'accordion-leadership',
      label: 'Leadership',
      children: (
        <>
          <Entry
            icon={AiOutlineTeam}
            className="entry-first"
            date="September 2020 - May 2021"
            title="President"
            subtitle="CSU's American Indian Science and Engineering Society"
          >
            <ul>
              <li>Doubled membership through campus recruiting and online outreach</li>
              <li>Organized meetings and volunteer efforts throughout the year</li>
            </ul>
          </Entry>
          <Entry
            icon={AiOutlineTeam}
            className="entry-last"
            date="August 2020 - May 2020"
            title="Treasurer"
            subtitle="AISES and Hashdump"
          >
            <ul>
              <li>Manage a budget of over $40,000</li>
              <li>Write budget proposals for education, outreach, and professional development</li>
            </ul>
          </Entry>
        </>
      ),
    },
  ];

  return (
    <section className="resume container">
      <motion.div
        ref={headerRef}
        initial="hidden"
        animate={isHeaderVisible ? 'visible' : 'hidden'}
        custom={{ delay: 0, distance: 30 }}
        variants={fadeInUpVariants}
      >
        <div className="resume__header">
          <h2>Resume</h2>
          <p>Professional experience, education, and achievements.</p>
        </div>
      </motion.div>

      <motion.div
        ref={buttonRef}
        initial="hidden"
        animate={isButtonVisible ? 'visible' : 'hidden'}
        custom={{ delay: SECONDARY_DELAYS.default, distance: 20 }}
        variants={fadeInUpVariants}
      >
        <a
          href={ResumeFile}
          className="btn btn-primary resume__download"
        >
          Download<span><BsSave /></span>
        </a>
      </motion.div>

      <motion.div
        ref={accordionRef}
        initial="hidden"
        animate={isAccordionVisible ? 'visible' : 'hidden'}
        custom={{ delay: SECONDARY_DELAYS.long, distance: 20 }}
        variants={fadeInUpVariants}
      >
        <div className="resume__accordion">
          {sections.map((section) => (
            <div key={section.id} className="resume__accordion-item">
              <button
                id={section.headerId}
                className="resume__accordion-header"
                aria-expanded={open === section.id}
                aria-controls={`body-${section.id}`}
                onClick={() => handleToggle(section.id)}
              >
                {section.label}
                <span className="chevron">&#9660;</span>
              </button>
              <AccordionAnimatedBody isOpen={open === section.id}>
                {section.children}
              </AccordionAnimatedBody>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
