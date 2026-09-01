export default function Loading() { return <div className="page-skeleton" aria-label="Loading workspace"><div className="skeleton skeleton-title"/><div className="skeleton-grid">{Array.from({length:4},(_,index)=><div className="skeleton skeleton-card" key={index}/>)}</div><div className="skeleton skeleton-panel"/></div>; }

