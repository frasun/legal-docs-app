import { sanityClient } from "sanity:client";
import imageUrlBuilder from "@sanity/image-url";
import type { ImageAsset } from "@sanity/types";

const builder = imageUrlBuilder(sanityClient);

export default function imageUrl(image: ImageAsset, width = 960, height = 300) {
  return builder.image(image).size(width, height).fit("max").auto("format");
}
