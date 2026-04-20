<template>
  <section class="about-page">
    <h1>About</h1>
    <p>Welcome to maoJun.</p>
    <p>382931184@qq.com</p>
  </section>
</template>

<style scoped>
.about-page {
  min-height: 100svh;
  display: grid;
  place-content: center;
  text-align: center;
  gap: 0.8rem;
  padding: 2rem;
  background: #000;
  color: #f5f5f5;
}

h1 {
  font-size: clamp(2rem, 4vw, 3.2rem);
  margin: 0;
}

p {
  margin: 0;
  color: rgb(255 255 255 / 72%);
}
</style>
