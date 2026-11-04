import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import rackImg from "@/assets/rack.png";
import { Card, PageHeader, Tag } from "@/components/Shell";
import { rackCells, racks } from "@/data/mock";

export const Route = createFileRoute("/racks")({
  head: () => ({
    meta: [
      { title: "仓储货架 · 404DESIGN 智慧物流大屏" },
      { name: "description", content: "智能货架库位状态、利用率与货品分布。" },
      { property: "og:title", content: "仓储货架 · 404DESIGN 智慧物流大屏" },
      { property: "og:description", content: "货架正视图与库位货物明细。" },
    ],
  }),
  component: RacksPage,
});

function RacksPage() {
  const [idx, setIdx] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [sel, setSel] = useState(0);
  const r = racks[idx];
  const cells = rackCells(r);
  const s = cells[sel];

  return (
    <div>
      <PageHeader title="智能货架" code={r.id} sub={`A 区 · 第 ${r.id.slice(2)} 排 · 3 层 × 4 格`} status="正常运行" extra="最近盘点 14:25" />
      <div className="grid grid-cols-[1fr_330px] gap-6 px-8 pt-2">
        <div>
          <div className="flex justify-between text-[10px] tracking-widest text-muted-foreground">
            <span className="font-num">RACK ELEVATION / 货架正视</span><span>悬停查看箱内信息 · 点击打开档案</span>
          </div>
          <div className="relative mx-auto mt-2 w-[760px]">
            <img src={rackImg} alt="货架正视图" width={1408} height={832} className="w-full" />
            <div className="absolute grid grid-cols-4 grid-rows-3" style={{ left: "10%", top: "6%", width: "80%", height: "82%" }}>
              {cells.map((c, i) => (
                <button
                  key={c.pos}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => setSel(i)}
                  className={`relative m-1 rounded-md transition-all ${c.empty ? "bg-card/85 backdrop-blur" : ""} ${sel === i ? "ring-2 ring-primary" : "hover:ring-2 hover:ring-primary/50"}`}
                >
                  {c.empty && <span className="text-xs text-muted-foreground">空箱</span>}
                  {hover === i && (
                    <div className="glass absolute -top-2 left-1/2 z-20 w-44 -translate-x-1/2 -translate-y-full p-3 text-left text-[11px]">
                      <div className="font-num font-semibold">{c.code} · {c.status}</div>
                      <div className="text-muted-foreground">{c.name}</div>
                      <div className="text-muted-foreground">{c.pos} · {c.qty} 件</div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
          <p className="text-center text-[11px] text-muted-foreground">● 有货 {r.used} 箱 · ○ 空箱 {r.empty} 个 · 3 层 × 4 格</p>
        </div>
        <Card title="货架状态" right={<Tag>可用</Tag>}>
          <div className="font-num text-4xl font-bold">{r.rate}<span className="text-sm text-muted-foreground">% 库位使用率</span></div>
          <div className="mt-3 h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${r.rate}%` }} /></div>
          <div className="mt-5 grid grid-cols-2 gap-4">
            {[["今日入库", r.inbound, "次"], ["今日出库", r.outbound, "次"], ["在库货箱", r.used, "箱"], ["预警", 9, "条"]].map(([l, v, u]) => (
              <div key={String(l)}>
                <div className="text-[11px] text-muted-foreground">{l}</div>
                <div className="font-num text-2xl font-bold">{v}<span className="ml-0.5 text-xs font-normal text-muted-foreground">{u}</span></div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl bg-accent p-4 text-xs">
            <div className="font-num font-semibold">{s.code} · {s.status}</div>
            <div className="mt-1 text-muted-foreground">{s.pos} · {s.name}</div>
            <div className="text-muted-foreground">{s.qty} 件 · 点击货位切换</div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-4 gap-4 px-8 pt-4">
        {racks.map((rk, i) => (
          <button key={rk.id} onClick={() => { setIdx(i); setSel(0); }} className={`glass flex items-center justify-between p-4 text-left ${i === idx ? "ring-2 ring-primary" : "opacity-80"}`}>
            <div>
              <div className="text-sm font-semibold">货架 {rk.id}</div>
              <div className="text-[11px] text-muted-foreground">{rk.used} 箱有货 · {rk.empty} 个空箱</div>
            </div>
            <img src={rackImg} alt="" className="h-8 w-auto" loading="lazy" />
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[1.6fr_1fr] gap-4 px-8 pt-4">
        <Card title="库位货物" right="展示部分 · 含空箱示例">
          <table className="w-full text-xs">
            <thead className="text-muted-foreground"><tr className="text-left"><th className="py-1.5">库位</th><th>货箱编号</th><th>货物名称</th><th>数量</th><th>入库时间</th><th>状态</th><th /></tr></thead>
            <tbody>
              {cells.slice(0, 4).map((c, i) => (
                <tr key={c.pos} className={`border-t ${sel === i ? "bg-accent" : ""}`}>
                  <td className="py-2 font-num font-semibold">{c.pos}</td><td className="font-num">{c.code}</td><td>{c.name}</td><td>{c.qty} 件</td><td>今日 10:46</td>
                  <td><Tag tone={c.empty ? "primary" : "success"}>{c.status}</Tag></td>
                  <td><button onClick={() => setSel(i)} className="text-primary">查看 ↗</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card title="货品分布">
          {[["精密电子配件", 35, "bg-primary"], ["工业传感器", 35, "bg-teal"], ["智能控制模组", 30, "bg-violet"]].map(([n, p, c]) => (
            <div key={String(n)} className="mb-4">
              <div className="flex justify-between text-xs"><span className="text-muted-foreground">{n}</span><span className="font-num">{p}%</span></div>
              <div className="mt-1.5 h-1.5 rounded-full bg-muted"><div className={`h-full rounded-full ${c}`} style={{ width: `${Number(p) * 2}%` }} /></div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
