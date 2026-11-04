import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, TrendingUp, Package, Truck, AlertTriangle, Gauge } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, XAxis } from "recharts";
import warehouse from "@/assets/warehouse.jpg";
import yardClean from "@/assets/warehouse-clean2.png";
import haulerA from "@/assets/truck-a-clean.png";
import haulerB from "@/assets/truck-b-clean.png";
import agvSprite from "@/assets/sprite-agv.png";
import boxSprite from "@/assets/sprite-box.png";
import { Card } from "@/components/Shell";
import { activities, throughput, todayTrend } from "@/data/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "运营总览 · 404DESIGN 智慧物流大屏" },
      { name: "description", content: "实时查看物流中心今日作业、关键指标、吞吐趋势与作业动态。" },
      { property: "og:title", content: "运营总览 · 404DESIGN 智慧物流大屏" },
      { property: "og:description", content: "让每一件货物的流转清晰可见。" },
    ],
  }),
  component: Index,
});

const hotspots = [
  { x: 36, y: 22, tag: "STORAGE / A-03", label: "智能货架", to: "/racks", dot: "bg-teal" },
  { x: 72, y: 30, tag: "TRANSPORT / 01", label: "运输卡车", to: "/trucks", dot: "bg-primary" },
  { x: 47, y: 52, tag: "PARCEL / BX-8472", label: "传送带货箱", to: "/parcel", dot: "bg-warning" },
  { x: 34, y: 42, tag: "ROBOT / AGV-07", label: "搬运机器人", to: "/racks", dot: "bg-violet" },
] as const;

const kpis = [
  { icon: TrendingUp, label: "准时发运率", value: "96.8", unit: "%" },
  { icon: Package, label: "在库货物", value: "8,476", unit: "件" },
  { icon: Truck, label: "作业车辆", value: "18", unit: "辆" },
  { icon: AlertTriangle, label: "待处理预警", value: "03", unit: "条" },
];

function Index() {
  return (
    <div className="relative -mt-16 min-h-[calc(100vh-2rem)] overflow-hidden pt-16">
      <div className="scene-fit absolute inset-0">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: "max(100cqw, calc(100cqh * 1920 / 1088))", aspectRatio: "1920 / 1088" }}
        >
          <img src={warehouse} alt="物流中心等轴测场景" width={1920} height={1088} className="absolute inset-0 h-full w-full opacity-90" />
          {[0, 1.75, 3.5, 5.25].map((d) => (
            <img key={`a${d}`} src={boxSprite} alt="" className="anim-belt-a absolute w-[2.4%] -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: `-${d}s` }} />
          ))}
          {[0, 2, 4].map((d) => (
            <img key={`b${d}`} src={boxSprite} alt="" className="anim-belt-b absolute w-[2.4%] -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: `-${d}s` }} />
          ))}
          <img src={agvSprite} alt="搬运机器人" className="anim-agv absolute w-[4.5%] -translate-x-1/2 -translate-y-1/2 drop-shadow-lg" />
          <img src={yardClean} alt="" className="absolute inset-0 h-full w-full" style={{ maskImage: "linear-gradient(90deg, transparent 64%, #000 70%)", WebkitMaskImage: "linear-gradient(90deg, transparent 64%, #000 70%)" }} />
          <MovingTruck src={haulerB} w={356} h={329} x={1300} y={160} anim="anim-truck-b" wheels={[[28,155],[47,165],[70,178],[178,234],[268,283]]} />
          <MovingTruck src={haulerA} w={387} h={350} x={1660} y={345} anim="anim-truck-a" wheels={[[50,167],[80,185],[195,252],[282,305]]} />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/20 via-25% to-transparent to-50%" />
          {hotspots.map((h) => (
            <Link key={h.label} to={h.to} className="group absolute z-10 flex items-center gap-3" style={{ left: `${h.x}%`, top: `${h.y}%` }}>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-card shadow-lg">
                <span className={`pulse-dot h-2.5 w-2.5 rounded-full ${h.dot}`} />
              </span>
              <span className="glass flex items-center gap-6 px-4 py-2.5 transition-transform group-hover:-translate-y-1">
                <span>
                  <span className="block font-num text-[9px] tracking-widest text-muted-foreground">{h.tag}</span>
                  <span className="text-sm font-semibold">{h.label}</span>
                </span>
                <ArrowUpRight className="h-4 w-4 text-primary" />
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-[360px_1fr_1fr] grid-rows-[auto_1fr_auto] gap-4 px-8 pb-4">
        <div className="col-span-3">
          <p className="font-num text-[10px] font-semibold tracking-[0.3em] text-primary">OPERATIONS CENTER / 01</p>
          <h1 className="mt-2 text-3xl font-bold">让每一件货物的流转清晰可见</h1>
          <p className="mt-1 text-xs text-muted-foreground">华东智能物流中心 · 实时运营态势</p>
        </div>

        <div className="col-start-1 flex flex-col gap-4">
          <Card title="今日作业概览" right="模拟更新">
            <div className="font-num text-4xl font-bold">13,005 <span className="text-sm font-normal text-muted-foreground">件</span></div>
            <div className="mt-1 flex justify-between text-xs">
              <span className="text-muted-foreground">今日已处理货物</span>
              <span className="font-semibold text-success">↗ 12.6% 较昨日</span>
            </div>
            <div className="mt-2 h-16">
              <ResponsiveContainer>
                <AreaChart data={todayTrend}>
                  <defs>
                    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke="var(--primary)" strokeWidth={2} fill="url(#g)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card title="关键指标" right="今日">
            <ul className="space-y-3">
              {kpis.map((k) => (
                <li key={k.label} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-accent-foreground"><k.icon className="h-3.5 w-3.5" /></span>
                  <span className="text-xs text-muted-foreground">{k.label}</span>
                  <span className="ml-auto font-num text-xl font-bold">{k.value}<span className="ml-0.5 text-xs font-normal text-muted-foreground">{k.unit}</span></span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="col-span-3 mt-40 grid grid-cols-[360px_1.4fr_1fr] gap-4">
          <Card title="设备在线率" right={<span className="text-success">运行良好</span>}>
            <div className="font-num text-5xl font-bold">98.2<span className="text-lg text-muted-foreground">%</span></div>
            <div className="mt-4 h-1.5 rounded-full bg-muted"><div className="h-full w-[98.2%] rounded-full bg-primary" /></div>
            <p className="mt-3 text-xs text-muted-foreground">自动化设备 54 / 55 台在线</p>
            <Link to="/racks" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary"><Gauge className="h-3 w-3" />查看机器人状态 ↗</Link>
          </Card>
          <Card title="小时吞吐趋势" right="入库 / 出库">
            <div className="flex justify-between">
              <div className="font-num text-3xl font-bold">2,342 <span className="text-xs font-normal text-muted-foreground">件 / 15:00 时段</span></div>
              <span className="text-xs font-semibold text-success">+8.4%</span>
            </div>
            <div className="h-36">
              <ResponsiveContainer>
                <BarChart data={throughput} barGap={3}>
                  <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                  <Bar dataKey="in" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={12} />
                  <Bar dataKey="out" fill="var(--teal)" radius={[4, 4, 0, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card title="作业动态" right="模拟更新 15:00:56">
            <ul className="space-y-4">
              {activities.map((a) => (
                <li key={a.time} className="flex gap-4">
                  <span className="font-num text-xs text-muted-foreground">{a.time}</span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/15 text-success">
                    {a.icon === "check" ? <Check className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                  </span>
                  <div>
                    <div className="text-sm font-semibold">{a.title}</div>
                    <div className="text-xs text-muted-foreground">{a.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MovingTruck({ src, w, h, x, y, anim, wheels }: { src: string; w: number; h: number; x: number; y: number; anim: string; wheels: number[][] }) {
  const delay = anim === "anim-truck-b" ? "-12s" : "0s";
  return (
    <div className={`${anim} absolute`} style={{ left: `${(x / 1920) * 100}%`, top: `${(y / 1088) * 100}%`, width: `${(w / 1920) * 100}%`, aspectRatio: `${w} / ${h}` }}>
      <div className="truck-body absolute inset-0" style={{ animationDelay: delay }}>
        <img src={src} alt="运输卡车" className="absolute inset-0 h-full w-full" style={{ filter: "drop-shadow(18px 14px 10px oklch(0.3 0.03 250 / 0.35))" }} />
      </div>
      {wheels.map(([cx, cy], i) => (
        <div key={i} className="absolute" style={{ left: `${(cx / w) * 100}%`, top: `${(cy / h) * 100}%`, width: `${(30 / w) * 100}%`, aspectRatio: "1", transform: "translate(-50%, -50%) skewY(28deg) scaleX(0.72)" }}>
          <svg viewBox="0 0 40 40" className="truck-wheel h-full w-full" style={{ animationDelay: delay }}>
            <circle cx="20" cy="20" r="19" fill="oklch(0.22 0.01 250)" />
            <circle cx="20" cy="20" r="11" fill="oklch(0.78 0.01 250)" />
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <rect key={a} x="19" y="9.5" width="2" height="9" rx="1" fill="oklch(0.45 0.01 250)" transform={`rotate(${a} 20 20)`} />
            ))}
            <circle cx="20" cy="20" r="3" fill="oklch(0.35 0.01 250)" />
          </svg>
        </div>
      ))}
    </div>
  );
}
