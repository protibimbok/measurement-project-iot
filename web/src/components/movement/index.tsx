import { useEffect, useRef } from "react";
import { getDomElement } from "./scene";

const MovementRenderer = () => {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const divEl = elRef.current;
    const onResize = () => {
      if (!divEl) {
        return;
      }
      const box = divEl.getBoundingClientRect();
      const height = window.innerHeight - box.top * 2;
      const width = window.innerWidth - box.left * 2;
      divEl.style.height = `${height}px`;
      divEl.style.width = `${width}px`;
      const canvasEl = getDomElement(width, height);
      divEl.appendChild(canvasEl);
    };

    onResize();

    document.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("resize", onResize);
      divEl?.firstElementChild?.remove();
    };
  }, []);

  return <div ref={elRef} className="" />;
};

export default MovementRenderer;
