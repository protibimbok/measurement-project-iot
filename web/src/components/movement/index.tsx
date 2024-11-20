import { useEffect, useRef } from "react";
import { getDomElement, resetTrace } from "./scene";

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

  return (
    <div className="relative">
      <div ref={elRef} />
      <button
        type="button"
        className="absolute right-0 bottom-full mb-7 -mr-5 px-3 py-2 border rounded-lg text-xs font-bold hover:bg-red-200"
        onClick={resetTrace}
      >
        CLEAR
      </button>
    </div>
  );
};

export default MovementRenderer;
