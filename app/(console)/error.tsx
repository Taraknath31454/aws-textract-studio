"use client";
import { AlertTriangle, RotateCcw } from "lucide-react";
export default function WorkspaceError({reset}:{error:Error;reset:()=>void}) { return <div className="standalone-state embedded"><span><AlertTriangle size={32}/></span><h1>Something interrupted the workspace</h1><p>The frontend could not render this view. Your local demo data is still safe.</p><button className="btn btn-primary" onClick={reset}><RotateCcw size={16}/>Try again</button></div>; }

