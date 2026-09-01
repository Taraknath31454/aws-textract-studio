import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";
import { PageHeader } from "@/components/ui/common";
export default function AnalyticsPage() { return <div className="page-stack"><PageHeader eyebrow="PROCESSING ANALYTICS" title="Analytics" description="Understand volume, extraction confidence, review pressure, and workflow quality." /><AnalyticsDashboard /></div>; }

