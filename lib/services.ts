export type Service = {
  id: string;
  title: string;
  description: string;
  image: string;
  tags?: string[];
};

export const services: Service[] = [
  { id: "wedding", title: "Wedding Catering", description: "Complete catering for wedding functions, planned around your guests, days and menu.", image: "/photos/services/wedding.jpg", tags: ["Customized Menus", "Multi-day Events"] },
  { id: "reception", title: "Reception Catering", description: "Well-presented buffets and attentive service for evening receptions.", image: "/photos/services/reception.jpg", tags: ["Buffet Setup", "Guest Service"] },
  { id: "engagement", title: "Engagement Function", description: "Elegant food and service for engagement ceremonies of every size.", image: "/photos/services/engagement.jpg", tags: ["Elegant Service", "Custom Menu"] },
  { id: "counters", title: "Live Counters", description: "Interactive food and drink counters that bring energy and variety to your celebration.", image: "/photos/services/counters.jpg", tags: ["Live Food", "Food Counter", "Italian", "Chinese", "Punjabi", "Paan", "Ice Cream", "Mocktail"] },
  { id: "hospitality", title: "Premium Hospitality", description: "Trained hospitality and serving staff to look after your guests.", image: "/photos/services/hospitality.jpg", tags: ["Serving Staff", "Hospitality Team"] },
];