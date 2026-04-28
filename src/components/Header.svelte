<script lang="ts">
  import { fade } from "svelte/transition";
  import CartIcon from "./cart/CartIcon.svelte";
  import { clickOutside } from "../utils/click-outside";
  // 1. IMPORT THE CART STORE
  import { isCartDrawerOpen } from "../stores/cart";

  let isOpen = $state(false);
  let firstLinkEl: HTMLAnchorElement | undefined = $state();

  function toggleMenu() {
    isOpen = !isOpen;

    // 2. IF OPENING MENU, CLOSE CART
    if (isOpen) {
      isCartDrawerOpen.set(false);
    }
  }

  function closeMenu() {
    isOpen = false;
  }
  
  // ... rest of your script ...
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
          <a bind:this={firstLinkEl} href="/about" class="page-nav-items">About</a>
        </li>
        <li class="transition-transform hover:scale-105"><a href="/letterpress" class="page-nav-items">Letterpress</a></li>
        <li class="transition-transform hover:scale-105"><a href="/typepieces" class="page-nav-items">Typepieces</a></li>
        <li class="transition-transform hover:scale-105"><a href="/documentation" class="page-nav-items">Documentation</a></li>
        <li class="transition-transform hover:scale-105"><a href="/shop" class="page-nav-items">Shop</a></li>
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
    padding: 0.5rem;
  }

  .logo img {
    max-height: 2.5rem;
  }

  #page-nav {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  #page-nav a:focus-visible {
    outline: 3px solid var(--color-paper-content);
    outline-offset: 2px;
  }

  #cart-page-nav {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 1rem;
  }

  li {
    list-style: none;
  }

  #op-btn-page-nav {
    display: none;
    fill: var(--color-paper-content);
    background: none;
    border: none;
    cursor: pointer;
  }

  @media (max-width: 700px) {
    #page-nav {
      position: fixed;
      z-index: 90;
      top: 65px; 
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

<!-- ---
import CartIcon from "./cart/CartIcon.svelte";

---

<script>
document.addEventListener('DOMContentLoaded', () => {
  const openBtn = document.getElementById('op-btn-page-nav')

  openBtn?.addEventListener("click", function (){
    document.getElementById('page-nav')?.classList.toggle('open'); 
    document.getElementById('page-nav')?.classList.toggle('paper_pattern'); 
    document.getElementById('backdrop')?.classList.toggle('hidden');
    document.querySelector("body")?.classList.toggle('overflow-hidden');
    console.log("waiting - menu should be open now");
    
    // Simple delay
    setTimeout(() => {
      const firstLink = document.querySelector("#page-nav a");
      console.log("Focus target:", firstLink);
      firstLink?.focus();
      console.log("Active element after focus:", document.activeElement);
    }, 100);
  });


  document.getElementById('backdrop')?.addEventListener("click", function(){
    document.getElementById('page-nav')?.classList.toggle('open');
    document.getElementById('page-nav')?.classList.toggle('paper_pattern');
    document.getElementById('backdrop')?.classList.toggle('hidden');
    document.querySelector("body")?.classList.toggle('overflow-hidden');
  });
});
</script>

<div
  id="backdrop"
  class="fixed inset-0 bg-slate-400/50 backdrop-blur-sm transition-opacity duration-300 hidden z-1"
></div>
<header class="paper_pattern">
    <nav>
      <a href="/" class="logo transition-transform hover:scale-105">
        <img 
          src="/Logo.png";
          alt="Home";
        />
      </a>
      <div id="cart-page-nav">
          <ul id="page-nav" tabindex="-1" class="">
            <li class="transition-transform hover:scale-105"><a id="first_nav_item" tabindex="-1" href="/about" class="page-nav-items">About</a></li>
            <li class="transition-transform hover:scale-105"><a href="/letterpress" class="page-nav-items">Letterpress</a></li>
            <li class="transition-transform hover:scale-105"><a href="/typepieces" class="page-nav-items">Typepieces</a></li>
            <li class="transition-transform hover:scale-105"><a href="/documentation" class="page-nav-items">Documentation</a></li>
            <li class="transition-transform hover:scale-105"><a href="/shop" class="page-nav-items">Shop</a></li>
          </ul>
        <CartIcon client:load />
        <button aria-label="Open Page Menu" id="op-btn-page-nav" class="transition-transform hover:scale-105">

          <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px"><path d="M120-240v-66.67h720V-240H120Zm0-206.67v-66.66h720v66.66H120Zm0-206.66V-720h720v66.67H120Z"/></svg>

        </button>
      </div>
    </nav>
</header>

<style>
  header {
    position: sticky;
    top: 0;
    z-index: 100;
    border: 1px solid var(--color-paper-content);
    border-width: 0 0 1px 0;
  }

  nav{
    display: flex;
    align-items:center;
    justify-content: space-between;
    padding: 0.5rem;
  }

  .logo img{
    max-height: 2.5rem;

  }

  #page-nav {
    display: flex;
    align-items:center;
    gap: 1rem;

    & a:focus-visible {
      outline: 3px solid var(--color-paper-content);
      outline-offset: 2px;
    }
  }

  #cart-page-nav {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 1rem;
  }

  li{
    list-style: none;
  }

  #op-btn-page-nav {
    display: none;
    fill: var(--color-paper-content);
  }

  @media (max-width: 700px) {
    #cart-page-nav {
      flex-flow: row nowrap;
    }

    #page-nav {
      position: fixed;
      z-index: 90;
      top: 65px;
      right: 0;
      height: 100vh;
      width: 92.5vw;
      padding: 0 0 0 1rem;
      background-color: var(--color-paper-bg);
      border: 1px solid var(--color-paper-content);
      border-width: 0 0 0 1px;
      flex-direction: column;
      align-items: flex-start;
      display: none;

      &:focus {
        outline: 3px solid var(--color-paper-content);
      }

      &.open {
        display: flex !important;
        gap: 0;
        animation: slideIn 0.3s ease-in-out;
      }
      
      & li {
        padding: .5rem;
      }
    }

    #op-btn-page-nav {
      display: flex !important;
    }

  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
</style> -->