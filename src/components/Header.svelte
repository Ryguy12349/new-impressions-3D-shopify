<script lang="ts">
  import { fade } from "svelte/transition";
  import { untrack } from "svelte"; 
  import CartIcon from "./cart/CartIcon.svelte";
  import { clickOutside } from "../utils/click-outside";
  import { isCartDrawerOpen } from "../stores/cart";

  let isOpen = $state(false);
  let firstLinkEl: HTMLAnchorElement | undefined = $state();

  function toggleMenu() {
    isOpen = !isOpen;

    if (isOpen) {
      isCartDrawerOpen.set(false);
    }
  }

  function closeMenu() {
    isOpen = false;
  }
  
  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      closeMenu();
    }
  }

  // --- RESTORED SIDE EFFECTS ---
  $effect(() => {
    if (isOpen) {
      // 1. Lock scroll
      document.body.classList.add('overflow-hidden');
      
      // 2. Move focus to the first link for accessibility
      // untrack prevents this effect from re-running if firstLinkEl changes
      untrack(() => {
        requestAnimationFrame(() => {
          setTimeout(() => firstLinkEl?.focus(), 60);
        });
      });
    } else {
      // 3. Unlock scroll when closed
      document.body.classList.remove('overflow-hidden');
    }

    // Cleanup: ensures scroll is unlocked if component is destroyed
    return () => {
      if (typeof document !== 'undefined') {
        document.body.classList.remove('overflow-hidden');
      }
    };
  });
</script>

{#if isOpen}
  <div
    transition:fade={{ duration: 300 }}
    onclick={closeMenu}
    id="backdrop"
    class="fixed inset-0 bg-slate-400/50 backdrop-blur-sm z-[80]"
    role=none
  ></div>
{/if}

<header class="paper_pattern relative z-[100]">
  <nav>
    <a href="/" class="logo transition-transform hover:scale-105">
      <img src="/Logo.png" alt="Home" />
    </a>

    <div id="cart-page-nav">
      <ul 
        id="page-nav" 
        class:open={isOpen} 
        class:paper_pattern={isOpen}
        tabindex="-1"
        use:clickOutside={closeMenu}
        onkeydown={onKeyDown}
        role="menu"
      >
        <li class="transition-transform hover:scale-105">
          <a bind:this={firstLinkEl} href="/about"><span class="page-nav-items">About</span></a>
        </li>
        <li class="transition-transform hover:scale-105"><a href="/letterpress"><span class="page-nav-items">Letterpress</span></a></li>
        <li class="transition-transform hover:scale-105"><a href="/typepieces"><span class="page-nav-items">Typepieces</span></a></li>
        <li class="transition-transform hover:scale-105"><a href="/documentation"><span class="page-nav-items">Documentation</span></a></li>
        <li class="transition-transform hover:scale-105"><a href="/shop"><span class="page-nav-items">Shop</span></a></li>
      </ul>

      <CartIcon bind:menuOpen={isOpen}/>

      <button 
        aria-label={isOpen ? "Close Page Menu" : "Open Page Menu"} 
        id="op-btn-page-nav" 
        type="button"
        class="relative z-[110] transition-transform hover:scale-105 flex items-center justify-center"
        onmousedown={(e) => { e.stopPropagation(); toggleMenu(); }}
        onkeydown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault(); // Stop the browser from trying to "click" it
            toggleMenu();
          }
        }}
      >
        {#if isOpen}
          <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#04040f">
            <path d="m251.33-204.67-46.66-46.66L433.33-480 204.67-708.67l46.66-46.66L480-526.67l228.67-228.66 46.66 46.66L526.67-480l228.66 228.67-46.66 46.66L480-433.33 251.33-204.67Z"/>
          </svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px">
            <path d="M120-240v-66.67h720V-240H120Zm0-206.67v-66.66h720v66.66H120Zm0-206.66V-720h720v66.67H120Z"/>
          </svg>
        {/if}
      </button>
    </div>
  </nav>
</header>

<style>
  header {
    position: sticky;
    top: 0;
    z-index: 100;
    border-bottom: 1px solid var(--color-paper-content);
  }

  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 1rem;
  }

  .logo{
    margin-bottom:0;
    width: fit-content;
  }

  .logo img {
    max-height: 2rem;
  }

  #page-nav {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  a {
    display: block;
    margin: 0;
    width: 100%;
  }

  .page-nav-items{
    width: 100%;
  }

  .page-nav-items:focus-within {
    outline: 1px solid var(--color-paper-content);
    outline-offset: 2px;
  }

  #cart-page-nav {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: .5rem;
  }

  li {
    list-style: none;
    width: 100%;
  }

  #op-btn-page-nav {
    display: none;
    fill: var(--color-paper-content);
    background: none;
    border: none;
    cursor: pointer;
  }

  @media (max-width: 820px) {
    #page-nav {
      position: fixed;
      z-index: 90;
      top: 3.5625rem; 
      right: 0;
      height: 100vh;
      width: 92.5vw;
      padding: 1rem;
      background-color: var(--color-paper-bg);
      border-left: 1px solid var(--color-paper-content);
      flex-direction: column;
      align-items: flex-start;
      display: none; 
    }

    #page-nav.open {
      display: flex !important;
      animation: slideIn 0.3s ease-in-out;
    }

    #op-btn-page-nav {
      display: flex !important;
    }
  }

  @keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
</style>
