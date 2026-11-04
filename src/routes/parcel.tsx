import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, Truck } from "lucide-react";
import boxImg from "@/assets/box.png";
import { Card, PageHeader, Tag } from "@/components/Shell";
import { parcelTrack, parcels } from "@/data/mock";

export const Route = createFileRoute("/parcel")({
  head: () => ({
    meta: [
      { title: "货物追踪 · 404DESIGN 智慧物流大屏" },
      { name: "description", content: "货箱档案、流转轨迹、包装装载与关联作业对象。" },
      { property: "og:title", content: "货物追踪 · 404DESIGN 智慧物流大屏" },
      { property: "og:description", content: "追踪每一个货箱的完整流转过程。" },
    ],
  }),
  component: ParcelPage,
});

function ParcelPage() {
  const [idx, setIdx] = useState(0);
  const p = parcels[idx]!;
  const gross = +(p.weight + 1.4).toFixed(1);

  return (
    <div>
      <PageHeader title="货箱详情" code={p.id} sub={`${p.name} · 华东分拣批次 2026-1023-B`} status={p.status} extra="最近扫描 14:28" />
      <div className="grid grid-cols-[1fr_1.05fr] gap-6 px-8 pt-2">
        <div className="flex flex-col">
          <div className="flex justify-between text-[10px] tracking-widest text-muted-foreground">
            <span className="font-num">PARCEL VIEW / 货箱外观</span><Tag tone="primary">包装完好</Tag>
          </div>
          <div className="relative flex flex-1 items-center justify-center">
            <img key={p.id} src={boxImg} alt="货箱外观" width={1024} height={1024} className="page-enter w-[440px] drop-shadow-2xl" />
            <span className="glass absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 text-xs"><span className="h-2 w-2 rounded-full bg-success" />已完成外观检测</span>
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>BOX ID <b className="font-num text-primary">{p.id}</b></span><span>批次 2026-1023-B</span></div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {parcels.map((x, i) => (
              <button key={x.id} onClick={() => setIdx(i)} className={`glass flex items-center justify-between p-3 text-left ${i === idx ? "ring-2 ring-primary" : ""}`}>
                <div>
                  <div className="font-num text-sm font-semibold">{x.id}</div>
                  <div className="text-[11px] text-muted-foreground">{x.status} · {x.qty} 件</div>
                </div>
                <img src={boxImg} alt="" className="h-9 w-9" loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-4">
            {[["箱内数量", p.qty, "件", "单箱标准数量"], ["货物净重", p.weight, "kg", "不含包装"], ["包装体积", 0.108, "m³", "60 × 40 × 45 cm"]].map(([l, v, u, d]) => (
              <Card key={String(l)}>
                <div className="text-[11px] text-muted-foreground">{l}</div>
                <div className="font-num text-3xl font-bold">{v}<span className="ml-0.5 text-xs font-normal text-muted-foreground">{u}</span></div>
                <div className="text-[11px] text-muted-foreground">{d}</div>
              </Card>
            ))}
          </div>
          <Card title="货箱档案" right={<Tag>{p.status}</Tag>}>
            <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-xs">
              {[["货物名称", p.name], ["SKU / 数量", `${p.sku} / ${p.qty} 件`], ["所属订单", p.order], ["箱体尺寸", "60 × 40 × 45 cm"], ["净重 / 毛重", `${p.weight} / ${gross} kg`], ["目的站点", p.dest], ["存储库位", p.slot], ["温控要求", "常温"]].map(([k, v]) => (
                <div key={k} className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">{["防潮", "易碎", "向上放置"].map((t) => <Tag key={t} tone="primary">{t}</Tag>)}</div>
          </Card>
          <div className="grid grid-cols-2 gap-4">
            <Card title="流转轨迹" right="演示记录">
              <ol className="space-y-4">
                {parcelTrack.map((s, i) => (
                  <li key={s.time} className="flex gap-3">
                    <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${i === 0 ? "bg-primary" : "border border-muted-foreground"}`} />
                    <span className="font-num text-[11px] text-muted-foreground">{s.time}</span>
                    <div>
                      <div className="text-xs font-semibold">{s.title}</div>
                      <div className="text-[11px] text-muted-foreground">{s.desc}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>
            <div className="flex flex-col gap-4">
              <Card title="包装与装载" right="演示数据">
                <div className="flex justify-between text-xs"><span className="text-muted-foreground">毛重 / 承重上限</span><span className="font-num">{gross} / 30 kg</span></div>
                <div className="mt-2 h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${(gross / 30) * 100}%` }} /></div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                  <div><div className="text-muted-foreground">包装材质</div>五层瓦楞纸</div>
                  <div><div className="text-muted-foreground">封箱方式</div>十字封箱</div>
                </div>
              </Card>
              <Card title="关联作业对象">
                <Link to="/trucks" className="flex items-center gap-3 rounded-xl bg-accent p-3">
                  <Truck className="h-4 w-4 text-primary" />
                  <div className="text-xs"><div className="font-semibold">计划车辆 TRK-2048</div><div className="text-muted-foreground">3 号月台 · 上海 → 杭州</div></div>
                  <ArrowUpRight className="ml-auto h-4 w-4 text-primary" />
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
