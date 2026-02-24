export default function Footer() {
  return (
    <footer className="footer">
      <span className="footer-logo">Lumière</span>
      <span className="footer-copy">
        © {new Date().getFullYear()} Lumière SaaS · Diseñado para la excelencia estética
      </span>
    </footer>
  );
}
