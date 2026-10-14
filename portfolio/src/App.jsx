import { useEffect, useState } from "react";
import { getPortfolioContent, resolveMediaUrl, submitContact } from "./api";

const fallbackProjects = [
  { title: "CPU Scheduling Simulator", type: "Java / Web", description: "A web-based simulator for FCFS, SJF, SRTF, Round Robin, Priority, and HRRN scheduling with metric calculations and Gantt-chart visualization.", color: "coral", tech_stack: ["Java", "HTML", "CSS", "JavaScript"] },
  { title: "Operational Data Analysis", type: "Excel / Power BI", description: "Cleaned, transformed, and explored structured operational datasets using Excel, Power Query, Power BI transformations, custom columns, and interactive reporting.", color: "blue", tech_stack: ["Microsoft Excel", "Power Query", "Power BI"] },
  { title: "Flutter UI Practice", type: "Mobile development", description: "Built Flutter UI layouts and practiced application structure, navigation flow, debugging, and cross-platform development fundamentals.", color: "gold", tech_stack: ["Flutter", "Dart"] },
];

const fallbackSkills = [{ name: "C++", proficiency: 82 }, { name: "Python", proficiency: 84 }, { name: "Java", proficiency: 78 }, { name: "SQL", proficiency: 82 }, { name: "Microsoft Excel", proficiency: 86 }, { name: "Power BI", proficiency: 78 }, { name: "MySQL", proficiency: 80 }, { name: "Data Structures", proficiency: 76 }];
const fallbackBlogs = [{ title: "Building a CPU Scheduling Simulator", excerpt: "Notes on comparing process scheduling algorithms through dynamic input, metrics, and visualization.", content: "The simulator explores FCFS, SJF, SRTF, Round Robin, Priority, and HRRN scheduling by calculating waiting time, turnaround time, response time, and average metrics with a visual Gantt chart." }, { title: "Learning Data Analytics Through Operations Data", excerpt: "A short reflection on cleaning structured datasets and turning them into useful reporting views.", content: "During the data analytics internship, Excel, Power Query, Power BI transformations, and custom columns helped turn structured operational data into clearer exploratory insights." }];
const fallbackTestimonials = [{ name: "Portfolio note", role: "Resume highlight", quote: "Kismat combines core computer science fundamentals with practical analytics, web, and mobile development experience." }];
const fallbackExperience = [
  { title: "Data Analytics Intern", company: "Hindustan Zinc Limited", location: "Udaipur, Rajasthan", start_date: "Jun 2026", end_date: "Present", description: "Cleaned and preprocessed structured operational datasets, conducted exploratory analysis, and used Power Query and Power BI transformations for interactive reporting." },
  { title: "Flutter Development Intern", company: "Marvik Academy for Technical Education (MATE)", location: "Udaipur", start_date: "Nov 2024", end_date: "Nov 2024", description: "Assisted with Flutter UI layouts, application structure, navigation flow, debugging, and cross-platform development basics." },
];
const fallbackEducation = [
  { degree: "B.Tech", institution: "Institute of Engineering and Technology, Mohanlal Sukhadia University", field_of_study: "Computer Science and Engineering", location: "Udaipur, Rajasthan", start_date: "2023", end_date: "2027", description: "Current CGPA: 7.78/10." },
  { degree: "Senior Secondary", institution: "Board of Secondary Education, Rajasthan", field_of_study: "Science (PCM)", location: "Rajasthan", start_date: "2023", end_date: "2023", description: "Percentage: 71.40%." },
  { degree: "Secondary", institution: "Board of Secondary Education, Rajasthan", location: "Rajasthan", start_date: "2021", end_date: "2021", description: "Percentage: 89.00%." },
];
const fallbackCertificates = [
  { title: "Programming Fundamentals using Python", issuer: "Infosys", issue_date: "May 2026" },
  { title: "Smart India Hackathon Participation", issuer: "HackNRoll", issue_date: "Sep 2025" },
  { title: "Data Analytics Job Simulation", issuer: "Deloitte", issue_date: "Jul 2025" },
  { title: "Core Java Training", issuer: "Internshala", issue_date: "Jun 2025", description: "Grade B." },
  { title: "SQL for Data Science", issuer: "Great Learning Academy", issue_date: "Oct 2024" },
  { title: "C Programming", issuer: "Great Learning Academy", issue_date: "Oct 2024" },
];

function Arrow() { return <span aria-hidden="true">↗</span>; }

function ContactIcon({ type }) {
  const symbols = { email: "@", phone: "☎", whatsapp: "◉", linkedin: "in", github: "GH" };
  return <span className={`contact-icon contact-icon-${type}`} aria-hidden="true">{symbols[type]}</span>;
}

function ContactDetails({ about }) {
  const whatsappHref = about.whatsapp_number ? `https://wa.me/${about.whatsapp_number.replace(/\D/g, "")}` : "";
  return <div className="contact-details">
    {about.email && <a href={`mailto:${about.email}`}><ContactIcon type="email" /><span className="contact-value"><span>Email</span>{about.email}</span></a>}
    {about.phone_number && <a href={`tel:${about.phone_number}`}><ContactIcon type="phone" /><span className="contact-value"><span>Phone</span>{about.phone_number}</span></a>}
    {about.whatsapp_number && <a href={whatsappHref} target="_blank" rel="noreferrer"><ContactIcon type="whatsapp" /><span className="contact-value"><span>WhatsApp</span>{about.whatsapp_number}</span></a>}
    {about.linkedin_url && <a href={about.linkedin_url} target="_blank" rel="noreferrer"><ContactIcon type="linkedin" /><span className="contact-value"><span>LinkedIn</span>View profile <Arrow /></span></a>}
    {about.github_url && <a href={about.github_url} target="_blank" rel="noreferrer"><ContactIcon type="github" /><span className="contact-value"><span>GitHub</span>View repositories <Arrow /></span></a>}
  </div>;
}

function HeroContactDetails({ about }) {
  return <div className="hero-contact"><div className="hero-contact-row">{about.location && <span><b aria-hidden="true">⌖</b>{about.location}</span>}{about.email && <a href={`mailto:${about.email}`}><b aria-hidden="true">✉</b>{about.email}</a>}</div><div className="hero-socials">{about.github_url && <a className="hero-social github" href={about.github_url} target="_blank" rel="noreferrer" aria-label="GitHub">GH</a>}{about.linkedin_url && <a className="hero-social linkedin" href={about.linkedin_url} target="_blank" rel="noreferrer" aria-label="LinkedIn">in</a>}{about.resume_url && <a className="hero-social resume" href={about.resume_url} target="_blank" rel="noreferrer" aria-label="Resume">PDF</a>}{about.email && <a className="hero-social email" href={`mailto:${about.email}`} aria-label="Email">✉</a>}</div></div>;
}

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  function update(event) { setForm({ ...form, [event.target.name]: event.target.value }); }
  async function submit(event) { event.preventDefault(); setStatus({ type: "", text: "" }); setIsSubmitting(true); try { const result = await submitContact(form); setStatus({ type: "success", text: result.detail }); setForm({ name: "", email: "", subject: "", message: "" }); } catch (error) { setStatus({ type: "error", text: error.message }); } finally { setIsSubmitting(false); } }
  return <form className="contact-form" onSubmit={submit}><div className="contact-fields"><label><span>Name</span><input name="name" required minLength="2" value={form.name} onChange={update} /></label><label><span>Email</span><input name="email" type="email" required value={form.email} onChange={update} /></label></div><label><span>Subject</span><input name="subject" required minLength="2" value={form.subject} onChange={update} /></label><label><span>Message</span><textarea name="message" required minLength="10" rows="5" value={form.message} onChange={update} /></label><div className="contact-form-footer"><button className="button button-dark" disabled={isSubmitting} type="submit">{isSubmitting ? "Sending..." : "Send message"} <Arrow /></button>{status.text && <p className={status.type === "success" ? "form-success" : "form-error"} role="status">{status.text}</p>}</div></form>;
}

export default function App() {
  const [content, setContent] = useState({ about: null, skills: [], projects: [], blogs: [], testimonials: [], experience: [], education: [], certificates: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [expandedBlog, setExpandedBlog] = useState("");

  useEffect(() => {
    getPortfolioContent()
      .then(([about, skills, projects, blogs, testimonials, experience, education, certificates]) => setContent({ about, skills, projects, blogs, testimonials, experience, education, certificates }))
      .catch(() => setLoadError("CMS content is unavailable. Showing the latest saved preview."))
      .finally(() => setIsLoading(false));
  }, []);

  const about = content.about || { headline: "Kismat Kanwar Rathod", summary: "B.Tech Computer Science and Engineering student focused on operating systems, computer architecture, high-performance computing, ML systems, and data analytics.", bio: "Kismat is a Computer Science and Engineering student from Udaipur with hands-on experience in data analytics, Flutter development, and core CS projects. She has built a CPU Scheduling Simulator and is interested in long-term research work that can grow into a final-year project.", resume_url: "/kismat-kanwar-rathod-resume.pdf", location: "Udaipur, Rajasthan, India", email: "kkismatkanwar2007@gmail.com", phone_number: "7851831225", whatsapp_number: "7851831225", github_url: "https://github.com/KISMAT-07", linkedin_url: "https://www.linkedin.com/in/rathorekismat2007" };
  const featuredProjects = content.projects.length ? content.projects.map((project, index) => ({ ...project, type: project.tech_stack?.slice(0, 2).join(" / ") || "Product engineering", description: project.summary, color: ["coral", "blue", "gold"][index % 3] })) : fallbackProjects;
  const skills = content.skills.length ? content.skills.map((skill) => ({ name: skill.name, proficiency: skill.proficiency ?? 0 })) : fallbackSkills;
  const blogs = content.blogs.length ? content.blogs : fallbackBlogs;
  const testimonials = content.testimonials.length ? content.testimonials : fallbackTestimonials;
  const experience = content.experience.length ? content.experience : fallbackExperience;
  const education = content.education.length ? content.education : fallbackEducation;
  const certificates = content.certificates.length ? content.certificates.filter((certificate) => certificate.is_published !== false) : fallbackCertificates;

  return <div className="site-shell">
    <header className="site-header"><a className="wordmark" href="#top">Kisu<span>.</span></a><nav aria-label="Primary navigation"><a href="#top">Home</a><a href="#about">About</a><a href="#skills">Skills</a><a href="#journal">Journal</a><a href="#experience">Experience</a><a href="#education">Education</a><a href="#certificates">Certificates</a><a href="#work">Work</a><a href="#contact">Contact</a></nav><a className="header-link" href="#contact">Let&apos;s talk <Arrow /></a></header>
    <main id="top">
      <section className="hero-section"><div className="hero-copy"><p className="eyebrow">About me</p><h1>{about.headline || "Useful software, carefully built."}</h1><p className="hero-description">{about.summary}</p><HeroContactDetails about={about} /><div className="hero-actions"><a className="button button-dark" href={about.resume_url || "#contact"} target={about.resume_url ? "_blank" : undefined} rel={about.resume_url ? "noreferrer" : undefined}>{about.resume_url ? "Download resume" : "Contact me"} <Arrow /></a><a className="text-link" href="#work">View my work <Arrow /></a></div></div><div className="hero-visual" aria-label="Profile photo and portfolio highlights"><div className="visual-grid" />{about.profile_image_url && <div className="profile-frame"><img className="hero-profile-image" src={resolveMediaUrl(about.profile_image_url)} alt="Kismat Kanwar Rathod" onError={(event) => { event.currentTarget.style.display = "none"; }} /></div>}<div className="visual-card visual-card-main"><span className="card-label">✦ &nbsp; CURRENTLY EXPLORING</span><strong>Operating Systems + Data Analytics</strong></div><div className="visual-card visual-card-side"><span className="side-dot" /><span>{isLoading ? <>API<br />loading</> : <>API<br />ready</>}</span></div><div className="hero-stats"><div><strong>{Math.max(featuredProjects.length, 1)}+</strong><span>Projects</span></div><div><strong>{Math.max(experience.length, 1)}</strong><span>Internships</span></div><div><strong>B.Tech</strong><span>CSE Student</span></div></div><div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" /></div></section>
      <section className="signal-bar"><p>Udaipur, Rajasthan</p><span>✦</span><p>Core CS + Analytics</p><span>✦</span><p>2023 / 2027</p></section>
      <section className="work-section" id="work"><div className="section-intro"><p className="eyebrow">Selected work</p><h2>Systems, data,<br />and useful tools.</h2><p>Projects and internship work shaped by computer science fundamentals, analytics, and practical development.</p></div><div className="project-list">{featuredProjects.map((project, index) => <article className={`project-card ${project.color}`} key={project.title}><div className="project-number">0{index + 1}</div><div className="project-details"><p className="project-type">{project.type}</p><h3>{project.title}</h3><p>{project.description}</p><div className="project-links">{project.live_url && <a href={project.live_url} target="_blank" rel="noreferrer" aria-label={`View live ${project.title}`}>View project <Arrow /></a>}{project.repo_url && <a className="source-link" href={project.repo_url} target="_blank" rel="noreferrer" aria-label={`View source code for ${project.title}`}>View source <Arrow /></a>}{!project.live_url && !project.repo_url && <span className="project-link-muted">{project.tech_stack?.slice(0, 3).join(" / ") || "Project links coming soon"}</span>}</div></div><div className="project-shape" /></article>)}</div></section>
      <section className="about-section" id="about"><div className="about-heading"><p className="eyebrow">A bit about me</p><h2>Learning systems,<br /><em>building clarity.</em></h2><p className="about-lede">A portfolio for Kismat's education, internships, CS projects, certificates, and professional story.</p></div><div className="about-copy"><p>{about.bio || about.summary}</p><p>She is seeking a long-term research internship with the possibility of continuing the work as a final-year project.</p><div className="about-facts"><div><span>Based in</span><strong>{about.location || "India"}</strong></div><div><span>Focus</span><strong>{skills.slice(0, 3).map((skill) => skill.name).join(" · ")}</strong></div><div><span>Education</span><strong>{education[0]?.degree || "Add education in Kisu CMS"}</strong></div></div></div></section>
      <section className="skills-section" id="skills"><div className="section-intro"><p className="eyebrow">Skills and tools</p><h2>Built with<br /><em>careful tools.</em></h2></div><div className="skills-content"><p>The technologies I use to turn thoughtful ideas into reliable products.</p><div className="skill-meters">{skills.map((skill) => <div className="skill-meter" key={skill.name}><div className="skill-meter-label"><span>{skill.name}</span><span>{skill.proficiency}%</span></div><div className="skill-meter-track"><span style={{ width: `${skill.proficiency}%` }} /></div></div>)}</div></div></section>
      <section className="journal-section" id="journal"><div className="section-intro"><p className="eyebrow">From the journal</p><h2>Notes from<br /><em>the work.</em></h2></div><div className="journal-grid">{blogs.slice(0, 3).map((blog) => { const isExpanded = expandedBlog === blog.title; return <article className="journal-card" key={blog.title}><p className="project-type">{blog.tags?.[0] || "Building in public"}</p><h3>{blog.title}</h3><p>{blog.excerpt}</p>{isExpanded && <p className="journal-content">{blog.content || blog.excerpt}</p>}<button className="journal-read-more" type="button" onClick={() => setExpandedBlog(isExpanded ? "" : blog.title)}>{isExpanded ? "Show less" : "Read more"} <Arrow /></button></article>; })}</div></section>
      <section className="timeline-section" id="experience"><div className="section-intro"><p className="eyebrow">Experience</p><h2>A timeline<br /><em>in progress.</em></h2></div><div className="timeline-list">{experience.slice(0, 4).map((item) => <article className="timeline-item" key={`${item.company}-${item.title}`}><div className="timeline-date">{item.start_date}<br />{item.end_date || "Present"}</div><div><h3>{item.title}</h3><p className="timeline-company">{item.company}{item.location ? ` · ${item.location}` : ""}</p><p>{item.description}</p></div></article>)}</div></section>
      <section className="education-section" id="education"><div className="section-intro"><p className="eyebrow">Education</p><h2>The foundation<br /><em>behind the work.</em></h2></div><div className="education-list">{education.length ? education.map((item) => <article className="education-item" key={`${item.institution}-${item.degree}`}><div className="education-date">{item.start_date}<br />{item.end_date || "Present"}</div><div><h3>{item.degree}</h3><p className="education-institution">{item.institution}{item.field_of_study ? ` · ${item.field_of_study}` : ""}{item.location ? ` · ${item.location}` : ""}</p>{item.description && <p>{item.description}</p>}</div></article>) : <p className="education-empty">Education details can be added from Kisu CMS.</p>}</div></section>
      <section className="certificates-section" id="certificates"><div className="section-intro"><p className="eyebrow">Certificates</p><h2>Learning that<br /><em>keeps moving.</em></h2></div><div className="certificate-list">{certificates.map((certificate) => <article className="certificate-item" key={`${certificate.issuer}-${certificate.title}`}>{certificate.image_url && <img className="certificate-image" src={resolveMediaUrl(certificate.image_url)} alt={`${certificate.title} certificate`} onError={(event) => { event.currentTarget.style.display = "none"; }} />}<div className="certificate-date">{certificate.issue_date}</div><div><h3>{certificate.title}</h3><p>{certificate.issuer}</p>{certificate.description && <p className="certificate-description">{certificate.description}</p>}{certificate.credential_url && <a href={certificate.credential_url} target="_blank" rel="noreferrer">View credential <Arrow /></a>}</div></article>)}</div></section>
      <section className="testimonial-section"><p className="eyebrow">A good word</p><blockquote>“{testimonials[0].quote}”</blockquote><p className="quote-author">{testimonials[0].name}{testimonials[0].role ? ` · ${testimonials[0].role}` : ""}</p></section>
      <section className="contact-section" id="contact"><div className="contact-heading"><p className="eyebrow">Have a project in mind?</p><h2>Let&apos;s make<br /><em>something useful.</em></h2><ContactDetails about={about} /></div><ContactForm /></section>
    </main>
    <footer className="site-footer"><span>© 2026 Kismat Kanwar Rathod</span><span>{loadError || "Content managed with Kisu CMS."}</span><a href="#top">Back to top ↑</a></footer>
  </div>;
}
