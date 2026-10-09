export type Standard = {
  title: string;
  text: string;
  image?: string; // real certificate photo, e.g. "/images/certificates/fssai.jpg"
};

// Sirf wahi cheezein likho jo sach me hain.
// Real certificate (jaise FSSAI licence) ho to photo public/images/certificates/ me rakho
// aur ek entry add karo: { title: "FSSAI Licence", text: "...", image: "/images/certificates/fssai.jpg" }
export const standards: Standard[] = [
  { title: "Clean Kitchen Practices", text: "Careful food handling and clean preparation for every event." },
  { title: "Organized Service Flow", text: "Trained staff and a planned service flow for large gatherings." },
  { title: "Customized Menus", text: "Menus built around your guests, traditions and budget." },
];