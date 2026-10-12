export interface CareerJob {
    id: string;
    slug: string;
    title: string;
    description: string;
    category: string;
    department: string;
    location: string;
    type: string;
    qualifications: string;
    experience: string;
    salary: string;
    overview?: string;
    responsibilities?: string[];
    requirements?: string[];
}

export const CAREER_JOBS: CareerJob[] = [
    {
        id: "job-1",
        slug: "product-designer",
        title: "Product Designer",
        description: "We're looking for a mid-level product designer to join our team.",
        category: "Design",
        department: "Digital Product & Design",
        location: "100% remote",
        type: "Full-time",
        qualifications: "Bachelor's in Design, HCI or equivalent experience",
        experience: "3+ Years",
        salary: "$85,000 - $115,000 / year",
        overview:
            "Join our global creative and product ecosystem. You will craft seamless, high-energy digital interfaces, interactive brand touchpoints, and intuitive mobile web experiences for millions of energetic consumers and athletes worldwide.",
        responsibilities: [
            "Lead end-to-end UX/UI design initiatives from discovery wireframes to pixel-perfect interactive prototypes.",
            "Collaborate closely with product managers, brand strategists, and front-end developers to ship responsive experiences.",
            "Maintain, evolve, and document our shared design system with fluid typography and modern animation principles.",
            "Conduct qualitative user testing and translate quantitative metrics into design improvements.",
        ],
        requirements: [
            "Strong portfolio demonstrating responsive web design, mobile UI, and dynamic micro-interactions.",
            "Proficiency in Figma, design systems, and rapid prototyping workflows.",
            "Deep understanding of accessibility, typography, and fluid screen design.",
            "Clear communication and ability to present design rationale with conviction.",
        ],
    },
    {
        id: "job-2",
        slug: "engineering-manager",
        title: "Engineering Manager",
        description: "We're looking for an experienced engineering manager to join our team.",
        category: "Development",
        department: "Software Engineering & Technology",
        location: "100% remote",
        type: "Full-time",
        qualifications: "BS/MS in Computer Science or equivalent practical background",
        experience: "6+ Years",
        salary: "$130,000 - $160,000 / year",
        overview:
            "Guide and empower a high-caliber distributed software engineering squad. You will balance technical architecture, team mentorship, and high-velocity product delivery across cutting-edge modern web platforms.",
        responsibilities: [
            "Lead and mentor a cross-functional squad of front-end, back-end, and platform engineers.",
            "Drive technical excellence, automated CI/CD practices, and web performance standards.",
            "Partner with leadership to plan sprint roadmaps, resource allocation, and milestone timelines.",
            "Foster an inclusive, transparent engineering culture with flat hierarchies and ownership.",
        ],
        requirements: [
            "Demonstrated track record of managing and growing engineering teams in modern web tech (TypeScript, Next.js, Node.js).",
            "Strong architectural grasp of cloud infrastructure, APIs, and real-time interactive apps.",
            "Exceptional coaching skills and empathetic people management.",
            "Commitment to high code quality and test-driven engineering culture.",
        ],
    },
    {
        id: "job-3",
        slug: "customer-success-manager",
        title: "Customer Success Manager",
        description: "We're looking for a customer success manager to join our team.",
        category: "Customer Service",
        department: "Customer Operations & Experience",
        location: "100% remote",
        type: "Full-time",
        qualifications: "Bachelor's Degree in Business, Communications or related field",
        experience: "3+ Years",
        salary: "$65,000 - $85,000 / year",
        overview:
            "Be the champion for our commercial partners and consumers. You will build long-term trust, optimize onboarding journeys, and ensure every customer inquiry receives prompt, energizing resolution.",
        responsibilities: [
            "Own the end-to-end customer support lifecycle and proactive outreach for partner accounts.",
            "Analyze ticket feedback trends and collaborate with product teams to eliminate friction points.",
            "Develop best-practice guides, customer onboarding workflows, and knowledge base resources.",
            "Maintain top-tier CSAT scores and rapid first-response metrics across support channels.",
        ],
        requirements: [
            "Proven experience in customer success, client relations, or account retention.",
            "Superb written and verbal communication with an upbeat, solutions-oriented attitude.",
            "Familiarity with CRM platforms, ticketing tooling, and customer analytics.",
            "Ability to remain calm, empathetic, and decisive under high pressure.",
        ],
    },
    {
        id: "job-4",
        slug: "account-executive",
        title: "Account Executive",
        description: "We're looking for an account executive to join our team.",
        category: "Finance",
        department: "Commercial Sales & Finance",
        location: "100% remote",
        type: "Full-time",
        qualifications: "Bachelor's in Finance, Commerce, Business Administration",
        experience: "4+ Years",
        salary: "$80,000 - $105,000 / year",
        overview:
            "Drive key commercial distribution pipelines and financial account health. You will identify expansion opportunities, negotiate contracts, and solidify partnerships that expand our market leadership.",
        responsibilities: [
            "Manage enterprise accounts, wholesale distributors, and key retail network partners.",
            "Forecast monthly and quarterly sales pipelines with high financial precision.",
            "Prepare data-backed commercial proposals, financial terms, and contract agreements.",
            "Represent the brand at trade conventions, partner meetings, and executive reviews.",
        ],
        requirements: [
            "Documented history of meeting and exceeding enterprise sales or commercial quota targets.",
            "Sharp business acumen and contract negotiation competence.",
            "Disciplined CRM hygiene and pipeline tracking abilities.",
            "Self-starter mindset with strong consultative selling skills.",
        ],
    },
    {
        id: "job-5",
        slug: "seo-marketing-manager",
        title: "SEO Marketing Manager",
        description: "We're looking for an experienced SEO marketing manager to join our team.",
        category: "Marketing",
        department: "Digital Growth & Brand Marketing",
        location: "100% remote",
        type: "Full-time",
        qualifications: "Bachelor's in Marketing, Media, Communications or equivalent",
        experience: "4+ Years",
        salary: "$75,000 - $95,000 / year",
        overview:
            "Scale our organic footprint across search engines and discovery channels. You will shape our organic search strategy, technical SEO audits, and content distribution for sports and cultural events.",
        responsibilities: [
            "Formulate and execute global organic search growth strategies across all digital properties.",
            "Perform in-depth keyword analysis, competitor gap studies, and technical site audits.",
            "Collaborate with content creators to optimize editorial event articles and landing pages.",
            "Track ranking movements, organic traffic KPIs, and core web vitals in Google Search Console.",
        ],
        requirements: [
            "Proven track record of driving significant organic traffic scale in competitive niches.",
            "Advanced knowledge of technical SEO (crawling, indexing, schema markup, performance).",
            "Proficiency with Ahrefs, SEMrush, Screaming Frog, and Google Analytics 4.",
            "Data-driven mindset with sharp storytelling and reporting capabilities.",
        ],
    },
    {
        id: "job-6",
        slug: "operations-lead",
        title: "Operations Lead",
        description: "We're looking for an operations lead to manage logistics and supply flow.",
        category: "Operations",
        department: "Supply Chain & Field Operations",
        location: "Kathmandu · Hybrid",
        type: "Full-time",
        qualifications: "Bachelor's in Supply Chain, Logistics, or Industrial Engineering",
        experience: "5+ Years",
        salary: "Competitive · Industry Standard",
        overview:
            "Direct regional distribution efficiency, warehouse logistics, and field event supply chains. You ensure products and event assets arrive on time, everywhere, without compromise.",
        responsibilities: [
            "Oversee regional supply chains, inventory forecasting, and warehouse fulfillment routes.",
            "Coordinate logistics for major national extreme sporting events and brand activations.",
            "Audit vendor agreements, transport logistics, and regulatory compliance standards.",
            "Implement lean operations to minimize lead times and optimize delivery costs.",
        ],
        requirements: [
            "Extensive operational leadership experience within FMCG, beverage, or retail logistics.",
            "Comprehensive understanding of warehouse inventory management systems.",
            "Exceptional crisis management and rapid problem-solving abilities.",
            "Strong team leadership in high-tempo field environments.",
        ],
    },
    {
        id: "job-7",
        slug: "regional-brand-director",
        title: "Regional Brand Director",
        description: "We're looking for a brand director to lead strategic national campaigns.",
        category: "Management",
        department: "Executive Brand Leadership",
        location: "Kathmandu, Nepal",
        type: "Full-time",
        qualifications: "Master's or Bachelor's in Management, Brand Marketing, or Media",
        experience: "8+ Years",
        salary: "Executive Tier · Performance Bonuses",
        overview:
            "Shape the creative vision, cultural relevance, and athletic partnerships that define our brand nationally. You will lead high-impact marketing campaigns, athlete sponsorships, and landmark events.",
        responsibilities: [
            "Define and oversee regional brand strategy aligned with international brand identity.",
            "Lead a passionate team across digital media, communications, athlete marketing, and events.",
            "Cultivate relationships with elite athletes, cultural leaders, and media houses.",
            "Manage multi-million dollar annual marketing budgets with clear return on investment.",
        ],
        requirements: [
            "Recognized leadership in building iconic consumer brands and cultural movements.",
            "Deep understanding of youth culture, extreme sports, music, and digital trends.",
            "Charismatic communication and executive-level stakeholder presentation presence.",
            "Visionary creative mindset combined with disciplined commercial stewardship.",
        ],
    },
];
