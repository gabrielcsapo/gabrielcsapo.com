const SIZE = 520;
const INSET = 34;

// A repeatable starting composition keeps the page still while React mounts.
export function createNetwork() {
  const nodes = Array.from({ length: 66 }, (_, i) => {
    const angle = i * 2.3999632297;
    const radius = 25 + Math.sqrt(i / 65) * 197;
    const x = 260 + Math.cos(angle) * radius * 0.93;
    const y = 254 + Math.sin(angle) * radius;
    return { x, y, homeX: x, homeY: y, vx: 0, vy: 0, radius: i % 11 === 0 ? 4 : 2.1 };
  });
  const links = [];
  // Each new node joins the growing network through its two closest predecessors.
  for (let i = 1; i < nodes.length; i++) {
    const nearest = nodes
      .slice(0, i)
      .map((node, j) => ({
        j,
        distance: Math.hypot(node.x - nodes[i].x, node.y - nodes[i].y),
      }))
      .sort((a, b) => a.distance - b.distance);
    for (const { j, distance } of nearest.slice(0, i % 3 === 0 ? 1 : 2)) {
      links.push({ source: i, target: j, length: distance, secondary: links.length % 4 === 0 });
    }
  }
  return { nodes, links };
}

export function stepNetwork(network, { time, step = 1, pointer = null, dragged = -1 }) {
  const { nodes, links } = network;
  const dt = Math.min(2, Math.max(0, step));
  for (const [i, node] of nodes.entries()) {
    const driftX = Math.sin(time * 0.0003 + i * 0.8) * 12;
    const driftY = Math.cos(time * 0.00025 + i * 0.6) * 12;
    node.vx += (node.homeX + driftX - node.x) * 0.0025 * dt;
    node.vy += (node.homeY + driftY - node.y) * 0.0025 * dt;
    if (pointer && dragged < 0) {
      const dx = node.x - pointer.x;
      const dy = node.y - pointer.y;
      const distance = Math.hypot(dx, dy) || 1;
      if (distance < 90) {
        const force = (1 - distance / 90) * 0.3 * dt;
        node.vx += (dx / distance) * force;
        node.vy += (dy / distance) * force;
      }
    }
  }
  for (const link of links) {
    const a = nodes[link.source];
    const b = nodes[link.target];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const distance = Math.hypot(dx, dy) || 1;
    const force = (distance - link.length) * 0.006 * dt;
    a.vx += (dx / distance) * force;
    a.vy += (dy / distance) * force;
    b.vx -= (dx / distance) * force;
    b.vy -= (dy / distance) * force;
  }
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const distance = Math.hypot(dx, dy) || 1;
      if (distance < 40) {
        const force = (40 - distance) * 0.012 * dt;
        a.vx += (dx / distance) * force;
        a.vy += (dy / distance) * force;
        b.vx -= (dx / distance) * force;
        b.vy -= (dy / distance) * force;
      }
    }
    const node = nodes[i];
    if (i === dragged) {
      node.vx = 0;
      node.vy = 0;
      continue;
    }
    node.vx = Math.max(-3, Math.min(3, node.vx * Math.pow(0.88, dt)));
    node.vy = Math.max(-3, Math.min(3, node.vy * Math.pow(0.88, dt)));
    node.x = Math.max(INSET, Math.min(SIZE - INSET, node.x + node.vx * dt));
    node.y = Math.max(INSET, Math.min(SIZE - INSET, node.y + node.vy * dt));
  }
}
