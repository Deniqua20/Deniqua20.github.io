"use strict";
const CAREER_TRACKS = [
  {
    "id": "blue",
    "title": "Security operations",
    "group": "Cybersecurity",
    "description": "Detect suspicious activity and help respond to incidents.",
    "startingRoles": [
      "SOC analyst",
      "Security monitoring analyst"
    ],
    "developingRoles": [
      "Detection engineer",
      "Threat hunter",
      "Incident responder"
    ],
    "tasks": [
      "Review login logs and separate suspicious events from routine activity.",
      "Write a detection rule and test whether it catches the behavior you intended.",
      "Triage an alert and explain what should be investigated or contained next."
    ],
    "project": "Analyze sample authentication logs, write one detection, and document your triage decisions.",
    "skills": "Windows and Linux logs, networking, SIEM queries, incident handling",
    "practiceLink": "projects/azure-sentinel-soc.html",
    "practiceLabel": "Explore Dee’s honeypot project",
    "careerLink": "https://www.cyberseek.org/pathway.html",
    "profile": {
      "investigate": 3,
      "build": 2,
      "organize": 1
    }
  },
  {
    "id": "red",
    "title": "Offensive security",
    "group": "Cybersecurity",
    "description": "Test defenses in authorized environments and explain how to improve them.",
    "startingRoles": [
      "Security testing associate",
      "Junior penetration tester"
    ],
    "developingRoles": [
      "Penetration tester",
      "Red team operator",
      "Vulnerability researcher"
    ],
    "tasks": [
      "Test an intentionally vulnerable application in a lab and explain the weakness.",
      "Plan a security test with explicit permission, scope, and rules of engagement.",
      "Write a reproducible finding that explains impact and recommends a fix."
    ],
    "project": "Complete a deliberately vulnerable web lab and write a finding with evidence and remediation.",
    "skills": "HTTP, operating systems, networking, scripting, clear reporting",
    "practiceLink": "https://portswigger.net/web-security",
    "practiceLabel": "Explore Web Security Academy",
    "careerLink": "https://www.cyberseek.org/pathway.html",
    "profile": {
      "investigate": 3,
      "create": 2,
      "build": 1
    }
  },
  {
    "id": "dfir",
    "title": "Digital forensics",
    "group": "Cybersecurity",
    "description": "Preserve evidence and reconstruct what happened during an incident.",
    "startingRoles": [
      "Digital forensics technician",
      "Junior forensic analyst"
    ],
    "developingRoles": [
      "Digital forensics analyst",
      "DFIR analyst",
      "Malware analyst"
    ],
    "tasks": [
      "Build a timeline from logs, browser artifacts, and file activity.",
      "Preserve an evidence copy and record how it was collected and handled.",
      "Compare artifacts and document which conclusions the evidence supports."
    ],
    "project": "Investigate a sample disk image and produce an evidence inventory and event timeline.",
    "skills": "File systems, evidence handling, operating system artifacts, timelines",
    "practiceLink": "https://www.autopsy.com/",
    "practiceLabel": "Explore Autopsy",
    "careerLink": "https://www.cyberseek.org/pathway.html",
    "profile": {
      "investigate": 3,
      "organize": 2,
      "build": 1
    }
  },
  {
    "id": "grc",
    "title": "Governance, risk and compliance",
    "group": "Cybersecurity",
    "description": "Connect security controls, business risks, and evidence.",
    "startingRoles": [
      "GRC analyst",
      "IT risk analyst",
      "Compliance analyst"
    ],
    "developingRoles": [
      "Security auditor",
      "Risk manager",
      "Security governance lead"
    ],
    "tasks": [
      "Assess a business scenario and explain security risks in plain language.",
      "Compare a control requirement with evidence and document gaps.",
      "Build a risk register with owners, recommended actions, and follow up dates."
    ],
    "project": "Assess a fictional small business and create a risk register plus a short remediation plan.",
    "skills": "Risk assessment, control frameworks, evidence review, stakeholder communication",
    "practiceLink": "projects/security-risk-assessment.html",
    "practiceLabel": "Explore Dee’s GRC project",
    "careerLink": "https://www.nist.gov/cyberframework",
    "profile": {
      "organize": 3,
      "explain": 2,
      "investigate": 1
    }
  },
  {
    "id": "iam",
    "title": "Identity and access",
    "group": "Cybersecurity",
    "description": "Give people the access they need and remove access they no longer need.",
    "startingRoles": [
      "IAM analyst",
      "Access management analyst"
    ],
    "developingRoles": [
      "IAM engineer",
      "Identity security engineer",
      "Identity architect"
    ],
    "tasks": [
      "Review user permissions and identify unnecessary access.",
      "Design a process for someone joining, changing roles, or leaving a company.",
      "Automate an access change and verify that it completed correctly."
    ],
    "project": "Model a joiner, mover, and leaver process and show how you would validate access changes.",
    "skills": "Authentication, authorization, least privilege, directories, automation",
    "practiceLink": "projects/identity-lifecycle.html",
    "practiceLabel": "Explore Dee’s IAM project",
    "careerLink": "https://www.cyberseek.org/pathway.html",
    "profile": {
      "organize": 3,
      "build": 2,
      "people": 1
    }
  },
  {
    "id": "cloud",
    "title": "Cloud security",
    "group": "Cybersecurity",
    "description": "Configure and monitor cloud environments with security in mind.",
    "startingRoles": [
      "Cloud support associate",
      "Cloud security analyst"
    ],
    "developingRoles": [
      "Cloud security engineer",
      "Cloud security architect",
      "DevSecOps engineer"
    ],
    "tasks": [
      "Configure cloud access, network boundaries, and logging for a small environment.",
      "Review a cloud configuration for risky permissions or exposed services.",
      "Automate a cloud security baseline and check that changes remain within it."
    ],
    "project": "Diagram a small cloud environment and explain its access, network, logging, and cost controls.",
    "skills": "Cloud services, IAM, networking, logging, infrastructure automation",
    "practiceLink": "projects/cloud-security-monitoring.html",
    "practiceLabel": "Explore Dee’s cloud project",
    "careerLink": "https://learn.microsoft.com/en-us/training/azure/",
    "profile": {
      "build": 3,
      "organize": 2,
      "investigate": 1
    }
  },
  {
    "id": "architecture",
    "title": "Security architecture",
    "group": "Cybersecurity",
    "description": "Design how security controls fit together across a system.",
    "startingRoles": [
      "Security analyst",
      "Systems engineer"
    ],
    "developingRoles": [
      "Security engineer",
      "Security architect",
      "Enterprise security architect"
    ],
    "tasks": [
      "Draw system trust boundaries and decide where security controls belong.",
      "Compare design choices and explain tradeoffs between security, cost, and usability.",
      "Translate business requirements into a documented secure system design."
    ],
    "project": "Create a reference architecture with trust boundaries, a threat model, and a decision record.",
    "skills": "System design, threat modeling, network and identity controls, business requirements",
    "practiceLink": "https://owasp.org/www-community/Threat_Modeling",
    "practiceLabel": "Explore threat modeling",
    "careerLink": "https://www.cyberseek.org/pathway.html",
    "profile": {
      "build": 3,
      "organize": 2,
      "create": 1
    }
  },
  {
    "id": "appsec",
    "title": "Application security",
    "group": "Cybersecurity",
    "description": "Help teams build safer software throughout development.",
    "startingRoles": [
      "Software developer",
      "Application security associate"
    ],
    "developingRoles": [
      "Application security engineer",
      "Product security engineer",
      "Secure code reviewer"
    ],
    "tasks": [
      "Review application code to understand where input or access checks may fail.",
      "Help a developer reproduce a security bug and test the fix.",
      "Add security checks to a development workflow and tune unhelpful findings."
    ],
    "project": "Build a small application, threat model it, and document one security improvement with a test.",
    "skills": "Programming, HTTP, secure design, authentication, code review",
    "practiceLink": "https://owasp.org/www-project-juice-shop/",
    "practiceLabel": "Explore OWASP Juice Shop",
    "careerLink": "https://owasp.org/www-project-application-security-verification-standard/",
    "profile": {
      "build": 3,
      "investigate": 2,
      "organize": 1
    }
  },
  {
    "id": "software",
    "title": "Software development",
    "group": "Broader tech",
    "description": "Build and maintain applications that solve problems for users.",
    "startingRoles": [
      "Junior software developer",
      "Web developer"
    ],
    "developingRoles": [
      "Software engineer",
      "Backend engineer",
      "Technical lead"
    ],
    "tasks": [
      "Turn a user need into a working feature or small application.",
      "Debug code and write tests to check that the fix works.",
      "Design an API and explain how it should behave when something goes wrong."
    ],
    "project": "Build a small useful application with a README, tests, and a clear explanation of its users.",
    "skills": "Programming, version control, testing, APIs, accessible interfaces",
    "practiceLink": "https://developer.mozilla.org/en-US/docs/Learn_web_development",
    "practiceLabel": "Explore MDN learning",
    "careerLink": "https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm",
    "profile": {
      "build": 3,
      "create": 2,
      "organize": 1
    }
  },
  {
    "id": "data",
    "title": "Data and AI",
    "group": "Broader tech",
    "description": "Use data to answer questions and evaluate useful models.",
    "startingRoles": [
      "Data analyst",
      "Business intelligence analyst"
    ],
    "developingRoles": [
      "Data engineer",
      "Data scientist",
      "Machine learning engineer"
    ],
    "tasks": [
      "Clean a dataset and check whether missing values or errors affect the answer.",
      "Use queries or visualizations to explain a pattern and its limitations.",
      "Evaluate a model using suitable metrics rather than assuming its output is correct."
    ],
    "project": "Analyze a public dataset and publish your question, cleaning steps, findings, and limitations.",
    "skills": "SQL, statistics, data quality, Python, evaluation, responsible data use",
    "practiceLink": "https://www.kaggle.com/learn",
    "practiceLabel": "Explore Kaggle Learn",
    "careerLink": "https://www.bls.gov/ooh/math/data-scientists.htm",
    "profile": {
      "investigate": 3,
      "organize": 2,
      "build": 1
    }
  },
  {
    "id": "network",
    "title": "Networking and infrastructure",
    "group": "Broader tech",
    "description": "Keep systems connected, available, and understandable.",
    "startingRoles": [
      "NOC analyst",
      "Network support technician",
      "Junior systems administrator"
    ],
    "developingRoles": [
      "Network engineer",
      "Systems engineer",
      "Infrastructure engineer"
    ],
    "tasks": [
      "Trace why two systems cannot communicate and explain where the connection fails.",
      "Plan network segmentation or routing for a small environment.",
      "Monitor system availability and document a repeatable troubleshooting process."
    ],
    "project": "Build a small network lab and document addressing, segmentation, and a connectivity investigation.",
    "skills": "TCP/IP, DNS, routing, switching, operating systems, monitoring",
    "practiceLink": "https://www.netacad.com/",
    "practiceLabel": "Explore Cisco Networking Academy",
    "careerLink": "https://www.bls.gov/ooh/computer-and-information-technology/network-and-computer-systems-administrators.htm",
    "profile": {
      "build": 3,
      "investigate": 2,
      "people": 1
    }
  },
  {
    "id": "support",
    "title": "IT support and service delivery",
    "group": "Broader tech",
    "description": "Help people resolve technology problems and improve everyday systems.",
    "startingRoles": [
      "Help desk technician",
      "IT support specialist",
      "Desktop support technician"
    ],
    "developingRoles": [
      "Systems administrator",
      "IT service manager",
      "Endpoint engineer"
    ],
    "tasks": [
      "Ask a user clear questions and troubleshoot a device or account problem.",
      "Write a guide that helps someone solve a common technology issue.",
      "Prioritize support requests and explain progress in language users understand."
    ],
    "project": "Create a troubleshooting knowledge base with example tickets, resolution steps, and escalation criteria.",
    "skills": "Troubleshooting, operating systems, customer communication, ticketing, documentation",
    "practiceLink": "https://learn.microsoft.com/en-us/training/",
    "practiceLabel": "Explore Microsoft Learn",
    "careerLink": "https://www.bls.gov/ooh/computer-and-information-technology/computer-support-specialists.htm",
    "profile": {
      "people": 3,
      "explain": 2,
      "build": 1
    }
  },
  {
    "id": "writing",
    "title": "Technical writing and documentation",
    "group": "Broader tech",
    "description": "Turn complicated information into useful guides people can understand.",
    "startingRoles": [
      "Documentation specialist",
      "Junior technical writer"
    ],
    "developingRoles": [
      "Technical writer",
      "Developer education specialist"
    ],
    "project": "Write a clear getting started guide for a tool, then ask someone unfamiliar with it to follow it.",
    "skills": "Research, interviewing, writing, editing, information structure",
    "practiceLink": "https://developers.google.com/tech-writing",
    "practiceLabel": "Explore technical writing lessons",
    "careerLink": "https://www.onetonline.org/link/summary/27-3042.00",
    "profile": {
      "explain": 3,
      "organize": 2,
      "investigate": 1
    }
  },
  {
    "id": "customer",
    "title": "Customer success and technology adoption",
    "group": "Broader tech",
    "description": "Understand customer needs and help people get value from technology.",
    "startingRoles": [
      "Customer support specialist",
      "Customer onboarding specialist"
    ],
    "developingRoles": [
      "Customer success manager",
      "Implementation consultant"
    ],
    "project": "Create a sample onboarding plan for a new software customer, including discovery questions and a clear success goal.",
    "skills": "Customer communication, product knowledge, discovery, training, follow through",
    "practiceLink": "https://www.bls.gov/ooh/office-and-administrative-support/customer-service-representatives.htm",
    "practiceLabel": "Explore customer service work",
    "careerLink": "https://www.onetonline.org/link/summary/15-1232.00",
    "profile": {
      "people": 3,
      "explain": 2,
      "organize": 1
    }
  },
  {
    "id": "design",
    "title": "User experience and digital design",
    "group": "Broader tech",
    "description": "Understand how people use products and make those experiences clearer.",
    "startingRoles": [
      "Junior digital designer",
      "UX design associate"
    ],
    "developingRoles": [
      "UX designer",
      "Product designer",
      "UX researcher"
    ],
    "project": "Interview someone about a frustrating website, sketch an improved experience, and test whether it is easier to use.",
    "skills": "User research, visual design, accessible interfaces, prototyping, usability testing",
    "practiceLink": "https://www.w3.org/WAI/fundamentals/accessibility-intro/",
    "practiceLabel": "Explore accessible design",
    "careerLink": "https://www.bls.gov/ooh/computer-and-information-technology/web-developers.htm",
    "profile": {
      "create": 3,
      "people": 2,
      "investigate": 1
    }
  }
];
if (typeof module !== "undefined" && module.exports) module.exports = CAREER_TRACKS;
