import { useEffect, useRef, useState } from "react";

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

const skillGroups = [
  {
    label: "Languages",
    items: [
      { name: "Java", icon: JavaIcon, tone: "java" },
      { name: "C++", icon: CppIcon, tone: "cpp" },
      { name: "Python", icon: PythonIcon, tone: "python" },
      { name: "JavaScript", icon: JavaScriptIcon, tone: "javascript" },
    ],
  },
  {
    label: "Web stack",
    items: [
      { name: "React", icon: ReactIcon, tone: "react" },
      { name: "Node.js", icon: NodeIcon, tone: "node" },
      { name: "Express", icon: ExpressIcon, tone: "express" },
      { name: "MongoDB", icon: MongoIcon, tone: "mongo" },
      { name: "MySQL", icon: MysqlIcon, tone: "mysql" },
    ],
  },
  {
    label: "Frontend",
    items: [
      { name: "HTML5", icon: HtmlIcon, tone: "html" },
      { name: "CSS3", icon: CssIcon, tone: "css" },
      { name: "Git", icon: GitIcon, tone: "git" },
      { name: "GitHub", icon: GithubIcon, tone: "github" },
    ],
  },
];

/*
 * PROJECTS
 *
 * Replace the href values below with your actual deployed
 * project URLs.
 */
const projects = [
  {
    number: "01",
    name: "BillNest",
    type: "Full Stack Web Application",
    date: "July 2026",
    description:
    "A full-stack warranty management platform that helps users securely store, organize, and track product warranties, making important warranty details easy to access when needed.",
    stack: ["React", "Node.js", "Express", "MongoDB", "JWT", "REST API"],    accent: "project-iot",
    href: "https:bill-nest-gamma.vercel.app",
  },
  {
    number: "02",
    name: "EduSync",
    type: "Full Stack Web Application",
    date: "September 2025",
    description:
      "A personalized student progress tracker informed by attendance patterns and learning data, designed to make progress easier to understand.",
    stack: ["React", "Node.js", "Express", "MongoDB"],
    accent: "project-education",
    href: "https://edu-sync-omega-ebon.vercel.app",
  },
  {
    number: "03",
    name: "Gas Guard Pro",
    type: "IoT Safety Project",
    date: "March 2025",
    description:
      "A home-safety system that monitors gas continuously, activates exhaust fans, triggers alarms, and sends timely alerts.",
    stack: ["Arduino", "MQ-2 Sensor", "C++", "Relay Module"],
    accent: "project-iot"
  },
];

const movingSkills = [
  "React.js",
  "Node.js",
  "Express.js",
  "MongoDB",
  "JavaScript",
  "Java",
  "Python",
  "REST APIs",
  "Git & GitHub",
  "Problem Solving",
];

function App() {
  const heroRef = useRef(null);
  const [heroProgress, setHeroProgress] = useState(0);
  const [pageProgress, setPageProgress] = useState(0);

  useEffect(() => {
    let frameId = 0;

    const updateMotion = () => {
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const nextPageProgress =
        documentHeight > 0 ? window.scrollY / documentHeight : 0;

      setPageProgress(Math.min(Math.max(nextPageProgress, 0), 1));

      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();

        const scrollDistance = Math.max(
          heroRef.current.offsetHeight - window.innerHeight,
          1
        );

        const nextHeroProgress = Math.min(
          Math.max(-rect.top / scrollDistance, 0),
          1
        );

        setHeroProgress(nextHeroProgress);
      }

      document.querySelectorAll("[data-scroll-scene]").forEach((scene) => {
        const rect = scene.getBoundingClientRect();
        const viewport = window.innerHeight;

        const progress = Math.min(
          Math.max(
            (viewport - rect.top) / (viewport + rect.height),
            0
          ),
          1
        );

        scene.style.setProperty(
          "--scene-progress",
          progress.toFixed(3)
        );
      });

      frameId = 0;
    };

    const requestMotionUpdate = () => {
      if (!frameId) {
        frameId = window.requestAnimationFrame(updateMotion);
      }
    };

    requestMotionUpdate();

    window.addEventListener(
      "scroll",
      requestMotionUpdate,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      requestMotionUpdate
    );

    return () => {
      window.removeEventListener(
        "scroll",
        requestMotionUpdate
      );

      window.removeEventListener(
        "resize",
        requestMotionUpdate
      );

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <main
      id="top"
      className="portfolio"
      style={{
        "--hero-progress": heroProgress,
        "--page-progress": pageProgress,
      }}
    >
      {/* ==================== HERO ==================== */}

      <section className="hero-scroll" ref={heroRef}>
        <div className="hero-stage">

          <a
            className="availability-banner"
            href="mailto:meetsharma0702@gmail.com"
          >
            <span className="availability-dot" />

            Available for internships and collaborations

            <span className="availability-action">
              Get in touch <ArrowIcon />
            </span>
          </a>

          <Header />

          <div className="hero-grid">

            {/* HERO CONTENT */}

            <div className="hero-copy">

              <p className="kicker">
                Hey, I&apos;m
              </p>

              <h1>

                <span className="hero-name">
                  Meet

                  <span className="inline-portrait">
                    <img
                      src="/assets/meet-sharma.jpg"
                      alt="Meet Sharma"
                    />
                  </span>

                  Sharma
                </span>

                <span>
                  A Full Stack <strong>Developer</strong>
                </span>

                <em>
                  Building digital products that work.
                </em>

              </h1>

              <p className="hero-description">
                Computer Science undergraduate at Chandigarh
                University, focused on practical web applications,
                thoughtful interfaces, and full-stack problem solving.
              </p>

              <div className="hero-actions hero-actions-main">

                <a
                  className="button button-primary"
                  href="#projects"
                >
                  View selected work <ArrowIcon />
                </a>

                <a
                  className="button button-quiet"
                  href="/Meet-Sharma-Resume.pdf"
                  download
                >
                  Download resume <DownloadIcon />
                </a>

              </div>

              <div
                className="hero-socials"
                aria-label="Social links"
              >

                {socialLinks.map((link) => {
                  const Icon = link.icon;

                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.name}
                    >
                      <span
                        className={`brand-icon ${link.tone}`}
                      >
                        <Icon />
                      </span>
                    </a>
                  );
                })}

                <span className="hero-social-divider" />

                <a
                  className="hero-talk-link"
                  href="mailto:meetsharma0702@gmail.com"
                >
                  Let&apos;s talk <ArrowIcon />
                </a>

              </div>
            </div>

            {/* HERO VISUAL */}

            <div
              className="hero-machine"
              aria-label="Scroll-reactive developer profile visual"
            >

              <div className="machine-caption caption-top">
                React / Node / MongoDB
              </div>

              <div className="machine-caption caption-bottom">
                Damoh, Madhya Pradesh, India
              </div>

              <div className="machine-orbit orbit-one" />
              <div className="machine-orbit orbit-two" />
              <div className="machine-orbit orbit-three" />

              <div className="machine-ticks" />

              <div className="machine-core">
                <span className="core-mark">
                  MS
                </span>

                <span className="core-label">
                  BUILD / LEARN / SHIP
                </span>
              </div>

              <div className="portrait-card">
                <img
                  src="/assets/meet-sharma.jpg"
                  alt="Meet Sharma"
                />
              </div>

              <div className="machine-node node-react">
                <ReactIcon />
              </div>

              <div className="machine-node node-js">
                <JavaScriptIcon />
              </div>

              <div className="machine-node node-db">
                <MongoIcon />
              </div>

            </div>
          </div>

          <div className="hero-foot">

            <span>
              Scroll to explore
            </span>

            <div className="scroll-line">
              <i />
            </div>

            <span>
              {Math.round(heroProgress * 100)
                .toString()
                .padStart(2, "0")}{" "}
              / 100
            </span>

          </div>

        </div>
      </section>

      {/* ==================== SKILL MARQUEE ==================== */}

      <section
        className="skill-marquee"
        aria-label="Technical skills"
      >
        <div className="marquee-track">

          {[...movingSkills, ...movingSkills].map(
            (skill, index) => (
              <span key={`${skill}-${index}`}>
                {skill}
                <i>+</i>
              </span>
            )
          )}

        </div>
      </section>

      {/* ==================== ABOUT ==================== */}

      <section
        className="intro-section section-shell"
        id="about"
        data-scroll-scene
      >

        <div className="section-index">
          01 / PROFILE
        </div>

        <div className="intro-layout">

          <h2>
            A developer who connects thoughtful interfaces
            with useful systems.
          </h2>

          <div className="intro-copy">

            <p>
              I am a Computer Science and Engineering
              undergraduate with hands-on experience in
              React.js, Node.js, Express.js, and MongoDB.
              I enjoy taking a problem from an idea to a
              responsive, practical web application.
            </p>

            <a
              className="text-link"
              href="mailto:meetsharma0702@gmail.com"
            >
              Let&apos;s work together <ArrowIcon />
            </a>

          </div>

        </div>

        <div className="fact-grid">

          <Fact
            value="2028"
            label="Expected graduation"
          />

          <Fact
            value="10+"
            label="Number of project's"
          />

          <Fact
            value="50+"
            label="DSA problems solved"
          />

          <Fact
            value="SIH"
            label="Smart India Hackathon participant"
          />

        </div>

      </section>

      {/* ==================== EXPERIENCE ==================== */}

      <section
        className="experience-section section-shell"
        id="experience"
        data-scroll-scene
      >

        <div className="section-heading-row">

          <div>

            <div className="section-index">
              02 / EXPERIENCE
            </div>

            <h2>
              Working across the stack.
            </h2>

          </div>

          <p>
            Building production-minded features with a
            practical, collaborative approach.
          </p>

        </div>

        <article className="experience-card">

          <div className="experience-date">
            JUN 2026 - JUL 2026
          </div>

          <div className="experience-role">

            <p>
              BinaryLogix, Bhopal
            </p>

            <h3>
              Full Stack Web Development Intern
            </h3>

          </div>

          <ul>

            <li>
              Developed 3+ responsive web applications
              with React.js and Node.js.
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

        </article>

      </section>

      {/* ==================== PROJECTS ==================== */}

      <section
        className="projects-section section-shell"
        id="projects"
        data-scroll-scene
      >

        <div className="section-heading-row">

          <div>

            <div className="section-index">
              03 / SELECTED WORK
            </div>

            <h2>
              Projects made to solve real problems.
            </h2>

          </div>

          <p>
            Two focused builds across web development,
            analytics, and physical safety.
          </p>

        </div>

        <div className="project-list">

          {projects.map((project) => (

            /*
             * IMPORTANT:
             *
             * The project card is now an <a> element.
             * Clicking anywhere on the card will open
             * the project's website.
             */

            <a
              className={`project-card ${project.accent}`}
              key={project.name}
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.name} project`}
            >

              <div className="project-number">
                {project.number}
              </div>

              <div className="project-content">

                <p className="project-type">

                  {project.type}

                  <span>
                    {project.date}
                  </span>

                </p>

                <h3>
                  {project.name}
                </h3>

                <p className="project-description">
                  {project.description}
                </p>

                <div className="project-stack">

                  {project.stack.map((item) => (
                    <span key={item}>
                      {item}
                    </span>
                  ))}

                </div>

              </div>

              <div
                className="project-art"
                aria-hidden="true"
              >

                <span className="project-orbit" />

                <span className="project-pulse" />

                <span className="project-grid" />

              </div>

            </a>

          ))}

        </div>

      </section>

      {/* ==================== SKILLS ==================== */}

      <section
        className="skills-section section-shell"
        id="skills"
        data-scroll-scene
      >

        <div className="section-heading-row">

          <div>

            <div className="section-index">
              04 / TOOLKIT
            </div>

            <h2>
              The tools behind the work.
            </h2>

          </div>

          <p>
            From frontend detail to backend logic, with each
            icon in its recognizable brand color.
          </p>

        </div>

        <div className="skills-grid">

          {skillGroups.map((group) => (

            <article
              className="skill-group"
              key={group.label}
            >

              <h3>
                {group.label}
              </h3>

              <div className="skill-list">

                {group.items.map((item) => {

                  const Icon = item.icon;

                  return (
                    <div
                      className="skill-item"
                      key={item.name}
                    >

                      <span
                        className={`brand-icon ${item.tone}`}
                      >
                        <Icon />
                      </span>

                      <span>
                        {item.name}
                      </span>

                    </div>
                  );

                })}

              </div>

            </article>

          ))}

        </div>

      </section>

      {/* ==================== EDUCATION ==================== */}

      <section
        className="credentials-section section-shell"
        data-scroll-scene
      >

        <div className="section-index">
          05 / EDUCATION & LEARNING
        </div>

        <div className="credentials-layout">

          <article className="education-card">

            <p className="card-overline">
              Chandigarh University, Mohali
            </p>

            <h2>
              B.E. Computer Science & Engineering
            </h2>

            <div>
              <span>
                Expected 2028
              </span>
            </div>

          </article>

          <div className="certifications">

            <p className="card-overline">
              Certifications
            </p>

            <span>
              Generative AI / Infosys
            </span>

            <span>
              Python Data Analytics / Meta
            </span>

            <span>
              Front-End Development / University of California
            </span>

          </div>

        </div>

      </section>

      {/* ==================== FOOTER ==================== */}

      <footer
        className="contact-section"
        id="contact"
        data-scroll-scene
      >

        <div className="footer-orbit" />

        <p className="section-index">
          06 / GET IN TOUCH
        </p>

        <h2>
          Let&apos;s build something that matters.
        </h2>

        <a
          className="email-link"
          href="mailto:meetsharma0702@gmail.com"
        >
          meetsharma0702@gmail.com <ArrowIcon />
        </a>

        <div className="social-links">

          {socialLinks.map((link) => {

            const Icon = link.icon;

            return (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >

                <span
                  className={`brand-icon ${link.tone}`}
                >
                  <Icon />
                </span>

                <span>
                  {link.name}
                </span>

                <span className="social-handle">
                  {link.handle}
                </span>

                <ExternalIcon />

              </a>
            );

          })}

        </div>

        <p className="footer-signoff">
          Meet Sharma / 2026
        </p>

      </footer>

    </main>
  );
}

/* ==================== HEADER ==================== */

function Header() {
  return (
    <header className="site-header">

      <a
        className="wordmark"
        href="#top"
        aria-label="Meet Sharma home"
      >
        MS<span>.</span>
      </a>

      <nav aria-label="Main navigation">

        <a href="#about">
          About
        </a>

        <a href="#experience">
          Experience
        </a>

        <a href="#projects">
          Work
        </a>

        <a href="#contact">
          Contact
        </a>

      </nav>

      <a
        className="header-email"
        href="mailto:meetsharma0702@gmail.com"
      >
        Available for internships <span>+</span>
      </a>

    </header>
  );
}

/* ==================== FACT ==================== */

function Fact({ value, label }) {
  return (
    <div className="fact">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

/* ==================== SVG ==================== */

function Svg({
  children,
  viewBox = "0 0 24 24",
}) {
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

/* ==================== ARROW ==================== */

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

/* ==================== DOWNLOAD ==================== */

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

/* ==================== EXTERNAL ==================== */

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

/* ==================== GITHUB ==================== */

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

/* ==================== LINKEDIN ==================== */

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

/* ==================== INSTAGRAM ==================== */

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

/* ==================== LEETCODE ==================== */

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

/* ==================== REACT ==================== */

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

/* ==================== JAVASCRIPT ==================== */

function JavaScriptIcon() {
  return (
    <Svg>
      <path
        fill="currentColor"
        d="M3 3h18v18H3Z"
      />

      <path
        fill="#1c1c1c"
        d="M14.05 16.93c.39.63.9 1.1 1.82 1.1.76 0 1.25-.38 1.25-.91 0-.63-.5-.85-1.34-1.22l-.46-.2c-1.34-.57-2.23-1.29-2.23-2.8 0-1.39 1.06-2.45 2.72-2.45 1.18 0 2.03.41 2.64 1.49l-1.45.93c-.32-.57-.66-.79-1.19-.79-.54 0-.89.34-.89.79 0 .55.34.77 1.12 1.1l.46.2c1.58.68 2.47 1.37 2.47 2.92 0 1.67-1.31 2.58-3.07 2.58-1.72 0-2.83-.82-3.37-1.89Zm-6.54.16c.29.52.55.96 1.18.96.6 0 .98-.23.98-1.13v-6.11h1.83v6.14c0 1.86-1.09 2.71-2.68 2.71-1.44 0-2.27-.74-2.69-1.63Z"
      />
    </Svg>
  );
}

/* ==================== HTML ==================== */

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

      <path
        fill="#fff"
        d="m8.06 7.13.14 1.57H12v1.55H8.34l.17 1.88H12v1.55H10.2l.12 1.32 1.68.45v1.62l-3.17-.87-.46-5.12h5.17V7.13Zm3.94 0v1.57h4.42l-.15 1.55H12v1.88h4.1l-.37 4.05-3.73 1.03v-1.62l2.22-.6.13-1.32H12v-1.55h4.03l.4-4.49Z"
      />
    </Svg>
  );
}

/* ==================== CSS ==================== */

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

      <path
        fill="#fff"
        d="M12 7.13v1.57H7.64l.14 1.55H12v1.88H7.95l.42 4.67 3.63 1v-1.62l-2.14-.58-.13-1.45H12v-1.88H9.56l-.13-1.44H12V7.13Zm0 0v1.57h4.5l-.14 1.55H12v1.88h4.2l-.43 4.82-3.77 1.04v-1.62l2.27-.61.13-1.46H12v-1.88h4.08l.4-4.49Z"
      />
    </Svg>
  );
}

/* ==================== JAVA ==================== */

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

/* ==================== C++ ==================== */

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

/* ==================== PYTHON ==================== */

function PythonIcon() {
  return (
    <Svg>
      <path
        fill="currentColor"
        d="M11.87 2.2c-4.1 0-3.84 1.78-3.84 1.78l.01 1.84h3.9v.55H6.49S3.88 6.08 3.88 10.23s2.28 4 2.28 4h1.36v-1.92s-.07-2.29 2.25-2.29h3.87s2.18.04 2.18-2.12V4.34s.33-2.14-3.95-2.14Zm-2.15 1.23a.72.72 0 1 1 0 1.44.72.72 0 0 1 0-1.44Z"
      />

      <path
        fill="#ffd845"
        d="M12.13 21.8c4.1 0 3.84-1.78 3.84-1.78l-.01-1.84h-3.9v-.55h5.45s2.61.29 2.61-3.86-2.28-4-2.28-4h-1.36v1.92s.07 2.29-2.25 2.29h-3.87s-2.18-.04-2.18 2.12v3.56s-.33 2.14 3.95 2.14Zm2.15-1.23a.72.72 0 1 1 0-1.44.72.72 0 0 1 0 1.44Z"
      />
    </Svg>
  );
}

/* ==================== NODE ==================== */

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

/* ==================== EXPRESS ==================== */

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

/* ==================== MONGO ==================== */

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

/* ==================== MYSQL ==================== */

function MysqlIcon() {
  return (
    <Svg>
      <path
        fill="currentColor"
        d="M3 15.4c1.52-3.47 4.04-5.2 7.56-5.2 1.61 0 2.72.53 3.32 1.6.64-2.87 2.35-4.3 5.12-4.3.87 0 1.86.2 2.96.6l-.54 1.53c-.78-.25-1.48-.38-2.1-.38-2.36 0-3.74 1.6-4.15 4.81.55.74.83 1.8.83 3.19 0 1.45-.47 2.8-1.4 4.05l-1.31-.98c.67-.9 1-1.86 1-2.9 0-1.11-.27-1.89-.82-2.34-.42-.38-1.31-.57-2.65-.57-2.86 0-4.85 1.45-5.96 4.35L3 15.4Zm6.96-9.25c1.18-.93 2.65-1.4 4.4-1.4 1.28 0 2.54.24 3.8.72l-.58 1.51c-1.03-.36-2.1-.54-3.22-.54-1.34 0-2.47.34-3.37 1.02Z"
      />
    </Svg>
  );
}

/* ==================== GIT ==================== */

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