import { Redis } from "@upstash/redis";

export default new Redis({
	url: import.meta.env.KV_REST_API_URL,
	token: import.meta.env.KV_REST_API_TOKEN,
});
