<script>
  
    function scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  </script>
  
  <footer class="bg-[#F9FAFB] text-[#1a1a1a] pt-24 px-6 md:px-16 relative">
    <div class="max-w-[90%] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
      
      <!-- Contact -->
      <div>
        <h3 class="font-semibold text-2xl mb-8 space-y-4">Contact</h3>
        <p class="text-base mb-4">Email: <a href="mailto:szelyesteodora@gmail.com" class="">contact@afa.ro</a></p>
        <p class="text-base mb-4">
          Telefon: <a href="tel:+40711111111" class=" hover:underline">+40 711 111 111</a>
        </p>
        
      </div>
  
      <!-- Legals -->
      <div>
        <h3 class="font-semibold text-2xl mb-8">Politici</h3>
        <ul class="space-y-4 text-base">
          <li><a href="/politici#termeni" class="hover:underline">Termeni și condiții</a></li>
          <li><a href="/politici#confidentialitate" class="hover:underline">Politica de confidențialitate</a></li>
          <li><a href="/politici#servicii" class="hover:underline">Politica de livrare a serviciilor</a></li>
        </ul>
      </div>
  
      <!-- Social -->
      <div>
        <h3 class="font-semibold text-2xl mb-8">Social Media</h3>
        <ul class="space-y-4 text-base">
          <li><a href="https://www.facebook.com/" target="_blank" class="hover:underline">Facebook</a></li>
          <li><a href="https://www.instagram.com/" target="_blank" class="hover:underline">Instagram</a></li>
          <li><a href="https://www.linkedin.com/" target="_blank" class="hover:underline">LinkedIn</a></li>
        </ul>
      </div>
  
      <!-- Logo -->
      <div class="flex items-start justify-start lg:justify-end">
        <div class="text-right">
          <a href="/"><img src="/logo/logo-subsol.png" alt="AFA Logo" class="h-auto" /></a>
    
        </div>
      </div>
    </div>
  
    <!-- Copyright -->
    <div class="max-w-7xl mx-auto mt-10 border-t border-gray-200 pt-6 pb-12 text-sm text-gray-400 text-center">
      © 2025 Automated Financial Analyst. Toate drepturile rezervate.
    </div>
  
    <!-- Scroll to top icon -->
    <button
      on:click={scrollToTop}
      class="absolute bottom-6 right-6 text-[#1a1a1a] hover:text-[#050937] transition"
      aria-label="Scroll to top"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  </footer>
  