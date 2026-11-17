// A branded "Are you sure?" pop-up, used instead of the browser's plain confirm().
//   const confirm = useConfirm();
//   if (!(await confirm({ title: "Delete this post?", confirmLabel: "Delete" }))) return;
import { AlertTriangle, Trash2 } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "./ui";

export interface ConfirmOptions {
  title: string;
  message?: ReactNode;
  /** Text on the confirm button, e.g. "Delete" */
  confirmLabel?: string;
  cancelLabel?: string;
  /** Red button and bin icon (default), or a neutral question */
  danger?: boolean;
}

type Ask = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<Ask>(async () => false);
export const useConfirm = () => useContext(ConfirmContext);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<(ConfirmOptions & { resolve: (ok: boolean) => void }) | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const cancelButton = useRef<HTMLButtonElement>(null);

  const ask = useCallback<Ask>((options) => new Promise((resolve) => setRequest({ ...options, resolve })), []);

  useEffect(() => {
    if (!request) return;
    // showModal() puts it above everything, including other open pop-ups.
    if (!dialog.current?.open) dialog.current?.showModal();
    cancelButton.current?.focus(); // the safe choice is focused, so a stray Enter doesn't delete
  }, [request]);

  const answer = (ok: boolean) => {
    request?.resolve(ok);
    setRequest(null);
    dialog.current?.close();
  };

  const danger = request?.danger ?? true;
  const Icon = danger ? Trash2 : AlertTriangle;

  return (
    <ConfirmContext.Provider value={ask}>
      {children}
      <dialog
        ref={dialog}
        aria-labelledby="confirm-title"
        aria-describedby={request?.message ? "confirm-message" : undefined}
        onCancel={(e) => {
          e.preventDefault(); // Escape key
          answer(false);
        }}
        onClick={(e) => e.target === dialog.current && answer(false)} // click outside
        className="w-[calc(100%-2rem)] max-w-md rounded-xl p-0 shadow-2xl backdrop:bg-ink-900/50 backdrop:backdrop-blur-[2px]"
      >
        {request && (
          <div className="p-6">
            <div className="flex gap-4">
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${danger ? "bg-red-100 text-error" : "bg-gold-100 text-maroon-700"}`}
                aria-hidden
              >
                <Icon size={21} />
              </span>
              <div className="min-w-0 pt-1">
                <h2 id="confirm-title" className="font-heading text-xl font-bold leading-snug text-maroon-900">
                  {request.title}
                </h2>
                {request.message && (
                  <div id="confirm-message" className="mt-2 break-words text-[15px] text-ink-600">
                    {request.message}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                ref={cancelButton}
                type="button"
                onClick={() => answer(false)}
                className="inline-flex items-center justify-center rounded-md border border-ink-600/40 bg-white px-4 py-2 text-sm font-semibold text-ink-900 transition-colors hover:border-maroon-700 hover:bg-maroon-50 hover:text-maroon-700"
              >
                {request.cancelLabel ?? "Cancel"}
              </button>
              <Button
                onClick={() => answer(true)}
                className={danger ? "!bg-error !text-white hover:!bg-red-700" : ""}
              >
                {request.confirmLabel ?? (danger ? "Yes, delete" : "Yes")}
              </Button>
            </div>
          </div>
        )}
      </dialog>
    </ConfirmContext.Provider>
  );
}
