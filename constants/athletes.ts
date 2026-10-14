export interface AthleteStat {
    label: string;
    value: string;
    detail?: string;
}

export interface CareerHighlight {
    year: string;
    title: string;
    event: string;
}

export interface AthleteData {
    id: string;
    slug: string;
    aliases?: string[];
    name: string;
    sport: string;
    title: string;
    displayTitle: string;
    subtitle: string;
    discipline: string;
    team: string;
    nationality: string;
    hometown: string;
    debutYear: string;
    quote: string;
    description: string;
    defaultImage: string;
    hoverImage: string;
    actionImage?: string;
    portraitImage?: string;
    stats: AthleteStat[];
    bio: string[];
    highlights: CareerHighlight[];
}

export const ATHLETES: AthleteData[] = [
    {
        id: "athlete-1",
        slug: "formula-1",
        aliases: ["max-verstappen", "card-1"],
        name: "Max Verstappen",
        sport: "Formula 1",
        title: "Formula 1<br />Grand Prix",
        displayTitle: "Formula 1 Grand Prix",
        subtitle: "Scuderia Racing",
        discipline: "Formula One World Championship",
        team: "Oracle Red Bull Racing",
        nationality: "Netherlands",
        hometown: "Hasselt, Belgium",
        debutYear: "2015",
        quote: "To be fast you have to believe in the limit, then find what lies just on the other side.",
        description:
            "Precision aerodynamics meet raw asphalt adrenaline. Pushing cutting-edge engineering past 340 km/h to capture the checkered flag.",
        defaultImage: "/images/home/athletes/hover-athlete-1.jpg",
        hoverImage: "/images/home/athletes/athlete-1.jpg",
        actionImage: "/images/home/athletes/athlete-1.jpg",
        portraitImage: "/images/home/athletes/hover-athlete-1.jpg",
        stats: [
            { label: "World Championships", value: "3x", detail: "Consecutive Titles" },
            { label: "Grand Prix Wins", value: "61+", detail: "All-Time Top 3" },
            { label: "Career Podiums", value: "105+", detail: "Historic Record" },
            { label: "Top Speed", value: "354 km/h", detail: "Aerodynamic Apex" },
        ],
        bio: [
            "Max Verstappen represents the absolute peak of modern motorsport precision. Debuting in Formula 1 at just 17 years old, he became the youngest driver in Grand Prix history, instantly rewriting conventional wisdom about experience and raw driving instinct.",
            "Under the banner of Oracle Red Bull Racing, Verstappen's aggressive racecraft, surgical cornering, and supernatural wet-weather car control have delivered multiple World Championships, defining an unprecedented era of dominance in world motorsport.",
            "Away from the circuit, his relentless simulator training and technical dialogue with Red Bull Advanced Technologies push the engineering boundaries of aerodynamic efficiency, tire management, and telemetry science.",
        ],
        highlights: [
            { year: "2023", title: "Record 19 Wins in a Single Season", event: "Formula 1 World Championship" },
            { year: "2021", title: "Maiden World Championship Title", event: "Abu Dhabi Grand Prix" },
            { year: "2016", title: "Youngest Ever Grand Prix Winner", event: "Spanish Grand Prix (Age 18)" },
        ],
    },
    {
        id: "athlete-2",
        slug: "freestyle-motocross",
        aliases: ["luc-ackermann", "card-2"],
        name: "Luc Ackermann",
        sport: "Freestyle Motocross",
        title: "Freestyle<br />Motocross",
        displayTitle: "Freestyle Motocross",
        subtitle: "X-Fighters Division",
        discipline: "FMX & Big Air World Tour",
        team: "Red Bull X-Fighters",
        nationality: "Germany",
        hometown: "Mühlhausen, Germany",
        debutYear: "2017",
        quote: "When you're forty feet in the air, time slows down and muscle memory takes complete control.",
        description:
            "Launching forty feet into thin air, defying gravity with heart-stopping tsunami flips and uncompromising two-wheeled mastery.",
        defaultImage: "/images/home/athletes/hover-athlete-2.jpg",
        hoverImage: "/images/home/athletes/athlete-2.jpg",
        actionImage: "/images/home/athletes/hover-athlete-2.jpg",
        portraitImage: "/images/home/athletes/athlete-2.jpg",
        stats: [
            { label: "World Titles", value: "2x", detail: "FIM FMX World Champion" },
            { label: "Air Time", value: "4.8s", detail: "Per Ramp Launch" },
            { label: "Jump Height", value: "40+ Ft", detail: "Apex Elevation" },
            { label: "World Record", value: "Youngest", detail: "Motorcycle Double Backflip" },
        ],
        bio: [
            "Luc Ackermann has elevated freestyle motocross into an awe-inspiring aerial discipline. Born into a stunt-riding family, Ackermann landed a motorcycle backflip at just twelve years old, foretelling a career dedicated to breaking the laws of physics.",
            "As a cornerstone of Red Bull X-Fighters, Ackermann became the youngest athlete in history to land a motorcycle double backflip, combining sheer courage with millimetric throttle control over massive 40-foot gaps.",
            "His progressive repertoire blends tsunami flip extensions, 360-degree flat spins, and unmatched trick precision, constantly expanding the possibilities of competitive big air.",
        ],
        highlights: [
            { year: "2021", title: "X-Games Gold Medalist", event: "FMX Moto X QuarterPipe High Air" },
            { year: "2019", title: "FIM World Championship Gold", event: "Night of the Jumps Series" },
            { year: "2018", title: "Historical Double Backflip", event: "Red Bull Dirt Diggers Record" },
        ],
    },
    {
        id: "athlete-3",
        slug: "ocean-surfing",
        aliases: ["kai-lenny", "big-wave-surfing", "card-3"],
        name: "Kai Lenny",
        sport: "Big Wave Surfing",
        title: "Big Wave<br />Ocean Surfing",
        displayTitle: "Big Wave Ocean Surfing",
        subtitle: "Heavy Water Elite",
        discipline: "Big Wave & Hydrofoil Riding",
        team: "Red Bull Ocean Division",
        nationality: "United States",
        hometown: "Maui, Hawaii",
        debutYear: "2014",
        quote: "The ocean doesn't care about your resume. You have to be completely present with every breath.",
        description:
            "Carving towering 50-foot monster swells where split-second composure and raw nerve separate immortality from wipeout.",
        defaultImage: "/images/home/athletes/hover-athlete-3.jpg",
        hoverImage: "/images/home/athletes/athlete-3.jpg",
        actionImage: "/images/home/athletes/athlete-3.jpg",
        portraitImage: "/images/home/athletes/hover-athlete-3.jpg",
        stats: [
            { label: "Biggest Wave", value: "70+ Ft", detail: "Nazaré & Jaws Peaks" },
            { label: "World Titles", value: "8x", detail: "Multi-Discipline Champion" },
            { label: "Ride Speed", value: "65 km/h", detail: "Hydrofoil Wave Acceleration" },
            { label: "WSL Awards", value: "5x", detail: "Ride of the Year" },
        ],
        bio: [
            "Raised along the North Shore of Maui, Kai Lenny is widely regarded as the most versatile waterman of his generation. From tow-in surfing massive Pacific peaks at Pe'ahi (Jaws) to pioneering offshore hydrofoiling, Lenny treats extreme swells as expansive vertical playgrounds.",
            "Backed by Red Bull's elite ocean safety teams, he has confronted colossal 70-foot Atlantic swells at Nazaré, Portugal, executing high-speed carving turns where traditional surfers could only survive straight lines.",
            "Beyond competition, Lenny spearheads ocean research, testing hydrofoil dynamics and eco-engineered carbon fiber boards that redefine how humanity interacts with ocean swells.",
        ],
        highlights: [
            { year: "2022", title: "Nazaré Tow Surfing Challenge Champion", event: "WSL Big Wave World Tour" },
            { year: "2020", title: "Jaws Big Wave Championship Victory", event: "Pe'ahi, Maui Invitational" },
            { year: "2019", title: "Overall Big Wave Performance of the Year", event: "World Surf League Awards" },
        ],
    },
    {
        id: "athlete-4",
        slug: "backcountry-snowboarding",
        aliases: ["travis-rice", "card-4"],
        name: "Travis Rice",
        sport: "Snowboarding",
        title: "Backcountry<br />Snowboarding",
        displayTitle: "Backcountry Snowboarding",
        subtitle: "Alpine Freeride",
        discipline: "Big Mountain Freeride",
        team: "Red Bull Natural Selection",
        nationality: "United States",
        hometown: "Jackson, Wyoming",
        debutYear: "2005",
        quote: "Out in the deep alpine, nature sets the parameters. You're simply translating gravity into art.",
        description:
            "Untouched powder corridors and sheer glacier drops. Navigating extreme mountain frontiers with fearless speed and razor precision.",
        defaultImage: "/images/home/athletes/hover-athlete-1.jpg",
        hoverImage: "/images/home/athletes/athlete-1.jpg",
        actionImage: "/images/home/athletes/athlete-1.jpg",
        portraitImage: "/images/home/athletes/hover-athlete-1.jpg",
        stats: [
            { label: "Vertical Descent", value: "1,400m", detail: "Alaskan Spine Faces" },
            { label: "X-Games Medals", value: "8x", detail: "Slopestyle & Big Air" },
            { label: "Slope Angle", value: "55°+", detail: "Glacial Headwalls" },
            { label: "Tour Founder", value: "Natural Selection", detail: "World Freeride Tour" },
        ],
        bio: [
            "Travis Rice is synonymous with big-mountain snowboarding progression. Hailing from Jackson Hole, Wyoming, Rice redefined what is possible on alpine spine walls, bringing freestyle spins into unrideable Alaskan backcountry faces.",
            "Through boundary-pushing cinema projects like 'That's It, That's All' and 'The Fourth Phase,' created in partnership with Red Bull Media House, Rice captivated millions worldwide while elevating mountain cinematography to museum-grade art.",
            "His vision culminated in the creation of the Red Bull Natural Selection Tour, bringing together the world's finest freeriders to compete on raw, untouched backcountry terrain with safety and respect for the mountain.",
        ],
        highlights: [
            { year: "2023", title: "Natural Selection Tour Champion", event: "Revelstoke, British Columbia" },
            { year: "2016", title: "Best Snowboard Film of the Year", event: "The Fourth Phase Premiere" },
            { year: "2012", title: "Red Bull Supernatural Inaugural Champion", event: "Baldface Lodge, BC" },
        ],
    },
    {
        id: "athlete-5",
        slug: "street-skateboarding",
        aliases: ["gustavo-ribeiro", "card-5"],
        name: "Gustavo Ribeiro",
        sport: "Skateboarding",
        title: "Urban Street<br />Skateboarding",
        displayTitle: "Urban Street Skateboarding",
        subtitle: "Street League Pro",
        discipline: "Street Skateboarding",
        team: "Red Bull Skate Division",
        nationality: "Portugal",
        hometown: "Lisbon, Portugal",
        debutYear: "2019",
        quote: "The concrete is unforgiving, but when every movement aligns in the final fraction of a second, it feels effortless.",
        description:
            "Transforming raw city concrete into an arena of technical innovation, balance, and relentless boundary-pushing skate progression.",
        defaultImage: "/images/home/athletes/hover-athlete-2.jpg",
        hoverImage: "/images/home/athletes/athlete-2.jpg",
        actionImage: "/images/home/athletes/hover-athlete-2.jpg",
        portraitImage: "/images/home/athletes/athlete-2.jpg",
        stats: [
            { label: "World Titles", value: "1x", detail: "World Skate Champion" },
            { label: "SLS Super Crown", value: "Champion", detail: "Street League Skateboarding" },
            { label: "Gap Record", value: "24 Stairs", detail: "Technical Flip Entry" },
            { label: "Olympic Rank", value: "Finalist", detail: "Tokyo Olympic Games" },
        ],
        bio: [
            "Lisbon-born Gustavo Ribeiro has emerged as one of the most technically gifted street skateboarders in the world. Renowned for surgical board control and ice-cold composure under competition pressure, Ribeiro routinely locks in highest-difficulty ledge tricks and stair gaps.",
            "In 2022, Ribeiro achieved street skating immortality by capturing the Street League Skateboarding (SLS) Super Crown World Championship in Rio de Janeiro, sealing victory with a clutch 360 flip crooked grind on the final attempt.",
            "His disciplined training routine, supported by the Red Bull Athlete Performance Center, blends strength conditioning, spatial kinematics, and artistic street filming throughout Lisbon, Barcelona, and Los Angeles.",
        ],
        highlights: [
            { year: "2023", title: "World Skateboarding Championship Silver", event: "Rome World Championships" },
            { year: "2022", title: "SLS Super Crown World Champion", event: "Rio de Janeiro Arena" },
            { year: "2019", title: "Tampa Am Champion & Pro Turn", event: "Skatepark of Tampa, Florida" },
        ],
    },
    {
        id: "athlete-6",
        slug: "rock-climbing",
        aliases: ["sasha-digiulian", "cliff-rock-climbing", "card-6"],
        name: "Sasha DiGiulian",
        sport: "Rock Climbing",
        title: "Alpine Cliff<br />Rock Climbing",
        displayTitle: "Alpine Cliff Rock Climbing",
        subtitle: "Vertical Horizons",
        discipline: "Big Wall & Sport Climbing",
        team: "Red Bull Vertical Expedition",
        nationality: "United States",
        hometown: "Alexandria, Virginia",
        debutYear: "2013",
        quote: "On a sheer granite wall with thousands of feet of exposure below, clarity replaces fear.",
        description:
            "Ascending sheer monolithic granite walls with unyielding grip, pure mental clarity, and zero margin for error.",
        defaultImage: "/images/home/athletes/hover-athlete-3.jpg",
        hoverImage: "/images/home/athletes/athlete-3.jpg",
        actionImage: "/images/home/athletes/athlete-3.jpg",
        portraitImage: "/images/home/athletes/hover-athlete-3.jpg",
        stats: [
            { label: "Max Difficulty", value: "5.14d / 9a", detail: "First Female Ascent" },
            { label: "Big Walls", value: "30+", detail: "First Ascents Worldwide" },
            { label: "World Titles", value: "World Champion", detail: "IFSC World Championships" },
            { label: "Wall Height", value: "1,000m", detail: "El Capitan & Rockies" },
        ],
        bio: [
            "Sasha DiGiulian is a trailblazer in world climbing, holding the distinction of being the first North American woman to climb grade 9a (5.14d) and the first woman to free-climb the perilous Magic Mushroom on the north face of the Eiger in Switzerland.",
            "Her career spans high-pressure indoor competition—where she claimed World Championship gold—to high-altitude big wall expeditions across Madagascar, South Africa, Greenland, and the Canadian Rockies.",
            "A relentless advocate for female representation in extreme sports, DiGiulian continues to push human endurance on untouched multi-pitch routes while inspiring the next generation of alpine adventurers.",
        ],
        highlights: [
            { year: "2022", title: "First Female Ascent of Rayu (8c)", event: "Picos de Europa, Spain" },
            { year: "2018", title: "Mora Mora Big Wall Free Climb (8c)", event: "Tsaranoro Massif, Madagascar" },
            { year: "2015", title: "First Female Ascent of Magic Mushroom", event: "Eiger North Face, Switzerland" },
        ],
    },
];

export function getAthleteBySlug(slug: string): AthleteData | undefined {
    const cleanSlug = slug.toLowerCase().trim();
    return ATHLETES.find(
        (a) =>
            a.slug.toLowerCase() === cleanSlug ||
            a.id.toLowerCase() === cleanSlug ||
            a.aliases?.some((alias) => alias.toLowerCase() === cleanSlug)
    );
}
