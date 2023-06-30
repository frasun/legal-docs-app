import Cryptr from "cryptr";
export default new Cryptr(import.meta.env.CRYPTR_SECRET, { saltLength: 5 });
