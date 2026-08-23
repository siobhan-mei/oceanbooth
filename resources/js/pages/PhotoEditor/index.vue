<template>
    <div class="main-bg">
        <TopHeader variant="page" @back-click="playClickSound" />
        <div class="d-flex flex-row">
            <PhotoPreview
                :mode="mode"
                :template-id="templateId"
                :photos="photos"
                :camera-ready="camera.isReady.value"
                :activeSlotIndex="pendingSlotIndex"
                :countdown="camera.countdown.value"
                :is-capturing="isCapturing"
                :is-retaking="isRetaking"
                @snap="onSlotSelected"
                @start-capture="onSnapClick"
                @video-ref="onVideoRef"
            />
            <EditorPanel />
        </div>
        <input
            ref="fileInput"
            type="file"
            accept="image/jpeg, image/png, image/webp"
            class="d-none"
            @change="onFileSelected"
        />
        <PhotoCropperModal
            :show="showCropper"
            :src="cropperSrc"
            @cancel="onCropCancel"
            @confirm="onCropConfirm"
        />
        <ConfirmModal
            :show="showCameraPermission"
            title="Permission to use camera"
            message="Allow OceanBooth to use your camera to snap a photo?"
            confirm-text="Allow"
            cancel-text="Deny"
            @cancel="onCameraPermissionCancel"
            @confirm="onCameraPermissionConfirm"
        />
        <ConfirmModal
            :show="showCameraDenied"
            title="Camera access denied"
            message="We can't reach your camera. Please enable camera access in your browser settings, then try again."
            @cancel="onCameraDeniedClose"
            @confirm="onCameraDeniedClose"
        />
        <ConfirmModal
            :show="showCameraNotFound"
            title="Camera not found"
            message="We couldn't find a camera on this device. Please connect a camera and try again."
            @cancel="onCameraNotFoundClose"
            @confirm="onCameraNotFoundClose"
        />
    </div>
</template>
<script>
import TopHeader from "@components/TopHeader.vue";
import PhotoPreview from "@components/photo-editor/PhotoPreview.vue";
import EditorPanel from "@components/photo-editor/EditorPanel.vue";
import PhotoCropperModal from "@components/modals/PhotoCropperModal.vue";
import ConfirmModal from "@components/modals/ConfirmModal.vue";
import clickSfx from "@assets/sfx/click.mp3";
import { useSound } from "@composables/useSound";
import { useUploadPhoto } from "@composables/useUploadPhoto";
import { useSnapPhoto } from "@composables/useSnapPhoto";

export default {
    name: "PhotoEditor",
    components: {
        TopHeader,
        PhotoPreview,
        EditorPanel,
        PhotoCropperModal,
        ConfirmModal,
    },
    setup() {
        const { play: playClickSound } = useSound(clickSfx, 0.4);
        const upload = useUploadPhoto();
        const camera =  useSnapPhoto();

        return { playClickSound, upload, camera };
    },
    data() {
        return {
            photos: [null],
            pendingSlotIndex: null,
            cropperSrc: null,
            showCropper: false,
            showCameraPermission: false,
            showCameraDenied: false,
            showCameraNotFound: false,
            isCapturing: false,
            isRetaking: false,
        };
    },
    computed: {
        mode() {
            return this.$route.query.mode || "camera";
        },
        templateId() {
            return Number(this.$route.query.template) || 1;
        },
    },
    watch: {
        templateId: {
            immediate: true,
            handler(id) {
                const slotCount = { 1: 1, 2: 2, 3: 3 }[id] ?? 1;
                this.photos = Array(slotCount).fill(null);
            },
        },
    },
    methods: {
        async onSlotSelected(index) {
            if (this.mode === "upload"){
                this.pendingSlotIndex = index;
                this.$refs.fileInput.click();
                return;
            }

            if (!this.camera.isReady.value) {
                this.pendingSlotIndex = index;
                this.showCameraPermission = true;
                return;
            }

            if (this.photos[index]) {
                // Retake: single slot only, no auto-advance
                if (this.isCapturing) return;
                this.isCapturing = true;
                this.isRetaking = true;
                this.photos[index] = null;
                await this.captureSlot(index);
                this.isRetaking = false;
                this.isCapturing = false;   
            } else {
                // Empty slot clicked: reuse the existing auto-loop
                this.onSnapClick();
            }
        },
        async onCameraPermissionConfirm() {
            this.showCameraPermission = false;
            const granted = await this.camera.requestCameraAccess();
            if (!granted) {
                if (this.camera.error.value === "no-camera") {
                    this.showCameraNotFound = true;
                } else {
                    this.showCameraDenied = true;
                }
                return;
            }
            this.pendingSlotIndex = this.photos.findIndex((p) => !p);
        },
        onCameraPermissionCancel () {
            this.showCameraPermission = false;
            this.pendingSlotIndex = null;
        },
        onCameraDeniedClose() {
            this.showCameraDenied = false;
            this.pendingSlotIndex = null;
        },
        onCameraNotFoundClose() {
            this.showCameraNotFound = false;
            this.pendingSlotIndex = null;
        },
        async onVideoRef(el) {
            if (el) await this.camera.attach(el);
        },
        async onSnapClick() {
            if (!this.camera.isReady.value || this.isCapturing) return;
            this.isCapturing = true;
            for (let index = 0; index < this.photos.length; index++) {
                if (this.photos[index]) continue;

                this.pendingSlotIndex = index;
                await this.$nextTick();

                const completed = await this.camera.runCountdown(3);
                if (!completed) break;

                const dataUrl = await this.camera.capture();
                if (dataUrl) this.photos[index] = dataUrl;
            }
            const nextEmpty = this.photos.findIndex((p) => !p);
            this.pendingSlotIndex = nextEmpty === -1 ? null : nextEmpty;
            this.isCapturing = false;
        },
        async captureSlot(index) {
            this.pendingSlotIndex = index;
            await this.$nextTick();
            const completed = await this.camera.runCountdown(3);
            if (!completed) return false;
            const dataUrl = await this.camera.capture();
            if (dataUrl) this.photos[index] = dataUrl;
            return true;
        },
        async onFileSelected(event) {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;

            try {
                this.cropperSrc = await this.upload.handleFile(file);
                this.showCropper = true;
            } catch {
                // handleFile already sets upload.error; UI for it is a follow-up task
            }
        },
        onCropConfirm(dataUrl) {
            this.photos[this.pendingSlotIndex] = dataUrl;
            this.resetCropper();
        },
        onCropCancel() {
            this.resetCropper();
        },
        resetCropper() {
            this.showCropper = false;
            this.cropperSrc = null;
            this.pendingSlotIndex = null;
        },
    },  
    beforeUnmount() {
            this.camera.stop();
    },
};
</script>

<style scoped>
.main-bg {
    display: flex;
    align-items: center;
}
</style>
