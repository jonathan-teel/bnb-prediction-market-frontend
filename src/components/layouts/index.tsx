import { ReactNode } from "react";
import HeaderTop from "./header/HeaderTop";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(18,27,41,0.6),transparent_58%)]" />
        <div className="absolute -left-1/4 top-[-12%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(252,213,53,0.22),transparent_62%)] blur-[140px]" />
        <div className="absolute right-[-10%] top-1/3 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(44,64,96,0.38),transparent_68%)] blur-[140px]" />
        <div className="absolute bottom-[-28%] left-1/2 h-[520px] w-[680px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(12,20,40,0.55),transparent_70%)] blur-[150px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1920px] flex-col">
        <HeaderTop />
        <main className="flex-1 px-4 py-6 sm:px-8 lg:px-16 lg:py-10">
          <div className="relative h-full w-full rounded-3xl border border-[color:var(--border-soft)] bg-[color:var(--surface-primary)] backdrop-blur-2xl shadow-bnb-card sm:rounded-[28px]">
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_top_left,rgba(252,213,53,0.08),transparent_62%)] opacity-80 sm:rounded-[28px]" />
            <div className="relative flex h-full w-full flex-col gap-8 px-4 py-6 sm:px-8 lg:px-12 lg:py-12">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
