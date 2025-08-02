import { atom } from "nanostores";

export const $templateSearch = atom<string | undefined>();

export function setQuery(query: string) {
	$templateSearch.set(query);
}

export function resetQuery() {
	$templateSearch.set("");
}
