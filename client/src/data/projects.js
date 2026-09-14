export const projects = [
  {
    id: "ranklytics",
    name: "Ranklytics",
    image: "/images/SEO-project.png",
    featured: true,
    category: "AI SEO Analytics Platform",
    stack: ["React", "Node.js", "Express", "MongoDB", "Gemini AI", "Browserbase"],
    overview:
      "Enterprise-grade SEO intelligence suite that analyzes 20+ technical factors on a site, surfaces automated AI-generated fixes, and compiles the results into a real-time audit report.",
    highlights: [
      "Keyword tracking engine with historical rank deltas",
      "JWT-protected routes and per-account audit history",
      "Asynchronous report queue for long-running crawls",
      "One-click PDF exporter for client-ready reports",
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
      "A high-throughput CRM built to streamline sales pipelines, with role-based access control and pipeline analytics for small sales teams.",
    highlights: [
      "Server-side pagination for large lead datasets",
      "One-click CSV export for reporting",
      "RBAC authorization middleware across every route",
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
    category: "Real-Time Messaging Suite",
    stack: ["React", "Node.js", "Express", "MongoDB", "Socket.IO", "Cloudinary"],
    overview:
      "A full-featured chat platform with instant messaging, media sharing, and live presence tracking across conversations.",
    highlights: [
      "Persistent WebSocket connections via Socket.IO",
      "HTTP-only cookie session security",
      "Cloudinary-backed avatar and media uploads",
      "Real-time read receipts and typing indicators",
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
    category: "Automated Candidate Evaluation Engine",
    stack: ["React", "JavaScript", "Puter.js"],
    overview:
      "A client-side AI utility that parses a resume for ATS compliance and structural improvements, with feedback in real time.",
    highlights: [
      "Zero-backend, fully serverless execution",
      "Fast feedback loop with no upload wait time",
      "Interactive score breakdown by category",
    ],
    links: {
      github: "https://github.com/rohankoriya/ai-resume-analyzer",
      demo: "https://ai-resume-analyzer-blond-eight.vercel.app/",
    },
  },
];
