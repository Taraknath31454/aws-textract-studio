export function ActivityChart({ values }: { values: number[] }) {
  const points = values.length ? values : [0];
  const width = 700;
  const height = 200;
  const xStep = points.length > 1 ? width / (points.length - 1) : width;
  const toY = (value: number) => height - Math.max(0, Math.min(100, value)) / 100 * 170;
  const path = points.map((value, index) => `${index ? "L" : "M"}${(index * xStep).toFixed(1)} ${toY(value).toFixed(1)}`).join(" ");
  const area = `${path} L${width} ${height} L0 ${height}Z`;
  return <div className="activity-chart"><div className="chart-y"><span>100%</span><span>75%</span><span>50%</span><span>0%</span></div><div className="chart-area"><svg viewBox={`0 0 ${width} 220`} preserveAspectRatio="none" role="img" aria-label="Confidence across recent completed documents"><defs><linearGradient id="confidence-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#38bdf8" stopOpacity=".2" /><stop offset="1" stopColor="#38bdf8" stopOpacity="0" /></linearGradient></defs><path className="area-path" d={area} fill="url(#confidence-area)" /><path className="line-path" d={path} fill="none" stroke="#38bdf8" strokeWidth="2" vectorEffect="non-scaling-stroke" />{points.map((value, index) => <circle key={index} cx={index * xStep} cy={toY(value)} r="3" fill="#0b0f16" stroke="#67d7ff" strokeWidth="2" vectorEffect="non-scaling-stroke" />)}</svg><div className="chart-x"><span>Older</span><span>Recent documents</span><span>Latest</span></div></div></div>;
}
