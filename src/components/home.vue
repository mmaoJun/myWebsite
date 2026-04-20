<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch, nextTick } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'

const route = useRoute()
const router = useRouter()
const isHomePage = computed(() => route.path === '/')

const heroImage = '/fRBvUGdOZ.jpeg'
const burningImage = '/burning.webp'
const cardsImage = '/p2410236616.webp'
const cardBack1 = '/card1.jpeg'
const cardBack2 = '/card2.jpeg'
const cardBack3 = '/card3.jpeg'
const hitokoto = ref('')
const fromWho = ref('')
const hitokoto1 = ref('')
const fromWho1 = ref('')
const hitokoto2 = ref('')
const homeRoot = ref(null)
let lenis = null
let rafFn = null
let navEl = null
let navInitialWidth = 0
let homeActive = false
const cleanups = []

const getHitokoto = async () => {
  try {
    const res = await axios.get('https://v1.hitokoto.cn', {
      params: { c: 'h' },
    })
    hitokoto.value = res.data.hitokoto
    fromWho.value = res.data.from || ''
  } catch (error) {
    hitokoto1.value = '请求失败，请重试'
    fromWho1.value = ''
    console.error('请求出错：', error)
  }
}
const getHitokoto1 = async () => {
  try {
    const res = await axios.get('https://v1.hitokoto.cn', {
      params: { c: 'i' },
    })
    hitokoto1.value = res.data.hitokoto
    fromWho1.value = res.data.from || ''
  } catch (error) {
    hitokoto1.value = '请求失败，请重试'
    fromWho1.value = ''
    console.error('请求出错：', error)
  }
}
const getHitokoto2 = async () => {
  try {
    const res = await axios.get('https://v1.hitokoto.cn', {
      params: { c: 'a' ,max_length: 10},
    })
    hitokoto2.value = res.data.hitokoto
    
  } catch (error) {
    hitokoto2.value = '请求失败，请重试'
    console.error('请求出错：', error)
  }
}
const initSmoothScroll = () => {
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.9 })
  lenis.on('scroll', ScrollTrigger.update)
  rafFn = (t) => lenis?.raf(t * 1000)
  gsap.ticker.add(rafFn)
  gsap.ticker.lagSmoothing(0)
  cleanups.push(() => {
    if (rafFn) gsap.ticker.remove(rafFn)
    lenis?.destroy()
  })
}

const handleGoHome = (event) => {
  event.preventDefault()
  if (route.path !== '/') {
    router.push('/')
    return
  }
  if (!navEl) return
  gsap.to(navEl, {
    width: navInitialWidth || navEl.getBoundingClientRect().width,
    duration: 1.25,
    ease: 'power1.inOut',
    overwrite: true,
  })
  if (lenis) {
    lenis.scrollTo(0, { immediate: true })
    ScrollTrigger.update()
  } else {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }
}

const initHeroScroll = () => {
  const nav = document.querySelector('.hero-nav')
  const frame = homeRoot.value?.querySelector('.hero-frame')
  const heroImg = homeRoot.value?.querySelector('.hero-media img')
  const heroCopy = homeRoot.value?.querySelector('.hero-copy')
  if (!nav || !frame || !heroImg || !heroCopy) return

  const mm = gsap.matchMedia()

  mm.add('(min-width: 768px)', () => {
    const initialNavWidth = nav.getBoundingClientRect().width
    const tl = gsap.timeline({
      scrollTrigger: { trigger: homeRoot.value?.querySelector('.hero'), start: 'top top', end: 'bottom top', scrub: 1.1 },
    })

    tl.to(frame, { scale: 0.74, '--hero-dark': 0.36, ease: 'none' }, 0)
      .to(heroImg, { scale: 1.18, ease: 'none' }, 0)
      .to(heroCopy, { y: -28, opacity: 0.15, ease: 'none' }, 0)

    const navTrigger = ScrollTrigger.create({
      trigger: homeRoot.value?.querySelector('.intro'),
      start: 'top 52%',
      end: 'top 52%',
      onEnter: () => gsap.to(nav, { width: '860px', duration: 1.25, ease: 'power1.inOut', overwrite: true }),
      onLeaveBack: () => gsap.to(nav, { width: initialNavWidth, duration: 0.75, ease: 'power1.inOut', overwrite: true }),
    })

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
      navTrigger.kill()
    }
  })

  mm.add('(max-width: 767px)', () => {
    const initialNavWidth = nav.getBoundingClientRect().width
    const tl = gsap.timeline({
      scrollTrigger: { trigger: homeRoot.value?.querySelector('.hero'), start: 'top top', end: 'bottom top', scrub: 1 },
    })

    tl.to(frame, { scale: 0.82, '--hero-dark': 0.28, ease: 'none' }, 0)
      .to(heroImg, { scale: 1.16, ease: 'none' }, 0)

    const navTrigger = ScrollTrigger.create({
      trigger: homeRoot.value?.querySelector('.intro'),
      start: 'top 58%',
      end: 'top 58%',
      onEnter: () => gsap.to(nav, { width: '82vw', duration: 1.15, ease: 'power1.inOut', overwrite: true }),
      onLeaveBack: () => gsap.to(nav, { width: initialNavWidth, duration: 0.7, ease: 'power1.inOut', overwrite: true }),
    })

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
      navTrigger.kill()
    }
  })

  cleanups.push(() => mm.revert())
}

const initCardScroll = () => {
  const cardContainer = homeRoot.value?.querySelector('.card-container')
  const stickyHeader = homeRoot.value?.querySelector('.sticky-header h1')
  if (!cardContainer || !stickyHeader) return

  const mm = gsap.matchMedia()
  mm.add('(max-width: 999px)', () => {
    gsap.set(homeRoot.value?.querySelectorAll('.card, .card-container, .sticky-header h1, #card-1, #card-2, #card-3') || [], { clearProps: 'all' })
  })

  mm.add('(min-width: 1000px)', () => {
    let gapDone = false
    let flipDone = false
    const cards = homeRoot.value?.querySelectorAll('.card') || []
    const edgeCards = homeRoot.value?.querySelectorAll('#card-1, #card-3') || []
    const allCards = homeRoot.value?.querySelectorAll('#card-1, #card-2, #card-3') || []
    const trigger = ScrollTrigger.create({
      trigger: homeRoot.value?.querySelector('.sticky'),
      start: 'top top',
      end: `+=${window.innerHeight * 3.2}px`,
      scrub: 1,
      pin: true,
      pinSpacing: true,
      onUpdate: (self) => {
        const p = self.progress
        if (p >= 0.1 && p <= 0.25) {
          const hp = gsap.utils.mapRange(0.1, 0.25, 0, 1, p)
          gsap.set(stickyHeader, { y: gsap.utils.mapRange(0, 1, 40, 0, hp), opacity: gsap.utils.mapRange(0, 1, 0, 1, hp) })
        } else if (p < 0.1) {
          gsap.set(stickyHeader, { y: 40, opacity: 0 })
        } else {
          gsap.set(stickyHeader, { y: 0, opacity: 1 })
        }
        if (p <= 0.25) {
          const w = gsap.utils.mapRange(0, 0.25, 75, 60, p)
          gsap.set(cardContainer, { width: `${w}%` })
        } else gsap.set(cardContainer, { width: '60%' })

        if (p >= 0.35 && !gapDone) {
          gsap.to(cardContainer, { gap: '20px', duration: 0.5, ease: 'power3.out' })
          gsap.to(allCards, { borderRadius: '20px', duration: 0.5, ease: 'power3.out' })
          gapDone = true
        } else if (p < 0.35 && gapDone) {
          gsap.to(cardContainer, { gap: '0px', duration: 0.5, ease: 'power3.out' })
          gsap.to(homeRoot.value?.querySelector('#card-1'), { borderRadius: '20px 0 0 20px', duration: 0.5, ease: 'power3.out' })
          gsap.to(homeRoot.value?.querySelector('#card-2'), { borderRadius: '0px', duration: 0.5, ease: 'power3.out' })
          gsap.to(homeRoot.value?.querySelector('#card-3'), { borderRadius: '0 20px 20px 0', duration: 0.5, ease: 'power3.out' })
          gapDone = false
        }

        if (p >= 0.7 && !flipDone) {
          gsap.to(cards, { rotationY: 180, duration: 0.75, ease: 'power3.inOut', stagger: 0.1 })
          gsap.to(edgeCards, { y: 30, rotationZ: (i) => [-15, 15][i], duration: 0.75, ease: 'power3.inOut' })
          flipDone = true
        } else if (p < 0.7 && flipDone) {
          gsap.to(cards, { rotationY: 0, duration: 0.75, ease: 'power3.inOut', stagger: -0.1 })
          gsap.to(edgeCards, { y: 0, rotationZ: 0, duration: 0.75, ease: 'power3.inOut' })
          flipDone = false
        }
      },
    })
    return () => trigger.kill()
  })

  cleanups.push(() => mm.revert())
}

const activateHome = async () => {
  if (homeActive) return
  await nextTick()
  if (!homeRoot.value) return
  getHitokoto()
  getHitokoto1()
  getHitokoto2()
  initSmoothScroll()
  navEl = document.querySelector('.hero-nav')
  navInitialWidth = navEl?.getBoundingClientRect().width || 0
  initHeroScroll()
  initCardScroll()
  homeActive = true
}

const deactivateHome = () => {
  if (!homeActive) return
  cleanups.forEach((fn) => fn())
  cleanups.length = 0
  ScrollTrigger.getAll().forEach((t) => t.kill())
  lenis = null
  rafFn = null
  homeActive = false
}

onMounted(async () => {
  gsap.registerPlugin(ScrollTrigger)
  if (!isHomePage.value) return
  await activateHome()
})

watch(isHomePage, async (isHome) => {
  if (isHome) {
    await activateHome()
  } else {
    deactivateHome()
  }
})

onBeforeUnmount(() => {
  deactivateHome()
})
</script>

<template>
  <header class="hero-nav">
    <a class="hero-logo" href="/" @click="handleGoHome">maoJun</a>
    <nav class="hero-links">
      <RouterLink to="/movies">Movies</RouterLink>
      <RouterLink to="/musics">Musics</RouterLink>
      <RouterLink to="/pictures">Pictures</RouterLink>
    </nav>
    <button class="hero-cta" @click="$router.push('/about')">about</button>
  </header>

  <main v-if="isHomePage" ref="homeRoot">
    <section class="hero">
    <div class="hero-inner">
      <div class="hero-frame">
        <div class="hero-media"><img :src="heroImage" alt="hero" /></div>
        <div class="hero-copy">
          <h1>{{ hitokoto }}</h1>
          <p>——{{ fromWho }}</p>
        </div>
        <span class="hero-tip">Scroll to Explore</span>
      </div>
    </div>
  </section>

  <section class="intro">
    <img class="intro-poster" :src="burningImage" alt="Burning" />
    <p class="intro-text">
      要怎么做才能年纪轻轻就过上那种生活<br />
      悠闲地到处旅行<br />
      开着保时捷<br />
      在豪宅里煮意面<br />
      了不起的盖茨比啊
    </p>
    <p class="intro-sub">燃烧<br />Burning<br />-2018-</p>
  </section>

  <section class="sticky">
    <div class="sticky-header"><h1>{{ hitokoto2 }}</h1></div>
    <div class="card-container">
      <div class="card" id="card-1">
        <div class="card-front card-front-1" :style="{ backgroundImage: `url(${cardsImage})` }"></div>
        <div class="card-back card-back-image"><img :src="cardBack1" alt="card back 1" /></div>
      </div>
      <div class="card" id="card-2">
        <div class="card-front card-front-2" :style="{ backgroundImage: `url(${cardsImage})` }"></div>
        <div class="card-back card-back-image"><img :src="cardBack2" alt="card back 2" /></div>
      </div>
      <div class="card" id="card-3">
        <div class="card-front card-front-3" :style="{ backgroundImage: `url(${cardsImage})` }"></div>
        <div class="card-back card-back-image"><img :src="cardBack3" alt="card back 3" /></div>
      </div>
    </div>
  </section>

  <section class="outro">
    <h1>{{ hitokoto1 }}</h1>
    <p>——{{ fromWho1 }}</p>
  </section>
  <footer class="site-footer">工信部备案号 黔ICP备2026005154号-1</footer>
  </main>
  <RouterView v-else />
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Manrope:wght@400;500;700&display=swap');

:global(:root){--bg:#000;--fg:#f5f5f5;--nav-bg:rgb(0 0 0 / 62%);--nav-border:rgb(255 255 255 / 22%);--card-1:#b2b2b2;--card-2:#ce2017;--card-3:#2f2f2f}
:global(*){margin:0;padding:0;box-sizing:border-box}
:global(html),:global(body),:global(#app){background:var(--bg);color:var(--fg);font-family:'Manrope',sans-serif}
img{width:100%;height:100%;object-fit:cover}
section{position:relative;width:100%;padding:2rem;background:var(--bg);color:var(--fg)}
.site-footer{padding:1.4rem 2rem 2.2rem;text-align:center;font-size:.82rem;letter-spacing:.04em;color:rgb(255 255 255 / 48%);background:#000}
h1{font-family:'Cormorant Garamond',serif;font-size:clamp(2.25rem,5vw,4.2rem);font-weight:500;line-height:1}
p{font-size:2rem;font-weight:500;line-height:1}

.hero-nav{position:fixed;left:50%;top:clamp(.9rem,4.8vh,2.8rem);transform:translateX(-50%);width:min(1625px,calc(100% - 2.7rem));min-height:3.5rem;border-radius:16px;border:1px solid rgb(255 255 255 / 10%);background:rgb(24 24 26 / 28%);backdrop-filter:blur(18px) saturate(140%);-webkit-backdrop-filter:blur(18px) saturate(140%);box-shadow:inset 0 1px 0 rgb(255 255 255 / 12%);display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.45rem .6rem .45rem 1rem;z-index:9999;will-change:transform,width}
.hero-logo{font-family:'Cormorant Garamond',serif;font-size:1.62rem;font-weight:700;letter-spacing:.02em;color:rgb(255 255 255 / 92%);text-decoration:none}
.hero-links{display:flex;gap:1.4rem}
.hero-links a,.hero-links :deep(a){color:rgb(255 255 255 / 84%);text-decoration:none;font-size:.9rem;transition:opacity .25s ease}
.hero-links a:hover,.hero-links :deep(a:hover){opacity:.65}
.hero-cta{border:0;border-radius:12px;background:#d7d7d7;color:#111;font-weight:700;font-size:.84rem;padding:.68rem 1.3rem;cursor:pointer;transition:background-color .22s ease}
.hero-cta:hover{background:#ececec}

.hero{height:200svh;padding:0;z-index:1}
.hero-inner{position:sticky;top:0;height:100svh;display:flex;align-items:center;justify-content:center}
.hero-frame{position:relative;width:min(1725px,calc(100% - 2.9rem));height:min(94svh,1060px);border-radius:16px;overflow:hidden;box-shadow:0 24px 80px rgb(0 0 0 / 40%);transform-origin:50% 50%;--hero-dark:0;will-change:transform}
.hero-frame::before{content:'';position:absolute;inset:-35%;pointer-events:none;z-index:1;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.62' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)'/%3E%3C/svg%3E");background-size:180px 180px;mix-blend-mode:soft-light;opacity:.16;filter:contrast(135%) brightness(108%);animation:filmGrainMove 1.2s steps(4,end) infinite,filmGrainFlicker 2.4s ease-in-out infinite alternate}
.hero-frame::after{content:'';position:absolute;inset:0;pointer-events:none;z-index:2;background:linear-gradient(to bottom,rgb(0 0 0 / calc(var(--hero-dark) * .45)) 0%,rgb(0 0 0 / var(--hero-dark)) 100%),radial-gradient(circle at 52% 40%,rgb(255 255 255 / 3%) 0%,rgb(0 0 0 / calc(22% + var(--hero-dark) * 62%)) 92%)}
.hero-media,.hero-copy,.hero-tip{position:absolute}.hero-media{inset:0;z-index:0}.hero-media img{transform:scale(1.24);transform-origin:50% 50%;will-change:transform}
.hero-copy{left:50%;top:51%;transform:translate(-50%,-50%);text-align:center;width:min(760px,90%);text-shadow:0 8px 32px rgb(0 0 0 / 35%);z-index:3}
.hero-copy h1{font-size:clamp(2.2rem,6.3vw,4.35rem);color:rgb(245 245 245 / 98%)}
.hero-copy p{margin-top:.5rem;font-family:'Cormorant Garamond',serif;font-size:clamp(1.05rem,2vw,1.45rem);color:rgb(255 255 255 / 84%)}
.hero-tip{left:50%;bottom:2.4rem;transform:translateX(-50%);font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:rgb(255 255 255 / 70%);z-index:3}

@keyframes filmGrainMove{0%{transform:translate3d(0,0,0)}15%{transform:translate3d(-1.2%,-.8%,0)}30%{transform:translate3d(.9%,.7%,0)}45%{transform:translate3d(-.8%,1.1%,0)}60%{transform:translate3d(1.1%,-.6%,0)}75%{transform:translate3d(-.7%,-1%,0)}90%{transform:translate3d(.8%,.6%,0)}100%{transform:translate3d(0,0,0)}}
@keyframes filmGrainFlicker{0%{opacity:.12}50%{opacity:.18}100%{opacity:.16}}

.intro,.outro{min-height:100svh;text-align:center;align-content:center;z-index:4;background-color:#000;background-image:radial-gradient(circle at 1px 1px,rgb(255 255 255 / 8%) 1px,transparent 0);background-size:18px 18px}
.site-footer{padding:1.4rem 2rem 2.2rem;text-align:center;font-size:.82rem;letter-spacing:.04em;color:rgb(255 255 255 / 48%);background:#000}
.intro{min-height:100svh;margin-top:-100svh;padding:2rem 2rem 4.2rem;display:flex;flex-direction:column;justify-content:flex-end;align-items:center}
.intro h1,.outro h1{width:min(900px,92%);margin:0 auto;color:rgb(255 255 255 / 90%)}
.intro-poster{width:min(560px,88vw);height:auto;display:block;margin:0 auto 1.6rem;border-radius:10px;opacity:.95}
.intro-text{width:min(980px,94%);margin:0 auto;font-family:'Cormorant Garamond',serif;font-size:clamp(1.28rem,2.25vw,2rem);line-height:1.2;color:rgb(255 255 255 / 88%)}
.intro-sub{margin-top:1.9rem;font-family:'Manrope',sans-serif;font-size:clamp(.82rem,1.1vw,.96rem);line-height:1.45;letter-spacing:.04em;color:rgb(255 255 255 / 70%)}

.sticky{min-height:100svh;display:flex;justify-content:center;align-items:center}
.sticky-header{position:absolute;top:20%;left:50%;transform:translate(-50%,-50%)}
.sticky-header h1{text-align:center;will-change:transform,opacity;transform:translateY(40px);opacity:0}
.card-container{position:relative;width:75%;display:flex;perspective:1000px;transform:translateY(40px);will-change:width}
.card{position:relative;flex:1;aspect-ratio:5/7;transform-style:preserve-3d;transform-origin:top;transform:translateZ(0)}
.card + .card{margin-left:-3px}
#card-1{border-radius:20px 0 0 20px}#card-3{border-radius:0 20px 20px 0}
.card-front,.card-back{position:absolute;width:100%;height:100%;backface-visibility:hidden;border-radius:inherit;overflow:hidden}
.card-front{background-size:calc(300% + 14px) auto;background-repeat:no-repeat;background-position:center;transform:translateZ(.1px)}
.card-front-1{background-position:calc(0% - 5px) 50%}
.card-front-2{background-position:50% 50%}
.card-front-3{background-position:calc(100% + 5px) 50%}
.card-back{display:flex;justify-content:center;align-items:center;text-align:center;transform:rotateY(180deg);padding:2rem}
.card-back-image{padding:0}
.card-back-image img{width:100%;height:100%;object-fit:fill;display:block}
#card-1 .card-back:not(.card-back-image){background:var(--card-1);color:#fff}#card-2 .card-back:not(.card-back-image){background:var(--card-2);color:#fff}#card-3 .card-back:not(.card-back-image){background:var(--card-3);color:#fff}

@media (max-width:1000px){
.hero-nav{width:calc(100% - 1.5rem);padding-inline:.8rem .45rem;min-height:3.15rem}
.hero-links{display:none}.hero-cta{font-size:.68rem;padding:.58rem .85rem}
.hero-frame{width:calc(100% - 1.4rem);height:63svh;border-radius:16px}
.intro{margin-top:-56svh;padding:1.2rem 1.2rem 2.6rem;justify-content:flex-end}
.intro-poster{width:min(420px,88vw);margin-bottom:1rem}
.intro-text{font-size:clamp(1.1rem,4.6vw,1.62rem)}
.intro-sub{font-size:clamp(.76rem,2.8vw,.9rem);margin-top:1.5rem}
.intro h1,.outro h1{width:100%}
.sticky{min-height:max-content;padding:4rem 2rem;flex-direction:column}
.sticky-header{position:relative;top:0;left:0;transform:none;margin-bottom:3rem}
.sticky-header h1{opacity:1;transform:none}
.card-container{width:100%;flex-direction:column;gap:2rem}
.card + .card{margin-left:0}
.card{width:100%;max-width:400px;margin:0 auto;border-radius:20px!important}
#card-1,#card-2,#card-3,.card-back{transform:none}
}

:global(html::-webkit-scrollbar),:global(body::-webkit-scrollbar){width:6px!important;background:#000!important}
:global(html::-webkit-scrollbar-thumb),:global(body::-webkit-scrollbar-thumb){background-color:#444!important;border-radius:10px!important}
:global(html::-webkit-scrollbar-thumb:hover),:global(body::-webkit-scrollbar-thumb:hover){background-color:#777!important}
:global(html),:global(body){scrollbar-width:thin!important;scrollbar-color:#444 #000!important}
</style>
