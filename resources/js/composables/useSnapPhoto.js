import { ref } from "vue";

export function useSnapPhoto() {
    const stream = ref(null);
    const videoEl = ref(null);
    const isReady = ref(false);
    const error = ref(null);
    const countdown = ref(0);

    function mapError(err) {
        if (err.name === "NotFoundError" || err.name === "OverconstrainedError") {
            return "no-camera";
        }
        if (err.name === "NotAllowedError" || err.name === "SecurityError") {
            return "permission-denied";
        }
        return "unknown";
    }

    async function requestCameraAccess() {
        error.value = null;
        try {
            stream.value = await navigator.mediaDevices.getUserMedia({ video: true});
            isReady.value = true;
            return true;
        } catch (err) {
            isReady.value = false;
            error.value = mapError(err);
            return false;
        }
    }
    
    async function attach(videoElement) {
        videoEl.value = videoElement;
        if (videoEl.value && stream.value) {
            videoEl.value.srcObject = stream.value;
            try {
                await videoEl.value.play();
            } catch {
                // AbortError is common if attach() fires again before play() resolves — safe to ignore
            }
        }
    }

    function waitForVideoReady(video, timeoutMs = 3000) {
        if (video.readyState >= 2 && video.videoWidth && !video.paused) return Promise.resolve();
        return new Promise((resolve) => {
            const onReady = () => { cleanup(); resolve(); };
            const timer = setTimeout(onReady, timeoutMs);
            const cleanup = () => {
                clearTimeout(timer);
                video.removeEventListener("playing", onReady);
            };
            video.addEventListener("playing", onReady, { once: true });
        });
    }

    async function capture() {
        if (!videoEl.value) return null;
        await waitForVideoReady(videoEl.value);
        const canvas = document.createElement("canvas");
        canvas.width = videoEl.value.videoWidth;
        canvas.height = videoEl.value.videoHeight;
        if (!canvas.width || !canvas.height) return null;

        const ctx = canvas.getContext("2d");
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoEl.value, 0, 0);
        
        return canvas.toDataURL("image/jpeg", 0.9);
    }

    function wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function runCountdown(seconds = 3) {
        for (let i = seconds; i > 0; i--) {
            countdown.value = i;
            await wait(1000);
        }
        countdown.value = 0;
        return true;
    }

    function stop() {
        stream.value?.getTracks().forEach((track) => track.stop());
        stream.value = null;
        isReady.value = false;
    }

    return { stream, isReady, error, countdown, requestCameraAccess, attach, capture, runCountdown, stop }
}