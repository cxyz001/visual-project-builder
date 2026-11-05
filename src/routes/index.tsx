import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, TrendingUp, Package, Truck, AlertTriangle, Gauge, Pause, Play } from "lucide-react";
import { lazy, Suspense, useState } from "react";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, XAxis } from "recharts";
const LogisticsScene = lazy(() => import('@/components/LogisticsScene'));
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

const kpis = [
  { icon: TrendingUp, label: "准时发运率", value: "96.8", unit: "%" },
  { icon: Package, label: "在库货物", value: "8,476", unit: "件" },
  { icon: Truck, label: "作业车辆", value: "18", unit: "辆" },
  { icon: AlertTriangle, label: "待处理预警", value: "03", unit: "条" },
];

function Index() {
  const [paused, setPaused] = useState(false);
  return (
    <div className={`operations-home relative -mt-16 min-h-[calc(100vh-2rem)] overflow-hidden pt-16 ${paused ? "scene-paused" : ""}`}>
      <Suspense fallback={<div className="absolute inset-0 bg-background" />}><LogisticsScene paused={paused} /></Suspense>
      <div className="scene-instructions">拖动旋转 · 滚轮缩放 · 点击设备查看详情</div>

      <div className="dashboard-layout relative z-10 grid grid-cols-[320px_1fr_1fr] grid-rows-[auto_1fr_auto] gap-4 px-8 pb-4">
        <div className="col-span-3">
          <p className="font-num text-[10px] font-semibold tracking-[0.3em] text-primary">OPERATIONS CENTER / 01</p>
          <h1 className="mt-2 text-3xl font-bold">让每一件货物的流转清晰可见</h1>
          <p className="mt-1 text-xs text-muted-foreground">华东智能物流中心 · 实时运营态势</p>
          <button type="button" aria-pressed={paused} onClick={() => setPaused(!paused)} className="scene-control glass inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-primary">
            {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
            {paused ? "继续场景演示" : "暂停场景演示"}
            <span className="ml-2 font-normal text-muted-foreground">卡车 · AGV · 传送带</span>
          </button>
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

        <div className="dashboard-bottom col-span-3 mt-24 grid grid-cols-[320px_1.4fr_1fr] gap-4">
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
