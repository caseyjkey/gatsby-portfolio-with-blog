export interface ExperienceEntry {
  year: string;
  company: string;
  location: string;
  title: string;
  bullets: string[];
}

/**
 * Helper to parse the first date from a date string for sorting.
 * Handles formats like "April 2024 – Present" or "August 2019 - May 2020, August 2020 - May 2021"
 */
function parseStartDate(dateString: string): Date {
  // Extract the first month and year from the string
  const match = dateString.match(/^([A-Za-z]+) (\d{4})/);
  if (!match) return new Date(9999, 0, 1); // Put at end if unparseable

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthIndex = monthNames.indexOf(match[1]);
  const year = parseInt(match[2], 10);

  return new Date(year, monthIndex, 1);
}

// Raw data in unsorted order
const rawExperienceData: ExperienceEntry[] = [
  {
    year: "May 2018 - July 2018",
    company: "Northrop Grumman STEM Camp",
    location: "Denver, CO",
    title: "Student Instructor",
    bullets: [
      "Built a project based Python programming curriculum focused on gaming and security.",
      "Taught 10 high school students Python object-oriented programming.",
      "Released a blog covering the curriculum."
    ]
  },
  {
    year: "January 2019 - May 2019",
    company: "Colorado State University",
    location: "Fort Collins, CO",
    title: "Teaching Assistant",
    bullets: [
      "Lead over 100 students through the fundamentals of Python.",
      "Reviewed and revised curriculum for teaching Python to non-technical majors."
    ]
  },
  {
    year: "May 2019 – August 2019",
    company: "Oracle",
    location: "Reston, VA",
    title: "Cloud Solutions Engineer",
    bullets: [
      "Built business intelligence dashboards for optimizing five revenue streams.",
      "Analyzed Tweets and News outlets for live analysis using Python.",
      "Maximized application availability by automating deployment to Oracle Cloud."
    ]
  },
  {
    year: "August 2019 - May 2020, August 2020 - May 2021",
    company: "Bongo",
    location: "Loveland, CO",
    title: "DevOps Engineer",
    bullets: [
      "Built custom monitors to fortify web application's live audio infrastructure.",
      "Automated hundreds of end-to-end React user interface tests with Ruby, Capybara, and Jenkins."
    ]
  },
  {
    year: "May 2020 – August 2020",
    company: "Amazon Web Services",
    location: "Remote",
    title: "Associate Cloud Consultant",
    bullets: [
      "Architected self-service WorkSpace solution to reduce end-user's procurement time by 85%.",
      "Satisfied customer requests for highly available RESTful services after project demos."
    ]
  },
  {
    year: "August 2021 – August 2022",
    company: "Capital One",
    location: "Remote",
    title: "Senior Associate Software Engineer",
    bullets: [
      "Accelerated dataset registration by developing a Chrome extension to enforce metadata compliance.",
      "Improved file transfer efficiency by designing a self‑service data streaming and processing pipeline.",
      "Enhanced real‑time analytics by implementing multithreading for Kafka stream processing."
    ]
  },
  {
    year: "August 2022 – April 2024",
    company: "Amazon",
    location: "Santa Monica, CA",
    title: "Software Development Engineer",
    bullets: [
      "Designed efficient bulk registration features for large‑scale data ingestion pipelines.",
      "Developed and optimized C++ and Python‑based APIs for large‑scale data catalog systems.",
      "Led junior developers by sharing context, reviewing code, and guiding contributions.",
      "Delivered flexible CI/CD pipelines with approvals, tests, rollbacks, and branch deployments.",
      "Worked closely with product and UX teams to refine UI behavior for React-based applications.",
      "Managed infrastructure security and scalability using AWS CDK, CloudFormation, and SAM."
    ]
  },
  {
    year: "April 2024 – Present",
    company: "Oracle",
    location: "Redwood Shores, CA",
    title: "Applications Developer",
    bullets: [
      "Built and launched a scalable release management tool supporting 13780 users with high reliability.",
      "Mentored new developers, facilitating knowledge transfer and collaborative problem‑solving.",
      "Implemented AI‑powered automation to optimize DevOps workflows and artifact management.",
      "Led onboarding and support for users, resolving bugs, gathering feedback, and refining key features.",
      "Efficiently ingested data sources with Python, DRF, and Celery for asynchronous data processing."
    ]
  }
];

// Sort chronologically by first date (newest first)
export const experienceData: ExperienceEntry[] = [...rawExperienceData].sort((a, b) => {
  const dateA = parseStartDate(a.year);
  const dateB = parseStartDate(b.year);
  return dateB.getTime() - dateA.getTime();
});
