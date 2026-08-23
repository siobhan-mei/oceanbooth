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
                :src="templateSelectionDecor1"
                class="template-decor-1"
                alt="shell"
            />
            <img
                :src="templateSelectionDecor2"
                class="template-decor-2"
                alt="starfish"
            />
            <img
                :src="templateSelectionDecor3"
                class="template-decor-3"
                alt="turtle"
            />
        </div>
    </div>
</template>

<script>
import TopHeader from "@components/TopHeader.vue";
import TemplateCard from "@components/TemplateCard.vue";
import templateSelectionDecor1 from "@assets/images/template-selection-decor-01.svg";
import templateSelectionDecor2 from "@assets/images/template-selection-decor-02.svg";
import templateSelectionDecor3 from "@assets/images/template-selection-decor-03.svg";
import clickSfx from "@assets/sfx/click.mp3";
import { useSound } from "@composables/useSound";

export default {
    name: "TemplateSelection",
    components: {
        TopHeader,
        TemplateCard,
    },
    setup() {
        const { play: playClickSound } = useSound(clickSfx, 0.4);
        return {
            playClickSound,
        };
    },
    data() {
        return {
            templateSelectionDecor1,
            templateSelectionDecor2,
            templateSelectionDecor3,
            activeTemplateId: null,
        };
    },
    methods: {
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
.template-decor-1 {
    position: absolute;
    width: auto;
    height: 90px;
    rotate: 30deg;
    top: 17%;
    left: 70%;
}
.template-decor-2 {
    position: absolute;
    width: auto;
    height: 80px;
    top: 62%;
    left: 24.5%;
}
.template-decor-3 {
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
.template-decor-1, .template-decor-2, .template-decor-3{
    animation: fade-in-blur 0.6s ease both;
}
.template-decor-1{ animation-delay: 0.7s; }
.template-decor-2{ animation-delay: 0.9s; }
.template-decor-3{ animation-delay: 0.11s; }
@keyframes fade-in-blur {
    from { opacity: 0; transform: translateY(15px); filter: blur(6px); }
    to { opacity: 1; transform: translateY(0); filter: blur(0); }
}
</style>
