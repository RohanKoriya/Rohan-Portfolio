export const projects = [
  {
    id: "ranklytics",
    name: "Ranklytics",
    image: "/images/SEO-project.png",
    featured: true,
    category: "AI SEO Analytics Platform",
    stack: ["React", "Node.js", "Express", "MongoDB", "Gemini AI", "Browserbase"],
    overview:
      "SEO analytics platform that analyzes 20+ technical factors, identifies issues, and uses AI to suggest improvements in a detailed audit report.",
    highlights: [
      "Keyword tracking with historical ranking changes",
      "JWT-protected routes with per-user audit history",
      "Asynchronous processing for long-running SEO crawls",
      "One-click PDF export for audit reports",
    ],
    links: {
      github: "https://github.com/rohankoriya/ranklytics",
      demo: "https://seo-rank-tracker-swart.vercel.app",
    },
  },
  {
    id: "leadflow",
    name: "LeadFlow",
    image: "/images/leadflow-img.png",
    featured: false,
    category: "Smart Leads & CRM Workspace",
    stack: ["React", "JavaScript", "Node.js", "Express", "MongoDB", "Docker"],
    overview:
      "A CRM workspace for managing leads and sales pipelines, with role-based access control, analytics, and reporting.",
    highlights: [
      "Server-side pagination for large lead datasets",
      "One-click CSV export for reporting",
      "Role-based access control across protected routes",
      "Containerized with Docker for consistent deploys",
    ],
    links: {
      github: "https://github.com/rohankoriya/leadflow",
      demo: "https://smart-leads-dashboard-n2ug.onrender.com",
    },
  },
  {
    id: "chatsphere",
    name: "ChatSphere",
    image: "/images/chatsphere-img.png",
    featured: false,
    category: "Real-Time Messaging App",
    stack: ["React", "Node.js", "Express", "MongoDB", "Socket.IO", "Cloudinary"],
    overview:
      "A real-time chat application with messaging, media sharing, online presence, and conversation updates.",
    highlights: [
      "Real-time messaging with Socket.IO",
      "HTTP-only cookies for authentication",
      "Cloudinary-based avatar and media uploads",
      "Typing indicators and read receipts",
    ],
    links: {
      github: "https://github.com/rohankoriya/chatsphere",
      demo: "https://chatsphere-s8lq.onrender.com/login",
    },
  },
  {
    id: "ai-resume-analyzer",
    name: "AI Resume Analyzer",
    image: "/images/resume-analys-img.png",
    featured: false,
    category: "AI Resume Analysis",
    stack: ["React", "JavaScript", "Puter.js"],
    overview:
      "A web app that analyzes resumes for ATS-friendly structure and provides AI-powered suggestions for improvement.",
    highlights: [
      "Client-side resume analysis with Puter.js",
      "ATS-focused feedback across multiple categories",
      "Interactive score breakdown and improvement suggestions",
    ],
    links: {
      github: "https://github.com/rohankoriya/ai-resume-analyzer",
      demo: "https://ai-resume-analyzer-blond-eight.vercel.app/",
    },
  },
];
