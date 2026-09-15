import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Check, WarningCircle } from '@phosphor-icons/react';
import Container from '../components/Container';
import Reveal from '../components/Reveal';
import './page-shell.css';
import './contact.css';

const FIELDS = [
  {
    name: 'name',
    label: 'Your name',
    help: 'However you would like to be addressed in the reply.',
    autoComplete: 'name',
    type: 'text',
  },
  {
    name: 'email',
    label: 'Email address',
    help: 'Used only to reply. Format: name@example.com',
    autoComplete: 'email',
    type: 'email',
  },
  {
    name: 'message',
    label: 'Message',
    help: 'A few sentences of context is plenty. At least 20 characters.',
    multiline: true,
  },
];

/* TODO(content): three real contact routes. Each needs a real label and a real
   URL. Nothing about an address, a handle or a number is known yet. */
const ROUTES = ['one', 'two', 'three'];

const EMPTY = { name: '', email: '', message: '' };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = 'Add your name so a reply can be addressed properly.';
  }

  if (!values.email.trim()) {
    errors.email = 'Add an email address so a reply can reach you.';
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Use the format name@example.com so the reply can send.';
  }

  if (!values.message.trim()) {
    errors.message = 'Add a short message so the context is clear.';
  } else if (values.message.trim().length < 20) {
    errors.message = 'Add a little more detail, at least 20 characters.';
  }

  return errors;
}

export default function Contact() {
  const reduced = useReducedMotion();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | submitting | success

  const fieldRefs = useRef({});

  /* The success panel mounts only after the form finishes exiting, so focus is
     moved by the ref callback rather than by an effect keyed on status. */
  const focusOnMount = useCallback((node) => {
    if (node) node.focus();
  }, []);

  /* TODO(wiring): there is no backend. Replace this timer with the real POST
     and move the success transition into the resolution of that request. */
  useEffect(() => {
    if (status !== 'submitting') return undefined;
    const timer = setTimeout(() => setStatus('success'), 800);
    return () => clearTimeout(timer);
  }, [status]);

  function handleChange(event) {
    const { name, value } = event.target;
    const nextValues = { ...values, [name]: value };
    setValues(nextValues);
    if (attempted) setErrors(validate(nextValues));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setAttempted(true);

    const firstInvalid = FIELDS.find((field) => nextErrors[field.name]);
    if (firstInvalid) {
      const node = fieldRefs.current[firstInvalid.name];
      if (node) node.focus();
      return;
    }

    setStatus('submitting');
  }

  function handleReset() {
    setValues(EMPTY);
    setErrors({});
    setAttempted(false);
    setStatus('idle');
  }

  const errorCount = Object.keys(errors).length;
  const submitting = status === 'submitting';
  const fade = reduced ? { duration: 0 } : { duration: 0.32, ease: [0.16, 1, 0.3, 1] };

  return (
    <main className="pg-main">
      <Container as="section" className="pg-head">
        <h1 className="u-h1 pg-head__title">Contact</h1>
        {/* TODO(content): one line on what a good first message contains, max 25 words */}
        <p className="pg-slot pg-head__lede">
          Short line about what to send and what to expect goes here.
        </p>
      </Container>

      <Container as="section" className="u-section ct-body">
        <div className="ct-split">
          <div className="ct-aside">
            <Reveal>
              <h2 className="u-h3">Other routes</h2>
              <ul className="ct-routes">
                {ROUTES.map((route) => (
                  <li key={route}>
                    {/* TODO(content): route name, max 2 words */}
                    <p className="pg-label">Route {route}</p>
                    {/* TODO(content): real URL and real visible value. Placeholder
                        until the real handle or address is known. */}
                    <a className="ct-route__value" href="#">
                      Value goes here
                      <ArrowUpRight size={14} weight="regular" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="ct-panel">
            <p className="u-visually-hidden" role="status">
              {submitting ? 'Sending your message.' : ''}
              {status === 'success' ? 'Your message was sent.' : ''}
              {attempted && errorCount > 0 && status === 'idle'
                ? `${errorCount} ${errorCount === 1 ? 'field needs' : 'fields need'} attention.`
                : ''}
            </p>

            <AnimatePresence mode="wait" initial={false}>
              {status === 'success' ? (
                <motion.div
                  key="success"
                  className="ct-success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={fade}
                >
                  <Check size={28} weight="regular" className="ct-success__icon" aria-hidden="true" />
                  {/* TODO(wiring): this state must not ship until the form
                      actually posts somewhere. */}
                  <h2 className="u-h3" tabIndex={-1} ref={focusOnMount}>
                    Message sent.
                  </h2>
                  <p className="ct-success__body">
                    Thank you for writing. A reply will go to the address you
                    gave. Nothing you typed is stored in this browser.
                  </p>
                  <button type="button" className="u-btn u-btn--ghost" onClick={handleReset}>
                    Send another
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  noValidate
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={fade}
                >
                  <fieldset className="ct-fieldset" disabled={submitting}>
                    <legend className="u-visually-hidden">Send a message</legend>

                    {FIELDS.map((field) => {
                      const error = errors[field.name];
                      const helpId = `${field.name}-help`;
                      const errorId = `${field.name}-error`;
                      const describedBy = error ? `${helpId} ${errorId}` : helpId;

                      return (
                        <div className="ct-field" key={field.name}>
                          <label className="ct-label" htmlFor={field.name}>
                            {field.label}
                          </label>
                          <p className="ct-help" id={helpId}>
                            {field.help}
                          </p>

                          {field.multiline ? (
                            <textarea
                              className="ct-textarea"
                              id={field.name}
                              name={field.name}
                              rows={6}
                              value={values[field.name]}
                              onChange={handleChange}
                              aria-describedby={describedBy}
                              aria-invalid={error ? 'true' : 'false'}
                              ref={(node) => {
                                fieldRefs.current[field.name] = node;
                              }}
                            />
                          ) : (
                            <input
                              className="ct-input"
                              id={field.name}
                              name={field.name}
                              type={field.type}
                              autoComplete={field.autoComplete}
                              value={values[field.name]}
                              onChange={handleChange}
                              aria-describedby={describedBy}
                              aria-invalid={error ? 'true' : 'false'}
                              ref={(node) => {
                                fieldRefs.current[field.name] = node;
                              }}
                            />
                          )}

                          {error ? (
                            <p className="ct-error" id={errorId} role="alert">
                              <WarningCircle size={16} weight="regular" aria-hidden="true" />
                              {error}
                            </p>
                          ) : null}
                        </div>
                      );
                    })}
                  </fieldset>

                  {submitting ? (
                    <div className="ct-sending" aria-hidden="true">
                      <div className="pg-skel ct-sending__bar" />
                      <div className="pg-skel ct-sending__bar ct-sending__bar--text" />
                    </div>
                  ) : (
                    <div className="ct-submit">
                      <button type="submit" className="u-btn">
                        Send message
                      </button>
                      <span className="ct-help">No message is stored on this site.</span>
                    </div>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </main>
  );
}
