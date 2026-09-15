import { FlaskConical } from "lucide-react";
import { QueryLab } from "@/components/queries/query-lab";
import { QueryConsole } from "@/components/queries/query-console";
import { PageHeader } from "@/components/ui/common";

export default function QueryLabPage() { return <div className="page-stack"><PageHeader eyebrow="TEXTRACT QUERIES" title="Query Lab" description="Design, test, and save targeted natural-language extraction questions." actions={<span className="demo-tool-badge"><FlaskConical size={16} /> Frontend experiment</span>} /><QueryConsole /><QueryLab /></div>; }

