<script>
  let name = "";
  let email = "";
  let phone = "";
  let subject = "";
  let message = "";
  let isSending = false;
  let successMessage = "";

  let subjects = [
    { label: "Analiză financiară", icon: "📊" },
    { label: "Asistență tehnică", icon: "🛠️" },
    { label: "Feedback", icon: "💬" },
    { label: "Altceva", icon: "❓" },
  ];

  async function handleSubmit(event) {
    event.preventDefault();
    isSending = true;
    successMessage = "";

    const formData = new FormData();
    formData.append("to", "universalio777@gmail.com");
    formData.append("fromDisplayName", name || "Vizitator");
    formData.append("subject", `Mesaj de contact: ${subject}`);
    formData.append(
      "text",
      `Nume: ${name}\nEmail: ${email}\nTelefon: ${phone}\n\nMesaj:\n${message}`,
    );
    formData.append(
      "html",
      `
      <p><strong>Nume:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Telefon:</strong> ${phone}</p>
      <p><strong>Subiect:</strong> ${subject}</p>
      <p><strong>Mesaj:</strong><br>${message.replace(/\n/g, "<br>")}</p>
    `,
    );

    try {
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        successMessage = "Mesajul a fost trimis cu succes!";
        name = email = phone = subject = message = "";
      } else {
        alert(result.error || "Eroare la trimiterea mesajului.");
      }
    } catch (err) {
      console.error("Eroare la trimitere:", err);
      alert("Eroare la conectarea cu serverul.");
    } finally {
      isSending = false;
    }
  }
</script>

<section id="contact" class="bg-[#F9FAFB] py-20 px-6 md:px-16">
  <div
    class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-24 max-w-[80%] mx-auto"
  >
    <!-- Stanga: Text -->
    <div class="w-full md:w-1/2">
      <h2
        class="text-2xl md:text-5xl font-semibold text-[#050937] mb-8 leading-snug"
      >
        Nu ai găsit răspunsurile pe care le căutai?
      </h2>
      <p class="text-gray-500 text-sm md:text-lg">
        Suntem aici să te ajutăm în performanță! <br /> <br />
        Poți lua legătura cu noi și pe rețelele sociale — postăm frecvent informații
        utile, actualizări și răspundem rapid întrebărilor din comunitate.
      </p>
    </div>

    <!-- Dreapta: Formularul -->
    <div class="w-full md:w-1/2 bg-white rounded-xl shadow-lg px-6 py-8">
      <h3 class="text-center text-[#050937] font-semibold text-3xl mb-6">
        Scrie-ne!
      </h3>

      <form class="formular-contact space-y-8" on:submit={handleSubmit}>
        <input
          type="text"
          placeholder="Nume"
          bind:value={name}
          class="w-full border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
        <input
          type="email"
          placeholder="Email"
          bind:value={email}
          class="w-full border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
        <input
          type="tel"
          placeholder="Număr de telefon"
          bind:value={phone}
          class="w-full border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />

        <textarea
          placeholder="Mesaj"
          rows="5"
          bind:value={message}
          class="w-full border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
        />

        <select
          bind:value={subject}
          class="w-full border border-gray-200 rounded-md px-4 py-3 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          <option disabled selected value="">💼 Alege un subiect</option>
          {#each subjects as s}
            <option value={s.label}>{s.icon} {s.label}</option>
          {/each}
        </select>

        <button
          type="submit"
          class="w-full bg-[#050937] text-white rounded-md py-2 font-medium hover:bg-[#1a1f4b] transition"
          disabled={isSending}
        >
          {isSending ? "Se trimite..." : "Trimite"}
        </button>

        {#if successMessage}
          <p class="text-green-600 text-center text-sm mt-2">
            {successMessage}
          </p>
        {/if}
      </form>
    </div>
  </div>
</section>
