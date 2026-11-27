import AboutSection from "@/components/about-section/AboutSection";
import CinematicHero from "@/components/cinematic-hero/CinematicHero";
import ContactSection from "@/components/contact-section/ContactSection";
import ExperienceTimeline from "@/components/experience-timeline/ExperienceTimeline";
import ProjectCard from "@/components/project-card/ProjectCard";
import ScrollReveal from "@/components/scroll-reveal/ScrollReveal";
import SiteHeader from "@/components/site-header/SiteHeader";
import SkillsSection from "@/components/skills-section/SkillsSection";
import TextReveal from "@/components/text-reveal/TextReveal";
import { portfolioData } from "@/data/portfolio";
import styles from "./page.module.scss";

export default function Home() {
  const {
    profile,
    about,
    skillGroups,
    projects,
    experience,
    education,
    certifications,
  } = portfolioData;

  return (
    <>
      <a className={styles.skipLink} href="#main-content">
        Skip to content
      </a>
      <SiteHeader name={profile.name} linkedinUrl={profile.linkedinUrl} />
      <main className={styles.page} id="main-content">
        <CinematicHero
          name={profile.name}
          tagline={profile.tagline}
          heroDescriptor={profile.heroDescriptor}
        />

        <section className={styles.work} id="work" aria-labelledby="work-title">
          <ScrollReveal as="div" className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>01 / Projects</p>
              <h2 id="work-title">
                <TextReveal text="Projects." />
              </h2>
            </div>
            <span className={styles.sectionCount}>
              {String(projects.length).padStart(2, "0")} projects
            </span>
          </ScrollReveal>

          <div className={styles.projectGrid}>
            {projects.map((project, index) => (
              <ProjectCard
                index={index}
                isFullWidth={
                  projects.length % 2 === 1 && index === projects.length - 1
                }
                key={project.id}
                project={project}
              />
            ))}
          </div>
        </section>

        <SkillsSection groups={skillGroups} />

        <AboutSection about={about} />

        <ExperienceTimeline entries={experience} />

        <ScrollReveal
          as="section"
          className={styles.education}
          id="education"
          aria-labelledby="education-title"
        >
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>05 / Education</p>
              <h2 id="education-title">Education &amp; credentials.</h2>
            </div>
          </div>

          <div className={styles.educationGrid}>
            <div>
              <p className={styles.educationLabel}>Education</p>
              <div className={styles.educationList}>
                {education.map((entry) => (
                  <article className={styles.educationItem} key={entry.id}>
                    <span className={styles.educationPeriod}>{entry.period}</span>
                    <div>
                      <h3>{entry.qualification}</h3>
                      <p>{entry.institution}</p>
                      <span className={styles.educationGrade}>
                        {entry.grade}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div>
              <p className={styles.educationLabel}>Selected certifications</p>
              <div className={styles.educationList}>
                {certifications.map((certification) => (
                  <article
                    className={styles.certificationItem}
                    key={certification.id}
                  >
                    <h3>{certification.title}</h3>
                    <div>
                      <span>{certification.issuer}</span>
                      <span>{certification.date}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

      </main>

      <ContactSection
        name={profile.name}
        email={profile.email}
        githubUrl={profile.githubUrl}
        linkedinUrl={profile.linkedinUrl}
        leetcodeUrl={profile.leetcodeUrl}
        instagramUrl={profile.instagramUrl}
        location={profile.location}
        resumeUrl={profile.resumeUrl}
        copyrightYear={profile.copyrightYear}
      />
    </>
  );
}
