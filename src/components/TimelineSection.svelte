<script lang="ts">
  let activeIndex = $state(0);
  let container: HTMLUListElement;
  let elements: HTMLLIElement[] = $state([]);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  $effect(() => {
    if (!container) return;

    const navObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries.find((e) => e.isIntersecting);
        if (entry) {
          const index = elements.indexOf(entry.target as HTMLLIElement);
          if (index !== -1) activeIndex = index;
        }
      },
      { root: container, threshold: 0.75 }
    );

    elements.forEach((el) => el && navObserver.observe(el));

    const handleHeaderClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'H3' && target.closest('.timeline-block')) {
        scrollToTop();
      }
    };

    document.addEventListener('click', handleHeaderClick);

    return () => {
      navObserver.disconnect();
      document.removeEventListener('click', handleHeaderClick);
    };
  });

  function goPrevious() {
    if (activeIndex > 0) {
      elements[activeIndex - 1].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }

  function goNext() {
    if (activeIndex < elements.length - 1) {
      elements[activeIndex + 1].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }

  const dates = ["9-8", "9-15", "9-22", "9-29", "10-6", "10-20", "10-27", "11-10", "12-8", "Winter Inbetweens", "3-5", "3-26", "Spring Break", "4-9"];
</script>

<nav class="timeline-nav paper_pattern">
  <div class="nav-header">
    <h2>Timeline</h2>
    <div class="nav-btns">
      <button onclick={goPrevious} disabled={activeIndex === 0} aria-label="Previous">
          <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="currentColor">
            <path d="M560.67-240 320-480.67l240.67-240.66L608-674 414.67-480.67 608-287.33 560.67-240Z"/>
          </svg>
      </button>
      <button onclick={goNext} disabled={activeIndex === elements.length - 1} aria-label="Next">
          <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="currentColor">
            <path d="M521.33-480.67 328-674l47.33-47.33L616-480.67 375.33-240 328-287.33l193.33-193.34Z"/>
          </svg>
      </button>
    </div>
  </div>
  
  <ul bind:this={container}>
    {#each dates as date, i}
      <li bind:this={elements[i]}>
        <a href="#{date.toLowerCase().replace(' ', '-')}" class={activeIndex === i ? 'active' : ''}>
          {date.replace('-', '/')}
        </a>
      </li>
    {/each}
  </ul>
</nav>

<div class="timeline-content">
  <section id="9-8" class="timeline-block">
    <h3>9/8</h3>
    <div class="img_grid">
      <img src="/timeline/9-8_1.jpg" alt="" width="300" height="300" loading="lazy" />
    </div>
  </section>

  <section id="9-15" class="timeline-block">
    <h3>9/15</h3>
    <div class="img_grid">
      <img src="/timeline/9-15_1.jpg" alt="" width="300" height="300" loading="lazy" />
    </div>
  </section>

  <section id="9-22" class="timeline-block">
    <h3>9/22</h3>
    <div class="img_grid">
      <img src="/timeline/9-22_1.JPG" alt="" width="300" height="300" loading="lazy" />
    </div>
  </section>

  <section id="9-29" class="timeline-block">
    <h3>9/29</h3>
    <div class="img_grid">
      <img src="/timeline/9-29_1.JPG" alt="" width="300" height="300" loading="lazy" />
      <img src="/timeline/9-29_2.JPG" alt="" width="300" height="300" loading="lazy" />
      <img src="/timeline/9-29_3.JPG" alt="" width="300" height="300" loading="lazy" />
      <img src="/timeline/9-29_4.JPG" alt="" width="300" height="300" loading="lazy" />
    </div>
  </section>

  <section id="10-6" class="timeline-block">
    <h3>10/6</h3>
    <div class="img_grid">
      <img src="/timeline/10-6_1.jpg" alt="" width="300" height="300" loading="lazy" />
      <img src="/timeline/10-6_2.JPG" alt="" width="300" height="300" loading="lazy" />
      <img src="/timeline/10-6_3.jpg" alt="" width="300" height="300" loading="lazy" />
      <img src="/timeline/10-6_4.JPG" alt="" width="300" height="300" loading="lazy" />
    </div>
  </section>

  <section id="10-20" class="timeline-block">
    <h3>10/20</h3>
    <div class="img_grid">
      <video controls width="300" height="auto" muted>
        <source src="/timeline/10-20_1.webm" type="video/webm" />
      </video>
    </div>
  </section>

  <section id="10-27" class="timeline-block">
    <h3>10/27</h3>
    <div class="img_grid">
      <img src="/timeline/10-27_1.JPG" alt="" width="300" height="300" loading="lazy" />
      <img src="/timeline/10-27_2.JPG" alt="" width="300" height="300" loading="lazy" />
      <img src="/timeline/10-27_3.JPG" alt="" width="300" height="300" loading="lazy" />
    </div>
  </section>

  <section id="11-10" class="timeline-block">
    <h3>11/10</h3>
    <div class="img_grid">
      <img src="/timeline/11-10_1.jpg" alt="" width="300" height="300" loading="lazy" />
      <img src="/timeline/11-10_2.JPG" alt="" width="300" height="300" loading="lazy" />
      <img src="/timeline/11-10_3.JPG" alt="" width="300" height="300" loading="lazy" />
    </div>
  </section>

  <section id="12-8" class="timeline-block">
    <h3>12/8</h3>
    <div class="img_grid">
      <img src="/timeline/12-8_1.JPG" alt="" width="300" height="300" loading="lazy" />
      <img src="/timeline/12-8_2.JPG" alt="" width="300" height="300" loading="lazy" />
      <img src="/timeline/12-8_3.jpg" alt="" width="300" height="300" loading="lazy" />
      <img src="/timeline/12-8_4.jpg" alt="" width="300" height="300" loading="lazy" />
    </div>
  </section>

  <section id="winter-inbetweens" class="timeline-block">
    <h3>Winter Inbetweens</h3>
    <div class="img_grid">
      <img src="/timeline/winter_1.jpg" alt="" width="300" height="300" loading="lazy" />
      <img src="/timeline/winter_2.jpg" alt="" width="300" height="300" loading="lazy" />
      <img src="/timeline/winter_3.JPG" alt="" width="300" height="300" loading="lazy" />
      <img src="/timeline/winter_4.jpg" alt="" width="300" height="300" loading="lazy" />
    </div>
  </section>

  <section id="3-5" class="timeline-block">
    <h3>3/5</h3>
    <div class="img_grid">
      <img src="/timeline/z_3-5_1.png" alt="" width="300" height="300" loading="lazy" />
      <img src="/timeline/z_3-5_2.jpg" alt="" width="300" height="300" loading="lazy" />
      <img src="/timeline/z_3-5_3.png" alt="" width="300" height="300" loading="lazy" />
    </div>
  </section>

  <section id="3-26" class="timeline-block">
    <h3>3/26</h3>
    <div class="img_grid">
      <img src="/timeline/z_3-26_1.png" alt="" width="300" height="300" loading="lazy" />
      <img src="/timeline/z_3-26_2.png" alt="" width="300" height="300" loading="lazy" />
      <img src="/timeline/z_3-26_3.png" alt="" width="300" height="300" loading="lazy" />
    </div>
  </section>

  <section id="spring-break" class="timeline-block">
    <h3>Spring Break</h3>
    <div class="img_grid">
      <img src="/timeline/z_spring_1.jpg" alt="" width="300" height="300" loading="lazy" />
      <img src="/timeline/z_spring_2.jpg" alt="" width="300" height="300" loading="lazy" />
    </div>
  </section>

  <section id="4-9" class="timeline-block">
    <h3>4/9</h3>
    <div class="img_grid">
      <img src="/timeline/zz_4-9_1.jpg" alt="" width="300" height="300" loading="lazy" />
      <img src="/timeline/zz_4-9_2.jpg" alt="" width="300" height="300" loading="lazy" />
      <img src="/timeline/zz_4-9_3.jpg" alt="" width="300" height="300" loading="lazy" />
    </div>
  </section>
</div>

<style>
  .timeline-nav {
    position: sticky;
    top: 3.5rem;
    z-index: 50;
    /* Removed background - paper_pattern handles it */
    border-bottom: 1px solid var(--color-paper-content);
    padding-bottom: 0.25rem;
  }

  .nav-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.25rem 1rem;
  }

  .nav-header h2 {
    margin: 0;
    font-size: 1.25rem;
  }

  .nav-btns {
    display: flex;
    gap: 0.25rem;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-paper-content);
    display: flex;
    align-items: center;
    padding: 0;
  }

  button:disabled {
    opacity: 0.1;
  }

  .timeline-nav ul {
    display: flex;
    flex-flow: row nowrap;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
  }

  .timeline-nav ul li {
    flex: 0 0 100%;
    text-align: center;
    scroll-snap-align: center;
  }

  .timeline-nav ul li a {
    display: block;
    text-decoration: none;
    color: var(--color-paper-content);
    opacity: 0.3;
  }

  .timeline-nav ul li a.active {
    opacity: 1;
    text-decoration: underline;
  }

  .timeline-block {
    padding: 4rem 1rem;
    scroll-margin-top: 120px;
    max-width: 1000px;
    margin: 0 auto;
  }

  .img_grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-top: 1rem;
  }

  .img_grid img, .img_grid video {
    width: 100%;
    max-width: 500px;
    height: auto;
    aspect-ratio: 1/1;
    object-fit: cover;
    border: 1px solid var(--color-paper-content);
    border-radius: 0;
  }

  @media (min-width: 700px) {
    .timeline-nav ul li {
      flex: 0 0 33.33%;
    }

    .img_grid {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>