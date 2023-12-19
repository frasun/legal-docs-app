import { persistentMap } from "@nanostores/persistent";
import { ERROR, ToastStatus } from "@utils/toasts";
import { navigate } from "astro:transitions/client";

export type ToastStore = {
  message?: string | string[];
  status: ToastStatus;
  show?: boolean;
  list?: boolean;
};

export const $toast = persistentMap<ToastStore>(
  "toast:",
  { status: ToastStatus.default, message: undefined, show: false, list: false },
  {
    listen: false,
    encode(value) {
      return JSON.stringify(value);
    },
    decode(value) {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    },
  }
);

export function resetToast() {
  $toast.set({ message: undefined, status: ToastStatus.default, show: false });
}

export function displayError(message?: string | string[]) {
  $toast.set({
    status: ToastStatus.error,
    message: message || ERROR,
    show: true,
  });
}

export function displayToast(
  message: string,
  reload = false,
  reloadUrl?: string,
  error = false
) {
  if (error) {
    $toast.setKey("status", ToastStatus.error);
  }

  $toast.setKey("message", message);

  if (reload) {
    if (reloadUrl) {
      navigate(reloadUrl);
    } else {
      navigate(window.location.href);
    }
  } else {
    $toast.setKey("show", true);
  }
}
