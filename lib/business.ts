export const business = {
  name: "AVSAR CATERERS",
  tagline: "Premium Catering & Hospitality",
  owner: "Vinod Rajpurohit",
  phone: "+91 87698 77604",
  phoneLink: "tel:+918769877604",
  whatsappNumber: "918769877604",
  whatsappMessage:
    "Hello Avsar Caterers, I would like to enquire about catering for my event.",
  email: "avsarcaterersrajasthan1996@gmail.com",
  instagramHandle: "@avsar_excellency_1996",
  instagram: "https://www.instagram.com/avsar_excellency_1996/",
  location: {
    state: "Rajasthan",
    country: "India",
    display: "Rajasthan, India",
    serviceArea:
      "Based in Rajasthan. Serving celebrations across Rajasthan & beyond.",
    address: "",
    mapEmbedUrl: "https://www.google.com/maps?q=Rajasthan%2C%20India&output=embed",
    mapLink: "https://www.google.com/maps/search/?api=1&query=Rajasthan%2C%20India",
  },
} as const;

export const whatsappLink =
  "https://wa.me/" +
  business.whatsappNumber +
  "?text=" +
  encodeURIComponent(business.whatsappMessage);

export const emailLink = "mailto:" + business.email;