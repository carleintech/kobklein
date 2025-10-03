import MegaMenu from "./MegaMenu";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="position-fixed top-0 left-0 right-0 z-3">
      <MegaMenu />
      <div className="position-absolute" style={{ top: 16, right: 16 }}>
        <ThemeToggle />
      </div>
    </header>
  );
}