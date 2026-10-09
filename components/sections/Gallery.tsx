import GalleryClient from "./GalleryClient";
import { getPhotos, getVideos } from "@/lib/gallery-data";

export default function Gallery() {
  return <GalleryClient photos={getPhotos()} videos={getVideos()} />;
}