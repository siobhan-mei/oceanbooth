import { ref } from "vue";

export function useSnapPhoto() {
    const stream = ref(null);
    const videoEl = ref(null);
    const isReady = ref(false);
    const error = ref(null);

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
    
    function attach(videoElement) {
        videoEl.value = videoElement;
        if (videoEl.value && stream.value) {
            videoEl.value.srcObject = stream.value;
        }
    }

    function capture() {
        if (!videoEl.value) return null;
        const canvas = document.createElement("canvas");
        canvas.width = videoEl.value.videoWidth;
        canvas.height = videoEl.value.videoHeight;
        canvas.getContext("2d").drawImage(videoEl.value, 0, 0);
        return canvas.toDataURL("image/jpeg", 0.9);
    }

    function stop() {
        stream.value?.getTracks().forEach((track) => track.stop());
        stream.value = null;
        isReady.value = false;
    }

    return { stream, isReady, error, requestCameraAccess, attach, capture, stop }
}