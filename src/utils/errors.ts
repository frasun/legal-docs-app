import { displayError } from "@stores/toast";

export default {
  EMAIL_TAKEN: "Konto o podanym adresie e-mail już istnieje",
  WRONG_CREDENTIALS: "Podany adres e-mail lub hasło są nieprawidłowe",
  WRONG_VERIFICATION_CODE: "Podany kod jest nieprawidłowy",
  VERIFICATION_CODE_EXPIRED:
    "Podano nieprawidłowy kod 3 razy. Należy zarejestrować konto ponownie.",
  WRONG_EMAIL: "Adres e-mail jest nieprawidłowy",
  UNSAFE_PASSWORD: "Hasło nie spełnia warunków bezpieczeństwa",
  ACCEPT_TERMS: "Aby kontynuować musisz zaakceptować regulamin",
  DIFFERENT_PASSWORDS: "Hasła nie są jednakowe",
  ANSWER_WRONG_FORMAT: "pole ma nieprawidłowy format",
  ANSWER_REQUIRED: "pole jest wymagane",
  LIMIT_LOGIN_ATTEMPTS:
    "Podano nieprawdiłowe dane logowania 4 razy pod rząd. Spróbuj ponownie za chwilę",
};

export function handleFormValidation(el: Element, e: Error) {
  const errors = JSON.parse(e.message);
  const displayErrors: string[] = [];

  errors.map(([message, path]: [string, string]) => {
    const field: HTMLElement | null = el.querySelector(`input[name="${path}"]`);

    if (field) {
      const fieldName = field.dataset.label;

      if (field.dataset.label) {
        displayErrors.push(`${fieldName}: ${message}`);
      } else {
        const labels: NodeListOf<HTMLElement> = el.querySelectorAll(
          `label[for="${path}"]`
        );

        if (labels.length) {
          for (let label of Array.from(labels)) {
            if (label.style.display !== "none") {
              displayErrors.push(`${label.innerHTML}: ${message}`);
              break;
            }
          }
        }
      }
    }
  });

  if (displayErrors.length) {
    displayError(displayErrors);
  } else {
    displayError();
  }
}
