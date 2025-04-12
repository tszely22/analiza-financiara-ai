<script>
  // @ts-ignore
  /**
   * @type {number | null}
   */
  let activeIndex = null;

  const faqs = [
    {
      question: "Cum se pot încărca rezultatele financiare anuale ale firmei?",
      answer:
        "Rezultatele financiare anuale se introduc manual în platformă, în câmpurile predefinite aferente Bilanțului contabil și Contului de profit și pierdere, pentru ultimii 3 ani. Secțiunea dedicată completării acestor date, intitulată „Analiză”, devine disponibilă doar utilizatorilor înregistrați în platformă..",
    },
    {
      question: "Se pot descărca rezultatul analizei financiare?",
      answer:
        "Analiza financiară generată automat de platformă va fi transmisă în mod direct, în format PDF, la adresa de e-mail utilizată pentru înregistrare. Descărcarea manuală nu este necesară.",
    },
    {
      question:
        "Cui se adresează platforma și ce tip de utilizatori o pot folosi eficient?",
      answer:
        "Platforma se adresează oricărui tip de firmă, indiferent de domeniul de activitate. Aceasta poate fi utilizată eficient fără a necesita pregătire profesională în domeniul financiar, fiind necesar doar accesul la rezultatele financiare anuale ale firmei.",
    },
    {
      question:
        "Ce forme de suport tehnic și documentație sunt puse la dispoziția utilizatorilor?",
      answer:
        "Utilizatorii au acces la suport tehnic prin e-mail și formular de contact. Acestea oferă explicații clare despre funcționalitățile platformei și despre pașii necesari pentru o utilizare eficientă.",
    },
  ];

  // @ts-ignore
  function toggle(index) {
    // @ts-ignore
    activeIndex = activeIndex === index ? null : index;
  }
</script>

<section id="suport" class=" py-10 px-4 my-[100px]">
  <h2 class="text-4xl text-center mb-16 font-semibold">Întrebări</h2>
  <div class=" mx-auto bg-white rounded-2xl p-6 md:p-4 shadow-lg max-w-[75%]">
    {#each faqs as faq, index}
      <div class=" last:border-none text-lg">
        <button
          class={`w-full text-left py-8 px-8 rounded-xl transition-colors flex justify-between items-center ${
            activeIndex === index
              ? "bg-gray-100 font-semibold"
              : "hover:bg-gray-50"
          }`}
          on:click={() => toggle(index)}
        >
          {faq.question}
          <svg
            class="h-5 w-5 transition-transform"
            class:rotate-180={activeIndex === index}
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {#if activeIndex === index}
          <div class="px-16 pb-4 pt-2 mt-[12.5px] text-base text-[#000000]">
            {faq.answer}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</section>
