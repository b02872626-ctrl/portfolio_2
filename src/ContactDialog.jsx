import { useEffect, useRef, useState } from "react";
import "./contact-dialog.css";

// Messages are delivered by FormSubmit (formsubmit.co) to the address below.
// The first message sent triggers a one-time "Activate form" email to that inbox.
const sendEndpoint = (email) => `https://formsubmit.co/ajax/${email}`;

const emptyForm = { name: "", email: "", message: "", website: "" };

export default function ContactDialog({ open, onClose, email }) {
  const dialogRef = useRef(null);
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setStatus((current) => (current === "sent" ? "idle" : current));
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const response = await fetch(sendEndpoint(email), {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          _subject: `Portfolio message from ${form.name}`,
          _replyto: form.email,
          _template: "table",
          _honey: form.website,
        }),
      });
      const result = await response.json().catch(() => ({}));
      const accepted =
        response.ok &&
        (String(result.success) === "true" || /activat/i.test(String(result.message ?? "")));
      if (!accepted) throw new Error(result.message || `HTTP ${response.status}`);
      setStatus("sent");
      setForm(emptyForm);
    } catch {
      setStatus("error");
    }
  };

  // Clicking the dimmed backdrop closes the dialog.
  const handleBackdropClick = (event) => {
    if (event.target === dialogRef.current) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className="contact-dialog"
      aria-labelledby="contact-dialog-title"
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      <div className="contact-dialog__folder">
        <span className="contact-dialog__tab">New message</span>
        <div className="contact-dialog__body">
          <div className="contact-dialog__head">
            <h2 id="contact-dialog-title">
              {status === "sent" ? "Message sent" : "Get in touch"}
            </h2>
            <button type="button" className="tab-button tab-button--icon contact-dialog__close" onClick={onClose} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {status === "sent" ? (
            <div className="contact-dialog__done">
              <p>Thanks for reaching out. I&apos;ll reply to you by email.</p>
              <button type="button" className="tab-button contact-dialog__send" onClick={onClose}>
                Close
              </button>
            </div>
          ) : (
            <form className="contact-dialog__form" onSubmit={handleSubmit}>
              <p className="contact-dialog__intro">
                Tell me about your project and I&apos;ll get back to you.
              </p>
              <label>
                <span>Name</span>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={120}
                  value={form.name}
                  onChange={update("name")}
                />
              </label>
              <label>
                <span>Your email</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  maxLength={200}
                  value={form.email}
                  onChange={update("email")}
                />
              </label>
              <label>
                <span>Message</span>
                <textarea
                  name="message"
                  rows={5}
                  required
                  maxLength={5000}
                  value={form.message}
                  onChange={update("message")}
                />
              </label>
              {/* Hidden from people; bots that fill it are ignored. */}
              <label className="contact-dialog__honey" aria-hidden="true">
                Website
                <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={update("website")} />
              </label>

              {status === "error" ? (
                <p className="contact-dialog__error" role="alert">
                  The message didn&apos;t go through. Please try again in a moment.
                </p>
              ) : null}

              <div className="contact-dialog__actions">
                <button type="submit" className="tab-button contact-dialog__send" disabled={status === "sending"}>
                  {status === "sending" ? "Sending…" : "Send message"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </dialog>
  );
}
