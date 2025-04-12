<script>
  import mockup from "$lib/images/mockup.png";
  import linie from "$lib/images/linie.png";
  import spirala from "$lib/images/spirala-patrat.png";
  import legatura from "$lib/images/legatura.png"; // background connector
</script>

<!-- ✅ Section 1: Unique Solution -->
<section id="avantaje" class="bg-[#F9FAFB] py-24 px-6 mt-12 mb-12 md:px-16">
  <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
    
    <!-- Left: MacBook Image -->
    <div class="w-full md:w-1/2 flex justify-center">
      <img src={mockup} alt="MacBook" class="max-w-xs md:max-w-xl w-full" />
    </div>

    <!-- Right: Text Content -->
    <div class="w-full md:w-1/2 text-[#050937]">
      <h2 class="relative text-2xl md:text-4xl font-semibold leading-snug mb-6 z-[10]">
        Pentru că afacerea ta e unică,<br />
        la fel sunt și soluțiile.
        <img
          src={linie}
          alt="linie"
          class="w-1/2 mt-2 absolute top-[60px] right-[100px] z-[-10]"
        />
      </h2>

      <p class="text-sm md:text-lg text-[#3b3b57] leading-relaxed">
        Inteligența artificială va construi automat o analiză SWOT pe baza datelor financiare procesate (indicatori, interpretări, grafice), identificând punctele tari, punctele slabe, oportunitățile și riscurile specifice firmei. <br /><br />
        Ulterior, pe baza acestei analize, AI-ul va genera recomandări personalizate, comparând poziția firmei tale cu tendințele și valorile din piață, specifice domeniului de activitate.
      </p>
    </div>
  </div>
</section>



<!-- ✅ Section 2: Cum funcționează? -->
<div class="max-w-7xl mx-auto text-center mb-16">
  <h2 class="text-3xl md:text-4xl font-semibold text-[#050937]">Cum funcționează?</h2>
  <p class="text-gray-400 mt-2 text-lg">Tu introduci datele, noi facem restul.</p>
</div>

<section
  class="bg-[#F9FAFB] py-22 px-6 md:px-16 relative overflow-hidden"
  style="background-image: url({legatura}); background-repeat: no-repeat; background-position: center; background-size: contain;"
>


  <div class="grid gap-24 md:grid-cols-3 max-w-[90%] mx-auto ">
    <!-- Step 1 -->
    <div
      class="bg-[#050937] text-white p-12 rounded-xl relative overflow-hidden"
      style="background-image: url({spirala}); background-size: cover; background-repeat: no-repeat; opacity: 95%;"
    >
      <div class="relative z-10 min-h-24 ">
        <h3 class="font-semibold mb-6 text-2xl min-h-16">
          1. Analiza performanței firmei pe baza rentabilității
        </h3>
        <p class="text-base opacity-90">
          Datele din contul de profit și pierdere aferente ultimilor trei ani sunt completate manual de utilizator. Structura aplicației include toate câmpurile relevante, deja specificate.
        </p>
      </div>
    </div>

    <!-- Step 2 -->
    <div
      class="bg-[#050937] text-white p-12 rounded-xl relative overflow-hidden"
      style="background-image: url({spirala}); background-size: cover; background-repeat: no-repeat; opacity: 95%;"
    >
      <div class="relative z-10 min-h-24">
        <h3 class="font-semibold mb-6 text-2xl min-h-16">2. Analiza poziției financiare</h3>
        <p class="text-base opacity-90">
          Datele din bilanțul contabil aferente ultimilor trei ani sunt completate manual de utilizator. Structura aplicației include toate câmpurile relevante, deja specificate.
        </p>
      </div>
    </div>

    <!-- Step 3 -->
    <div
      class="bg-[#050937] text-white p-12 rounded-xl relative overflow-hidden min-h-24"
      style="background-image: url({spirala}); background-size: cover; background-repeat: no-repeat; opacity: 95%;"
    >
      <div class="relative z-10 min-h-24">
        <h3 class="font-semibold mb-6 text-2xl min-h-16">3. Ce spun indicatorii despre afacerea ta</h3>
        <p class="text-base opacity-90">
          Pe baza datelor introduse manual de utilizator, se generează automat o interpretare clară și descriptivă a principalilor indicatori financiari.
        </p>
      </div>
    </div>
  </div>
</section>
