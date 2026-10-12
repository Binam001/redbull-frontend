export type EventStatus = "live" | "live-soon" | "tickets" | "past";

export interface EventFaq {
    question: string;
    answer: string;
}

export interface EventData {
    id: string;
    slug: string;
    title: string;
    sport: string;
    date: string;
    dateShort: string;
    month: string;
    day: string;
    location: string;
    country: string;
    fullLocation: string;
    flagEmoji: string;
    description: string;
    status: EventStatus;
    statusCtaText: string;
    image: string;
    carouselImages: string[];
    leadDescription?: string;
    aboutEvent?: string[];
    aboutVenue?: string | string[];
    venueImage?: string;
    faqs?: EventFaq[];
    galleryImages?: string[];
}

export const DEFAULT_FAQS: EventFaq[] = [
    {
        question: "How do I purchase tickets for this event?",
        answer: "Tickets and spectator passes can be booked directly through the official Red Bull ticketing portal. Availability varies depending on venue capacity and category tiers. We recommend booking in advance as high-profile events frequently sell out.",
    },
    {
        question: "Where can I watch the event if I cannot attend in person?",
        answer: "All major Red Bull events are broadcast live and on-demand worldwide on Red Bull TV (available on web, iOS, Android, and smart TVs) as well as the Red Bull YouTube channel.",
    },
    {
        question: "What time do the venue gates open for spectators?",
        answer: "Gates typically open two to three hours before the official competition start time to allow spectators ample time for security screening, exploring the sponsor fan village, and finding their seats.",
    },
    {
        question: "Are cameras and recording equipment permitted inside?",
        answer: "Personal mobile phones and non-professional point-and-shoot cameras are welcome. Professional lenses, tripods, and unauthorized drones or aerial recording equipment are strictly prohibited without press accreditation.",
    },
    {
        question: "What safety guidelines and prohibited items apply?",
        answer: "Spectators must follow all instructions from event marshals and remain within designated viewing zones. Prohibited items include weapons, alcohol brought from outside, fireworks, and large rigid banners.",
    },
    {
        question: "Is parking and public shuttle transit available?",
        answer: "Dedicated spectator parking zones and shuttle transit routes operate throughout competition days. Detailed transit maps and parking permit passes are distributed with your electronic ticket confirmation.",
    },
];

export const EVENTS: EventData[] = [
    {
        id: "event-1",
        slug: "germany-premier-padel-p2",
        title: "Germany Premier Padel P2",
        sport: "Padel",
        date: "5 – 11 October 2026",
        dateShort: "5–11 Oct",
        month: "OCT",
        day: "5",
        location: "Düsseldorf",
        country: "Germany",
        fullLocation: "Düsseldorf, Germany",
        flagEmoji: "🇩🇪",
        description: "As padel skyrockets worldwide, elite international players clash for supremacy at the high-stakes German stop.",
        status: "live-soon",
        statusCtaText: "Live Soon",
        image: "/images/home/hero/adventure-5.jpg",
        carouselImages: [
            "/images/home/hero/hero-1.jpg",
            "/images/home/hero/hero-2.jpg",
            "/images/home/hero/hero-3.jpg",
        ],
        venueImage: "/images/demo-location.jpg",
        leadDescription: "Germany Premier Padel P2 is here! From 5 to 11 October, international padel superstars descend on Düsseldorf to battle for ranking supremacy and continental glory. As padel cements its reputation as the fastest-growing racquet sport on the planet, Germany's premier indoor sports arena transforms into an electrifying theater of blistering rallies, fence-vaulting smashes, and world-class shot-making. Thousands of dedicated supporters will gather to witness world number ones clash with fearless rising contenders across a full week of non-stop drama on the glass court.",
        aboutEvent: [
            "Germany Premier Padel P2 brings premier-tier professional racquet action to the heart of Europe. Part of the elite international Premier Padel calendar governed by the FIP, the tournament features top-seeded pairs from Spain, Argentina, Brazil, and across Europe battling fiercely for vital world ranking points, prestigious silverware, and a lucrative prize purse.",
            "The tournament format features both men’s and women’s main draws across seven intense days of competition. Beginning with high-stakes qualifying rounds and round-of-32 battles, the intensity escalates through the quarterfinals and semifinals, culminating in back-to-back championship showdowns on Sunday evening under the arena spotlights.",
            "Padel at this elite level combines relentless tactical chess with breathtaking athletic acrobatics. Spectators will witness high-flying viboras, spin-heavy bandejas, and spectacular recoveries outside the court gates as players chase down balls that bounce off the 4-meter glass walls with unbelievable reaction speeds.",
            "Fans can experience premium hospitality packages, interactive fan villages with padel gear testing, and meet-and-greet sessions with their favorite international stars. Check out ticketing tiers and the daily schedule to ensure you don't miss a single moment of European padel history.",
        ],
        aboutVenue: [
            "Hosted at CASTELLO Düsseldorf, a state-of-the-art multi-purpose arena renowned for its outstanding acoustics and intimate spectator configuration. Located in Düsseldorf's southern district of Reisholz, the venue accommodates up to 3,300 passionate fans, offering unobstructed sightlines to the panoramic central padel court.",
            "The arena features specialized LED tournament lighting and high-traction acrylic turf surfaces engineered specifically to Premier Padel tour specifications. Its climate-controlled environment guarantees consistent ball bounce dynamics and optimal player performance regardless of external autumn weather conditions.",
            "Easily accessible via Düsseldorf's comprehensive public transit network, CASTELLO Düsseldorf provides dedicated fan lounges, sponsor experiential zones, and gourmet dining options, creating an electric festival atmosphere for visiting sports enthusiasts from all across Germany and neighboring European countries.",
        ],
        faqs: [
            {
                question: "Where can I buy tickets for Germany Premier Padel P2?",
                answer: "Tickets are available online through the official tournament ticketing portal and the CASTELLO Düsseldorf box office. Multiple categories are offered, including Single-Day Passes, Weekend Finals Passes, and Court-side VIP Hospitality packages.",
            },
            {
                question: "How can I follow the live matches online?",
                answer: "All main draw matches from CASTELLO Düsseldorf will be streamed live globally for free on Red Bull TV and the official Premier Padel YouTube channel, featuring multi-camera court coverage, live statistics, and bilingual expert commentary.",
            },
            {
                question: "How do I reach CASTELLO Düsseldorf by public transport?",
                answer: "CASTELLO Düsseldorf is directly connected to the regional train network (S-Bahn S6) via the Düsseldorf-Reisholz station, as well as multiple municipal bus and tram routes. Event tickets often include free local public transit travel within the VRR network on the day of the event.",
            },
            {
                question: "Are there food and beverage options inside the arena?",
                answer: "Yes, CASTELLO Düsseldorf features a wide range of concession stands, beverage bars, and food vendors offering hot meals, snacks, and refreshing Red Bull energy drinks throughout each tournament day.",
            },
            {
                question: "Is re-entry allowed during tournament sessions?",
                answer: "Re-entry is permitted with a valid scanned wristband or electronic ticket barcode. Please ensure you scan out with security personnel at the venue exit gates before leaving the arena grounds.",
            },
        ],
    },
    {
        id: "event-2",
        slug: "red-bull-rampage",
        title: "NPL 2026 (Season 3)",
        sport: "MTB Freeride",
        date: "8 – 10 October 2026",
        dateShort: "8–10 Oct",
        month: "OCT",
        day: "8",
        location: "Virgin, Utah",
        country: "United States",
        fullLocation: "Virgin, Utah, United States",
        flagEmoji: "🇺🇸",
        description: "The premier big-mountain freeride spectacle where elite riders sculpt fearless lines down sheer Utah desert cliffs.",
        status: "tickets",
        statusCtaText: "Tickets LIVE NOW!",
        image: "/images/home/hero/npl-2.jpeg",
        carouselImages: [
            "/images/home/hero/hero-1.jpg",
            "/images/home/hero/hero-2.jpg",
            "/images/home/hero/hero-3.jpg",
        ],
        venueImage: "/images/demo-location.jpg",
        leadDescription: "Red Bull Rampage is back! On Thursday, October 8 and Saturday, October 10 the world’s top [female](https://www.redbull.com/int-en/events/red-bull-rampage/red-bull-rampage-womens-roster-2026) and [male](https://www.redbull.com/int-en/events/red-bull-rampage/red-bull-rampage-mens-lineup-2026) freeride mountain bike riders will descend on the mountains of Southwest Utah to compete for the top podium spot and secure their names in history. Against the raw red-rock ridgelines of Virgin, eighteen elite athletes armed with shovels, pickaxes, and two-wheeled precision will spend over a week carving impossible descending lines directly into sandstone mesas. With zero room for error, riders will charge 70-foot canyon gaps, exposed ridge knives, and colossal natural drops into the desert abyss. Which athletes will add their name to the list of icons in 2026 and conquer gravity on freeride mountain biking's most unforgiving canvas?",
        aboutEvent: [
            "Red Bull Rampage, one of action sports’ most iconic events, returns to the towering cliffs of south-west Utah to mark 25 years of freeride mountain biking. What began as a raw expression of big mountain freeride has become the sport’s ultimate proving ground, shaping mountain biking’s biggest names and most defining moments.",
            "The event returns in its two-day format, with the [women’s competition](https://www.redbull.com/int-en/events/red-bull-rampage/red-bull-rampage-womens-roster-2026) on Thursday, October 8, followed by the [men’s competition](https://www.redbull.com/int-en/events/red-bull-rampage/red-bull-rampage-mens-lineup-2026) on Saturday, October 10. Each competitor, supported by their two-person dig crew, is given four days to hand-craft their personalized descent down a 750-foot vertical drop, followed by four days of practice to dial in tricks, speeds, and wind timing before taking their final judged runs.",
            "Judged on difficulty of line choice, amplitude, control, fluid style, and technical tricks, each run is an individualized masterclass in bravery and engineering. Riders combine massive backflips over canyons, flat-spin 360s off sheer cliffs, and razor-sharp navigation along razorback ridges where a gust of wind can mean the difference between glory and disaster.",
            "Check out the [FAQs page](https://www.redbull.com/int-en/events/red-bull-rampage/red-bull-rampage-faqs) to find out more about the event, including how to get tickets, how to watch, how to buy merch, and important info you need to know if you're attending in person.",
        ],
        aboutVenue: [
            "Each year the event takes place in the desert landscape of Virgin, Utah, United States. In 2026, [Red Bull Rampage returns to the original venue](https://www.redbull.com/int-en/red-bull-rampage-venues-overview) on Kolob Terrace Road where the first Rampage took place back in 2001! The location is known affectionately by fans and riders as the OG site.",
            "The OG venue features some of the steepest natural gradients and most dramatic natural amphitheaters in North America. Surrounded by towering red rock formations and harsh desert vegetation, the site demands extreme physical resilience from both athletes and spectators who hike the rugged ridgelines under the scorching desert sun.",
            "Returning to Kolob Terrace Road offers competitors completely fresh topography to explore while paying homage to the pioneering lines laid down by freeride legends over two decades ago. The natural bowl provides unprecedented panoramic sightlines for fans, creating an electric stadium-like energy deep in the remote American wilderness.",
        ],
        faqs: [
            {
                question: "How do I purchase tickets for Red Bull Rampage?",
                answer: "Due to the remote desert location and strict conservation regulations in Virgin, Utah, spectator tickets are extremely limited. Official ticket drops are announced in advance through Red Bull Rampage channels. Make sure to sign up for ticket alerts on redbull.com to be notified the moment passes become available.",
            },
            {
                question: "Where can I watch the live broadcast online?",
                answer: "Red Bull Rampage will be broadcast live for free exclusively on Red Bull TV and the official Red Bull YouTube channel. You can watch full multi-camera coverage of both the women’s competition on Thursday, October 8, and the men’s competition on Saturday, October 10, with real-time scoring, live drone feeds, and expert commentary.",
            },
            {
                question: "Can I hike to the venue in person?",
                answer: "Spectators with valid tickets must prepare for a strenuous desert hike from the shuttle drop-off area to the venue ridgelines. There is no direct vehicle access to the competition site. Sturdy hiking boots, ample hydration, sun protection, and physical fitness are mandatory for navigating the exposed sandstone terrain.",
            },
            {
                question: "What should I bring if I am attending in person?",
                answer: "Temperatures in the Utah desert can fluctuate dramatically. We strongly recommend bringing at least 3-4 liters of water per person, high-SPF sunscreen, a wide-brimmed hat, sunglasses, portable camp chairs, and layered clothing for cold mornings and hot afternoons. Open fires, glass containers, and unauthorized drones are strictly prohibited.",
            },
            {
                question: "What happens if there are high winds on competition day?",
                answer: "Freeride mountain biking at this extreme scale requires calm wind conditions for athlete safety when clearing 70-foot canyon gaps. In the event of high winds or severe weather, organizers reserve the right to delay competition start times or utilize the official weather contingency reserve day.",
            },
            {
                question: "Where can I buy official Red Bull Rampage merchandise?",
                answer: "Official Rampage event apparel, hats, and collectibles are sold on-site at the vendor village during event week and online through the official Red Bull Shop while supplies last.",
            },
        ],
    },
    {
        id: "event-3",
        slug: "motogp-grand-prix-of-japan",
        title: "MotoGP™ Grand Prix of Japan",
        sport: "MotoGP",
        date: "4-11 October 2026",
        dateShort: "5–11 Oct",
        month: "OCT",
        day: "4",
        location: "Motegi",
        country: "Japan",
        fullLocation: "Motegi, Japan",
        flagEmoji: "🇯🇵",
        description: "High-octane motorcycle racing thrills as world-class riders push beyond 340 km/h at the iconic Motegi circuit.",
        status: "past",
        statusCtaText: "Event Ended",
        image: "/images/home/hero/adventure-6.jpg",
        carouselImages: [
            "/images/home/hero/hero-1.jpg",
            "/images/home/hero/hero-2.jpg",
            "/images/home/hero/hero-3.jpg",
        ],
        venueImage: "/images/demo-location.jpg",
        leadDescription: "The roar of premier class motorcycle racing echoes across Tochigi Prefecture! The MotoGP™ Grand Prix of Japan brings riders pushing 300+ horsepower prototype machines to the absolute limit around the famed Twin Ring Motegi circuit. From 2 to 4 October, legendary manufacturers and world champions face extreme deceleration zones, technical chicanes, and full-throttle straights at speeds surpassing 340 km/h in pursuit of championship dominance.",
        aboutEvent: [
            "Steeped in Japanese motorsport heritage, the Japanese Grand Prix at Mobility Resort Motegi is widely recognized as one of the most grueling and technically demanding stopovers on the MotoGP calendar. With constructors fighting for home-turf pride before an incredibly passionate Japanese fanbase, every lap delivers breathless edge-of-seat drama.",
            "The race weekend features the full Grand Prix spectrum, including the high-stakes Saturday Tissot Sprint Race where riders battle at maximum aggression over half race distance, followed by the grueling 24-lap Main Grand Prix on Sunday. Alongside MotoGP, the Moto2 and Moto3 feeder categories deliver chaotic, photo-finish action.",
            "Motegi is renowned as a true 'stop-and-go' circuit, punishing brake discs and front Michelin slick tires with massive deceleration forces approaching 2G into Turn 11's downhill 90-degree corner. Only riders with supreme balance, titanium forearms, and flawless racecraft can conquer its punishing sequence of slow-speed exits.",
            "Spectators can explore the historic Honda Collection Hall on site, enjoy live grandstand commentary, and participate in track invasions after the podium ceremony. Follow official broadcast streams and live timing to catch every millisecond of heart-thumping two-wheeled fury.",
        ],
        aboutVenue: [
            "Mobility Resort Motegi, located among the scenic rolling hills of Tochigi Prefecture, is an engineering marvel designed with both a 4.8 km FIA Grade 1 road course and a 2.4 km superspeedway oval. Opened in 1997, it serves as the ultimate benchmark for modern motorsport vehicle dynamics.",
            "The facility offers world-class viewing grandstands positioned above the downhill sweeping chicanes, allowing fans to hear the unbaffled roar of 1000cc V4 and inline-four racing engines ricocheting off the surrounding forested landscape.",
            "Beyond the asphalt, the complex features a dedicated family theme park, glamping campsites, high-end paddock suites, and the world-famous museum showcasing hundreds of championship-winning road racing motorcycles and Formula 1 racers from motorsport history.",
        ],
    },
    {
        id: "event-4",
        slug: "dtm-hockenheimring-season-final",
        title: "DTM – Hockenheimring Season Final",
        sport: "DTM Racing",
        date: "10 – 11 October 2026",
        dateShort: "10–11 Oct",
        month: "OCT",
        day: "10",
        location: "Hockenheimring",
        country: "Germany",
        fullLocation: "Hockenheimring, Germany",
        flagEmoji: "🇩🇪",
        description: "The dramatic final stop of the DTM season where championship glory is decided at full throttle on German tarmac.",
        status: "live",
        statusCtaText: "WATCH LIVE NOW!",
        image: "/images/home/hero/adventure-4.jpg",
        carouselImages: [
            "/images/home/hero/hero-1.jpg",
            "/images/home/hero/hero-2.jpg",
            "/images/home/hero/hero-3.jpg",
        ],
        venueImage: "/images/demo-location.jpg",
        leadDescription: "The championship goes down to the wire! The DTM Season Final at the historic Hockenheimring delivers heart-stopping touring car battles where every point, every pit stop, and every overtake will decide the 2026 crown. From 10 to 11 October, Germany's most prestigious motorsport championship culminates in an adrenaline-fueled weekend of door-to-door GT3 combat on one of Europe's most storied circuits.",
        aboutEvent: [
            "The legendary Hockenheimring plays host to the grand finale of the DTM season. Top international GT3 drivers behind the wheels of factory-backed machinery from Porsche, BMW, Mercedes-AMG, Audi, Ferrari, and Lamborghini battle wheel-to-wheel in front of tens of thousands of cheering fans in the grandstands.",
            "Two feature sprint races held over Saturday and Sunday format ensure high stakes until the final checkered flag. With no driver changes and mandatory performance pit stops where crews swap four tires in under seven seconds, the championship can be won or lost in the blink of an eye.",
            "The battle for supremacy requires precision car control through high-speed sweepers and maximum braking stability into the tight hairpin at the end of the Parabolika straight, where overtaking maneuvers frequently test the structural integrity of carbon fiber bodywork.",
            "Fans have unprecedented access to the open paddock, pit lane walks, and autograph sessions, bringing spectators inches away from the roaring V8, flat-six, and twin-turbo powertrains that define modern sports car racing.",
        ],
        aboutVenue: [
            "The iconic Hockenheimring Baden-Württemberg in southwestern Germany provides an electric amphitheater atmosphere unlike any other track in the world, anchored by the legendary Motodrom stadium section where roaring grandstands surround the final corners.",
            "Originally built in 1932 as a motorcycle testing track through the Hardtwald forest, the modernized 4.57 km Grand Prix configuration blends high-speed slipstreaming down the curved Parabolika straight with tight, technical complexes designed to maximize overtaking opportunities.",
            "The venue boasts extensive spectator amenities, including trackside camping zones, elevated VIP hospitality suites, open-air concert stages, and comprehensive karting tracks, making it the ultimate destination for weekend motorsport festivals.",
        ],
    },
    {
        id: "event-5",
        slug: "red-bull-batalla-argentina-final",
        title: "Red Bull Batalla Argentina Final",
        sport: "MC Battle",
        date: "2-8 October 2026",
        dateShort: "2-11 Oct",
        month: "OCT",
        day: "2",
        location: "Buenos Aires",
        country: "Argentina",
        fullLocation: "Buenos Aires, Argentina",
        flagEmoji: "🇦🇷",
        description: "The world's most electrifying Spanish freestyle rap showdown bringing razor-sharp verbal battles to Buenos Aires.",
        status: "live-soon",
        statusCtaText: "Live Soon",
        image: "/images/home/hero/adventure-2.jpg",
        carouselImages: [
            "/images/home/hero/hero-1.jpg",
            "/images/home/hero/hero-2.jpg",
            "/images/home/hero/hero-3.jpg",
        ],
        venueImage: "/images/demo-location.jpg",
        leadDescription: "The fiercest rhyme masters in the Spanish-speaking world assemble in Buenos Aires! On October 2, 16 freestyle gladiators go microphone-to-microphone with wit, flow, rhythm, and raw verbal punchlines on the line. Red Bull Batalla Argentina Final is widely revered as the most intense, electric, and unforgiving national freestyle championship on Earth, where one slip of the tongue means instant elimination.",
        aboutEvent: [
            "Red Bull Batalla is the premier Spanish-language freestyle rap competition on the globe. Since 2005, it has provided a global launching pad for rap luminaries, giving birth to cultural phenomena and launching underground street poets into international superstars who sell out worldwide stadium tours.",
            "The Argentine National Final features an unforgiving knockout bracket format. Sixteen qualified MCs face off in one-on-one sudden death rounds where they must improvise verses over live beats curated by top producers, responding instantly to word prompts, thematic objects, and their opponent's sharp lyrical attacks.",
            "Judged by a panel of battle rap legends, criteria include lyrical creativity, rhyme complexity, flow variation, stage presence, and the devastating impact of punchlines that bring thousands of roaring fans to their feet with deafening cheers.",
            "The champion of this tournament earns direct qualification to the Red Bull Batalla International World Final, bearing the pride and expectations of Argentine hip-hop on the global stage. Tune in to the interactive worldwide livestream or secure tickets to experience this raw cultural explosion in person.",
        ],
        aboutVenue: [
            "Held at the legendary Estadio Obras Sanitarias in the Nuñez neighborhood of Buenos Aires, an iconic venue historically revered throughout South America as the 'Temple of Rock' and the cathedral of Argentine urban youth culture.",
            "With a capacity of over 4,500 roaring spectators, the indoor arena is famous for its thunderous acoustic resonance, magnifying the energy of every rhyme, crowd reaction, and beat drop into a physical sensation that vibrates through the floorboards.",
            "Conveniently situated along Avenida del Libertador with direct access to train and bus connections, Obras Sanitarias offers dedicated fan villages, street art installations, and VIP lounge areas, preserving its status as the beating heart of Latin American performance arts.",
        ],
    },
    {
        id: "event-6",
        slug: "red-bull-cliff-diving-world-series",
        title: "Red Bull Cliff Diving World Series",
        sport: "Cliff Diving",
        date: "22-24 November 2026",
        dateShort: "22-24 Nov",
        month: "NOV",
        day: "22",
        location: "Polignano a Mare",
        country: "Italy",
        fullLocation: "Polignano a Mare, Italy",
        flagEmoji: "🇮🇹",
        description: "Divers execute incredible acrobatics from heights of up to 27m into the Adriatic Sea in the ultimate display of skill.",
        status: "tickets",
        statusCtaText: "Tickets LIVE NOW!",
        image: "/images/home/hero/adventure-1.jpg",
        carouselImages: [
            "/images/home/hero/hero-1.jpg",
            "/images/home/hero/hero-2.jpg",
            "/images/home/hero/hero-3.jpg",
        ],
        venueImage: "/images/demo-location.jpg",
        leadDescription: "Fearless athletes leap from sheer cliffs up to 27 meters above the crystal-clear waters of Polignano a Mare! On 22 November, the Adriatic coastline becomes a majestic natural arena of gravity-defying twists, somersaults, and sheer courage as the Red Bull Cliff Diving World Series crowns its champions. Plunging at speeds surpassing 85 km/h with three seconds of pure freefall, the world's best divers showcase the ultimate fusion of elegance, bravery, and athleticism.",
        aboutEvent: [
            "The Red Bull Cliff Diving World Series stands as the undisputed pinnacle of extreme aquatic sports. Launching from heights nearly three times that of the Olympic 10-meter platform, elite male and female divers execute intricate multi-axis rotations before hitting the water with immense hydrodynamic impact.",
            "The competition consists of four distinct rounds over the weekend, testing divers on required and optional dives of varying degrees of difficulty. Scores are awarded by an international panel of five judges evaluating takeoff trajectory, in-air body position, rotation speed, and clean water entry with minimal splash.",
            "Entering the water at up to 85 km/h requires divers to tense every muscle in their body in less than a tenth of a second to absorb the decelerating shockwave, a feat demanding years of gymnastics training, mental fortitude, and flawless physical conditioning.",
            "Spectators gather by the thousands on private balconies, cliff perches, and flotillas of small boats and paddleboards crowding the cove, creating one of the most picturesque and raucous sporting spectacles on the Mediterranean calendar.",
        ],
        aboutVenue: [
            "The whitewashed seaside cliff perches of Polignano a Mare in southern Italy's Apulia region provide an unmatched natural amphitheater overlooking the azure Adriatic Sea, famed for dramatic limestone caves and sea-carved grottos.",
            "Unique to this historic fishing town, athletes must walk through a private civilian living room perched over the cliff edge before stepping onto the custom-built diving platforms suspended high above the Cala Porto cove.",
            "With sun-bleached houses clinging precariously to the 20-meter limestone gorge, the venue provides a breathtaking 360-degree viewing panorama for over 50,000 spectators who pack every vantage point of the pebble beach and clifftop promenades.",
        ],
    },
];

export function getEventBySlug(slug: string): EventData | undefined {
    return (
        EVENTS.find((e) => e.slug === slug || e.id === slug) ||
        EVENTS.find((e) => e.slug.replace("-2026", "") === slug.replace("-2026", "")) ||
        EVENTS.find((e) => slug.includes(e.slug) || e.slug.includes(slug))
    );
}
