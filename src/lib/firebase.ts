// Firebase for the website: form submissions (imported lazily from submit.ts, so
// the SDK only downloads when someone submits a form) and the staff CMS (/login/).
//
// The web config below is public by design — access is controlled by the
// Firestore security rules in firestore.rules.
import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { addDoc, collection, initializeFirestore, serverTimestamp } from "firebase/firestore";

const env = import.meta.env;

export const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  appId: env.VITE_FIREBASE_APP_ID,
});

// App Check blocks requests that don't come from the real site (spam bots).
if (env.VITE_RECAPTCHA_SITE_KEY) {
  initializeAppCheck(app, { provider: new ReCaptchaV3Provider(env.VITE_RECAPTCHA_SITE_KEY), isTokenAutoRefreshEnabled: true });
}

// Optional fields left blank arrive as undefined, which Firestore rejects otherwise.
export const db = initializeFirestore(app, { ignoreUndefinedProperties: true });

/** Saves one form submission to the `submissions` collection. */
export async function saveSubmission(formName: string, title: string, data: Record<string, unknown>) {
  await addDoc(collection(db, "submissions"), {
    formName,
    form: title,
    page: window.location.href,
    data,
    createdAt: serverTimestamp(),
  });
}
