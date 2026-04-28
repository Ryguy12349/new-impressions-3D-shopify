<script lang="ts">
  let { h1 = "" } = $props();

  const imageMap = {
    main_img_1: "/pageHeads/index_header_img/index_header_ 1.webp",
    track_img_1: "/pageHeads/index_header_img/index_header_ 2.webp",
    track_img_2: "/pageHeads/index_header_img/index_header_ 3.webp",
    track_img_3: "/pageHeads/index_header_img/index_header_ 4.webp",
    track_img_4: "/pageHeads/index_header_img/index_header_ 5.webp",
    track_img_5: "/pageHeads/index_header_img/index_header_ 6.webp",
    track_img_6: "/pageHeads/index_header_img/index_header_ 7.webp",
    track_img_7: "/pageHeads/index_header_img/index_header_ 8.webp",
    track_img_8: "/pageHeads/index_header_img/index_header_ 9.webp",
    track_img_9: "/pageHeads/index_header_img/index_header_ 10.webp",
    track_img_10: "/pageHeads/index_header_img/index_header_ 11.webp",
    track_img_11: "/pageHeads/index_header_img/index_header_ 12.webp",
    track_img_12: "/pageHeads/index_header_img/index_header_ 13.webp",
    track_img_13: "/pageHeads/index_header_img/index_header_ 14.webp",
    track_img_14: "/pageHeads/index_header_img/index_header_ 15.webp",
    track_img_15: "/pageHeads/index_header_img/index_header_ 16.webp",
    track_img_16: "/pageHeads/index_header_img/index_header_ 17.webp",
    track_img_17: "/pageHeads/index_header_img/index_header_ 18.webp",
    track_img_18: "/pageHeads/index_header_img/index_header_ 19.webp",
    track_img_19: "/pageHeads/index_header_img/index_header_ 20.webp",
    track_img_20: "/pageHeads/index_header_img/index_header_ 21.webp",
    track_img_21: "/pageHeads/index_header_img/index_header_ 22.webp",
    track_img_22: "/pageHeads/index_header_img/index_header_ 23.webp"
  };

  const allTrackImages = Object.values(imageMap).slice(1);
  const shuffled = allTrackImages.sort(() => Math.random() - 0.5);

  const track1 = shuffled.slice(0, 11);
  const track2 = shuffled.slice(11);

  const rotations1 = track1.map(() => Math.floor(Math.random() * 10) - 5);
  const rotations2 = track2.map(() => Math.floor(Math.random() * 10) - 5);
</script>

<section id="hero">
  <div class="marquee_wrapper">
    <div class="conveyor marquee_left">
      {#each [0, 1, 2] as _}
        {#each track1 as src, i}
          <div class="img_container" style="transform: rotate({rotations1[i]}deg);">
            <img {src} alt="" loading="lazy" />
          </div>
        {/each}
      {/each}
    </div>
  </div>

  <div class="hero-center">
    <h1 id="hero-title">{h1}</h1>
    <img src={imageMap.main_img_1} alt="Featured" id="featured_img" />
  </div>

  <div class="marquee_wrapper wrapper_bottom">
    <div class="conveyor marquee_right">
      {#each [0, 1, 2] as _}
        {#each track2 as src, i}
          <div class="img_container" style="transform: rotate({rotations2[i]}deg);">
            <img {src} alt="" loading="lazy" />
          </div>
        {/each}
      {/each}
    </div>
  </div>
</section>

<style>
  #hero {
    height: 80vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;
    --track-speed: 60s; /* Slower speed for triple-track content */
  }

  .marquee_wrapper {
    position: absolute;
    top: 20px;
    width: 100vw; 
    left: 50%;
    transform: translateX(-50%);
    overflow: hidden;
    mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
    -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
    z-index: 5;
  }

  .wrapper_bottom {
    top: auto;
    bottom: 20px;
  }

  .conveyor {
    display: flex;
    width: max-content;
    will-change: transform;
  }

  .img_container {
    padding: 0.5rem 2rem;
    flex-shrink: 0;
  }

  .conveyor img {
    height: 50px;
    width: auto;
    display: block;
  }

  /* STRICT MATH FOR TRIPLE CLONE:
     Since we have 3 identical sets, moving -33.33% 
     swaps Set 1 for Set 2 perfectly.
  */
  .marquee_left { 
    animation: scrollLeft var(--track-speed) linear infinite; 
  }
  
  .marquee_right { 
    animation: scrollRight var(--track-speed) linear infinite; 
  }

  @keyframes scrollLeft {
    0% { transform: translate3d(0, 0, 0); }
    100% { transform: translate3d(-33.333%, 0, 0); }
  }

  @keyframes scrollRight {
    /* To start from the "middle", we start at the seam of the 2nd and 3rd set */
    0% { transform: translate3d(-33.333%, 0, 0); }
    100% { transform: translate3d(0, 0, 0); }
  }

  .hero-center {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    z-index: 20;
  }

  #hero-title {
    position: absolute;
    top: 5%;
    width: 100%;
    text-align: center;
    font-size: clamp(2rem, 12vw, 6rem);
    font-weight: bold;
    z-index: 25;
    pointer-events: none;
    color: var(--color-paper-content);
  }

  #featured_img {
    max-height: 45vh;
    width: auto;
    max-width: 90vw;
    object-fit: contain;
    z-index: 20;
  }

  @media (min-width: 701px) {
    #hero { height: 65vh; }
    .marquee_wrapper { width: 110vw; }
    .conveyor img { height: 85px; }
    #hero-title { font-size: clamp(5rem, 15vw, 10rem); }
  }

  @media (prefers-reduced-motion: reduce) {
    .conveyor { animation-play-state: paused; }
  }
</style>