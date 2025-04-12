<script>
    import abstract from "$lib/images/abstract.png";
    import acasa from "$lib/images/poza-acasa.png";
  </script>
  
  <section id="acasa" class="bg-[#050937] text-white py-20 px-6 md:px-16 relative overflow-hidden">
    <!-- Background decorative wave lines -->
    <img
      src="{abstract}"
      alt="wave lines"
      class="absolute left-0 top-0 h-full opacity-30 pointer-events-none"
    />
  
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10">
      <!-- Left content -->
      <div class="text-left max-w-xl">
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight mb-6">
          Transformă situațiile financiare <br />
          în decizii strategice
        </h1>
        <p class="text-lg md:text-xl font-light mb-8">
          Automat. Rapid. Personalizat.
        </p>
        <a
          href="/login"
          class="inline-block bg-[#E0E5F9] text-[#050937] px-6 py-4 rounded-full text-lg font-medium hover:bg-[#d6dbf0] transition"
        >
          Începe acum
        </a>
      </div>
  
      <!-- Right illustration -->
      <div class="mt-10 md:mt-0">
        <img
          src="{acasa}"
          alt="Hero Graphic"
          class="w-full max-w-md md:max-w-xl"
        />
      </div>
    </div>
  </section>
  