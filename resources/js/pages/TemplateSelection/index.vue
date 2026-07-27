<template>
    <div class="main-bg">
        <TopHeader variant="page" @back-click="playClickSound" />
        <div class="main-container">
            <p class="d-flex justify-content-center">Select Template</p>

            <div class="template-grid">
                <!--Template 1-->
                <TemplateCard
                    class="template-column-item"
                    @snap="handleSnap(1)"
                    @upload="handleUpload(1)"
                >
                    <template #visual>
                        <div class="stacked-box"></div>
                    </template>
                </TemplateCard>
                <!--Template 2-->
                <TemplateCard
                    class="template-column-item"
                    @snap="handleSnap(2)"
                    @upload="handleUpload(2)"
                >
                    <template #visual>
                        <div class="stacked-box"></div>
                        <div class="stacked-box"></div>
                    </template>
                </TemplateCard>
                <!--Template 3-->
                <TemplateCard
                    class="template-column-item"
                    @snap="handleSnap(3)"
                    @upload="handleUpload(3)"
                >
                    <template #visual>
                        <div class="stacked-box"></div>
                        <div class="stacked-box"></div>
                        <div class="stacked-box"></div>
                    </template>
                </TemplateCard>
            </div>
        </div>
        <div class="element-container">
            <img
                :src="templateElement1"
                class="template-element-1"
                alt="shell"
            />
            <img
                :src="templateElement2"
                class="template-element-2"
                alt="starfish"
            />
            <img
                :src="templateElement3"
                class="template-element-3"
                alt="turtle"
            />
        </div>
        <!--Image file picker-->
        <!--<input
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        class="d-none"
        @change="onFileSelected"
        @click="playClickSound"
        />-->
        <!--Request camera access modal-->
        <!--<ConfirmModal
            :show="showPermissionModal"
            title="Permission to use camera"
            message="We need your permission to use your camera"
            confirm-text="Allow"
            @cancel="showPermissionModal= false"
            @confirm="requestCameraAccess"
        />-->
        <!--No camera detection alert-->
        <!--<ConfirmModal
            :show="showNoCameraModal"
            title="No camera found"
            message="Please connect a camera device"
            confirm-text="Retry"
            @cancel="showNoCameraModal = false"
            @confirm="retryCameraDetection"
        />-->
    </div>
</template>

<script>
import TopHeader from "@components/TopHeader.vue";
import TemplateCard from "@components/TemplateCard.vue";
/*import ConfirmModal from "@components/modals/ConfirmModal.vue";*/
import templateElement1 from "@assets/images/templateselection-element-1.svg";
import templateElement2 from "@assets/images/templateselection-element-2.svg";
import templateElement3 from "@assets/images/templateselection-element-3.svg";
import clickSfx from "@assets/sfx/click.mp3";
import { useSound } from "@composables/useSound";
/*import { useUploadPhoto } from "@composables/useUploadPhoto";*/

export default {
    name: "TemplateSelection",
    components: {
        TopHeader,
        TemplateCard,
        /*ConfirmModal,*/
    },
    setup() {
        const { play: playClickSound } = useSound(clickSfx, 0.4);
        /*const upload = useUploadPhoto();*/
        return {
            playClickSound, /*upload*/
        };
    },
    data() {
        return {
            templateElement1,
            templateElement2,
            templateElement3,
            activeTemplateId: null,
            /*showPermissionModal: false,
            showNoCameraModal: false,*/
        };
    },
    methods: {
        /*handleSnap(templateId) {
            this.showPermissionModal = true;
        },
        handleUpload(templateId) {
            this.activeTemplateId = templateId;
            this.upload.reset();
            this.$refs.fileInput.click();
        },
        onFileSelected(event) {
            this.upload.handleInputChange(event);
        },
        requestCameraAccess() {
            this.showPermissionModal = false;
            this.showNoCameraModal = true;
        },
        retryCameraDetection() {
            this.showNoCameraModal = false;
        },*/
        handleSnap(templateId) {
            this.$router.push({
                name: 'photoEditor',
                query: { mode: 'camera', template: templateId },
            });
        },
        handleUpload(templateId) {
            this.$router.push({
                name: 'photoEditor',
                query: { mode: 'upload', template: templateId },
            });
        },
    },
};
</script>

<style scoped>
.main-container {
    width: 45%;
    min-height: 450px;
    padding: 40px;
    border: 1px solid black;
    box-shadow: 0 6px 0px rgba(0, 0, 0, 0.319);
    border-radius: 20px;
    background: var(--color-main-container, #e6f6f8);
}
.template-grid {
    display: flex;
    gap: 16px;
    margin-top: 30px;
    height: 360px;
}
.stacked-box {
    background: #ffffff;
    border: 1px solid #000000;
    border-radius: 10px;
    flex: 1;
}
.template-column-item {
    flex: 1;
}
.element-container {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}
.template-element-1 {
    position: absolute;
    width: auto;
    height: 90px;
    rotate: 30deg;
    top: 17%;
    left: 70%;
}
.template-element-2 {
    position: absolute;
    width: auto;
    height: 80px;
    top: 62%;
    left: 24.5%;
}
.template-element-3 {
    position: absolute;
    width: auto;
    height: 110px;
    rotate: -20deg;
    top: 71%;
    left: 24.4%;
}
/*animation & transition*/
.main-container {
    animation: fade-in-blur 0.6s ease 0.5s both;
}
.template-element-1, .template-element-2, .template-element-3{
    animation: fade-in-blur 0.6s ease both;
}
.template-element-1{ animation-delay: 0.7s; }
.template-element-2{ animation-delay: 0.9s; }
.template-element-3{ animation-delay: 0.11s; }
@keyframes fade-in-blur {
    from { opacity: 0; transform: translateY(15px); filter: blur(6px); }
    to { opacity: 1; transform: translateY(0); filter: blur(0); }
}
</style>
