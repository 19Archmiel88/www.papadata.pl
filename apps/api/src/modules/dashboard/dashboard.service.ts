import { Injectable } from "@nestjs/common";
import type {
  DashboardOverviewResponse,
  DashboardPandLResponse,
  DashboardAdsResponse,
  DashboardCustomersResponse,
  DashboardProductsResponse,
  DashboardGuardianResponse,
  DashboardAlertsResponse,
  DashboardKnowledgeResponse,
  KPIValue,
  TimeseriesPoint,
  TableRow,
  DashboardAlert,
  KPIKey,
  DataFreshnessSource,
} from "@papadata/shared";
import { getAppMode } from "../../common/app-mode";
import { CacheService } from "../../common/cache.service";
import { getApiConfig } from "../../common/config";

type TimeRange = "1d" | "7d" | "30d";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const seeded = (i: number, seed: number) => {
  const x = Math.sin((i + 1) * seed) * 10000;
  return x - Math.floor(x);
};

const resolveTimeRange = (value?: string): TimeRange => {
  if (value === "1d" || value === "7d" || value === "30d") return value;
  return "30d";
};

const buildLabels = (pointsCount: number, timeRange: TimeRange): string[] => {
  const now = Date.now();
  const stepMs =
    timeRange === "1d"
      ? 2 * 60 * 60 * 1000
      : timeRange === "7d"
        ? 12 * 60 * 60 * 1000
        : 24 * 60 * 60 * 1000;
  const start = now - stepMs * (pointsCount - 1);
  return Array.from({ length: pointsCount }, (_, idx) => {
    const date = new Date(start + idx * stepMs);
    if (timeRange === "1d") {
      return date.toISOString().slice(11, 16);
    }
    return date.toISOString().slice(5, 10);
  });
};

const sum = (values: number[]) => values.reduce((acc, value) => acc + value, 0);

@Injectable()
export class DashboardService {
  private readonly cacheTtlMs = this.resolveCacheTtl();

  constructor(private readonly cacheService: CacheService) {}

  private resolveCacheTtl(): number {
    const raw = getApiConfig().cacheTtlMs;
    if (!Number.isFinite(raw) || raw <= 0) {
      return 15_000;
    }
    return raw;
  }

  private buildCacheKey(
    name: string,
    params?: Record<string, string | undefined>,
  ): string {
    const mode = getAppMode();
    const serializedParams = params
      ? Object.entries(params)
          .filter(([, value]) => value !== undefined && value !== "")
          .map(([key, value]) => `${key}=${value}`)
          .join("&")
      : "";
    return ["dashboard", mode, name, serializedParams]
      .filter(Boolean)
      .join(":");
  }

  private cacheResponse<T>(key: string, value: T): T {
    this.cacheService.set(key, value, this.cacheTtlMs);
    return value;
  }

  private getCachedResponse<T>(key: string): T | undefined {
    return this.cacheService.get<T>(key);
  }

  private withCache<T>(
    name: string,
    params: Record<string, string | undefined> | undefined,
    compute: () => T,
  ): T {
    const cacheKey = this.buildCacheKey(name, params);
    const cached = this.getCachedResponse<T>(cacheKey);
    if (cached) {
      return cached;
    }
    const payload = compute();
    return this.cacheResponse(cacheKey, payload);
  }

  getOverview(params?: { timeRange?: string }): DashboardOverviewResponse {
    return this.withCache("overview", { timeRange: params?.timeRange }, () => {
      const mode = getAppMode();
      const timeRange = resolveTimeRange(params?.timeRange);
      const timeMultiplier =
        timeRange === "1d" ? 0.032 : timeRange === "7d" ? 0.22 : 1;
      const baseSeed = timeRange === "1d" ? 19 : timeRange === "7d" ? 31 : 57;
      const pointsCount =
        timeRange === "1d" ? 12 : timeRange === "7d" ? 14 : 24;
      const labels = buildLabels(pointsCount, timeRange);

      const revenueSeries = Array.from({ length: pointsCount }).map((_, idx) =>
        clamp(
          140_000 * timeMultiplier +
            seeded(idx, baseSeed) * (40_000 * timeMultiplier),
          1000,
          5_000_000,
        ),
      );
      const spendSeries = Array.from({ length: pointsCount }).map((_, idx) =>
        clamp(
          35_000 * timeMultiplier +
            seeded(idx + 5, baseSeed) * (15_000 * timeMultiplier),
          500,
          1_000_000,
        ),
      );
      const roasSeries = Array.from({ length: pointsCount }).map((_, idx) =>
        clamp(3.2 + seeded(idx + 11, baseSeed) * 2.1, 1.5, 8.5),
      );
      const cpaSeries = Array.from({ length: pointsCount }).map((_, idx) =>
        clamp(32 + seeded(idx + 17, baseSeed) * 24, 15, 95),
      );

      const revenueSpendSeries: TimeseriesPoint[] = labels.map(
        (label, idx) => ({
          date: label,
          metrics: {
            revenue: revenueSeries[idx],
            spend: spendSeries[idx],
          },
        }),
      );

      const roasCpaSeries: TimeseriesPoint[] = labels.map((label, idx) => ({
        date: label,
        metrics: {
          roas: roasSeries[idx],
          cpa: cpaSeries[idx],
        },
      }));

      const kpis: KPIValue[] = [
        {
          key: "spend",
          value: sum(spendSeries),
          unit: "pln",
          deltaPercent: -4.2,
        },
        {
          key: "profit",
          value: sum(revenueSeries) * 0.34,
          unit: "pln",
          deltaPercent: 12.1,
        },
        {
          key: "aov",
          value: 242,
          unit: "pln",
          deltaPercent: 0.8,
        },
        {
          key: "new_returning",
          value: 68,
          unit: "percent",
          deltaPercent: 2.4,
        },
        {
          key: "ltv_30d",
          value: 412,
          unit: "pln",
          deltaPercent: 5.7,
        },
      ];

      const campaigns: TableRow[] = Array.from({ length: 8 }).map((_, i) => {
        const spend = (12_000 + seeded(i, baseSeed) * 45_000) * timeMultiplier;
        const roas = 2.4 + seeded(i + 3, baseSeed) * 3.8;
        const revenue = spend * roas;
        const cpa = 24 + seeded(i + 7, baseSeed) * 48;
        const ctr = 0.8 + seeded(i + 11, baseSeed) * 2.2;
        const cvr = 1.4 + seeded(i + 13, baseSeed) * 4.6;
        const delta = 4 + seeded(i + 17, baseSeed) * 12;
        return {
          id: `campaign-${i + 1}`,
          dimensions: { name: `Campaign ${i + 1}` },
          metrics: {
            spend,
            revenue,
            roas,
            cpa,
            ctr,
            cvr,
            delta,
          } as Partial<Record<KPIKey, number>>,
        };
      });

      const skus: TableRow[] = Array.from({ length: 8 }).map((_, i) => {
        const revenue =
          (25_000 + seeded(i, baseSeed) * 85_000) * timeMultiplier;
        const margin = 12 + seeded(i + 5, baseSeed) * 38;
        const profit = revenue * (margin / 100);
        const returns = 2 + seeded(i + 9, baseSeed) * 14;
        const trend = -15 + seeded(i + 13, baseSeed) * 45;
        const stockSeed = seeded(i, baseSeed);
        const stock =
          stockSeed > 0.8 ? "low" : stockSeed > 0.4 ? "medium" : "high";
        return {
          id: `SKU-${(i + 1).toString().padStart(3, "0")}`,
          dimensions: { name: `Product ${String.fromCharCode(65 + i)}`, stock },
          metrics: {
            revenue,
            profit,
            margin,
            returns,
            trend,
          } as Partial<Record<KPIKey, number>>,
        };
      });

      const alerts: DashboardAlert[] = [
        {
          id: "1",
          title: "Anomalia ROAS: Meta Ads",
          impact: "-14.2% vs wczoraj",
          time: "12m temu",
          severity: "critical",
          context: "Meta Ads",
          target: "ads",
        },
        {
          id: "2",
          title: "Prognozowany Stock-out",
          impact: "SKU-742 (3 dni)",
          time: "1h temu",
          severity: "warning",
          context: "Logistics",
          target: "products",
        },
        {
          id: "3",
          title: "Opóźnienie ETL: Google Analytics",
          impact: "Lag: 42 min",
          time: "3h temu",
          severity: "info",
          context: "GA4 Stream",
          target: "guardian",
        },
      ];

      return {
        mode,
        generatedAt: new Date().toISOString(),
        kpis,
        series: {
          revenueSpend: revenueSpendSeries,
          roasCpa: roasCpaSeries,
        },
        campaigns,
        skus,
        alerts,
      };
    });
  }

  getPandL(params?: { timeRange?: string }): DashboardPandLResponse {
    return this.withCache("pandl", { timeRange: params?.timeRange }, () => {
      const mode = getAppMode();
      const timeRange = resolveTimeRange(params?.timeRange);
      const multi = timeRange === "1d" ? 0.12 : timeRange === "7d" ? 0.42 : 1;
      const timeSeed = timeRange === "1d" ? 11 : timeRange === "7d" ? 29 : 61;
      const revenue = 3_735_000 * multi * (0.92 + seeded(8, timeSeed) * 0.16);
      const cogsRate = clamp(
        0.43 +
          (seeded(9, timeSeed) - 0.5) * 0.05 +
          (timeRange === "1d" ? 0.015 : timeRange === "30d" ? -0.01 : 0),
        0.38,
        0.5,
      );
      const feeRate = clamp(
        0.06 + (seeded(10, timeSeed) - 0.5) * 0.015,
        0.045,
        0.08,
      );
      const refundRate = clamp(
        0.018 + (seeded(11, timeSeed) - 0.5) * 0.008,
        0.01,
        0.035,
      );
      const shippingRate = clamp(
        0.03 + (seeded(12, timeSeed) - 0.5) * 0.012,
        0.02,
        0.05,
      );
      const adRate = clamp(
        0.12 +
          (seeded(13, timeSeed) - 0.5) * 0.03 +
          (timeRange === "1d" ? 0.01 : timeRange === "30d" ? -0.01 : 0),
        0.09,
        0.16,
      );
      const overheadFactor =
        timeRange === "1d" ? 0.28 : timeRange === "7d" ? 0.62 : 1;
      const cogs = revenue * cogsRate;
      const fees = revenue * feeRate;
      const refunds = revenue * refundRate;
      const shipping = revenue * shippingRate;
      const adSpend = revenue * adRate;
      const payroll = 420_000 * overheadFactor;
      const tools = 75_000 * overheadFactor;
      const grossProfit = revenue - cogs - fees - refunds - shipping;
      const contribution = grossProfit - adSpend;
      const ebitda = contribution - payroll - tools;
      const tax = ebitda > 0 ? ebitda * 0.19 : 0;
      const netProfit = ebitda - tax;

      const waterfall = [
        { label: "Revenue", value: revenue, type: "positive" as const },
        { label: "COGS", value: -cogs, type: "negative" as const },
        { label: "Fees", value: -fees, type: "negative" as const },
        { label: "Refunds", value: -refunds, type: "negative" as const },
        { label: "Shipping", value: -shipping, type: "negative" as const },
        { label: "Ad Spend", value: -adSpend, type: "negative" as const },
        { label: "Payroll", value: -payroll, type: "negative" as const },
        { label: "Tools", value: -tools, type: "negative" as const },
      ];

      return {
        mode,
        generatedAt: new Date().toISOString(),
        currency: "PLN",
        summary: {
          revenue,
          grossProfit,
          netProfit,
          contributionMargin: contribution / revenue,
          netMargin: netProfit / revenue,
          tax,
        },
        breakdown: {
          cogs,
          fees,
          refunds,
          shipping,
          adSpend,
          payroll,
          tools,
        },
        waterfall,
      };
    });
  }

  getAds(params?: { timeRange?: string }): DashboardAdsResponse {
    return this.withCache("ads", { timeRange: params?.timeRange }, () => {
      const mode = getAppMode();
      const timeRange = resolveTimeRange(params?.timeRange);
      const timeMultiplier =
        timeRange === "1d" ? 0.05 : timeRange === "7d" ? 0.3 : 1;
      const baseSeed = timeRange === "1d" ? 21 : timeRange === "7d" ? 33 : 71;
      const pointsCount =
        timeRange === "1d" ? 12 : timeRange === "7d" ? 14 : 24;
      const labels = buildLabels(pointsCount, timeRange);

      const spend = Array.from({ length: pointsCount }).map((_, idx) =>
        clamp(
          42_000 * timeMultiplier +
            seeded(idx, baseSeed) * (18_000 * timeMultiplier),
          1000,
          900_000,
        ),
      );
      const revenue = spend.map(
        (value, idx) =>
          value * clamp(2.4 + seeded(idx + 5, baseSeed) * 2.2, 1.2, 6.5),
      );
      const roas = revenue.map((value, idx) =>
        spend[idx] ? value / spend[idx] : 0,
      );
      const cpa = Array.from({ length: pointsCount }).map((_, idx) =>
        clamp(28 + seeded(idx + 9, baseSeed) * 26, 12, 95),
      );

      const spendRevenueSeries: TimeseriesPoint[] = labels.map(
        (label, idx) => ({
          date: label,
          metrics: { spend: spend[idx], revenue: revenue[idx] },
        }),
      );
      const roasCpaSeries: TimeseriesPoint[] = labels.map((label, idx) => ({
        date: label,
        metrics: { roas: roas[idx], cpa: cpa[idx] },
      }));

      const kpis: KPIValue[] = [
        { key: "spend", value: sum(spend), unit: "pln", deltaPercent: -3.4 },
        { key: "revenue", value: sum(revenue), unit: "pln", deltaPercent: 6.2 },
        {
          key: "roas",
          value: sum(revenue) / Math.max(sum(spend), 1),
          unit: "ratio",
          deltaPercent: 4.1,
        },
        {
          key: "cpa",
          value: sum(cpa) / Math.max(cpa.length, 1),
          unit: "pln",
          deltaPercent: -2.1,
        },
      ];

      const channels: TableRow[] = [
        {
          id: "meta",
          dimensions: { name: "Meta Ads" },
          metrics: { spend: spend[0], revenue: revenue[0], roas: roas[0] },
        },
        {
          id: "google",
          dimensions: { name: "Google Ads" },
          metrics: { spend: spend[1], revenue: revenue[1], roas: roas[1] },
        },
        {
          id: "allegro",
          dimensions: { name: "Allegro Ads" },
          metrics: { spend: spend[2], revenue: revenue[2], roas: roas[2] },
        },
      ];

      const campaigns: TableRow[] = Array.from({ length: 6 }).map((_, i) => {
        const baseSpend =
          (10_000 + seeded(i, baseSeed) * 35_000) * timeMultiplier;
        const campaignRoas = 2.2 + seeded(i + 3, baseSeed) * 3.1;
        return {
          id: `campaign-${i + 1}`,
          dimensions: {
            name: `Campaign ${i + 1}`,
            channel: i % 2 ? "Meta Ads" : "Google Ads",
          },
          metrics: {
            spend: baseSpend,
            revenue: baseSpend * campaignRoas,
            roas: campaignRoas,
            cpa: 24 + seeded(i + 5, baseSeed) * 35,
            ctr: 0.9 + seeded(i + 7, baseSeed) * 2.1,
            cvr: 1.2 + seeded(i + 9, baseSeed) * 3.2,
          } as Partial<Record<KPIKey, number>>,
        };
      });

      return {
        mode,
        generatedAt: new Date().toISOString(),
        kpis,
        series: {
          spendRevenue: spendRevenueSeries,
          roasCpa: roasCpaSeries,
        },
        channels,
        campaigns,
      };
    });
  }

  getCustomers(params?: { timeRange?: string }): DashboardCustomersResponse {
    return this.withCache("customers", { timeRange: params?.timeRange }, () => {
      const mode = getAppMode();
      const timeRange = resolveTimeRange(params?.timeRange);
      const baseSeed = timeRange === "1d" ? 17 : timeRange === "7d" ? 43 : 83;
      const kpis: KPIValue[] = [
        { key: "ltv", value: 920, unit: "pln", deltaPercent: 5.2 },
        { key: "aov", value: 238, unit: "pln", deltaPercent: 1.1 },
        {
          key: "conversion_rate",
          value: 2.6,
          unit: "percent",
          deltaPercent: 0.4,
        },
      ];

      const cohorts: TableRow[] = Array.from({ length: 6 }).map((_, i) => ({
        id: `cohort-${i + 1}`,
        dimensions: { cohort: `2025-${(i + 1).toString().padStart(2, "0")}` },
        metrics: {
          conversion_rate: clamp(22 + seeded(i, baseSeed) * 18, 8, 48),
          orders: clamp(320 + seeded(i + 3, baseSeed) * 260, 80, 900),
        },
      }));

      const segments: TableRow[] = [
        {
          id: "vip",
          dimensions: { name: "VIP" },
          metrics: { ltv: 1400, aov: 320, orders: 180 },
        },
        {
          id: "returning",
          dimensions: { name: "Returning" },
          metrics: { ltv: 860, aov: 260, orders: 460 },
        },
        {
          id: "new",
          dimensions: { name: "New" },
          metrics: { ltv: 420, aov: 190, orders: 720 },
        },
      ];

      return {
        mode,
        generatedAt: new Date().toISOString(),
        kpis,
        cohorts,
        segments,
      };
    });
  }

  getProducts(params?: { timeRange?: string }): DashboardProductsResponse {
    return this.withCache("products", { timeRange: params?.timeRange }, () => {
      const mode = getAppMode();
      const timeRange = resolveTimeRange(params?.timeRange);
      const baseSeed = timeRange === "1d" ? 23 : timeRange === "7d" ? 41 : 91;
      const timeMultiplier =
        timeRange === "1d" ? 0.2 : timeRange === "7d" ? 0.5 : 1;

      const kpis: KPIValue[] = [
        {
          key: "revenue",
          value: 3_200_000 * timeMultiplier,
          unit: "pln",
          deltaPercent: 3.8,
        },
        {
          key: "profit",
          value: 1_040_000 * timeMultiplier,
          unit: "pln",
          deltaPercent: 4.5,
        },
        { key: "returns", value: 3.4, unit: "percent", deltaPercent: -0.2 },
      ];

      const skus: TableRow[] = Array.from({ length: 8 }).map((_, i) => {
        const revenue =
          (35_000 + seeded(i, baseSeed) * 90_000) * timeMultiplier;
        const margin = 18 + seeded(i + 5, baseSeed) * 32;
        const profit = revenue * (margin / 100);
        const returns = 1 + seeded(i + 7, baseSeed) * 9;
        const trend = -12 + seeded(i + 11, baseSeed) * 38;
        const stockSeed = seeded(i + 13, baseSeed);
        const stock =
          stockSeed > 0.8 ? "low" : stockSeed > 0.4 ? "medium" : "high";
        return {
          id: `SKU-${(i + 1).toString().padStart(3, "0")}`,
          dimensions: { name: `Product ${String.fromCharCode(65 + i)}`, stock },
          metrics: { revenue, profit, margin, returns, trend } as Partial<
            Record<KPIKey, number>
          >,
        };
      });

      const movers: TableRow[] = [
        {
          id: "rising",
          dimensions: { name: "Rising" },
          metrics: { revenue: 420_000 * timeMultiplier, trend: 18 },
        },
        {
          id: "falling",
          dimensions: { name: "Falling" },
          metrics: { revenue: 260_000 * timeMultiplier, trend: -12 },
        },
      ];

      return {
        mode,
        generatedAt: new Date().toISOString(),
        kpis,
        skus,
        movers,
      };
    });
  }

  getGuardian(): DashboardGuardianResponse {
    return this.withCache("guardian", undefined, () => {
      const mode = getAppMode();
      const sources: DataFreshnessSource[] = [
        {
          source: "GA4",
          status: "ok",
          lastSync: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          delayMinutes: 5,
          records: 120_000,
        },
        {
          source: "Meta Ads",
          status: "delay",
          lastSync: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
          delayMinutes: 32,
          records: 54_000,
        },
        {
          source: "Shopify",
          status: "ok",
          lastSync: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
          delayMinutes: 8,
          records: 22_000,
        },
      ];

      const issues: DashboardAlert[] = [
        {
          id: "guardian-1",
          title: "Lag w danych Meta Ads",
          impact: "Opóźnienie 32 min",
          time: "12m temu",
          severity: "warning",
          context: "Meta Ads",
          target: "guardian",
        },
      ];

      return {
        mode,
        generatedAt: new Date().toISOString(),
        dataQuality: {
          freshness: "delay",
          coverage: "partial",
          sources,
          notes: ["Lag w danych Meta Ads"],
        },
        sources,
        issues,
      };
    });
  }

  getAlerts(): DashboardAlertsResponse {
    return this.withCache("alerts", undefined, () => {
      const mode = getAppMode();
      const alerts = [
        {
          id: "1",
          title: "Anomalia ROAS: Meta Ads",
          impact: "-14.2% vs wczoraj",
          time: "12m temu",
          severity: "critical" as const,
          context: "Meta Ads",
          target: "ads",
        },
        {
          id: "2",
          title: "Prognozowany Stock-out",
          impact: "SKU-742 (3 dni)",
          time: "1h temu",
          severity: "warning" as const,
          context: "Logistics",
          target: "products",
        },
        {
          id: "3",
          title: "Opóźnienie ETL: Google Analytics",
          impact: "Lag: 42 min",
          time: "3h temu",
          severity: "info" as const,
          context: "GA4 Stream",
          target: "guardian",
        },
      ];

      const summary = alerts.reduce(
        (acc, alert) => {
          acc[alert.severity] += 1;
          return acc;
        },
        { critical: 0, warning: 0, info: 0 },
      );

      return {
        mode,
        generatedAt: new Date().toISOString(),
        alerts,
        summary,
      };
    });
  }

  getKnowledge(): DashboardKnowledgeResponse {
    return this.withCache("knowledge", undefined, () => {
      const mode = getAppMode();
      return {
        mode,
        generatedAt: new Date().toISOString(),
        resources: [
          {
            id: "guide-1",
            title: "Jak poprawic ROAS w 7 dni",
            category: "Ads",
            level: "Intermediate",
            type: "Guide",
            module: "Performance",
            summary: "Szybkie audyty kampanii i optymalizacja budzetu.",
          },
          {
            id: "guide-2",
            title: "Segmentacja VIP i utrzymanie LTV",
            category: "Customers",
            level: "Advanced",
            type: "Playbook",
            module: "Retention",
            summary: "Strategia utrzymania klientow o wysokiej wartosci.",
          },
        ],
      };
    });
  }
}
