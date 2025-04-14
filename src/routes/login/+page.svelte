<script>
    import { goto } from "$app/navigation";
    import Cookies from "js-cookie";
    import { isLoggedIn } from "$lib/stores/auth";

    let isLogin = true;

    // câmpuri comune
    let email = "";
    let password = "";
    let showPassword = false;

    // doar pentru înregistrare
    let confirmPassword = "";
    let showConfirmPassword = false;
    let cui = "";
    let firmName = "";
    let caenCode = "";
    let location = "";
    let foundationYear = "";
    let contactName = "";

    const handleSubmit = async () => {
        if (isLogin) {
            try {
                const response = await fetch(
                    "https://analiza-financiara-ai.api-hub.xyz/api/entitati/login",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email,
                            password,
                        }),
                    },
                );

                const result = await response.json();

                if (response.ok) {
                    Cookies.set("token", result.token, {
                        secure: true,
                        sameSite: "strict",
                        path: "/",
                    });
                    Cookies.set("tokenExpires", result.expires, {
                        secure: true,
                        sameSite: "strict",
                        path: "/",
                    });
                    Cookies.set("userEmail", result.user.email, {
                        secure: true,
                        sameSite: "strict",
                        path: "/",
                    });

                    isLoggedIn.setLoggedIn(); // ✅ update store
                    goto("/incarcare");
                } else {
                    alert(result.message || "Autentificare eșuată");
                }
            } catch (error) {
                console.error("Eroare la autentificare:", error);
                alert("Eroare la conectare.");
            }
            try {
                const response = await fetch(
                    "https://analiza-financiara-ai.api-hub.xyz/api/entitati/login",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email, password }),
                    },
                );

                const raw = await response.text(); // 🟡 get raw response
                console.log("Raw login response:", raw);

                let result;
                try {
                    result = JSON.parse(raw);
                } catch (err) {
                    throw new Error("Invalid JSON received from server.");
                }

                if (response.ok) {
                    localStorage.setItem("token", result.token);
                    localStorage.setItem("tokenExpires", result.expires);
                    localStorage.setItem("userEmail", result.user.email);

                    console.log("✅ Token stored successfully");
                    goto("/incarcare");
                } else {
                    alert(result.message || "Autentificare eșuată");
                }
            } catch (error) {
                console.error("❌ Eroare la autentificare:", error);
                alert("Eroare la conectare.");
            }
        } else {
            if (password !== confirmPassword) {
                alert("Parolele nu coincid!");
                return;
            }

            try {
                const response = await fetch(
                    "https://analiza-financiara-ai.api-hub.xyz/api/entitati/users/add",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email,
                            parola: password,
                            cui,
                            nume_firma: firmName,
                            cod_caen: caenCode,
                            localitate_judet: location,
                            an_infiintare: foundationYear,
                            nume_reprezentant: contactName,
                        }),
                    },
                );

                const text = await response.text(); // First get raw response
                console.log("Raw response:", text);

                try {
                    const result = JSON.parse(text);

                    if (response.ok) {
                        localStorage.setItem("token", result.token);
                        localStorage.setItem("tokenExpires", result.expires);
                        goto("/incarcare");
                    } else {
                        alert(result.message || "Eroare necunoscută.");
                    }
                } catch (err) {
                    console.error("Eroare la parse JSON:", err);
                    alert("Răspuns invalid de la server.");
                }
            } catch (error) {
                console.error("Eroare la înregistrare:", error);
                alert("A apărut o eroare. Încearcă din nou.");
            }
        }
    };
</script>

<div
    class="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-26"
>
    <div class="w-full max-w-md bg-white rounded-2xl shadow p-8 space-y-6">
        <h1 class="text-2xl font-bold text-center text-gray-800">
            {isLogin ? "Autentificare" : "Înregistrare"}
        </h1>

        <form on:submit|preventDefault={handleSubmit} class="space-y-4">
            <div>
                <label class="block mb-1 text-sm font-medium text-gray-700"
                    >Email</label
                >
                <input
                    type="email"
                    bind:value={email}
                    required
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="exemplu@email.com"
                />
            </div>

            <div class="relative">
                <label class="block mb-1 text-sm font-medium text-gray-700"
                    >Parolă</label
                >
                <input
                    type={showPassword ? "text" : "password"}
                    bind:value={password}
                    required
                    class="w-full px-4 py-2 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder=" "
                />
                <button
                    type="button"
                    on:click={() => (showPassword = !showPassword)}
                    class="absolute top-[38px] right-3 text-sm text-gray-500 hover:text-gray-700"
                    tabindex="-1"
                >
                    {showPassword ? "Ascunde" : "Arată"}
                </button>
            </div>

            {#if !isLogin}
                <div class="relative">
                    <label class="block mb-1 text-sm font-medium text-gray-700"
                        >Confirmă Parola</label
                    >
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        bind:value={confirmPassword}
                        required
                        class="w-full px-4 py-2 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder=" "
                    />
                    <button
                        type="button"
                        on:click={() =>
                            (showConfirmPassword = !showConfirmPassword)}
                        class="absolute top-[38px] right-3 text-sm text-gray-500 hover:text-gray-700"
                        tabindex="-1"
                    >
                        {showConfirmPassword ? "Ascunde" : "Arată"}
                    </button>
                </div>

                <!-- Numele firmei -->
                <div>
                    <label class="block mb-1 text-sm font-medium text-gray-700"
                        >CUI</label
                    >
                    <input
                        type="varchar"
                        bind:value={cui}
                        required
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder=" "
                    />
                </div>

                <div>
                    <label class="block mb-1 text-sm font-medium text-gray-700"
                        >Numele firmei</label
                    >
                    <input
                        type="text"
                        bind:value={firmName}
                        required
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: SC Exemplu SRL"
                    />
                </div>

                <!-- Cod CAEN -->
                <div>
                    <label class="block mb-1 text-sm font-medium text-gray-700"
                        >Cod CAEN</label
                    >
                    <input
                        type="varchar"
                        bind:value={caenCode}
                        required
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: 6201"
                    />
                </div>

                <!-- Județ / Localitate -->
                <div>
                    <label class="block mb-1 text-sm font-medium text-gray-700"
                        >Localitate / Județ</label
                    >
                    <input
                        type="text"
                        bind:value={location}
                        required
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: Cluj-Napoca, Cluj"
                    />
                </div>

                <!-- Anul înființării -->
                <div>
                    <label class="block mb-1 text-sm font-medium text-gray-700"
                        >Anul înființării</label
                    >
                    <input
                        type="number"
                        bind:value={foundationYear}
                        min="1900"
                        max="2099"
                        required
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: 2018"
                    />
                </div>

                <!-- Nume reprezentant -->
                <div>
                    <label class="block mb-1 text-sm font-medium text-gray-700"
                        >Nume reprezentant</label
                    >
                    <input
                        type="text"
                        bind:value={contactName}
                        required
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: Maria Popescu"
                    />
                </div>
            {/if}

            <button
                type="submit"
                class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
                {isLogin ? "Conectează-te" : "Înregistrează-te"}
            </button>
        </form>

        <p class="text-sm text-gray-500 text-center">
            {isLogin ? "Nu ai cont? " : "Ai deja un cont? "}
            <button
                type="button"
                on:click={() => (isLogin = !isLogin)}
                class="text-blue-600 hover:underline"
            >
                {isLogin ? "Înregistrează-te" : "Autentifică-te"}
            </button>
        </p>
    </div>
</div>
