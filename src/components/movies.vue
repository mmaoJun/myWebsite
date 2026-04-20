<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

const pageRoot = ref(null)
const isMobileView = window.matchMedia('(max-width: 1000px)').matches
const movieFiles = [
  'p1086352249.jpg',
  'p1633113220.jpg',
  'p1903379979.jpg',
  'p2158166535.jpg',
  'p2180085848.jpg',
  'p2236181653.jpg',
  'p2361744534.jpg',
  'p2411622421.jpg',
  'p2497136132.jpg',
  'p2501864539.webp',
  'p2514384773.jpg',
  'p2516914607.jpg',
  'p2520095279.jpg',
  'p2545561196.jpg',
  'p2557573348.jpg',
  'p2558022335.jpg',
  'p2568288336.jpg',
  'p2570235120.jpg',
  'p2597979873.jpg',
  'p2614988097.jpg',
  'p2868462052.jpg',
  'p2887641712.jpg',
  'p2888332880.jpg',
  'p2905896429.jpg',
  'p2910701461.jpg',
  'p2923537864.jpg',
  'p2925885108.webp',
  'p2926962070.jpg',
  'p616779645.jpg',
]

const movieInfoMap = {
  'p1086352249.jpg': { title: '第九区', meta: '南非/美国 · 2009', quote: '我们不该这样对待他们。' },
  'p1633113220.jpg': { title: '杀人回忆', meta: '韩国 · 2003', quote: '直到最后，我还是不知道他是谁。' },
  'p1903379979.jpg': { title: '新世界', meta: '韩国 · 2013', quote: '要么成为怪物，要么被怪物吃掉。' },
  'p2158166535.jpg': { title: '辩护人', meta: '韩国 · 2013', quote: '国家即人民。' },
  'p2180085848.jpg': { title: '阿凡达', meta: '美国 · 2009', quote: 'I see you.' },
  'p2236181653.jpg': { title: '疯狂的麦克斯4', meta: '澳大利亚/美国 · 2015', quote: 'What a day! What a lovely day!' },
  'p2361744534.jpg': { title: '大鱼海棠', meta: '中国 · 2016', quote: '你总是在跑，每次看到你跑，我就感觉很好。' },
  'p2411622421.jpg': { title: '降临', meta: '美国 · 2016', quote: '如果你能看见你的一生，你会改变什么吗？' },
  'p2497136132.jpg': { title: '声之形', meta: '日本 · 2016', quote: '活着，本身就已经很了不起了。' },
  'p2501864539.webp': { title: '银翼杀手2049', meta: '美国/英国/加拿大 · 2017', quote: 'All the best memories are hers.' },
  'p2514384773.jpg': { title: '现在去见你', meta: '韩国 · 2018', quote: '没关系，下雨的时候我会再回来。' },
  'p2516914607.jpg': { title: '湮灭', meta: '美国/英国 · 2018', quote: '几乎没有人会真的想要自我毁灭，但我们都在一点点自毁。' },
  'p2520095279.jpg': { title: '燃烧', meta: '韩国 · 2018', quote: '有些人就像从未存在过一样消失。' },
  'p2545561196.jpg': { title: '朝花夕拾', meta: '中国香港 · 1987', quote: '有些记忆，一旦错过就回不去了。' },
  'p2557573348.jpg': { title: '千与千寻', meta: '日本 · 2001', quote: '曾经发生过的事不可能忘记，只是想不起来了。' },
  'p2558022335.jpg': { title: '天气之子', meta: '日本 · 2019', quote: '天气什么的，就让它狂暴吧。' },
  'p2568288336.jpg': { title: '罗小黑战记', meta: '中国 · 2019', quote: '愿你一生努力，一生被爱。' },
  'p2570235120.jpg': { title: '阳光普照', meta: '中国台湾 · 2019', quote: '有光的地方就有阴影。' },
  'p2597979873.jpg': { title: '无间道', meta: '中国香港 · 2002', quote: '出来混，迟早要还的。' },
  'p2614988097.jpg': { title: '星际穿越', meta: '美国/英国 · 2014', quote: '爱是唯一能超越时空维度的东西。' },
  'p2868462052.jpg': { title: '花束般的恋爱', meta: '日本 · 2021', quote: '喜欢是会枯萎的，但记忆不会。' },
  'p2887641712.jpg': { title: '铃芽之旅', meta: '日本 · 2022', quote: '我喜欢这个有你的世界。' },
  'p2888332880.jpg': { title: '余生那些年', meta: '日本 · 2022', quote: '就算明天见不到你，今天也要好好喜欢你。' },
  'p2905896429.jpg': { title: '破墓', meta: '韩国 · 2024', quote: '埋下去的，不一定会安静。' },
  'p2910701461.jpg': { title: '你的名字', meta: '日本 · 2016', quote: '我一直在寻找，不知何处的你。' },
  'p2923537864.jpg': { title: '罗小黑战记2', meta: '中国 · 2025', quote: '你想守护的东西，就是你变强的理由。' },
  'p2925885108.webp': { title: '无可奈何', meta: '韩国 · 2025', quote: '我们都在命运面前，学着体面地无可奈何。' },
  'p2926962070.jpg': { title: '当男人恋爱时', meta: '中国台湾 · 2021', quote: '我没有什么本事，但我会对你好。' },
  'p616779645.jpg': { title: '教父', meta: '美国 · 1972', quote: 'I’m gonna make him an offer he can’t refuse.' },
}

const cardColorMap = {
  'p1086352249.jpg': '#39ff14',
  'p1633113220.jpg': '#ff5a1f',
  'p1903379979.jpg': '#ff1744',
  'p2158166535.jpg': '#ff3d00',
  'p2180085848.jpg': '#00b0ff',
  'p2236181653.jpg': '#ff6d00',
  'p2361744534.jpg': '#00e5ff',
  'p2411622421.jpg': '#6a00ff',
  'p2497136132.jpg': '#ff2e88',
  'p2501864539.webp': '#7c4dff',
  'p2514384773.jpg': '#ff4081',
  'p2516914607.jpg': '#651fff',
  'p2520095279.jpg': '#ff1744',
  'p2545561196.jpg': '#ff6f00',
  'p2557573348.jpg': '#00c853',
  'p2558022335.jpg': '#00b8d4',
  'p2568288336.jpg': '#00e676',
  'p2570235120.jpg': '#ffd600',
  'p2597979873.jpg': '#ff3d00',
  'p2614988097.jpg': '#2962ff',
  'p2868462052.jpg': '#ff2d55',
  'p2887641712.jpg': '#ff6ec7',
  'p2888332880.jpg': '#ff5e57',
  'p2905896429.jpg': '#d50000',
  'p2910701461.jpg': '#7c4dff',
  'p2923537864.jpg': '#00c853',
  'p2925885108.webp': '#ff1744',
  'p2926962070.jpg': '#ff7043',
  'p616779645.jpg': '#ffab00',
}

const glassTheme = {
  titleColor: '#ffffff',
  metaColor: 'rgb(255 255 255 / 88%)',
  glow: 'rgb(255 255 255 / 20%)',
}

const movieCards = computed(() =>
  movieFiles.map((file, idx) => {
    const info = movieInfoMap[file]
    return {
      src: `/media-movies/${file}`,
      title: info?.title ?? file.replace(/\.[^.]+$/, ''),
      meta: info?.meta ?? '地区 · 年份',
      quote: info?.quote ?? '有些电影台词，会陪你很久。',
      bg: cardColorMap[file] ?? '#ff2d55',
      titleColor: glassTheme.titleColor,
      metaColor: glassTheme.metaColor,
      glow: glassTheme.glow,
    }
  }),
)

const backgroundQuotes = [
  { text: '"May the Force be with you."', top: '7%', left: '6%', rotate: '-10deg', opacity: 0.2, color: '#ff2d55' },
  { text: '"I\'ll be back."', top: '13%', left: '58%', rotate: '8deg', opacity: 0.18, color: '#ff6a00' },
  { text: '「生きろ。」', top: '22%', left: '12%', rotate: '-6deg', opacity: 0.2, color: '#7b2cff' },
  { text: '"국가란 국민입니다."', top: '28%', left: '63%', rotate: '-11deg', opacity: 0.2, color: '#00b8ff' },
  { text: '"I see you."', top: '37%', left: '5%', rotate: '6deg', opacity: 0.22, color: '#00c853' },
  { text: '「君の名は。」', top: '44%', left: '53%', rotate: '-4deg', opacity: 0.18, color: '#ff006e' },
  { text: '"To infinity and beyond!"', top: '54%', left: '16%', rotate: '-9deg', opacity: 0.17, color: '#06d6a0' },
  { text: '"아직 끝난 게 아니야."', top: '61%', left: '60%', rotate: '10deg', opacity: 0.21, color: '#3a86ff' },
  { text: '「まだだ、まだ終わらんよ。」', top: '70%', left: '8%', rotate: '5deg', opacity: 0.16, color: '#ff3b30' },
  { text: '"I\'m gonna make him an offer he can\'t refuse."', top: '77%', left: '50%', rotate: '-12deg', opacity: 0.15, color: '#ffd60a' },
  { text: '"가자, 끝까지."', top: '84%', left: '11%', rotate: '6deg', opacity: 0.18, color: '#00c853' },
  { text: '"All those moments will be lost in time."', top: '88%', left: '56%', rotate: '-7deg', opacity: 0.16, color: '#ff2d55' },
]

let lenis = null
let tickerFn = null
let cardsTrigger = null

onMounted(() => {
  lenis = new Lenis({
    lerp: isMobileView ? 0.12 : 0.075,
    smoothWheel: true,
    wheelMultiplier: isMobileView ? 0.7 : 0.9,
    touchMultiplier: isMobileView ? 0.72 : 0.95,
  })
  lenis.on('scroll', ScrollTrigger.update)

  tickerFn = (time) => {
    lenis?.raf(time * 1000)
  }
  gsap.ticker.add(tickerFn)
  gsap.ticker.lagSmoothing(0)

  const cards = pageRoot.value?.querySelectorAll('.sticky-cards .card') || []
  const totalCards = cards.length
  if (!totalCards) return

  const segmentSize = 1 / totalCards
  const cardYOffset = isMobileView ? 2.2 : 3.6
  const cardScaleStep = isMobileView ? 0.038 : 0.06
  const maxVisibleBehind = isMobileView ? 3 : 5
  const exitYPercent = isMobileView ? -185 : -250
  const exitRotation = isMobileView ? 16 : 35

  cards.forEach((card, i) => {
    gsap.set(card, {
      xPercent: -50,
      yPercent: -50 + i * cardYOffset,
      scale: 1 - i * cardScaleStep,
      zIndex: totalCards - i,
      autoAlpha: i <= maxVisibleBehind ? 1 : 0,
      force3D: true,
    })
  })

  cardsTrigger = ScrollTrigger.create({
    trigger: pageRoot.value?.querySelector('.sticky-cards'),
    start: 'top top',
    end: `+=${window.innerHeight * (isMobileView ? 5.8 : 7.2)}px`,
    pin: true,
    pinSpacing: true,
    scrub: isMobileView ? 0.28 : 0.48,
    onUpdate: (self) => {
      const progress = self.progress
      const activeIndex = Math.min(Math.floor(progress / segmentSize), totalCards - 1)
      const segProgress = (progress - activeIndex * segmentSize) / segmentSize

      cards.forEach((card, i) => {
        if (i < activeIndex) {
          gsap.set(card, {
            yPercent: exitYPercent,
            rotationX: exitRotation,
            autoAlpha: 0,
          })
        } else if (i === activeIndex) {
          gsap.set(card, {
            yPercent: gsap.utils.interpolate(-50, -200, segProgress),
            rotationX: gsap.utils.interpolate(0, exitRotation, segProgress),
            scale: 1,
            autoAlpha: 1,
          })
        } else {
          const behindIndex = i - activeIndex
          const currentYOffset = (behindIndex - segProgress) * cardYOffset
          const currentScale = 1 - (behindIndex - segProgress) * cardScaleStep
          const isVisible = behindIndex <= maxVisibleBehind

          gsap.set(card, {
            yPercent: -50 + currentYOffset,
            rotationX: 0,
            scale: currentScale,
            autoAlpha: isVisible ? 1 : 0,
          })
        }
      })
    },
  })
})

onBeforeUnmount(() => {
  cardsTrigger?.kill()
  if (tickerFn) gsap.ticker.remove(tickerFn)
  lenis?.destroy()
})
</script>

<template>
  <main ref="pageRoot" class="movies-page">
    <section class="intro">
      <h1>Enter the Frame</h1>
    </section>

    <section class="sticky-cards">
      <div class="bg-quotes" aria-hidden="true">
        <span
          v-for="(item, idx) in backgroundQuotes"
          :key="`bg-quote-${idx}`"
          class="bg-quote"
          :style="{
            top: item.top,
            left: item.left,
            transform: `rotate(${item.rotate})`,
            opacity: item.opacity,
            color: item.color,
          }"
        >{{ item.text }}</span>
      </div>
      <div
        class="card"
        v-for="(item, idx) in movieCards"
        :key="item.src"
        :style="{ '--card-bg': item.bg, '--title-color': item.titleColor, '--meta-color': item.metaColor, '--card-glow': item.glow }"
      >
        <div class="poster-wrap">
          <img :src="item.src" :alt="item.title" />
        </div>
        <h1 class="movie-title">{{ item.title }}</h1>
        <p class="movie-quote">“{{ item.quote }}”</p>
        <p class="movie-meta">{{ item.meta }}</p>
      </div>
    </section>

    <section class="outro">
      <h1>Loop Complete</h1>
    </section>
  </main>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap");
@import url("https://fonts.cdnfonts.com/css/druk-wide-bold");

.movies-page * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.movies-page img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.movies-page section {
  position: relative;
  width: 100%;
  height: 100svh;
  overflow: hidden;
}

.movies-page .intro,
.movies-page .outro {
  display: flex;
  justify-content: center;
  align-items: center;
}

.movies-page .intro h1,
.movies-page .outro h1 {
  text-transform: uppercase;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 3rem;
  font-weight: 800;
  line-height: 1;
}

.movies-page .sticky-cards {
  background-color: #fff;
  perspective: 850px;
}

.movies-page .bg-quotes {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.movies-page .bg-quote {
  position: absolute;
  display: inline-block;
  max-width: 58vw;
  font-family: "Microsoft YaHei", "Segoe UI", "Yu Gothic", "Malgun Gothic", sans-serif;
  font-weight: 700;
  font-size: clamp(2.2rem, 5.2vw, 4.8rem);
  letter-spacing: 0.01em;
  line-height: 1.08;
  filter: blur(0.2px);
  user-select: none;
}

.movies-page .sticky-cards .card {
  --card-side-gap: 2rem;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 65%;
  height: 66%;
  display: grid;
  place-items: center;
  padding: 1.6rem;
  border-radius: 1rem;
  color: #fff;
  transform-origin: center bottom;
  transform-style: preserve-3d;
  will-change: transform, opacity;
  contain: layout paint;
  overflow: hidden;
  background: var(--card-bg);
  border: 1px solid rgb(255 255 255 / 22%);
  box-shadow:
    0 24px 58px rgb(0 0 0 / 22%),
    inset 0 1px 0 rgb(255 255 255 / 20%),
    0 0 0 1px rgb(0 0 0 / 6%);
}

.movies-page .sticky-cards .card::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(140deg, rgb(255 255 255 / 34%) 0%, rgb(255 255 255 / 4%) 36%),
    radial-gradient(circle at 14% 8%, var(--card-glow) 0%, rgb(255 255 255 / 0%) 44%);
}

.movies-page .sticky-cards .card::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  border: 1px solid rgb(255 255 255 / 18%);
  transform: translateZ(8px);
}

.movies-page .poster-wrap {
  position: absolute;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%) translateZ(20px);
  height: calc(100% - 3.2rem);
  aspect-ratio: 2 / 3;
  border-radius: 0.8rem;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 34%);
  box-shadow:
    0 22px 46px rgb(0 0 0 / 42%),
    0 0 22px rgb(255 255 255 / 16%),
    inset 0 1px 0 rgb(255 255 255 / 36%);
}

.movies-page .movie-title {
  position: absolute;
  left: var(--card-side-gap);
  top: 1.55rem;
  z-index: 2;
  width: calc(100% - var(--card-side-gap) - (2rem + ((100% - 3.2rem) * 2 / 3)));
  display: block;
  text-align: center;
  margin: 0;
  color: var(--title-color);
  text-shadow: 0 7px 26px rgb(0 0 0 / 46%);
  font-family: "Microsoft YaHei", "PingFang SC", "Noto Sans SC", sans-serif;
  font-size: clamp(2.55rem, 5.2vw, 4.8rem);
  font-weight: 700;
  line-height: 0.92;
  text-transform: none;
}

.movies-page .movie-quote {
  position: absolute;
  left: var(--card-side-gap);
  top: 50%;
  z-index: 2;
  width: calc(100% - var(--card-side-gap) - (2rem + ((100% - 3.2rem) * 2 / 3)));
  display: block;
  text-align: center;
  transform: translateY(-50%);
  margin: 0;
  color: rgb(28 36 52 / 88%);
  text-shadow: 0 4px 16px rgb(0 0 0 / 24%);
  font-family: "Microsoft YaHei", "PingFang SC", "Noto Sans SC", sans-serif;
  font-size: clamp(1.2rem, 1.95vw, 1.7rem);
  line-height: 1.42;
  letter-spacing: 0.005em;
}

.movies-page .movie-meta {
  position: absolute;
  left: var(--card-side-gap);
  bottom: 1.6rem;
  z-index: 2;
  text-align: left;
  color: var(--meta-color);
  text-shadow: 0 4px 18px rgb(0 0 0 / 45%);
  font-family: "Microsoft YaHei", "PingFang SC", "Noto Sans SC", sans-serif;
  font-size: 1rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  opacity: 0.95;
}

@media (max-width: 1000px) {
  .movies-page .sticky-cards {
    perspective: 620px;
  }

  .movies-page .bg-quote {
    max-width: 78vw;
    font-size: clamp(1.35rem, 6.4vw, 2.2rem) !important;
    opacity: 0.14 !important;
  }

  .movies-page .sticky-cards .card {
    --mobile-gap: 0.75rem;
    --card-side-gap: var(--mobile-gap);
    width: min(84vw, 360px);
    height: min(72svh, 620px);
    padding: var(--mobile-gap);
    border-radius: 0.9rem;
    display: grid;
    grid-template-rows: auto 1fr auto;
    align-items: center;
    justify-items: center;
    row-gap: var(--mobile-gap);
    box-shadow:
      0 14px 30px rgb(0 0 0 / 18%),
      inset 0 1px 0 rgb(255 255 255 / 24%);
  }

  .movies-page .poster-wrap {
    position: relative;
    left: auto;
    top: auto;
    right: auto;
    transform: none;
    width: min(62vw, 250px);
    height: auto;
    aspect-ratio: 2 / 3;
    border-radius: 0.68rem;
  }

  .movies-page .movie-title {
    position: relative;
    left: auto;
    top: auto;
    transform: none;
    width: 100%;
    text-align: center;
    font-size: clamp(1.42rem, 6.2vw, 2rem);
    line-height: 1;
    margin: 0;
  }

  .movies-page .movie-meta {
    position: relative;
    left: auto;
    bottom: auto;
    transform: none;
    width: 100%;
    text-align: center;
    font-size: 0.9rem;
    letter-spacing: 0.03em;
    margin: 0;
  }

  .movies-page .movie-quote {
    position: relative;
    left: auto;
    top: auto;
    transform: none;
    width: 100%;
    text-align: center;
    font-family: "Microsoft YaHei", "PingFang SC", "Noto Sans SC", sans-serif;
    font-size: 1.12rem;
    line-height: 1.44;
    margin: 0;
  }
}
</style>
