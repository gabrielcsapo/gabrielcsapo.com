import { useEffect, useRef, useState } from "react";
import { createNetwork, stepNetwork } from "./networkPhysics";

export default function LivingNetwork() {
  const [network] = useState(createNetwork);
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const svgRef = useRef(null);
  const nodeRefs = useRef([]);
  const linkRefs = useRef([]);
  const pointer = useRef(null);
  const dragged = useRef(-1);
  const activePointer = useRef(null);
  const clock = useRef(0);
  const running = !reducedMotion;

  const paint = () => {
    network.nodes.forEach((node, i) => {
      nodeRefs.current[i]?.setAttribute("transform", `translate(${node.x} ${node.y})`);
    });
    network.links.forEach((link, i) => {
      const a = network.nodes[link.source];
      const b = network.nodes[link.target];
      const element = linkRefs.current[i];
      element?.setAttribute("x1", a.x);
      element?.setAttribute("y1", a.y);
      element?.setAttribute("x2", b.x);
      element?.setAttribute("y2", b.y);
      // A few fine connections recede and return, like the edges of a web in light.
      element?.setAttribute(
        "opacity",
        link.secondary ? 0.12 + (Math.sin(clock.current * 0.0004 + i) + 1) * 0.18 : 0.42,
      );
    });
  };
  const paintRef = useRef(paint);
  paintRef.current = paint;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReducedMotion(preference.matches);
    preference.addEventListener("change", change);
    return () => preference.removeEventListener("change", change);
  }, []);

  useEffect(() => {
    let frame;
    let previous = 0;
    let visible = true;
    let stopped = false;
    const tick = (time) => {
      if (stopped || !running || !visible || document.hidden) return;
      const step = previous ? Math.min((time - previous) / 16.667, 2) : 1;
      previous = time;
      clock.current += step * 16.667;
      stepNetwork(network, {
        time: clock.current,
        step,
        pointer: pointer.current,
        dragged: dragged.current,
      });
      paintRef.current();
      frame = requestAnimationFrame(tick);
    };
    const restart = () => {
      cancelAnimationFrame(frame);
      previous = 0;
      if (running && visible && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      restart();
    });
    observer.observe(svgRef.current);
    document.addEventListener("visibilitychange", restart);
    paintRef.current();
    restart();
    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", restart);
    };
  }, [running, network]);

  const position = (event) => {
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * 520,
      y: ((event.clientY - rect.top) / rect.height) * 520,
    };
  };
  const release = (event) => {
    if (event.pointerId !== activePointer.current) return;
    activePointer.current = null;
    dragged.current = -1;
    pointer.current = null;
    svgRef.current?.classList.remove("is-dragging");
  };

  return (
    <div className="living-network" aria-hidden="true">
      <svg
        ref={svgRef}
        className="network-canvas"
        viewBox="0 0 520 520"
        focusable="false"
        onPointerMove={(event) => {
          if (activePointer.current !== null && event.pointerId !== activePointer.current) return;
          if (!event.isPrimary) return;
          if (event.pointerType === "touch" && dragged.current < 0) return;
          const p = position(event);
          pointer.current = p;
          if (dragged.current >= 0) {
            const node = network.nodes[dragged.current];
            node.x = Math.max(34, Math.min(486, p.x));
            node.y = Math.max(34, Math.min(486, p.y));
            paint();
          }
        }}
        onPointerLeave={() => {
          if (dragged.current < 0) pointer.current = null;
        }}
        onPointerUp={release}
        onPointerCancel={release}
        onLostPointerCapture={release}
      >
        <g className="network-lines" aria-hidden="true">
          {network.links.map((link, i) => (
            <line
              key={`${link.source}-${link.target}`}
              ref={(el) => {
                linkRefs.current[i] = el;
              }}
              x1={network.nodes[link.source].x}
              y1={network.nodes[link.source].y}
              x2={network.nodes[link.target].x}
              y2={network.nodes[link.target].y}
              opacity={link.secondary ? 0.2 : 0.42}
            />
          ))}
        </g>
        <g aria-hidden="true">
          {network.nodes.map((node, i) => (
            <g
              key={i}
              ref={(el) => {
                nodeRefs.current[i] = el;
              }}
              transform={`translate(${node.x} ${node.y})`}
              className={`network-node ${i % 11 === 0 ? "network-node-accent" : ""}`}
            >
              <circle
                className="node-hit"
                r="17"
                onPointerDown={(event) => {
                  if (!event.isPrimary || event.button !== 0 || activePointer.current !== null)
                    return;
                  activePointer.current = event.pointerId;
                  dragged.current = i;
                  pointer.current = position(event);
                  svgRef.current.setPointerCapture(event.pointerId);
                  svgRef.current.classList.add("is-dragging");
                }}
              />
              {i % 11 === 0 && <circle className="node-ring" r="9" />}
              <circle className="node-dot" r={node.radius} />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
