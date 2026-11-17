// One wandering line through the places I've worked. It draws itself when the page loads,
// and each stop appears as the line reaches it. The wide drawing is for desktop, the narrow
// one for phones; CSS shows whichever fits.
const DRAW_SECONDS = 2.8;
const DRAW_DELAY = 0.3;

const wide = {
  name: "wide",
  width: 1120,
  height: 250,
  start: [10, 168],
  d: [
    "M 10 168",
    "C 60 168, 100 142, 150 148",
    "C 200 154, 235 186, 280 176",
    "C 345 162, 340 90, 300 90",
    "C 258 90, 262 166, 345 168",
    "C 375 169, 400 152, 430 150",
    "C 480 147, 520 180, 580 174",
    "C 640 168, 690 132, 760 138",
    "C 810 142, 840 176, 890 170",
    "C 950 163, 948 104, 915 104",
    "C 880 104, 886 164, 950 162",
    "C 1000 160, 1040 140, 1090 140",
  ].join(" "),
  stops: [
    { name: "eBay", detail: "intern", x: 150, y: 148, below: true, reach: 0.2 },
    { name: "PayPal", x: 430, y: 150, reach: 0.46 },
    { name: "LinkedIn", x: 760, y: 138, reach: 0.6 },
    { name: "Vanta", detail: "now", x: 1090, y: 140, now: true, anchor: "end", reach: 1 },
  ],
  node: 9,
  nameSize: 22,
  detailSize: 16,
};

const narrow = {
  name: "narrow",
  width: 350,
  height: 180,
  start: [5, 102],
  d: [
    "M 5 102",
    "C 18 102, 26 88, 40 90",
    "C 62 93, 70 110, 90 106",
    "C 108 102, 114 92, 130 94",
    "C 146 96, 152 112, 168 110",
    "C 196 106, 194 74, 178 74",
    "C 162 74, 164 102, 190 100",
    "C 204 99, 212 87, 225 86",
    "C 245 85, 255 104, 272 102",
    "C 292 100, 304 90, 322 90",
  ].join(" "),
  stops: [
    { name: "eBay", detail: "intern", x: 40, y: 90, below: true, reach: 0.21 },
    { name: "PayPal", x: 130, y: 94, reach: 0.42 },
    { name: "LinkedIn", x: 225, y: 86, below: true, reach: 0.66 },
    { name: "Vanta", detail: "now", x: 322, y: 90, now: true, anchor: "end", reach: 1 },
  ],
  node: 5.5,
  nameSize: 15,
  detailSize: 12,
};

function Drawing({ drawing }) {
  const { name, width, height, start, d, stops, node, nameSize, detailSize } = drawing;
  const gap = nameSize * 0.55;
  return (
    <svg
      className={`career-path career-path-${name}`}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="My path so far: an internship at eBay, then PayPal, then LinkedIn, and now Vanta."
    >
      <path className="career-line" d={d} pathLength="1" />
      <circle className="career-start" cx={start[0]} cy={start[1]} r={node * 0.6} />
      {stops.map((stop) => {
        const radius = stop.now ? node * 1.3 : node;
        const anchor = stop.anchor ?? "middle";
        const x = anchor === "end" ? stop.x + radius : stop.x;
        // Above the line, the detail sits closest to the dot; below it, the name does.
        const nameY = stop.below
          ? stop.y + radius + gap + nameSize
          : stop.y - radius - gap - (stop.detail ? detailSize * 1.4 : 0);
        const detailY = stop.below ? nameY + detailSize * 1.4 : stop.y - radius - gap;
        return (
          <g
            key={stop.name}
            className="career-stop"
            style={{ "--reach": `${DRAW_DELAY + stop.reach * DRAW_SECONDS - 0.25}s` }}
          >
            <circle
              className={stop.now ? "career-node career-node-now" : "career-node"}
              cx={stop.x}
              cy={stop.y}
              r={radius}
            />
            <text className="career-name" x={x} y={nameY} textAnchor={anchor} fontSize={nameSize}>
              {stop.name}
            </text>
            {stop.detail && (
              <text
                className="career-detail"
                x={x}
                y={detailY}
                textAnchor={anchor}
                fontSize={detailSize}
              >
                {stop.detail}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default function CareerPath() {
  return (
    <div
      className="career"
      style={{ "--draw": `${DRAW_SECONDS}s`, "--draw-delay": `${DRAW_DELAY}s` }}
    >
      <Drawing drawing={wide} />
      <Drawing drawing={narrow} />
    </div>
  );
}
