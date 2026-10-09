import ServicesClient from "./ServicesClient";
import { serviceImages } from "@/lib/media";
import { services } from "@/lib/services";

export default function Services() {
  return <ServicesClient images={serviceImages(services.map((s) => s.id))} />;
}