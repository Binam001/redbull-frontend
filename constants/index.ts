export interface NavDropdownItem {
  name: string;
  href: string;
  subtitle?: string;
  badge?: string;
  volume?: string;
  image?: string;
}

export interface NavLink {
  name: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: NavDropdownItem[];
}

export const navLinks: NavLink[] = [
  { name: "Home", href: "/" },
  {
    name: "Energy Drinks",
    href: "#",
    hasDropdown: true,
    dropdownItems: [
      {
        name: "Red Bull® 250ml",
        href: "/energy-drinks/red-bull-250ml",
        subtitle: "RED BULL® GOLD",
        volume: "250ml",
        badge: "Classic Gold",
        image: "/images/home/hero/short-can.jpg",
      },
      {
        name: "Carbonated Blackcurrant Blueberry 330ml",
        href: "/energy-drinks/carbonated-blackcurrant-blueberry-330ml",
        subtitle: "RED BULL® NEW-GEN",
        volume: "330ml",
        badge: "New-Gen Flavor",
        image: "/images/home/hero/long-can.jpg",
      },
    ],
  },
  { name: "Events", href: "/events" },
  { name: "Company", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/redbull",
    icon: "mdi:instagram",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/user/redbull",
    icon: "mdi:youtube",
  },
  {
    name: "X (Twitter)",
    href: "https://twitter.com/redbull",
    icon: "ri:twitter-x-fill",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/redbull",
    icon: "mdi:facebook",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@redbull",
    icon: "ic:baseline-tiktok",
  },
];

export const contactLinks = [
  {
    title: "Email",
    detail: "contact@redbull.com",
    href: "mailto:contact@redbull.com",
    icon: "mdi:email-outline",
  },
  {
    title: "Phone",
    detail: "+977 1-4412345",
    href: "tel:+97714412345",
    icon: "mdi:phone-outline",
  },
  {
    title: "Address",
    detail: "Kathmandu, Nepal",
    href: "https://maps.google.com/?q=Kathmandu,+Nepal",
    icon: "mdi:map-marker-outline",
  },
];
