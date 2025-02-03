import Menu from "./Menu";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Header() {
  return (
    <div className="container">
      <ThemeSwitcher />
      <Menu />
    </div>
  );
}
