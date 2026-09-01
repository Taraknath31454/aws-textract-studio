import { SettingsPanel } from "@/components/layout/settings-panel";
import { PageHeader } from "@/components/ui/common";
export default function SettingsPage() { return <div className="page-stack"><PageHeader eyebrow="WORKSPACE PREFERENCES" title="Settings" description="Configure appearance, processing defaults, review behavior, and local exports."/><SettingsPanel/></div>; }

