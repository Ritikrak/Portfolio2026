export type AboutFocusArea = {
  label: string;
  title: string;
  copy: string;
  visual: "Structure" | "Ripples" | "Constellation";
};

export type AboutContent = {
  eyebrow: string;
  headlineTop: string;
  headlineAccent: string;
  lead: string;
  focusAreas: AboutFocusArea[];
  practiceTitle: string;
  practiceParagraphs: string[];
  signature: string;
};

export type SkillGroup = {
  id: string;
  label: string;
  items: string[];
};

export type ProjectEntry = {
  id: string;
  title: string;
  category: string;
  year?: string;
  description: string;
  image: string;
  imageAlt: string;
  imageAspectRatio?: "wide" | "screen" | "document";
  isPlaceholderImage?: boolean;
  technologies: string[];
  href?: string;
  linkLabel?: string;
};

export type ExperienceEntry = {
  id: string;
  period: string;
  role: string;
  organization: string;
  location?: string;
  description: string;
};

export type EducationEntry = {
  id: string;
  period: string;
  institution: string;
  qualification: string;
  grade: string;
};

export type CertificationEntry = {
  id: string;
  title: string;
  issuer: string;
  date: string;
};

export const portfolioData = {
  profile: {
    name: "Ritik Raj",
    tagline:
      "Computer Science Engineering student focused on\ncybersecurity, full-stack development, and AI.",
    heroDescriptor: "Thinking Beyond",
    description:
      "Ritik Raj is a Computer Science Engineering (Cybersecurity) B.Tech student at Government Engineering College, Jehanabad, with experience in full-stack, Android, and machine-learning projects.",
    email: "rritik345@gmail.com",
    githubUrl: "https://github.com/Ritikrak",
    linkedinUrl: "https://www.linkedin.com/in/ritikraj0804/",
    leetcodeUrl: "https://leetcode.com/u/ritikraj0804/",
    instagramUrl: "",
    location: "Patna, India",
    resumeUrl:
      "https://drive.google.com/file/d/1ZWfn048uC3pi4u_z0_PVCfzOeHbZSpG0/view?usp=drivesdk",
    copyrightYear: "2026",
  },
  about: {
    eyebrow: "Three disciplines. One perspective.",
    headlineTop: "Strong systems.",
    headlineAccent: "Built to ship.",
    lead:
      "I’m Ritik Raj — a Computer Science (Cybersecurity) undergraduate who builds across the stack, from FastAPI and PostgreSQL backends to React interfaces, native Android apps, and applied ML tools.",
    focusAreas: [
      {
        label: "Build",
        title: "Full-stack systems, APIs, and native mobile",
        copy:
          "I design and ship end-to-end applications — whether modeling PostgreSQL workflows with FastAPI and React at Infosys Springboard, building Java Android apps at NIT Patna, or shipping responsive MERN web products.",
        visual: "Structure",
      },
      {
        label: "Secure",
        title: "Cybersecurity & network-aware engineering",
        copy:
          "Pursuing a B.Tech in Computer Science & Engineering (Cybersecurity) alongside Cisco CCNA training shapes how I write code: clean API boundaries, encrypted authentication flows, and resilient data handling.",
        visual: "Ripples",
      },
      {
        label: "Explore AI",
        title: "Applied machine learning & AI products",
        copy:
          "Beyond web and mobile, I turn ML models into practical tools — from multilingual NLP text classification with Scikit-learn to MindCare AI’s FastAPI wellness dashboard and prompt-driven image generation with Imagify.",
        visual: "Constellation",
      },
    ],
    practiceTitle: "Engineering in practice.",
    practiceParagraphs: [
      "Whether debugging Retrofit network calls on Android, structuring PostgreSQL migrations with Alembic, or wrapping a Scikit-learn model behind a clean FastAPI service, I care about readable architecture and software that holds up in real hands.",
      "Consistent practice in data structures and algorithms sharpens how I reason about edge cases and complexity, while internships and shipped products keep every solution grounded in real-world engineering.",
    ],
    signature: "Systems mindset. Security-aware. Built to ship.",
  } satisfies AboutContent,
  skillGroups: [
    {
      id: "development",
      label: "Development",
      items: [
        "HTML5",
        "CSS3",
        "Tailwind CSS",
        "JavaScript",
        "React.js",
        "Node.js",
        "Express.js",
        "MongoDB",
        "MERN Stack",
        "Python",
        "FastAPI",
        "PostgreSQL",
        "SQLAlchemy",
        "Alembic",
        "Java",
        "Android SDK",
        "Android Studio",
        "SQLite",
        "Retrofit",
        "Volley",
        "XML",
        "Scikit-learn",
        "Pandas",
        "NumPy",
        "Git & GitHub",
        "Postman",
      ],
    },
    {
      id: "foundations",
      label: "Foundations",
      items: [
        "Data Structures & Algorithms",
        "Problem solving — 300+ solved",
        "Computer Science Engineering",
        "Cybersecurity",
        "C++",
        "Object-Oriented Programming",
        "Database Management Systems",
        "MVC / MVVM",
        "REST APIs",
      ],
    },
    {
      id: "exploring",
      label: "Exploring",
      items: ["Artificial Intelligence", "Modern AI tools"],
    },
    {
      id: "languages",
      label: "Languages",
      items: [
        "English — Native or bilingual proficiency",
        "Hindi — Native or bilingual proficiency",
      ],
    },
  ] satisfies SkillGroup[],
  projects: [
    {
      id: "expert-decision-replay",
      title: "Expert Decision Replay Platform",
      category: "Full-stack / decision workflows",
      year: "Jul — Sep 2026",
      description:
        "A platform for capturing, storing, and replaying expert decision-making workflows. Built REST APIs with FastAPI, managed PostgreSQL data with SQLAlchemy and Alembic, and developed React.js interfaces integrated with backend services.",
      image: "/images/projects/expert-decision-replay-dashboard.png",
      imageAlt:
        "Employee dashboard for the Expert Decision Replay Platform with decision status metrics and a recent decisions table",
      imageAspectRatio: "wide",
      href: "https://expert-decision-replay-two.vercel.app/",
      linkLabel: "Open frontend",
      technologies: [
        "Python",
        "FastAPI",
        "PostgreSQL",
        "SQLAlchemy",
        "Alembic",
        "React.js",
      ],
    },
    {
      id: "language-detection-model",
      title: "Language Detection Model",
      category: "Machine learning",
      year: "Feb — Mar 2026",
      description:
        "A text-classification model that identifies the language of raw text, including examples such as English, French, and Spanish. Built with Python, Scikit-learn, Pandas, and NumPy.",
      image: "/images/projects/language-detection-model.png",
      imageAlt:
        "Language Detection Model project overview showing a multilingual prediction demo and machine-learning features",
      imageAspectRatio: "document",
      href: "https://github.com/Ritikrak/Language_detection_model",
      linkLabel: "View on GitHub",
      technologies: ["Python", "Scikit-learn", "Pandas", "NumPy"],
    },
    {
      id: "forever",
      title: "Forever",
      category: "Full-stack / e-commerce",
      year: "Aug — Oct 2025",
      description:
        "An end-to-end shopping platform for browsing products, adding items to a cart, and managing purchases. The project explores core full-stack web development and user-centered design.",
      image: "/images/projects/forever-homepage.png",
      imageAlt:
        "Forever storefront with its Latest Arrivals hero and clothing collection",
      imageAspectRatio: "wide",
      href: "https://ecom-app-frontend-51nq.onrender.com/",
      linkLabel: "Visit Forever",
      technologies: [
        "HTML",
        "CSS",
        "JavaScript",
        "React.js",
        "Tailwind CSS",
        "Node.js",
        "Express.js",
        "Git",
        "GitHub",
      ],
    },
    {
      id: "imagify",
      title: "Imagify",
      category: "AI / image generation",
      year: "Aug — Sep 2025",
      description:
        "An interactive application that turns a text prompt into a generated image, connecting an AI image-generation API with a user-friendly interface.",
      image: "/images/projects/imagify-homepage.png",
      imageAlt:
        "Imagify landing page with its AI text-to-image headline and image generation call to action",
      imageAspectRatio: "screen",
      href: "https://imagify2ai.netlify.app/",
      linkLabel: "Visit Imagify",
      technologies: [
        "React.js",
        "Tailwind CSS",
        "Node.js",
        "Express.js",
        "AI image-generation API",
      ],
    },
    {
      id: "mindcare-ai",
      title: "MindCare AI: Mental Health Score Prediction System",
      category: "Machine learning / wellness analytics",
      description:
        "An assessment dashboard that predicts a mental health score from user-provided social media, academic, sleep, and activity details. It includes visual analytics and general wellness suggestions.",
      image: "/images/projects/mindcare-ai-dashboard.png",
      imageAlt:
        "MindCare AI wellbeing assessment dashboard with a student profile form and wellness score preview",
      imageAspectRatio: "wide",
      href: "https://mindcare-ai-dashboard.onrender.com/",
      linkLabel: "Visit MindCare AI",
      technologies: [
        "HTML",
        "CSS",
        "JavaScript",
        "Python",
        "FastAPI",
        "Scikit-learn",
        "Joblib",
        "REST API",
        "Chart.js",
      ],
    },
  ] satisfies ProjectEntry[],
  experience: [
    {
      id: "infosys-springboard",
      period: "Jun — Aug 2026",
      role: "Intern",
      organization: "Infosys Springboard",
      description:
        "Contributing to an Expert Decision Replay Platform that captures, stores, and replays expert workflows. Working across the full stack with Python, FastAPI, PostgreSQL, and React.js: developing REST APIs, managing database models, building interfaces, and integrating frontend and backend services.",
    },
    {
      id: "nit-patna-android-developer",
      period: "Jun — Jul 2025",
      role: "Android Developer · Full-time",
      organization: "National Institute of Technology, Patna",
      location: "Patna, Bihar, India · On-site",
      description:
        "Developed Android applications in Java with Android SDK, XML layouts, and MVC/MVVM patterns. Integrated REST APIs using Retrofit/Volley, added SQLite storage, and built features including authentication, notifications, and real-time updates. Also worked on performance, debugging, backend integration, API testing, and Git/GitHub workflows. Created a Java-based Travel Guide app with 6+ Fragments and a RecyclerView, and built a localized sign-in/sign-up flow with encrypted password hashing.",
    },
  ] satisfies ExperienceEntry[],
  education: [
    {
      id: "gec-jehanabad",
      period: "Sep 2023 — Sep 2027",
      institution: "Government Engineering College, Jehanabad",
      qualification:
        "Bachelor of Technology — Computer Science and Engineering (Cybersecurity)",
      grade: "Grade: 8.43",
    },
    {
      id: "an-college-patna",
      period: "Apr 2020 — Apr 2022",
      institution: "Anugrah Narayan (A.N.) College, Patna",
      qualification: "Intermediate",
      grade: "Grade: 83%",
    },
    {
      id: "cbse-matriculation",
      period: "Apr 2019 — Apr 2020",
      institution: "Central Board of Secondary Education",
      qualification: "Matriculation",
      grade: "Grade: 82%",
    },
  ] satisfies EducationEntry[],
  certifications: [
    {
      id: "ccna-routing-switching",
      title: "Cisco Certified Network Associate (CCNA) — Routing and Switching",
      issuer: "Cisco",
      date: "Jun 2026",
    },
    {
      id: "cisco-introduction-networks",
      title: "Introduction to Networks",
      issuer: "Cisco",
      date: "Jun 2026",
    },
  ] satisfies CertificationEntry[],
};
