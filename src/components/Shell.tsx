import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, Settings } from "lucide-react";

const tabs = [
  { to: "/", label: "运营总览" },
  { to: "/trucks", label: "运输车辆" },
  { to: "/racks", label: "仓储货架" },
  { to: "/parcel", label: "货物追踪" },
] as const;

function useClock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const f = () => {
      const d = new Date();
      const p = (n: number) => String(n).padStart(2, "0");
      setT(`${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`);
    };
    f();
    const id = setInterval(f, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export function TopBar() {
  const t = useClock();
  return (
    <header className="relative z-20 flex h-16 items-center gap-10 px-8">
      <Link to="/" className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <div className="flex items-end gap-0.5">
            <span className="h-3 w-1 rounded bg-primary-foreground" />
            <span className="h-4 w-1 rounded bg-primary-foreground" />
            <span className="h-2.5 w-1 rounded bg-primary-foreground" />
          </div>
        </div>
        <div className="leading-tight">
          <div className="font-display text-base font-bold tracking-widest">404DESIGN</div>
          <div className="text-[10px] text-muted-foreground">B端可视化大屏设计</div>
        </div>
      </Link>
      <nav className="flex gap-10">
        {tabs.map((tab) => (
          <Link
            key={tab.to}
            to={tab.to}
            activeOptions={{ exact: true }}
            className="relative py-5 text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:font-semibold data-[status=active]:text-primary data-[status=active]:after:absolute data-[status=active]:after:inset-x-0 data-[status=active]:after:bottom-2 data-[status=active]:after:h-0.5 data-[status=active]:after:rounded data-[status=active]:after:bg-primary"
          >
            {tab.label}
          </Link>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-8 text-xs">
        <span className="flex items-center gap-1.5 font-semibold text-primary">
          <span className="h-2 w-2 rounded-full bg-success" /> DEMO · 演示数据
        </span>
        <span className="font-num text-muted-foreground">模拟时间 {t}</span>
        <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Settings className="h-3.5 w-3.5" />
        </button>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="flex justify-between px-8 py-3 text-[10px] text-muted-foreground">
      <span>404DESIGN · B端可视化大屏设计</span>
      <span>可交互概念演示 · 所有业务指标与事件为示例数据</span>
    </footer>
  );
}

export function PageHeader({ title, code, sub, status, extra }: { title: string; code: string; sub: string; status: string; extra: string }) {
  return (
    <div className="flex items-end justify-between px-8 pt-2">
      <div>
        <Link to="/" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-3 w-3" /> 返回运营总览
        </Link>
        <h1 className="mt-1 text-3xl font-bold">
          {title} <span className="font-num font-medium text-primary/70">{code}</span>
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
      </div>
      <div className="flex items-center gap-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success" />{status}</span>
        <span>{extra}</span>
      </div>
    </div>
  );
}

export function Card({ title, right, children, className = "" }: { title?: string; right?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`glass p-5 ${className}`}>
      {title && (
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">{title}</h3>
          <div className="text-xs text-muted-foreground">{right}</div>
        </div>
      )}
      {children}
    </section>
  );
}

export function Tag({ children, tone = "success" }: { children: ReactNode; tone?: "success" | "primary" | "muted" | "warning" }) {
  const map = {
    success: "bg-success/15 text-success",
    primary: "bg-primary/10 text-primary",
    muted: "bg-muted text-muted-foreground",
    warning: "bg-warning/15 text-warning",
  };
  return <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${map[tone]}`}>{children}</span>;
}
