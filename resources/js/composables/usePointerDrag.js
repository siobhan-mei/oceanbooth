export function usePointerDrag() {
    function start(event, { onMove, onEnd, onClick, threshold = 0 }) {
        event.preventDefault();
        const startX = event.clientX;
        const startY = event.clientY;
        let dragging = threshold === 0;

        function handleMove(e) {
            if (!dragging && Math.hypot(e.clientX - startX, e.clientY - startY) > threshold) {
                dragging = true;
            }
            if (dragging) onMove?.(e);
        }

    function handleUp(e) {
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
        if (dragging) {
            onEnd?.(e);
        } else {
            onClick?.(e);
        }
    }
        window.addEventListener("pointermove", handleMove);
        window.addEventListener("pointerup", handleUp);
    }

    return { start };
}   