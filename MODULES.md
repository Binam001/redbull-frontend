# Module Fields Specification

Required data fields and form inputs for each module.

---

## 1. Contact Page Module

### Form Submission Fields
- `name` (string, required) — Full Name
- `phoneNumber` (string, optional) — Phone Number
- `address` (string, optional) — Physical Address
- `email` (string, required) — Email Address
- `message` (string, required) — Message content
- `agreed` (boolean, required) — Agreement to Terms & Privacy Policy

### Office Contact Fields
- `address` (string) — Maharajgunj, Kathmandu, Nepal
- `phone` (string) — 01-4546409
- `email` (string) — info@sarasbeverages.com

---

## 2. Athletes Page Module

### Athlete Data Fields
- `id` (string) — Unique identifier
- `slug` (string) — URL slug
- `name` (string) — Athlete full name
- `sport` (string) — Sport category (e.g., Formula 1, Ocean Surfing)
- `title` (string) — HTML display title (with line breaks)
- `displayTitle` (string) — Plain text title
- `subtitle` (string) — Division / team tag
- `discipline` (string) — Specific competition discipline
- `team` (string) — Official racing/sports team
- `nationality` (string) — Country of origin
- `hometown` (string) — Athlete hometown
- `debutYear` (string) — Debut year
- `quote` (string) — Athlete signature quote
- `description` (string) — Summary description
- `defaultImage` (string) — Default card image URL
- `hoverImage` (string) — Hover card / action image URL
- `actionImage` (string, optional) — Wide action shot URL
- `portraitImage` (string, optional) — Studio portrait shot URL
- `aliases` (string[], optional) — Alternative lookup slugs

### Athlete Stats Fields (`stats[]`)
- `label` (string) — Stat title (e.g., "Grand Prix Wins")
- `value` (string) — Numeric / text value (e.g., "61")
- `detail` (string, optional) — Context detail

### Career Highlights Fields (`highlights[]`)
- `year` (string) — Achievement year
- `title` (string) — Award / position won
- `event` (string) — Competition or Grand Prix name

### Biography Fields
- `bio` (string[]) — Array of biography paragraphs

---

## 3. Career Page Module

### Job Posting Fields
- `id` (string) — Unique job identifier
- `slug` (string) — URL slug
- `title` (string) — Job title
- `description` (string) — Short summary
- `category` (string) — Department filter (Development, Design, Marketing, Customer Service, Operations, Finance, Management)
- `department` (string) — Full department name
- `location` (string) — Work location (e.g., "100% remote")
- `type` (string) — Employment type (e.g., "Full-time")
- `qualifications` (string) — Degree or background needed
- `experience` (string) — Required years of experience (e.g., "3+ Years")
- `salary` (string) — Salary range (e.g., "$85,000 - $115,000 / year")
- `overview` (string, optional) — Comprehensive role overview
- `responsibilities` (string[], optional) — List of core duties
- `requirements` (string[], optional) — Candidate qualifications list

### Job Application Form Fields
- `fullName` (string, required) — Applicant name
- `email` (string, required) — Email address
- `phone` (string, required) — Contact number
- `age` (string, required) — Applicant age
- `address` (string, required) — Residential address
- `linkedin` (string, optional) — LinkedIn profile URL
- `resumeFile` (File, required) — PDF format only, max 10MB

---

## 4. Events Page Module

### Event Data Fields
- `id` (string) — Unique event identifier
- `slug` (string) — URL slug
- `title` (string) — Event title
- `sport` (string) — Sport category (e.g., Mountain Bike, Breaking, Cliff Diving)
- `date` (string) — Full date range string (e.g., "10 – 12 October 2025")
- `dateShort` (string) — Condensed date (e.g., "10-12 Oct")
- `month` (string) — Month string (e.g., "Oct")
- `day` (string) — Day string (e.g., "10")
- `location` (string) — City / region
- `country` (string) — Host nation
- `fullLocation` (string) — Complete venue location string
- `flagEmoji` (string) — Country flag emoji
- `description` (string) — Event summary
- `status` (`"live"` | `"live-soon"` | `"tickets"` | `"past"`) — Current event status
- `statusCtaText` (string) — CTA button label (e.g., "Buy Tickets", "Watch Live")
- `image` (string) — Thumbnail card image URL
- `carouselImages` (string[]) — Array of hero carousel image URLs
- `leadDescription` (string, optional) — Extended headline description
- `aboutEvent` (string[], optional) — Narrative paragraphs about competition
- `aboutVenue` (string | string[], optional) — Venue specifics and terrain details
- `venueImage` (string, optional) — Venue photograph URL
- `galleryImages` (string[], optional) — Photo gallery image URLs
- `faqs` (EventFaq[], optional) — Custom event-specific FAQs

---

## 5. FAQ Module

### FAQ Item Fields
- `id` (string | number) — Identifier
- `question` (string) — Question prompt
- `answer` (string) / `answers` (string[]) — Answer text / narrative paragraphs
