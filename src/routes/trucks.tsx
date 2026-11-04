import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import truckImg from "@/assets/truck.png";
import { Card, PageHeader, Tag } from "@/components/Shell";
import { truckBoxes, trucks } from "@/data/mock";

export const Route = createFileRoute("/trucks")({
  head: () => ({
    meta: [
      { title: "运输车辆 · 404DESIGN 智慧物流大屏" },
      { name: "description", content: "查看运输卡车装载情况、装箱清单与任务进度。" },
      { property: "og:title", content: "运输车辆 · 404DESIGN 智慧物流大屏" },
      { property: "og:description", content: "卡车车厢货箱可视化与运输路线。" },
    ],
  }),
  component: TrucksPage,
});

function TrucksPage() {
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState<string | null>(null);
  const t = trucks[idx];
  const boxes = truckBoxes(t);
  const steps = ["车辆到位", "装载货物", "装载复核", "发车出库"];
  const stepDone = t.load === 100 ? 3 : t.load > 0 ? 1 : 0;

  return (
    <div>
      <PageHeader title="运输卡车" code={t.id} sub={`03 号装卸月台 · ${t.route[0]} → ${t.route[1]} · 装载任务已完成`} status={t.status} extra={`预计 ${t.eta} 发车`} />
      <div className="grid grid-cols-[1fr_330px] gap-6 px-8 pt-2">
        <div className="relative mx-auto w-full max-w-[1300px]">
          <img src={truckImg} alt="运输卡车侧视图" width={1792} height={768} className="w-full" />
          <div className="absolute grid grid-cols-6 grid-rows-3 gap-1" style={{ left: "28.5%", top: "20%", width: "61.5%", height: "35%" }}>
            {boxes.map((b) => (
              <button
                key={b.id}
                onClick={() => setSel(b.id)}
                className={`flex flex-col justify-between rounded border p-1.5 text-left text-[10px] transition-all hover:-translate-y-0.5 ${
                  !b.loaded ? "border-dashed border-border bg-muted/40 text-muted-foreground" : sel === b.id ? "border-primary bg-accent" : "border-border bg-card"
                }`}
              >
                <span className="font-num font-semibold">{b.id}</span>
                <span className="text-muted-foreground">{b.loaded ? `${b.weight} kg` : "待装载"}</span>
              </button>
            ))}
          </div>
        </div>
        <Card title="车辆概况" right={<Tag>运行中</Tag>}>
          <div className="font-num text-2xl font-bold">{t.plate}</div>
          <p className="text-xs text-muted-foreground">冷链厢式货车 · 9.6 m</p>
          <div className="mt-4 flex justify-between text-xs"><span className="text-muted-foreground">装载进度</span><span className="font-num text-primary">{t.load}%</span></div>
          <div className="mt-2 flex gap-1">
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i} className={`h-2 flex-1 rounded ${i < t.load / 10 ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4">
            {[["货箱", t.boxes, "箱"], ["异常货物", 0, "件"], ["总重", t.weight, "吨"], ["装卸月台", "03", "号"]].map(([l, v, u]) => (
              <div key={String(l)}>
                <div className="text-[11px] text-muted-foreground">{l}</div>
                <div className="font-num text-2xl font-bold">{v}<span className="ml-0.5 text-xs font-normal text-muted-foreground">{u}</span></div>
              </div>
            ))}
          </div>
          <div className="mt-5 text-sm font-semibold">运输路线</div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span>{t.route[0]}</span>
            <span className="h-px flex-1 border-t border-dashed border-primary" />
            <span className="text-primary">{t.route[1]}</span>
          </div>
          {sel && <div className="mt-4 rounded-xl bg-accent p-3 text-xs">已选中货箱 <b className="font-num">{sel}</b> · 详情见下方清单</div>}
        </Card>
      </div>

      <div className="grid grid-cols-4 gap-4 px-8 pt-4">
        {trucks.map((tr, i) => (
          <button key={tr.id} onClick={() => { setIdx(i); setSel(null); }} className={`glass flex items-center justify-between p-4 text-left ${i === idx ? "ring-2 ring-primary" : "opacity-80"}`}>
            <div>
              <div className="font-num text-sm font-semibold">{tr.id}</div>
              <div className="text-[11px] text-muted-foreground">{tr.route[1]} · {tr.status}</div>
            </div>
            <img src={truckImg} alt="" className="h-8 w-auto" loading="lazy" />
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[1.6fr_1fr] gap-4 px-8 pt-4">
        <Card title="装箱清单" right={`共 ${t.boxes} 箱 · 展示前 4 箱`}>
          <table className="w-full text-xs">
            <thead className="text-muted-foreground"><tr className="text-left"><th className="py-1.5">货箱编号</th><th>货物名称</th><th>车厢位置</th><th>重量</th><th>状态</th><th /></tr></thead>
            <tbody>
              {boxes.slice(0, 4).map((b) => (
                <tr key={b.id} className={`border-t ${sel === b.id ? "bg-accent" : ""}`}>
                  <td className="py-2 font-num">{b.id}</td><td>{b.name}</td><td>{b.slot}</td><td className="font-num">{b.weight} kg</td>
                  <td>{b.loaded ? <Tag>已装</Tag> : <Tag tone="muted">待装</Tag>}</td>
                  <td><button onClick={() => setSel(b.id)} className="text-primary">查看 ↗</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card title="任务进度" right={`预计 ${t.eta} 发车`}>
          <div className="flex justify-between pt-4">
            {steps.map((s, i) => (
              <div key={s} className="flex flex-col items-center gap-2 text-xs">
                <span className={`flex h-8 w-8 items-center justify-center rounded-full ${i < stepDone ? "bg-success/15 text-success" : i === stepDone ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {i < stepDone ? <Check className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                </span>
                {s}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
