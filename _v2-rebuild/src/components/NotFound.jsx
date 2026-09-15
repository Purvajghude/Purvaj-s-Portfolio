import { Link } from 'react-router-dom';
import Container from './Container';

export default function NotFound() {
  return (
    <main id="main" className="u-section">
      <Container>
        <p className="u-eyebrow">Error 404</p>
        <h1 className="u-h1" style={{ marginTop: 'var(--space-4)' }}>
          This page does not exist.
        </h1>
        <p className="u-body" style={{ marginTop: 'var(--space-6)' }}>
          The link may be out of date, or the address may have a typo in it.
        </p>
        <Link to="/" className="u-btn" style={{ marginTop: 'var(--space-8)' }}>
          Back home
        </Link>
      </Container>
    </main>
  );
}
