<script>
  import { onMount, onDestroy } from 'svelte';

  let container;
  let p5Instance;
  let rotation = { x: 0, y: 0 };
  
  // Object to hold our 6 separate models
  let parts = {
    pink: null,
    green: null,
    yellow: null,
    red: null,
    blue: null,
    black: null
  };

  let activeDirs = new Set();
  const speed = 0.05;

  const keyMap = {
    ArrowUp: 'up', w: 'up',
    ArrowDown: 'down', s: 'down',
    ArrowLeft: 'left', a: 'left',
    ArrowRight: 'right', d: 'right'
  };

  onMount(async () => {
    const p5Lib = (await import('p5')).default;

    p5Instance = new p5Lib((p) => {
      p.setup = async () => {
        const rect = container.getBoundingClientRect();
        p.createCanvas(rect.width, rect.height * 0.7, p.WEBGL).parent(container);
        
        try {
            // Change pink to FALSE
            parts.pink = await p.loadModel('/new-impressions-letterpress_2.00_pink.obj', false);
            
            parts.green = await p.loadModel('/new-impressions-letterpress_2.00_green.obj', false);
            parts.yellow = await p.loadModel('/new-impressions-letterpress_2.00_yellow.obj', false);
            parts.red = await p.loadModel('/new-impressions-letterpress_2.00_red.obj', false);
            parts.blue = await p.loadModel('/new-impressions-letterpress_2.00_blue.obj', false);
            parts.black = await p.loadModel('/new-impressions-letterpress_2.00_black.obj', false);
        } catch (e) {
            console.error("Error loading 3D parts:", e);
        }
    };

      p.draw = () => {
        p.clear(); 
        p.noStroke();

        if (activeDirs.has('up')) rotation.x -= speed;
        if (activeDirs.has('down')) rotation.x += speed;
        if (activeDirs.has('left')) rotation.y -= speed;
        if (activeDirs.has('right')) rotation.y += speed;

        // Lighting
        p.ambientLight(120);
        p.pointLight(255, 255, 255, 0, -200, 400);
        
        p.camera(0, 0, 600, 0, 0, 0, 0, 1, 0);

        p.push();

        p.push();
        
        //USER ORBIT
        p.rotateX(rotation.x);
        p.rotateY(rotation.y);

        //GLOBAL SCALE & ORIENTATION
        p.scale(0.6); 
        p.rotateZ(p.PI); // Your upside-down fix

        // PIVOT POINT 
        p.translate(0, -100, 0); 

        //DRAWING THE PARTS
        // 1. PINK (#FF028F)
        if (parts.pink) {
          p.ambientMaterial(255, 2, 143);
          p.model(parts.pink);
        }

        // 2. GREEN (#0CFF00)
        if (parts.green) {
          p.ambientMaterial(12, 255, 0);
          p.model(parts.green);
        }

        // 3. YELLOW (#FFE800)
        if (parts.yellow) {
          p.ambientMaterial(255, 232, 0);
          p.model(parts.yellow);
        }

        // 4. RED (#FB0101)
        if (parts.red) {
          p.ambientMaterial(251, 1, 1);
          p.model(parts.red);
        }

        // 5. BLUE (#00DDFF)
        if (parts.blue) {
          p.ambientMaterial(0, 221, 255);
          p.model(parts.blue);
        }

        // 6. BLACK (#272628)
        if (parts.black) {
          p.ambientMaterial(39, 38, 40);
          p.model(parts.black);
        }

        p.pop();
      };

      p.windowResized = () => {
        const rect = container.getBoundingClientRect();
        p.resizeCanvas(rect.width, rect.height * 0.7);
      };
    });
  });

  const startAction = (dir) => activeDirs.add(dir);
  const stopAction = (dir) => activeDirs.delete(dir);

  const handleKeyDown = (e) => {
    if (keyMap[e.key]) {
      e.preventDefault();
      startAction(keyMap[e.key]);
    }
  };

  const handleKeyUp = (e) => {
    if (keyMap[e.key]) stopAction(keyMap[e.key]);
  };

  onDestroy(() => { if (p5Instance) p5Instance.remove(); });
</script>

<svelte:window on:keydown={handleKeyDown} on:keyup={handleKeyUp} />

<div class="main-section" bind:this={container}>
  <nav class="controls" aria-label="3D Model Rotation Controls">
    {#each ['up', 'down', 'left', 'right'] as dir}
      <button 
        on:pointerdown={() => startAction(dir)} 
        on:pointerup={() => stopAction(dir)}
        on:pointerleave={() => stopAction(dir)}
        on:contextmenu={(e) => e.preventDefault()} 
      >
        {dir}
      </button>
    {/each}
  </nav>
</div>

<style>
    .main-section {
    position: relative;
    width: 100%;
    height: clamp(500px, 80vh, 800px);
    background-color: #272628;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    touch-action: pan-y; 
  }

    :global(canvas) {
    display: block;
    margin-top: 0;
    pointer-events: none; 
  }

    .controls {
        position: absolute;
        bottom: 1rem;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10;
        display: grid;
        grid-template-areas: 
        ". up ."
        "left . right"
        ". down .";
        gap: 10px;
        pointer-events: auto;
        touch-action: none; 
    }

  button:nth-child(1) { grid-area: up; }
  button:nth-child(2) { grid-area: down; }
  button:nth-child(3) { grid-area: left; }
  button:nth-child(4) { grid-area: right; }

  button {
    width: 70px;
    height: 50px;
    background: transparent;
    color: #efefef;
    border: 1px solid #555;
    border-radius: .25rem;
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 1px;
    cursor: pointer;
    user-select: none;
    transition: all 0.2s ease;
  }

  button:active, button:focus {
    background: #efefef;
    color: #272628;
    outline: none;
  }

  @media (min-width: 1024px) {
    .controls {
       bottom: 2rem;
    }
  }
</style>