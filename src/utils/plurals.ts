import { polishPlurals } from "polish-plurals";

export default {
  ROOM: polishPlurals.bind(null, "pokój", "pokoje", "pokoi"),
  KITCHEN: polishPlurals.bind(null, "kuchnia", "kuchnie", "kuchni"),
  HALL: polishPlurals.bind(null, "przedpokój", "przedpokoje", "przedpokoi"),
  BATHROOM: polishPlurals.bind(null, "łazienka", "łazienki", "łazienek"),
  TOILET: polishPlurals.bind(null, "toaleta", "toalety", "toalet"),
  BALCONY: polishPlurals.bind(null, "balkon", "balkony", "balkonów"),
  WARDROBE: polishPlurals.bind(null, "garderoba", "garderoby", "garderób"),
  GARAGE: polishPlurals.bind(null, "garaż", "garaże", "garaży"),
};
