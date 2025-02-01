import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <main className="mt-6">{children}</main>
    </div>
  );
};

export default Layout;
