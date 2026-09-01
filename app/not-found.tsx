import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";
export default function NotFound() { return <main className="standalone-state"><span><FileQuestion size={34}/></span><h1>Page not found</h1><p>The workspace route you requested does not exist or has moved.</p><Link className="btn btn-primary" href="/dashboard"><Home size={16}/>Return to dashboard</Link></main>; }

