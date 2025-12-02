// src/components/SiteFooter.tsx
export default function SiteFooter(){
  return (
    <footer className="site-footer" aria-hidden={false}>
      <div className="container">
        © {new Date().getFullYear()} Ribbony — Handmade gift magazines · All rights reserved
      </div>
    </footer>
  );
}
