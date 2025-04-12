<script>
    import "../app.css";
    import Meniu from "$lib/components/Meniu.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
  
  </script>
  
  <Meniu />
  <slot />
  <Footer />
  