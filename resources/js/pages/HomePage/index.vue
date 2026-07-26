<template>
    <div class="main-bg">
        <TopHeader />
        <div class="d-flex flex-column align-items-center">
            <div class="d-flex flex-row" style="margin-top: 30%">
                <div
                    class="card main-logo-card p-2 text-center align-items-center justify-content-center"
                >
                    <img :src="logo" class="logo-size width: 1rem; height: 1rem;" alt="oceanbooth logo" />
                </div>
                <h2 class="logo-title">OceanBooth</h2>
            </div>
            <p class="description text-center">
                Tap Start to ride the ultimate vibe wave and turn your<br />
                photos into awesome retro polaroids instantly without<br />
                getting annoying sand in your shoes!
            </p>
            <div class="btn-transition">
                <router-link 
                    to="/template-selection"
                    class="btn pink-button"
                    @click="playClickSound"
                >
                    Start Session
                </router-link>
            </div>
            <div class="polaroid-card card p-3 text-left">
                Recent Polaroids
                <p class="polaroid-card-placeholder text-center">
                     <NullIndicator /> no polaroids yet
                </p>
            </div>
        </div>
        <img :src="homeBg" class="home-bg" alt="wave background" />
            <FloatingPolaroids :images="imageData"/>
    </div>
</template>

<script>
import TopHeader from "@components/TopHeader.vue";
import FloatingPolaroids from "@components/FloatingPolaroids.vue";
import NullIndicator from "@components/svgs/NullIndicator.vue";
import logo from "@assets/images/logo.svg";
import homeBg from "@assets/images/home-bg.svg";
import homeElement1 from "@assets/images/home-element-1.svg";
import homeElement2 from "@assets/images/home-element-2.svg";
import homeElement3 from "@assets/images/home-element-3.svg";
import clickSfx from "@assets/sfx/click.mp3";
import { useSound } from "@composables/useSound";

export default {
    name: "HomePage",
    components: {
        TopHeader,
        NullIndicator,
        FloatingPolaroids,
    },
    setup() {
        const { play: playClickSound } = useSound(clickSfx, 0.4);
        return { playClickSound };
    },
    data() {
        return {
            logo,
            homeBg,
            imageData: [
                { src: homeElement1, width: 370 },
                { src: homeElement2, width: 370, marginLeft: -130, marginBottom: -220 },
                { src: homeElement3, width: 370, marginLeft: -40 },
            ],
        };
    },
};
</script>

<style scoped>
.logo-size {
    width: 1.8rem;
    height: 1.8rem;
}
.description {
    margin-top: 4%;
    margin-bottom: 8%;
}
.pink-button {
    margin-bottom: 30%;
}
.polaroid-card {
    border-radius: 15px;
    box-shadow: 0 4px 0px rgba(0, 0, 0, 0.319);
    border: 1px solid black;
    position: relative;
    z-index: 1;
}
.polaroid-card-placeholder {
    font-style: italic;
    color: #c5c5c5;
    font-size: small;
    width: 12rem;
    height: 2rem;
    margin-top: 8%;
}
.home-bg {
    width: 100%;
    display: block;
    margin-top: auto;
}
/*animation & transition*/
.card.main-logo-card, .logo-title {
    animation: fade-in-blur 0.6s ease 0.1s both;
}
.description {
    animation: fade-in-blur 0.6s ease 0.3s both;
}
.btn-transition {
    animation: fade-in-blur 0.6s ease 0.7s both;
}
.card.polaroid-card {
    animation: fade-in-blur 0.6s ease 0.9s both;
}
@keyframes fade-in-blur {
    from { opacity: 0; transform: translateY(15px); filter: blur(6px); }
    to { opacity: 1; transform: translateY(0); filter: blur(0); }
}
</style>
