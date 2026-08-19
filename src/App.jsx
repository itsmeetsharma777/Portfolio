import { useEffect, useRef, useState } from "react";

/* =========================================================
   DATA
   ========================================================= */

const socialLinks = [
  {
    name: "GitHub",
    handle: "@itsmeetsharma777",
    href: "https://github.com/itsmeetsharma777",
    icon: GithubIcon,
    tone: "github",
  },
  {
    name: "LinkedIn",
    handle: "/in/meetsharma777",
    href: "https://www.linkedin.com/in/meetsharma777",
    icon: LinkedinIcon,
    tone: "linkedin",
  },
  {
    name: "LeetCode",
    handle: "@itsmeetsharma",
    href: "https://leetcode.com/u/itsmeetsharma/",
    icon: LeetcodeIcon,
    tone: "leetcode",
  },
  {
    name: "Instagram",
    handle: "@meetsharma777",
    href: "https://www.instagram.com/meetsharma777/",
    icon: InstagramIcon,
    tone: "instagram",
  },
];

const skills = [
  { name: "React", icon: ReactIcon, tone: "react" },
  { name: "Node.js", icon: NodeIcon, tone: "node" },
  { name: "Express", icon: ExpressIcon, tone: "express" },
  { name: "MongoDB", icon: MongoIcon, tone: "mongo" },
  { name: "JavaScript", icon: JavaScriptIcon, tone: "javascript" },
  { name: "Java", icon: JavaIcon, tone: "java" },
  { name: "Python", icon: PythonIcon, tone: "python" },
  { name: "C++", icon: CppIcon, tone: "cpp" },
  { name: "HTML5", icon: HtmlIcon, tone: "html" },
  { name: "CSS3", icon: CssIcon, tone: "css" },
  { name: "Git", icon: GitIcon, tone: "git" },
  { name: "GitHub", icon: GithubIcon, tone: "github" },
];

const projects = [
  {
    number: "01",
    name: "BillNest",
    type: "FULL STACK WEB APPLICATION",
    date: "JULY 2026",
    description:
      "A full-stack warranty management platform that helps users securely store, organize, and track product warranties, making important warranty details easy to access when needed.",
    stack: ["React", "Node.js", "Express", "MongoDB", "JWT", "REST API"],
    href: "https://bill-nest-gamma.vercel.app",
    color: "violet",
    symbol: "BN",
  },
  {
    number: "02",
    name: "EduSync",
    type: "FULL STACK WEB APPLICATION",
    date: "SEPTEMBER 2025",
    description:
      "A personalized student progress tracker informed by attendance patterns and learning data, designed to make progress easier to understand.",
    stack: ["React", "Node.js", "Express", "MongoDB"],
    href: "https://edu-sync-omega-ebon.vercel.app",
    color: "cyan",
    symbol: "ES",
  },
  {
    number: "03",
    name: "Gas Guard Pro",
    type: "IOT SAFETY PROJECT",
    date: "MARCH 2025",
    description:
      "A home-safety system that monitors gas continuously, activates exhaust fans, triggers alarms, and sends timely alerts.",
    stack: ["Arduino", "MQ-2 Sensor", "C++", "Relay Module"],
    href: "#contact",
    color: "orange",
    symbol: "GG",
  },
];

const certifications = [
  "Generative AI / Infosys",
  "Python Data Analytics / Meta",
  "Front-End Development / University of California",
];

/* =========================================================
   APP
   ========================================================= */

function App() {
  const appRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeProject, setActiveProject] = useState(0);

  useEffect(() => {
    let raf = 0;

    const updateScroll = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress = max > 0 ? window.scrollY / max : 0;

      setScrollProgress(Math.min(Math.max(progress, 0), 1));

      raf = 0;
    };

    const requestUpdate = () => {
      if (!raf) {
        raf = requestAnimationFrame(updateScroll);
      }
    };

    requestUpdate();

    window.addEventListener("scroll", requestUpdate, {
      passive: true,
    });

    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);

      if (raf) {
        cancelAnimationFrame(raf);
      }
    };
  }, []);

  useEffect(() => {
    const root = appRef.current;

    if (!root) return;

    let raf = 0;
    let targetX = 50;
    let targetY = 50;
    let currentX = 50;
    let currentY = 50;

    const animate = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      root.style.setProperty("--mouse-x", `${currentX}%`);
      root.style.setProperty("--mouse-y", `${currentY}%`);

      raf = requestAnimationFrame(animate);
    };

    const handlePointer = (event) => {
      targetX = (event.clientX / window.innerWidth) * 100;
      targetY = (event.clientY / window.innerHeight) * 100;
    };

    window.addEventListener("pointermove", handlePointer, {
      passive: true,
    });

    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", handlePointer);

      if (raf) {
        cancelAnimationFrame(raf);
      }
    };
  }, []);

  const handleProjectMove = (event) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    card.style.setProperty("--card-x", `${x}%`);
    card.style.setProperty("--card-y", `${y}%`);

    const rotateX = ((y - 50) / 50) * -3;
    const rotateY = ((x - 50) / 50) * 4;

    card.style.setProperty("--rotate-x", `${rotateX}deg`);
    card.style.setProperty("--rotate-y", `${rotateY}deg`);
  };

  const resetProjectMove = (event) => {
    const card = event.currentTarget;

    card.style.setProperty("--card-x", "50%");
    card.style.setProperty("--card-y", "50%");
    card.style.setProperty("--rotate-x", "0deg");
    card.style.setProperty("--rotate-y", "0deg");
  };

  return (
    <main
      ref={appRef}
      className="portfolio"
      id="top"
      style={{
        "--scroll-progress": scrollProgress,
      }}
    >
      <CursorGlow />

      {/* =====================================================
          HERO
          ===================================================== */}

      <section className="hero" id="home">
        <div className="hero-grid-background" />

        <div className="hero-noise" />

        <Header />

        <div className="hero-content">
          <div className="hero-status glass-pill">
            <span className="status-light" />
            Available for internships & collaborations
          </div>

          <div className="hero-eyebrow">
            <span>01</span>
            COMPUTER SCIENCE / FULL STACK
          </div>

          <h1 className="hero-title">
            <span className="hero-line">
              Meet
              <span className="hero-image">
                <img
                  src="/assets/meet-sharma.jpg"
                  alt="Meet Sharma"
                />
              </span>
              Sharma
            </span>

            <span className="hero-line hero-line-outline">
              Full Stack
            </span>

            <span className="hero-line">
              <span className="gradient-text">Developer.</span>
            </span>
          </h1>

          <p className="hero-description">
            Computer Science undergraduate at Chandigarh University,
            focused on practical web applications, thoughtful
            interfaces, and full-stack problem solving.
          </p>

          <div className="hero-buttons">
            <a
              href="#projects"
              className="neon-button neon-button-primary"
            >
              <span>Explore my work</span>
              <ArrowIcon />
            </a>

            <a
              href="/Meet-Sharma-Resume.pdf"
              download
              className="neon-button neon-button-secondary"
            >
              <span>Download resume</span>
              <DownloadIcon />
            </a>
          </div>

          <div className="hero-meta">
            <span>React / Node / MongoDB</span>
            <span className="meta-line" />
            <span>Damoh, Madhya Pradesh</span>
          </div>
        </div>

        <div className="hero-orbit hero-orbit-one" />
        <div className="hero-orbit hero-orbit-two" />
        <div className="hero-orbit hero-orbit-three" />

        <div className="floating-code code-one">
          {"<React />"}
        </div>

        <div className="floating-code code-two">
          {"{ build: true }"}
        </div>

        <div className="floating-code code-three">
          {"npm run ship"}
        </div>

        <div className="hero-scroll">
          <span>SCROLL TO EXPLORE</span>
          <div className="scroll-arrow">
            <span />
          </div>
        </div>
      </section>

      {/* =====================================================
          MOVING TECH STRIP
          ===================================================== */}

      <section className="tech-strip">
        <div className="tech-track">
          {[...skills, ...skills].map((skill, index) => {
            const Icon = skill.icon;

            return (
              <span key={`${skill.name}-${index}`}>
                <span className={`mini-icon ${skill.tone}`}>
                  <Icon />
                </span>

                {skill.name}

                <b>+</b>
              </span>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          ABOUT
          ===================================================== */}

      <section className="section about-section" id="about">
        <SectionLabel number="02" text="PROFILE" />

        <div className="about-layout">
          <div className="about-heading reveal">
            <span>Building</span>
            <span>
              useful <i>digital</i>
            </span>
            <span>experiences.</span>
          </div>

          <div className="about-copy reveal">
            <p>
              I am a Computer Science and Engineering undergraduate
              with hands-on experience in React.js, Node.js,
              Express.js, and MongoDB.
            </p>

            <p>
              I enjoy taking a problem from an idea to a responsive,
              practical web application — combining clean interfaces
              with useful backend systems.
            </p>

            <a
              className="inline-link"
              href="mailto:meetsharma0702@gmail.com"
            >
              Let's work together
              <ArrowIcon />
            </a>
          </div>
        </div>

        <div className="stats-grid">
          <Stat number="2028" label="Expected graduation" />
          <Stat number="10+" label="Projects built" />
          <Stat number="50+" label="DSA problems solved" />
          <Stat number="SIH" label="Hackathon participant" />
        </div>
      </section>

      {/* =====================================================
          EXPERIENCE
          ===================================================== */}

      <section className="section experience-section" id="experience">
        <SectionLabel number="03" text="EXPERIENCE" />

        <div className="experience-header reveal">
          <div>
            <span className="tiny-label">RECENT EXPERIENCE</span>

            <h2>
              Learning by
              <br />
              <span className="gradient-text">building.</span>
            </h2>
          </div>

          <p>
            Production-minded development, debugging,
            collaboration and full-stack implementation.
          </p>
        </div>

        <div className="experience-window glass-card reveal">
          <div className="window-bar">
            <div className="window-dots">
              <i />
              <i />
              <i />
            </div>

            <span>experience.log</span>

            <span className="window-status">
              ACTIVE
            </span>
          </div>

          <div className="experience-body">
            <div className="experience-index">
              01
            </div>

            <div className="experience-company">
              <span>JUN 2026 — JUL 2026</span>

              <h3>BinaryLogix</h3>

              <p>Bhopal, Madhya Pradesh</p>
            </div>

            <div className="experience-role">
              <span className="role-badge">
                INTERNSHIP
              </span>

              <h3>
                Full Stack Web
                <br />
                Development Intern
              </h3>

              <ul>
                <li>
                  Developed 3+ responsive web applications with
                  React.js and Node.js.
                </li>

                <li>
                  Built REST APIs with Express.js and integrated
                  MongoDB for CRUD operations.
                </li>

                <li>
                  Collaborated through Git and GitHub while
                  debugging and improving performance.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PROJECTS
          ===================================================== */}

      <section className="section projects-section" id="projects">
        <SectionLabel number="04" text="SELECTED WORK" />

        <div className="projects-intro reveal">
          <div>
            <span className="tiny-label">
              PROJECT ARCHIVE / 2025 — 2026
            </span>

            <h2>
              Things I've
              <br />
              <span className="gradient-text">built.</span>
            </h2>
          </div>

          <p>
            Real projects built around useful problems,
            experimentation and full-stack development.
          </p>
        </div>

        <div className="project-stack-area">
          <div className="project-cards">
            {projects.map((project, index) => {
              return (
                <a
                  href={project.href}
                  target={
                    project.href.startsWith("http")
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    project.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className={`project-card project-${project.color}`}
                  key={project.name}
                  onMouseMove={handleProjectMove}
                  onMouseLeave={resetProjectMove}
                  onMouseEnter={() => setActiveProject(index)}
                >
                  <div className="project-glow" />

                  <div className="project-top">
                    <span className="project-number">
                      {project.number}
                    </span>

                    <span className="project-date">
                      {project.date}
                    </span>

                    <span className="project-open">
                      <ExternalIcon />
                    </span>
                  </div>

                  <div className="project-visual">
                    <div className="project-symbol">
                      {project.symbol}
                    </div>

                    <div className="project-ring ring-a" />
                    <div className="project-ring ring-b" />
                    <div className="project-ring ring-c" />

                    <div className="project-scan" />
                  </div>

                  <div className="project-info">
                    <span className="project-type">
                      {project.type}
                    </span>

                    <h3>{project.name}</h3>

                    <p>{project.description}</p>

                    <div className="project-tags">
                      {project.stack.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </div>

                  <div className="project-bottom">
                    <span>VIEW PROJECT</span>

                    <ArrowIcon />
                  </div>
                </a>
              );
            })}
          </div>

          <div className="project-pagination">
            {projects.map((project, index) => (
              <button
                key={project.name}
                type="button"
                className={
                  activeProject === index
                    ? "active"
                    : ""
                }
                onClick={() => {
                  const cards =
                    document.querySelectorAll(
                      ".project-card"
                    );

                  cards[index]?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }}
              >
                <span>0{index + 1}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          SKILLS
          ===================================================== */}

      <section className="section skills-section" id="skills">
        <SectionLabel number="05" text="TOOLKIT" />

        <div className="skills-heading reveal">
          <span className="tiny-label">
            TECHNOLOGY / STACK
          </span>

          <h2>
            My digital
            <br />
            <span className="gradient-text">
              toolbox.
            </span>
          </h2>
        </div>

        <div className="skills-cards">
          {skills.map((skill, index) => {
            const Icon = skill.icon;

            return (
              <div
                className="skill-card glass-card"
                key={skill.name}
                style={{
                  "--delay": `${index * 45}ms`,
                }}
              >
                <span className="skill-card-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span
                  className={`skill-large-icon ${skill.tone}`}
                >
                  <Icon />
                </span>

                <span className="skill-name">
                  {skill.name}
                </span>

                <span className="skill-arrow">
                  ↗
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          EDUCATION
          ===================================================== */}

      <section className="section education-section">
        <SectionLabel number="06" text="EDUCATION & LEARNING" />

        <div className="education-grid">
          <div className="education-main glass-card reveal">
            <div className="education-orbit" />

            <span className="tiny-label">
              UNIVERSITY
            </span>

            <h2>
              Chandigarh
              <br />
              <span>University.</span>
            </h2>

            <p>
              B.E. Computer Science & Engineering
            </p>

            <div className="education-footer">
              <span>EXPECTED GRADUATION</span>
              <strong>2028</strong>
            </div>
          </div>

          <div className="certification-card glass-card reveal">
            <span className="tiny-label">
              CERTIFICATIONS
            </span>

            <div className="certification-list">
              {certifications.map((item, index) => (
                <div key={item}>
                  <span>
                    0{index + 1}
                  </span>

                  <p>{item}</p>

                  <ExternalIcon />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTACT
          ===================================================== */}

      <footer className="contact-section" id="contact">
        <div className="contact-grid" />

        <div className="contact-orbit" />

        <SectionLabel number="07" text="GET IN TOUCH" />

        <div className="contact-content">
          <span className="tiny-label">
            HAVE AN IDEA?
          </span>

          <h2>
            Let's build
            <br />
            <span className="gradient-text">
              something.
            </span>
          </h2>

          <p>
            Open to internships, collaborations,
            interesting projects and opportunities
            to build useful things.
          </p>

          <a
            href="mailto:meetsharma0702@gmail.com"
            className="contact-email"
          >
            <span>meetsharma0702@gmail.com</span>
            <ArrowIcon />
          </a>
        </div>

        <div className="footer-socials">
          {socialLinks.map((link) => {
            const Icon = link.icon;

            return (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                key={link.name}
              >
                <span
                  className={`footer-icon ${link.tone}`}
                >
                  <Icon />
                </span>

                <span>{link.name}</span>

                <span className="footer-handle">
                  {link.handle}
                </span>

                <ExternalIcon />
              </a>
            );
          })}
        </div>

        <div className="footer-bottom">
          <span>MEET SHARMA / 2026</span>

          <a href="#top">
            BACK TO TOP ↑
          </a>

          <span>BUILT WITH REACT</span>
        </div>
      </footer>
    </main>
  );
}

/* =========================================================
   HEADER
   ========================================================= */

function Header() {
  return (
    <header className="site-header">
      <a href="#top" className="logo">
        MS<span>.</span>
      </a>

      <nav>
        <a href="#about">About</a>
        <a href="#experience">Experience</a>
        <a href="#projects">Work</a>
        <a href="#skills">Skills</a>
        <a href="#contact">Contact</a>
      </nav>

      <a
        href="mailto:meetsharma0702@gmail.com"
        className="header-cta"
      >
        <span />
        Available for internships
      </a>
    </header>
  );
}

/* =========================================================
   CURSOR
   ========================================================= */

function CursorGlow() {
  return (
    <div className="cursor-glow" aria-hidden="true">
      <div />
    </div>
  );
}

/* =========================================================
   SECTION LABEL
   ========================================================= */

function SectionLabel({ number, text }) {
  return (
    <div className="section-label">
      <span>{number}</span>
      <i />
      <strong>{text}</strong>
    </div>
  );
}

/* =========================================================
   STAT
   ========================================================= */

function Stat({ number, label }) {
  return (
    <div className="stat-card glass-card">
      <strong>{number}</strong>

      <span>{label}</span>

      <i />
    </div>
  );
}

/* =========================================================
   SVG WRAPPER
   ========================================================= */

function Svg({ children, viewBox = "0 0 24 24" }) {
  return (
    <svg
      viewBox={viewBox}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

/* =========================================================
   ARROW
   ========================================================= */

function ArrowIcon() {
  return (
    <Svg>
      <path
        fill="currentColor"
        d="M13.3 4.3 12 5.7l4 4H4v1.85h12l-4 4 1.3 1.3 6.2-6.22Z"
      />
    </Svg>
  );
}

/* =========================================================
   DOWNLOAD
   ========================================================= */

function DownloadIcon() {
  return (
    <Svg>
      <path
        fill="currentColor"
        d="M11.1 3h1.8v10.12l3.23-3.22 1.27 1.27-5.4 5.4-5.4-5.4 1.27-1.27 3.23 3.22ZM5 19h14v2H5Z"
      />
    </Svg>
  );
}

/* =========================================================
   EXTERNAL
   ========================================================= */

function ExternalIcon() {
  return (
    <Svg>
      <path
        fill="currentColor"
        d="M13 3h8v8h-1.8V6.08l-8.56 8.56-1.28-1.28 8.56-8.56H13ZM5 5h6v1.8H6.8v10.4h10.4V13H19v6H5Z"
      />
    </Svg>
  );
}

/* =========================================================
   BRAND ICONS
   ========================================================= */

function GithubIcon() {
  return (
    <Svg>
      <path
        fill="currentColor"
        d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.42-4.04-1.42-.55-1.38-1.33-1.74-1.33-1.74-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.08 1.84 2.82 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.96 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.53.12-3.19 0 0 1.01-.32 3.3 1.23a11.38 11.38 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.89.12 3.19.76.84 1.23 1.91 1.23 3.22 0 4.63-2.8 5.65-5.48 5.95.43.37.82 1.09.82 2.21v3.27c0 .32.22.69.83.58A12 12 0 0 0 12 .5Z"
      />
    </Svg>
  );
}

function LinkedinIcon() {
  return (
    <Svg>
      <path
        fill="currentColor"
        d="M4.98 3.5A2.48 2.48 0 1 0 5 8.46 2.48 2.48 0 0 0 4.98 3.5ZM3 9h4v12H3Zm7 0h3.83v1.64h.06c.53-.95 1.84-1.95 3.79-1.95C21.6 8.69 23 10.28 23 13.2V21h-4v-6.92c0-1.65-.03-3.77-2.3-3.77-2.3 0-2.65 1.8-2.65 3.65V21h-4Z"
      />
    </Svg>
  );
}

function InstagramIcon() {
  return (
    <Svg>
      <path
        fill="currentColor"
        d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5A3.95 3.95 0 0 0 7.75 20.2h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95Zm8.96 1.35a1.09 1.09 0 1 1 0 2.18 1.09 1.09 0 0 1 0-2.18ZM12 6.86A5.14 5.14 0 1 1 6.86 12 5.15 5.15 0 0 1 12 6.86Zm0 1.8A3.34 3.34 0 1 0 15.34 12 3.35 3.35 0 0 0 12 8.66Z"
      />
    </Svg>
  );
}

function LeetcodeIcon() {
  return (
    <Svg viewBox="0 0 32 32">
      <path
        fill="currentColor"
        d="M20.72 4.24a2 2 0 0 1 2.83 0l4.2 4.2a2 2 0 0 1 0 2.83l-9.1 9.1a2 2 0 0 1-2.82-2.84l7.69-7.68-2.79-2.78-10.5 10.5 2.79 2.78 4.04-4.04a2 2 0 1 1 2.83 2.83l-5.46 5.45a2 2 0 0 1-2.83 0l-4.2-4.2a2 2 0 0 1 0-2.83Z"
      />

      <path
        fill="currentColor"
        d="M12.68 27.76a2 2 0 0 1 0-4h13.08a2 2 0 1 1 0 4Z"
      />
    </Svg>
  );
}

function ReactIcon() {
  return (
    <Svg>
      <circle
        cx="12"
        cy="12"
        r="1.8"
        fill="currentColor"
      />

      <ellipse
        cx="12"
        cy="12"
        rx="8"
        ry="3.3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      <ellipse
        cx="12"
        cy="12"
        rx="8"
        ry="3.3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        transform="rotate(60 12 12)"
      />

      <ellipse
        cx="12"
        cy="12"
        rx="8"
        ry="3.3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        transform="rotate(120 12 12)"
      />
    </Svg>
  );
}

function JavaScriptIcon() {
  return (
    <Svg>
      <path
        fill="currentColor"
        d="M3 3h18v18H3Z"
      />

      <path
        fill="#181818"
        d="M14.05 16.93c.39.63.9 1.1 1.82 1.1.76 0 1.25-.38 1.25-.91 0-.63-.5-.85-1.34-1.22l-.46-.2c-1.34-.57-2.23-1.29-2.23-2.8 0-1.39 1.06-2.45 2.72-2.45 1.18 0 2.03.41 2.64 1.49l-1.45.93c-.32-.57-.66-.79-1.19-.79-.54 0-.89.34-.89.79 0 .55.34.77 1.12 1.1l.46.2c1.58.68 2.47 1.37 2.47 2.92 0 1.67-1.31 2.58-3.07 2.58-1.72 0-2.83-.82-3.37-1.89Zm-6.54.16c.29.52.55.96 1.18.96.6 0 .98-.23.98-1.13v-6.11h1.83v6.14c0 1.86-1.09 2.71-2.68 2.71-1.44 0-2.27-.74-2.69-1.63Z"
      />
    </Svg>
  );
}

function NodeIcon() {
  return (
    <Svg viewBox="0 0 32 32">
      <path
        fill="currentColor"
        d="m16 2 12.1 7v14L16 30 3.9 23V9Zm0 2.93-9.56 5.52v11.1L16 27.07l9.56-5.52v-11.1Z"
      />

      <path
        fill="currentColor"
        d="M16 8.2c-4.35 0-5.08 2.78-5.08 4.6 0 1.02.37 1.73 1.01 2.1.67.39 1.23.15 1.43-.4.24-.63.48-1.3.48-1.3.08-.2.01-.41-.17-.5-.18-.09-.4-.02-.5.16 0 0-.25.55-.44.96-.1.23-.22.27-.4.16-.17-.1-.3-.36-.3-.78 0-1.48.5-3.5 3.96-3.5 2.84 0 4.04 1.26 4.04 3.41 0 2.48-1.52 3.92-3.77 3.92-.74 0-1.4-.3-1.74-.66l-.3.96c.53.48 1.3.8 2.17.8 2.93 0 4.78-1.91 4.78-4.99 0-2.87-1.86-4.87-5.17-4.87Z"
      />
    </Svg>
  );
}

function ExpressIcon() {
  return (
    <Svg>
      <path
        fill="currentColor"
        d="M3 7h7.8v2H5.56v2.6h4.52v1.96H5.56V16H11v2H3Zm9.3 0h2.72l2.1 3.4L19.19 7H22l-3.42 5.34L22.2 18h-2.8l-2.3-3.68L14.78 18H12l3.66-5.68Z"
      />
    </Svg>
  );
}

function MongoIcon() {
  return (
    <Svg>
      <path
        fill="currentColor"
        d="M12.4 2.2c.24 3.28 2.86 4.53 3.56 7.36.74 2.98-.22 7.86-3.18 11.47l-.62.77-.1-4.04c.79-.37 1.1-1.25 1.1-1.25-.48.26-1.01.33-1.01.33l-.12-14.64Z"
      />

      <path
        fill="currentColor"
        d="M11.86 2.2C9.08 5.19 7.82 7.96 8.1 11.1c.25 2.81 1.7 5.6 3.74 8.13l.05-15.2Z"
      />
    </Svg>
  );
}

function JavaIcon() {
  return (
    <Svg>
      <path
        fill="currentColor"
        d="M12.01 2c-1.2 2.47.32 3.26.32 4.9 0 1.49-1.24 2.23-1.24 3.65 0 1.13.6 1.88 1.05 2.38-1.89-1.02-3.14-2.53-3.14-4.25 0-2.02 1.47-3.76 3.01-6.68ZM15.5 5.05c.5 1.4-1.65 2.34-1.65 4.23 0 1.05.44 1.72.79 2.16-1.3-.75-2.16-1.85-2.16-3.14 0-1.42.91-2.43 3.02-3.25ZM6 15.2c1.38 1.25 10.62 1.25 12 0-.55 2.85-11.45 2.85-12 0Zm1.16 3.11c2.52.92 7.16.92 9.68 0-1.72 2.3-7.96 2.3-9.68 0Z"
      />
    </Svg>
  );
}

function CppIcon() {
  return (
    <Svg viewBox="0 0 32 32">
      <path
        fill="currentColor"
        d="M16 2 29 9.5v13L16 30 3 22.5v-13Zm0 3.6L6.13 11.3v9.4L16 26.4l9.87-5.7v-9.4Z"
      />

      <path
        fill="currentColor"
        d="M11 14h4v-2h-4v2h-2v4h2v2h4v-2h-4v-4Zm9 0h-2v-2h-2v2h-2v2h2v2h2v-2h2v-2Zm4 0h-2v-2h-2v2h-2v2h2v2h2v-2h2Z"
      />
    </Svg>
  );
}

function PythonIcon() {
  return (
    <Svg>
      <path
        fill="currentColor"
        d="M11.87 2.2c-4.1 0-3.84 1.78-3.84 1.78l.01 1.84h3.9v.55H6.49S3.88 6.08 3.88 10.23s2.28 4 2.28 4h1.36v-1.92s-.07-2.29 2.25-2.29h3.87s2.18.04 2.18-2.12V4.34s.33-2.14-3.95-2.14Zm-2.15 1.23a.72.72 0 1 1 0 1.44.72.72 0 0 1 0-1.44Z"
      />

      <path
        fill="#ffd845"
        d="M12.13 21.8c4.1 0 3.84-1.78 3.84-1.78l-.01-1.84h-3.9v-.55h5.45s2.61.29 2.61-3.86-2.28-4-2.28-4h-1.36v1.92s.07-2.29-2.25 2.29h-3.87s-2.18-.04-2.18 2.12v3.56s-.33 2.14 3.95 2.14Zm2.15-1.23a.72.72 0 1 1 0-1.44.72.72 0 0 1 0 1.44Z"
      />
    </Svg>
  );
}

function HtmlIcon() {
  return (
    <Svg>
      <path
        fill="currentColor"
        d="M4 3h16l-1.45 16.23L12 21l-6.55-1.77Z"
      />

      <path
        fill="#ef652a"
        d="M12 19.24 17.29 17.8 18.53 4.33H12Z"
      />
    </Svg>
  );
}

function CssIcon() {
  return (
    <Svg>
      <path
        fill="currentColor"
        d="M4 3h16l-1.45 16.23L12 21l-6.55-1.77Z"
      />

      <path
        fill="#2c7acb"
        d="M12 19.24 17.29 17.8 18.53 4.33H12Z"
      />
    </Svg>
  );
}

function GitIcon() {
  return (
    <Svg>
      <path
        fill="currentColor"
        d="M22.7 10.4 13.6 1.3a1.1 1.1 0 0 0-1.55 0l-1.9 1.9 2.4 2.4a2.57 2.57 0 0 1 3.3 3.3l2.3 2.3a2.57 2.57 0 1 1-1.46 1.46l-2.15-2.15v5.65a2.57 2.57 0 1 1-2.03.07V10.5a2.57 2.57 0 0 1-1.4-3.37L8.8 4.82 1.3 12.3a1.1 1.1 0 0 0 0 1.55l9.1 9.1a1.1 1.1 0 0 0 1.55 0l10.75-10.76a1.1 1.1 0 0 0 0-1.55Z"
      />
    </Svg>
  );
}

export default App;