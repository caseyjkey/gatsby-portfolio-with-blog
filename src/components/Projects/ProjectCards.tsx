import { format } from 'date-fns';
import type { ProjectRecord } from '../../lib/projects';
import './projects.scss';

function formatDateRange(project: ProjectRecord) {
  const start = format(new Date(`${project.start}-01`), 'MMMM yyyy');
  if (project.end?.present) return `${start} - Present`;
  if (project.end?.date) return `${start} - ${format(new Date(`${project.end.date}-01`), 'MMMM yyyy')}`;
  return start;
}

type Props = {
  projects: ProjectRecord[];
  title: string;
  subtitle: string;
};

export default function ProjectCards({ projects, title, subtitle }: Props) {
  return (
    <section className="projects">
      <div className="container">
        <div className="projects__intro">
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <div className="card-grid">
          {projects.map((project) => (
            <article key={project.slug} className="project-card">
              <a href={project.postSlug} className="project-card__media">
                <img src={project.imageUrl} alt={project.title} loading="lazy" />
              </a>
              <div className="project-card__body">
                <div>
                  <h3>{project.title}</h3>
                  <p>{project.subtitle}</p>
                  <div className="project-card__meta">
                    <span>{formatDateRange(project)}</span>
                    {project.status ? <span className="project-card__status">{project.status}</span> : null}
                  </div>
                </div>
                <div className="project-card__description" dangerouslySetInnerHTML={{ __html: project.description }} />
                <div className="project-card__actions">
                  <a href={project.postSlug} className="btn-primary">Read Case Study</a>
                  {project.link ? <a href={project.link} className="btn-ghost">Live Site</a> : null}
                  {project.sourceLink ? <a href={project.sourceLink} className="btn-ghost">Source</a> : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
