import { DocumentWorkspace } from "@/components/documents/document-workspace";

export default async function DocumentPage({ params }: PageProps<"/documents/[id]">) { const { id } = await params; return <DocumentWorkspace id={id} />; }

