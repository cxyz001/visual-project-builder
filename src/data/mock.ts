export const throughput = ["08", "09", "10", "11", "12", "13", "14", "15"].map((h, i) => ({
  hour: h,
  in: [180, 240, 260, 330, 300, 380, 350, 342][i],
  out: [140, 220, 230, 290, 270, 320, 330, 300][i],
}));

export const todayTrend = [42, 38, 45, 40, 36, 44, 39, 46, 43, 48, 45, 50].map((v, i) => ({ i, v }));

export const activities = [
  { time: "15:00:56", title: "完成出库 5 件", desc: "分拣线 C2 → 3 号月台", icon: "check" },
  { time: "15:00:52", title: "完成入库 7 件", desc: "入库暂存区 → A 区货架", icon: "arrow" },
  { time: "15:00:48", title: "TRK-2048 装载复核完成", desc: "3 号月台 · 等待下一批货物", icon: "arrow" },
];

export type Truck = {
  id: string; plate: string; route: [string, string]; boxes: number; weight: number; eta: string; load: number; status: string;
};
export const trucks: Truck[] = [
  { id: "TRK-2048", plate: "沪A·8F62K", route: ["上海·华东中心", "杭州·城配站"], boxes: 18, weight: 7.34, eta: "15:10", load: 100, status: "装载完成" },
  { id: "TRK-2051", plate: "沪B·3K91L", route: ["上海·华东中心", "苏州·工业园"], boxes: 14, weight: 5.62, eta: "15:40", load: 78, status: "装载中" },
  { id: "TRK-2063", plate: "沪A·7Q20M", route: ["上海·华东中心", "宁波·北仑港"], boxes: 9, weight: 3.8, eta: "16:20", load: 50, status: "待装载" },
  { id: "TRK-2072", plate: "沪C·5T88N", route: ["上海·华东中心", "南京·江北仓"], boxes: 16, weight: 6.9, eta: "16:45", load: 89, status: "装载中" },
];
const goods = ["精密电子配件", "工业传感器", "智能控制模组", "包装耗材", "医疗器械"];
export const truckBoxes = (t: Truck) =>
  Array.from({ length: 18 }, (_, i) => ({
    id: `BX-${8701 + i}`,
    name: goods[i % goods.length],
    weight: +(9 + ((i * 7 + t.boxes) % 11) + 0.4).toFixed(1),
    slot: `货位 ${String(Math.floor(i / 6) + 1).padStart(2, "0")}`,
    loaded: i < Math.round((t.load / 100) * 18),
  }));

export type Rack = { id: string; used: number; empty: number; rate: number; inbound: number; outbound: number };
export const racks: Rack[] = [
  { id: "A-03", used: 40, empty: 6, rate: 91.7, inbound: 12, outbound: 11 },
  { id: "A-04", used: 34, empty: 12, rate: 74.0, inbound: 8, outbound: 9 },
  { id: "B-01", used: 44, empty: 4, rate: 95.6, inbound: 15, outbound: 6 },
  { id: "B-02", used: 32, empty: 16, rate: 66.7, inbound: 5, outbound: 14 },
];
export const rackCells = (r: Rack) =>
  Array.from({ length: 12 }, (_, i) => {
    const empty = (i * 5 + r.used) % 7 === 0;
    return {
      pos: `${r.id}-${String(i + 1).padStart(2, "0")}`,
      code: `BX-${10000 + i * 5 + r.used}`,
      name: empty ? "空箱 · 无货物" : goods[i % 3],
      qty: empty ? 0 : 12 + ((i * 3) % 14),
      status: empty ? "空箱" : i % 4 === 1 ? "待出库" : "在库",
      empty,
    };
  });

export type Parcel = { id: string; qty: number; weight: number; status: string; name: string; order: string; sku: string; slot: string; dest: string };
export const parcels: Parcel[] = [
  { id: "BX-8472", qty: 24, weight: 17.2, status: "分拣中", name: "精密电子配件", order: "SO-20261023-064", sku: "EL-4208", slot: "A-02-04", dest: "杭州城配站" },
  { id: "BX-8473", qty: 24, weight: 15.8, status: "待出库", name: "工业传感器", order: "SO-20261023-065", sku: "IS-1102", slot: "A-02-05", dest: "苏州工业园" },
  { id: "BX-8474", qty: 16, weight: 11.4, status: "在库", name: "智能控制模组", order: "SO-20261023-071", sku: "CM-3310", slot: "A-03-02", dest: "宁波北仑港" },
  { id: "BX-8475", qty: 12, weight: 9.6, status: "在库", name: "医疗器械", order: "SO-20261023-078", sku: "MD-0821", slot: "B-01-07", dest: "南京江北仓" },
];
export const parcelTrack = [
  { time: "14:31", title: "进入分拣传送带 C2", desc: "自动扫码识别，等待装车" },
  { time: "13:54", title: "从货架 A-02-04 出库", desc: "搬运机器人 AGV-07 执行" },
  { time: "10:46", title: "入库上架", desc: "质检通过，存入 A 区" },
  { time: "09:38", title: "到达华东物流中心", desc: "完成卸货登记" },
];
