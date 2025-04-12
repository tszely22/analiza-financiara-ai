<script>
  import { goto } from "$app/navigation";
  import { isLoggedIn } from "$lib/stores/auth";
  import { onMount } from "svelte";

  let menuOpen = false;
  let loggedIn = false;

  const unsubscribe = isLoggedIn.subscribe((value) => {
    loggedIn = value;
  });

  onMount(() => {
    isLoggedIn.checkAuth(); // checks cookies on load
  });

  const toggleMenu = () => (menuOpen = !menuOpen);

  const handleLogout = () => {
    isLoggedIn.logout(); // clears cookies + updates store
    goto("/");
  };
</script>

<!-- Navbar -->
<nav
  class="fixed top-0 left-0 w-full bg-[#050937] px-6 py-4 md:px-8 flex items-center justify-between z-50 shadow"
>
  <!-- Logo -->
  <div class="flex items-center space-x-2">
    <a href="/">
      <img src="/logo/logo-meniu.png" alt="AFA Logo" class="h-auto w-[125px]" />
    </a>
  </div>

  <!-- Desktop Links -->
  <ul
    class="hidden md:flex items-center gap-[75px] text-white font-medium text-sm tracking-wide"
  >
    <li><a href="/#acasa" class="hover:underline">ACASĂ</a></li>
    <li><a href="/#avantaje" class="hover:underline">AVANTAJE</a></li>
    <li><a href="/#suport" class="hover:underline">FAQ</a></li>
    <li><a href="/#contact" class="hover:underline">CONTACT</a></li>
    <li><a href="/incarcare" class="hover:underline">ANALIZĂ</a></li>
  </ul>

  <!-- Desktop CTA -->
  {#if loggedIn}
    <button
      on:click={handleLogout}
      class="hidden md:inline-block bg-[#E0E5F9] text-[#050937] text-lg font-medium px-6 py-4 rounded-full hover:bg-[#d6dbf0] transition cursor-pointer"
    >
      Delogare
    </button>
  {:else}
    <a
      href="/login"
      class="hidden md:inline-block bg-[#E0E5F9] text-[#050937] text-lg font-medium px-6 py-4 rounded-full hover:bg-[#d6dbf0] transition"
    >
      Înregistrează-te
    </a>
  {/if}

  <!-- Burger Icon -->
  <button
    class="md:hidden text-white focus:outline-none z-50"
    on:click={toggleMenu}
    aria-label="Toggle menu"
  >
    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {#if !menuOpen}
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      {:else}
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      {/if}
    </svg>
  </button>
</nav>

<!-- Mobile Menu -->
{#if menuOpen}
  <div
    class="md:hidden absolute top-[72px] left-0 w-full bg-[#050937] z-40 p-[15px]"
  >
    <ul
      class="flex flex-col items-start space-y-4 text-white font-medium text-sm p-[15px]"
    >
      <li>
        <a
          href="/#acasa"
          class="block hover:underline"
          on:click={() => (menuOpen = false)}>ACASĂ</a
        >
      </li>
      <li>
        <a
          href="/#avantaje"
          class="block hover:underline"
          on:click={() => (menuOpen = false)}>AVANTAJE</a
        >
      </li>
      <li>
        <a
          href="/#suport"
          class="block hover:underline"
          on:click={() => (menuOpen = false)}>SUPORT</a
        >
      </li>
      <li>
        <a
          href="/#contact"
          class="block hover:underline"
          on:click={() => (menuOpen = false)}>CONTACT</a
        >
      </li>

      {#if loggedIn}
        <li>
          <button
            on:click={() => {
              handleLogout();
              menuOpen = false;
            }}
            class="block bg-[#E0E5F9] text-[#050937] px-4 py-2 rounded-full hover:bg-[#d6dbf0] transition text-base"
          >
            Log Out
          </button>
        </li>
      {:else}
        <li>
          <a
            href="/login"
            on:click={() => (menuOpen = false)}
            class="block bg-[#E0E5F9] text-[#050937] px-4 py-2 rounded-full hover:bg-[#d6dbf0] transition text-base"
          >
            Înregistrează-te
          </a>
        </li>
      {/if}
    </ul>
  </div>
{/if}
