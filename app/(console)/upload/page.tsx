import { PageHeader } from "@/components/ui/common";
import { UploadWorkspace } from "@/components/upload/upload-workspace";

export default function UploadPage() { return <div className="page-stack"><PageHeader eyebrow="NEW PROCESSING JOB" title="Process a document" description="Configure extraction, validate metadata, and run the document through the AWS pipeline." /><UploadWorkspace /></div>; }

