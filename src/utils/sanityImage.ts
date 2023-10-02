//@ts-ignore
import { sanityClient } from "sanity:client";
import imageUrlBuilder from "@sanity/image-url";
import type { ImageAsset } from "@sanity/types";

const builder = imageUrlBuilder(sanityClient);

export default function imageUrl(image: ImageAsset, width = 960) {
  return builder.image(image).width(width).fit("max").auto("format");
}
