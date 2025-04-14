<script>
    // @ts-nocheck
    import IndicatorChart from "$lib/components/IndicatorChart.svelte"; // adjust path if needed
    import Cookies from "js-cookie"; // Add this import if not already present

    let pdfGenerating = false;

    let isPdfMode = false;

    let finishedProcess = false;

    let isDownloadingPDF = false;

    async function downloadPDF() {
        isDownloadingPDF = true;
        const blob = await generatePDFBlob();
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "raport-analiza-financiara.pdf";
        a.click();
        URL.revokeObjectURL(url);

        isDownloadingPDF = false;
    }

    async function generatePDFBlob() {
        isPdfMode = true;
        pdfGenerating = true;

        try {
            const html2pdf = (await import("html2pdf.js")).default;

            const element = document.getElementById("pdf-report");
            if (!element) {
                console.error("❌ Elementul PDF nu a fost găsit.");
                return null;
            }

            const opt = {
                margin: 0.5,
                filename: "raport-analiza-financiara.pdf", // optional if you're not saving
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    ignoreElements: (el) => el.classList?.contains("no-print"),
                },
                jsPDF: { unit: "in", format: "a3", orientation: "landscape" },
            };

            await new Promise((res) => setTimeout(res, 1500));
            const blob = await html2pdf()
                .from(element)
                .set(opt)
                .outputPdf("blob");

            return blob;
        } catch (error) {
            console.error("💥 Eroare la generarea PDF-ului:", error);
            return null;
        } finally {
            pdfGenerating = false;
            isPdfMode = false;
        }
    }

    async function generatePDFBlobAndSend() {
        const user = await getUserDetails();
        if (!user) return;

        try {
            const user = await getUserDetails();
            if (!user) return;

            const blob = await generatePDFBlob();
            if (!blob) return;

            const formData = new FormData();
            formData.append("user_id", user.id);
            formData.append("pdf", blob, "raport.pdf");

            for (const pair of formData.entries()) {
                console.log(`${pair[0]}:`, pair[1]);
            }

            const response = await fetch(
                "https://analiza-financiara-ai.api-hub.xyz/api/entitati/results/add",
                {
                    method: "POST",
                    body: formData,
                },
            );

            const result = await response.json();
            console.log("✅ Upload result:", result);

            // ✅ Now create a clean FormData just for sending email
            const emailForm = new FormData();

            // formData.append("to", user.email);
            emailForm.append("to", "universalio777@gmail.com");
            emailForm.append("fromDisplayName", "AFA");
            emailForm.append("subject", "Raportul Analizei Financiare");
            emailForm.append(
                "text",
                "Salut! Atașat găsești raportul analizei financiare. Pentru compania " +
                    user.nume_firma +
                    ".",
            );
            emailForm.append(
                "html",
                "<p>Salut! Atașat găsești raportul analizei financiare pentru compania " +
                    user.nume_firma +
                    ".</p>",
            );
            emailForm.append(
                "attachment",
                new File([blob], "raport-analiza-financiara.pdf", {
                    type: "application/pdf",
                }),
            );

            const responseEmail = await fetch("/api/sendEmail", {
                method: "POST",
                body: emailForm,
            });

            const emailSendResult = await responseEmail.json();
            console.log("📧 Email trimis:", emailSendResult);
            finishedProcess = true;
        } catch (error) {
            console.error("💥 Eroare la generarea/încărcarea PDF-ului:", error);
        }
    }

    let years = [2021, 2022, 2023];

    let aiResponse = "";
    let aiLoading = false;

    const campuriBilant = [
        "ACTIVE IMOBILIZATE - TOTAL",
        "STOCURI",
        "CREANŢE",
        "INVESTIȚII FINANCIARE PE TERMEN SCURT",
        "CASA ŞI CONTURI LA BĂNCI",
        "ACTIVE CIRCULANTE - TOTAL",
        "CHELTUIELI ÎN AVANS",
        "DATORII: SUMELE CARE TREBUIE PLĂTITE ÎNTR-O PERIOADĂ DE PÂNĂ LA UN AN",
        "DATORII:SUMELE CARE TREBUIE PLATITE INTR-O PERIOADA MAI MARE DE UN AN",
        "PROVIZIOANE",
        "VENITURI IN AVANS",
        "Subvenţii pentru investiţii",
        "CAPITALURI PROPRII",
    ];

    const campuriCont = [
        "Cifra de afaceri netă",
        "Producţia vândută",
        "Venituri din vânzarea mărfurilor",
        "Venituri din subvenţii de exploatare aferente cifrei de afaceri nete",
        "Venituri aferente costului producţiei în curs de execuţie",
        "  Sold C",
        "  Sold D",
        "Venituri din producţia de imobilizari necorporale si corporale",
        "Alte venituri din exploatare",
        "Cheltuieli cu materile prime și materialele consumabile",
        "Alte cheltuieli materiale",
        "Cheltuieli privind utilitatile",
        "Cheltuieli privind mărfurile",
        "Reduceri comerciale primite",
        "Cheltuieli cu personalul",
        "Cheltuieli de exploatare privind amortizarea imobilizărilor",
        "Cheltuieli privind prestaţiile externe",
        "Alte cheltuieli de exploatare",
        "Cheltuieli cu alte impozite, taxe și vărsăminte asimilate",
        "Ajustări privind provizioanele",
        "Profit din exploatare ",
        "Pierdere din exploatare",
        "Profit financiar",
        "Pierdere financiară",
        "Profit brut",
        "Pierdere brută",
        "Profit net al exercițiului financiar",
        "Pierdere netă al exercițiului financiar",
    ];

    let profitLossData = {};
    let balanceSheetData = {};

    for (let field of campuriCont) {
        profitLossData[field] = {};
        for (let year of years) {
            profitLossData[field][year] = "";
        }
    }

    for (let field of campuriBilant) {
        balanceSheetData[field] = {};
        for (let year of years) {
            balanceSheetData[field][year] = "";
        }
    }

    //I. Analiza Performanțelor – Contul de Profit și Pierdere

    // Solduri intermediare de gestiune

    function valoareaAdaugata(Pex, MC, Ci) {
        return Pex + MC - Ci;
    }

    // Cheltuieli cu materile prime și materialele consumabile is cheltuieliMPMC
    // Alte cheltuieli materiale is alteCheltuieliMateriale
    // Cheltuieli privind utilitatile is cheltuieliUtilitate
    // Cheltuieli privind mărfurile is cheltuieliMarfuri

    function ci(
        cheltuieliMPMC,
        alteCheltuieliMateriale,
        cheltuieliUtilitate,
        cheltuieliMarfuri,
        reduceriComercialePrimite,
        cheltuieliPrestatiiExterne,
    ) {
        return (
            cheltuieliMPMC +
            alteCheltuieliMateriale +
            cheltuieliUtilitate +
            cheltuieliMarfuri -
            reduceriComercialePrimite +
            cheltuieliPrestatiiExterne
        );
    }

    // Venituri din producţia de imobilizari necorporale si corporale

    function pex(productiaVanduta, soldC, soldD, cantitateImobilizata) {
        return productiaVanduta + soldC - soldD + cantitateImobilizata;
    }

    function mc(venituriVanzariMarfa, cheltuieliMarfuri) {
        return venituriVanzariMarfa - cheltuieliMarfuri;
    }

    // Cheltuieli cu alte impozite, taxe și vărsăminte asimilate is cheltuieliCuAlteImpTaxe

    function excedentBrutExploatare(
        valoareAdaugata,
        subventieExploatare,
        cheltuieliCuPersonalul,
        cheltuieliCuAlteImpTaxe,
    ) {
        return (
            valoareAdaugata +
            subventieExploatare -
            cheltuieliCuPersonalul -
            cheltuieliCuAlteImpTaxe
        );
    }

    // Rate de rentabilitate

    function totalActive(activeImobilizate, activeCirculante, cheltuieliAvans) {
        return activeImobilizate + activeCirculante + cheltuieliAvans;
    }

    function ROA(profitNet, totalActive) {
        return profitNet !== 0 ? (profitNet / totalActive) * 100 : null;
    }

    function ROE(profitNet, capitaluriProprii) {
        return profitNet !== 0 ? (profitNet / capitaluriProprii) * 100 : null;
    }

    // CA is Cifra de afaceri

    function rataRentabilitateResurseConsumate(profitExploatare, CA) {
        return profitExploatare !== 0 ? (profitExploatare / CA) * 100 : null;
    }

    // II. Analiza Poziției Financiare – Bilanțul Contabil

    // 1. Rate de structură
    function rataActiveImobilizate(activeImobilizate, totalActive) {
        return totalActive !== 0
            ? (activeImobilizate / totalActive) * 100
            : null;
    }

    function rataActiveCirculante(activeCirculante, totalActive) {
        return totalActive !== 0
            ? (activeCirculante / totalActive) * 100
            : null;
    }

    function rataStocurilor(stocuri, activeCirculante) {
        return activeCirculante !== 0
            ? (stocuri / activeCirculante) * 100
            : null;
    }

    function rataCreantelor(creante, activeCirculante) {
        return activeCirculante !== 0
            ? (creante / activeCirculante) * 100
            : null;
    }

    function rataDisponibilitatilor(disponibilitati, activeCirculante) {
        return activeCirculante !== 0
            ? (disponibilitati / activeCirculante) * 100
            : null;
    }

    function rataNumerarEchivalente(
        disponibilitati,
        investitiiFinanciareScurt,
        activeCirculante,
    ) {
        return totalActive !== 0
            ? ((disponibilitati + investitiiFinanciareScurt) /
                  activeCirculante) *
                  100
            : null;
    }

    function capitaluriPermanente(
        capitaluriProprii,
        datoriiTermenLung,
        subventiiInvestitii,
        provizioanele,
    ) {
        return (
            capitaluriProprii +
            datoriiTermenLung +
            subventiiInvestitii +
            provizioanele
        );
    }

    function rataStabilitatiiFinanciare(capitaluriPermanente, totalPasiv) {
        return totalPasiv !== 0
            ? (capitaluriPermanente / totalPasiv) * 100
            : null;
    }

    function rataAutonomieiFinanciare(capitaluriProprii, totalPasiv) {
        return totalPasiv !== 0 ? (capitaluriProprii / totalPasiv) * 100 : null;
    }

    // DATORII: SUMELE CARE TREBUIE PLĂTITE ÎNTR-O PERIOADĂ DE PÂNĂ LA UN AN - is datoriiCurente
    // DATORII:SUMELE CARE TREBUIE PLATITE INTR-O PERIOADA MAI MARE DE UN AN - is datoriiTermenLung

    function datoriiTotale(datoriiTermenLung, datoriiCurente) {
        return datoriiTermenLung + datoriiCurente;
    }

    function totalPasiv(capitaluriProprii, datoriiTermenLung, venituriAvans) {
        return capitaluriProprii + datoriiTermenLung + venituriAvans;
    }

    function rataIndatorariiGlobale(datoriiTotale, totalPasiv) {
        return totalPasiv !== 0 ? (datoriiTotale / totalPasiv) * 100 : null;
    }

    // 2. Situația financiară
    function rataLichiditatiiGenerale(activeCirculante, datoriiCurente) {
        return datoriiCurente !== 0 ? activeCirculante / datoriiCurente : null;
    }

    function rataLichiditatiiImediate(
        activeCirculante,
        stocuri,
        datoriiCurente,
    ) {
        return (activeCirculante - stocuri) / datoriiCurente;
    }

    // casa si conturi la banci is disponibilitati
    // INVESTIȚII FINANCIARE PE TERMEN SCURT is investitiiFinanciareScurt

    function rataLichiditatiiLaVedere(
        disponibilitati,
        investitiiFinanciareScurt,
        datoriiCurente,
    ) {
        return (disponibilitati + investitiiFinanciareScurt) / datoriiCurente; // poate fi același calcul
    }

    function rataSolvabilitatiiGenerale(totalActive, datoriiTotale) {
        return datoriiTotale !== 0 ? (totalActive / datoriiTotale) * 100 : null;
    }

    function rataSolvabilitatiiPatrimoniale(
        capitaluriProprii,
        capitaluriPermanente,
    ) {
        return (capitaluriProprii / capitaluriPermanente) * 100;
    }

    // 3. Echilibrul financiar
    function fondRulment(
        activeCirculante,
        cheltuieliAvans,
        datoriiCurente,
        venituriAvans,
    ) {
        return (
            activeCirculante +
            cheltuieliAvans -
            (datoriiCurente + venituriAvans)
        );
    }

    function necesarFondRulment(
        stocuri,
        creante,
        cheltuieliAvans,
        datoriiCurente,
        venituriAvans,
    ) {
        return (
            stocuri +
            creante +
            cheltuieliAvans -
            (datoriiCurente + venituriAvans)
        );
    }

    function trezorerieNet(fondRulment, necesarFondRulment) {
        return fondRulment - necesarFondRulment;
    }

    // I. Analiza performantelor firmei pe baza rentabilitatii (pe baza contului de profit si pierdere)
    // 1. Solduri intermediare de gestiune
    // VA, PEX, MC, EBE, CA, Rezultat de exploatare
    // 2. Rate rentabilitate
    // rezult financiar (profit sau pierdere), rezultat din exploatare (profit sau pierdere)
    // rezultat brut al exercitiului (profit sau pierdere), rezultat net al exercitiului (profit sau pierdere), ROA, ROE, Rrrc,
    // II. Analiza pozitiei financiare a firmei (pe baza bilantului contabil)
    // 1. Rate de structura
    // Rata activelor imobilizate, rata activelor circulante, rata stocurilor, rata creantelor, rata disponibilitatilor, rata numerar si echivalente
    // rata stabilitatii financiare, rata autonomiei financiare, rata indatorarii globable
    // 2. Situatia financiara
    // rata lichiditatii generale, rata lichiditatii imediate,
    // rata lichiditatii la vedere, rata solvabilitatii generale, rata solvabilitatii patrimoniale,
    // 3. Echilibrul financiar
    // FR, NFR, TN

    function allFieldsFilled(data) {
        return Object.values(data).every((yearData) =>
            Object.values(yearData).every((val) => val !== "" && val !== null),
        );
    }

    function calculateIndicators() {
        if (
            !allFieldsFilled(balanceSheetData) ||
            !allFieldsFilled(profitLossData)
        ) {
            alert(
                "Te rugăm să completezi toate câmpurile înainte de a continua.",
            );
            return false;
        }

        for (let year of years) {
            // 🔹 Date din bilanț
            let ai = +balanceSheetData["ACTIVE IMOBILIZATE - TOTAL"][year] || 0;
            let ac = +balanceSheetData["ACTIVE CIRCULANTE - TOTAL"][year] || 0;
            let chAv = +balanceSheetData["CHELTUIELI ÎN AVANS"][year] || 0;
            let stocuri = +balanceSheetData["STOCURI"][year] || 0;
            let creante = +balanceSheetData["CREANŢE"][year] || 0;
            let disponibilitati =
                +balanceSheetData["CASA ŞI CONTURI LA BĂNCI"][year] || 0;
            let investitiiScurt =
                +balanceSheetData["INVESTIȚII FINANCIARE PE TERMEN SCURT"][
                    year
                ] || 0;
            let datoriiCurente =
                +balanceSheetData[
                    "DATORII: SUMELE CARE TREBUIE PLĂTITE ÎNTR-O PERIOADĂ DE PÂNĂ LA UN AN"
                ][year] || 0;
            let datoriiLungi =
                +balanceSheetData[
                    "DATORII:SUMELE CARE TREBUIE PLATITE INTR-O PERIOADA MAI MARE DE UN AN"
                ][year] || 0;
            let venituriAvans =
                +balanceSheetData["VENITURI IN AVANS"][year] || 0;
            let subventiiInvestitii =
                +balanceSheetData["Subvenţii pentru investiţii"][year] || 0;
            let provizioane = +balanceSheetData["PROVIZIOANE"][year] || 0;
            let capitaluriProprii =
                +balanceSheetData["CAPITALURI PROPRII"][year] || 0;

            // 🔹 Date din contul de profit și pierdere
            let prodVanduta = +profitLossData["Producţia vândută"][year] || 0;
            let soldC = +profitLossData["  Sold C"][year] || 0;
            let soldD = +profitLossData["  Sold D"][year] || 0;
            let venituriImobilizari =
                +profitLossData[
                    "Venituri din producţia de imobilizari necorporale si corporale"
                ][year] || 0;
            let venituriMarfuri =
                +profitLossData["Venituri din vânzarea mărfurilor"][year] || 0;
            let cheltuieliMarfuri =
                +profitLossData["Cheltuieli privind mărfurile"][year] || 0;
            let cheltuieliMP =
                +profitLossData[
                    "Cheltuieli cu materile prime și materialele consumabile"
                ][year] || 0;
            let alteCheltuieliMateriale =
                +profitLossData["Alte cheltuieli materiale"][year] || 0;
            let utilitati =
                +profitLossData["Cheltuieli privind utilitatile"][year] || 0;
            let reduceriComerciale =
                +profitLossData["Reduceri comerciale primite"][year] || 0;
            let prestatiiExterne =
                +profitLossData["Cheltuieli privind prestaţiile externe"][
                    year
                ] || 0;
            let subventieExploatare =
                +profitLossData[
                    "Venituri din subvenţii de exploatare aferente cifrei de afaceri nete"
                ][year] || 0;
            let cheltuieliPersonal =
                +profitLossData["Cheltuieli cu personalul"][year] || 0;
            let alteImpozite =
                +profitLossData[
                    "Cheltuieli cu alte impozite, taxe și vărsăminte asimilate"
                ][year] || 0;

            let profitNet =
                +profitLossData["Profit net al exercițiului financiar"][year] ||
                0;
            let pierdereNeta =
                +profitLossData["Pierdere netă al exercițiului financiar"][
                    year
                ] || 0;
            let profitFinanciar =
                +profitLossData["Profit financiar"][year] || 0;
            let pierdereFinanciara =
                +profitLossData["Pierdere financiară"][year] || 0;
            let profitBrut = +profitLossData["Profit brut"][year] || 0;
            let pierdereBruta = +profitLossData["Pierdere brută"][year] || 0;

            let profitExploatare =
                +profitLossData["Profit din exploatare "][year] || 0;
            let pierdereExploatare =
                +profitLossData["Pierdere din exploatare"][year] || 0;
            let CA = +profitLossData["Cifra de afaceri netă"][year] || 0;

            // 🔹 Calculați componentele derivate
            const totalAct = totalActive(ai, ac, chAv);
            const datoriiTot = datoriiTotale(datoriiLungi, datoriiCurente);
            const totalPas = totalPasiv(
                capitaluriProprii,
                datoriiLungi,
                venituriAvans,
            );
            const capPermanente = capitaluriPermanente(
                capitaluriProprii,
                datoriiLungi,
                subventiiInvestitii,
                provizioane,
            );

            const PEX_ = pex(prodVanduta, soldC, soldD, venituriImobilizari);
            const MC_ = mc(venituriMarfuri, cheltuieliMarfuri);
            const CI_ = ci(
                cheltuieliMP,
                alteCheltuieliMateriale,
                utilitati,
                cheltuieliMarfuri,
                reduceriComerciale,
                prestatiiExterne,
            );
            const VA_ = valoareaAdaugata(PEX_, MC_, CI_);
            const EBE_ = excedentBrutExploatare(
                VA_,
                subventieExploatare,
                cheltuieliPersonal,
                alteImpozite,
            );

            // 🔹 Salvează rezultatele în indicatori
            indicatori.cifraAfaceri[year] = CA;
            indicatori.PEX[year] = PEX_;
            indicatori.MC[year] = MC_;
            indicatori.valoareAdaugata[year] = VA_;
            indicatori.execedentBrutExploatare[year] = EBE_;

            indicatori.rataRentabilitatiiEconomice[year] = ROA(
                profitNet,
                totalAct,
            );
            indicatori.rataRentabilitatiiFinanciare[year] = ROE(
                profitNet,
                capitaluriProprii,
            );
            indicatori.rataRentabilitateResurseConsumate[year] =
                rataRentabilitateResurseConsumate(profitExploatare, CA);
            indicatori.rataActiveImobilizate[year] = rataActiveImobilizate(
                ai,
                totalAct,
            );
            indicatori.rataActiveCirculante[year] = rataActiveCirculante(
                ac,
                totalAct,
            );
            indicatori.rataStocurilor[year] = rataStocurilor(stocuri, ac);
            indicatori.rataCreantelor[year] = rataCreantelor(creante, ac);
            indicatori.rataDisponibilitatilor[year] = rataDisponibilitatilor(
                disponibilitati,
                ac,
            );
            indicatori.rataNumerarEchivalente[year] = rataNumerarEchivalente(
                disponibilitati,
                investitiiScurt,
                ac,
            );
            indicatori.rataStabilitatiiFinanciare[year] =
                rataStabilitatiiFinanciare(capPermanente, totalPas);
            indicatori.rataAutonomieiFinanciare[year] =
                rataAutonomieiFinanciare(capitaluriProprii, totalPas);
            indicatori.rataIndatorariiGlobale[year] = rataIndatorariiGlobale(
                datoriiTot,
                totalPas,
            );
            indicatori.rataLichiditatiiGenerale[year] =
                rataLichiditatiiGenerale(ac, datoriiCurente);
            indicatori.rataLichiditatiiImediate[year] =
                rataLichiditatiiImediate(ac, stocuri, datoriiCurente);
            indicatori.rataLichiditatiiLaVedere[year] =
                rataLichiditatiiLaVedere(
                    disponibilitati,
                    investitiiScurt,
                    datoriiCurente,
                );
            indicatori.rataSolvabilitatiiGenerale[year] =
                rataSolvabilitatiiGenerale(totalAct, datoriiTot);
            indicatori.rataSolvabilitatiiPatrimoniale[year] =
                rataSolvabilitatiiPatrimoniale(
                    capitaluriProprii,
                    capPermanente,
                );

            const fr = fondRulment(ac, chAv, datoriiCurente, venituriAvans);
            const nfr = necesarFondRulment(
                stocuri,
                creante,
                chAv,
                datoriiCurente,
                venituriAvans,
            );
            indicatori.fondRulment[year] = fr;
            indicatori.necesarFondRulment[year] = nfr;
            indicatori.trezorerieNet[year] = trezorerieNet(fr, nfr);

            indicatori.profitExploatare[year] = profitExploatare;
            indicatori.pierdereExploatare[year] = pierdereExploatare;
            indicatori.profitFinanciar[year] = profitFinanciar;
            indicatori.pierdereFinanciara[year] = pierdereFinanciara;
            indicatori.profitBrut[year] = profitBrut;
            indicatori.pierdereBruta[year] = pierdereBruta;
            indicatori.profitNet[year] = profitNet;
            indicatori.pierdereNeta[year] = pierdereNeta;
        }

        console.log("Indicatori calculați:", indicatori);
        return true; // ✅ All good
    }

    let indicatori = {
        cifraAfaceri: {},
        PEX: {},
        MC: {},
        valoareAdaugata: {},
        execedentBrutExploatare: {},
        rataRentabilitatiiEconomice: {},
        rataRentabilitatiiFinanciare: {},
        rataRentabilitateResurseConsumate: {},
        rataActiveImobilizate: {},
        rataActiveCirculante: {},
        rataStocurilor: {},
        rataCreantelor: {},
        rataDisponibilitatilor: {},
        rataNumerarEchivalente: {},
        rataStabilitatiiFinanciare: {},
        rataAutonomieiFinanciare: {},
        rataIndatorariiGlobale: {},
        rataLichiditatiiGenerale: {},
        rataLichiditatiiImediate: {},
        rataLichiditatiiLaVedere: {},
        rataSolvabilitatiiGenerale: {},
        rataSolvabilitatiiPatrimoniale: {},
        fondRulment: {},
        necesarFondRulment: {},
        trezorerieNet: {},
        profitExploatare: {},
        pierdereExploatare: {},
        profitFinanciar: {},
        pierdereFinanciara: {},
        profitBrut: {},
        pierdereBruta: {},
        profitNet: {},
        pierdereNeta: {},
    };

    function preloadDummyData() {
        for (let field in balanceSheetData) {
            for (let year of years) {
                balanceSheetData[field][year] = Math.floor(
                    Math.random() * 10000,
                );
            }
        }

        for (let field in profitLossData) {
            for (let year of years) {
                profitLossData[field][year] = Math.floor(
                    Math.random() * 1000000,
                );
            }
        }

        calculateIndicators(); // run your logic again after populating
    }

    // Cifra de afacere
    // Valoarea adaugata
    // Ebe
    // Rezultatul financiar si de exploatare (profit sau pierdere)
    // Rezultatul de exploatare (profit sau pierdere)
    // Rezultatul net al exercitiului (profit sau pierdere)
    // ROA
    // ROE
    // Rrrc
    // Rata activelor imobilizate
    // Rata active circulante
    // Rata stocurilor
    // Rata creante
    // Rata disponibilitatii
    // Rata numerar si exchivalente
    // Rata stabilitatii financiare
    // Rata autonomiei financiare
    // Rata indatorarii globale
    // Rata lichiditatii generale
    // Rata lichidatii imediate
    // Rata lichidatii la vedere
    // Rata solvabilitatii generale
    // Rata solvabilitatii patrimoniale
    // Fondul de rulmenti
    // Necesarul de font de rulment

    async function sendIndicatorsToAI() {
        pdfGenerating = true;

        const financialData = [];
        const excludeIndicators = ["PEX", "MC", "CI"];

        for (const [indicator, values] of Object.entries(indicatori)) {
            if (!excludeIndicators.includes(indicator)) {
                financialData.push(
                    `${indicator}: ${years
                        .map(
                            (year) =>
                                `${year} = ${values[year]?.toFixed(2) ?? "—"}`,
                        )
                        .join(", ")}`,
                );
            }
        }

        const payload = {
            financialData: financialData.join("\n"),
        };

        console.log("Date transmise catre AI: ", payload);

        try {
            const response = await fetch(
                "https://analiza-financiara-ai.api-hub.xyz/api/entitati/openai",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                },
            );

            const result = await response.json();
            if (response.ok && result?.data?.response) {
                aiResponse = result.data.response;
            } else {
                aiResponse = `Eroare AI: ${result.message}`;
            }
        } catch (err) {
            console.error("Eroare la trimiterea datelor:", err);
            aiResponse = "Eroare la comunicarea cu serverul.";
        }
    }

    async function getUserDetails() {
        const email = Cookies.get("userEmail");

        if (!email) {
            console.error("❌ Email not found in localStorage.");
            return null;
        }

        try {
            const response = await fetch(
                "https://analiza-financiara-ai.api-hub.xyz/api/entitati/users/email",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                },
            );

            const result = await response.json();
            console.log("User data results:", result);

            // ✅ Extract user from result.data[0]
            if (
                response.ok &&
                Array.isArray(result.data) &&
                result.data.length > 0
            ) {
                const user = result.data[0];
                console.log("📄 Detalii utilizator:", user);
                return user;
            } else {
                console.error(
                    "❌ Utilizatorul nu a fost găsit:",
                    result.message,
                );
                return null;
            }
        } catch (err) {
            console.error("❌ Eroare la interogarea utilizatorului:", err);
            return null;
        }
    }
</script>

{#if pdfGenerating}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center overlay-loader"
    >
        <div
            class="text-white text-lg font-semibold animate-pulse flex gap-12 items-center"
        >
            Se generează analiza, diagnosticul financiar in format PDF și se
            trimite prin email...
            <div
                class="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"
            ></div>
        </div>
    </div>
{/if}

{#if isDownloadingPDF}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center overlay-loader"
    >
        <div
            class="text-white text-lg font-semibold animate-pulse flex gap-12 items-center"
        >
            Se generează diagnosticul financiar in format PDF și se pregătește
            descărcarea...
            <div
                class="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"
            ></div>
        </div>
    </div>
{/if}

<div id="pdf-report" class="print-pdf-fix">
    <div
        class="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-10 mt-[100px] space-y-12"
    >
        <!-- Bilanțul Contabil -->
        <div
            class="w-full max-w-6xl bg-white rounded-2xl shadow p-6 overflow-auto"
        >
            <h1 class="text-2xl font-bold text-center mb-4">
                Bilanțul Contabil
            </h1>
            <table class="min-w-full table-auto border border-gray-300">
                <thead class="bg-gray-200">
                    <tr>
                        <th class="border border-gray-300 px-4 py-2 text-left"
                            >Denumirea elementului</th
                        >
                        {#each years as year}
                            <th
                                class="border border-gray-300 px-4 py-2 text-center"
                                >{year}</th
                            >
                        {/each}
                    </tr>
                </thead>
                <tbody>
                    {#each campuriBilant as field}
                        <tr class="hover:bg-gray-50">
                            <td class="border border-gray-300 px-4 py-2"
                                >{field}</td
                            >
                            {#each years as year}
                                <td
                                    class="border border-gray-300 px-2 py-1 text-center"
                                >
                                    {#if isPdfMode}
                                        <div class="text-right">
                                            {balanceSheetData[field][year]}
                                        </div>
                                    {:else}
                                        <input
                                            type="number"
                                            min="0"
                                            step="any"
                                            bind:value={
                                                balanceSheetData[field][year]
                                            }
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-right focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                    {/if}
                                </td>
                            {/each}
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>

        <!-- Contul de Profit si Pierdere -->
        <div
            class="w-full max-w-6xl bg-white rounded-2xl shadow p-6 overflow-auto"
        >
            <h1 class="text-2xl font-bold text-center mb-4">
                Contul de Profit și Pierdere
            </h1>
            <table class="min-w-full table-auto border border-gray-300">
                <thead class="bg-gray-200">
                    <tr>
                        <th class="border border-gray-300 px-4 py-2 text-left"
                            >Denumirea elementului</th
                        >
                        {#each years as year}
                            <th
                                class="border border-gray-300 px-4 py-2 text-center"
                                >{year}</th
                            >
                        {/each}
                    </tr>
                </thead>
                <tbody>
                    {#each campuriCont as field}
                        <tr class="hover:bg-gray-50">
                            <td class="border border-gray-300 px-4 py-2"
                                >{field}</td
                            >
                            {#each years as year}
                                <td
                                    class="border border-gray-300 px-2 py-1 text-center"
                                >
                                    {#if isPdfMode}
                                        <div class="text-right">
                                            {profitLossData[field][year]}
                                        </div>
                                    {:else}
                                        <input
                                            type="number"
                                            min="0"
                                            step="any"
                                            bind:value={
                                                profitLossData[field][year]
                                            }
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-right focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                    {/if}
                                </td>
                            {/each}
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>

        <button
            on:click={async () => {
                aiLoading = true;
                preloadDummyData(); // for now; remove this line later
                calculateIndicators();
                await sendIndicatorsToAI();
                await generatePDFBlobAndSend(); // 👈 this handles the save-to-DB logic
                aiLoading = false;
            }}
            class="mb-8 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition no-print"
        >
            {aiLoading
                ? "Se analizează datele..."
                : "Calculează și analizează cu AI"}
        </button>
    </div>

    {#if aiResponse}
        {#if indicatori?.cifraAfaceri && Object.values(indicatori.cifraAfaceri).some((val) => val !== 0 && val !== null && val !== "")}
            <h2 class="text-2xl font-semibold mt-12 mb-8 text-center">
                Grafice Indicatori
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <IndicatorChart
                    label="Cifra de afaceri"
                    data={indicatori.cifraAfaceri}
                    {years}
                    type="line"
                    mode="time"
                />
                <IndicatorChart
                    label="Valoarea Adăugată (valoareAdaugata)"
                    data={indicatori.valoareAdaugata}
                    {years}
                    mode="time"
                />
                <IndicatorChart
                    label="Excedent Brut din Exploatare (EBE)"
                    data={indicatori.execedentBrutExploatare}
                    {years}
                    mode="time"
                />

                <IndicatorChart
                    label="ROA"
                    data={indicatori.rataRentabilitatiiEconomice}
                    {years}
                    type="line"
                    mode="time"
                />
                <IndicatorChart
                    label="ROE"
                    data={indicatori.rataRentabilitatiiFinanciare}
                    {years}
                    type="line"
                    mode="time"
                />
                <IndicatorChart
                    label="Rata rentabilității resurselor consumate (RRRC)"
                    data={indicatori.rataRentabilitateResurseConsumate}
                    {years}
                    type="line"
                    mode="time"
                />

                <IndicatorChart
                    label="Rata activelor imobilizate"
                    data={indicatori.rataActiveImobilizate}
                    {years}
                    mode="structure"
                />
                <IndicatorChart
                    label="Rata activelor circulante"
                    data={indicatori.rataActiveCirculante}
                    {years}
                    mode="structure"
                />
                <IndicatorChart
                    label="Rata stocurilor"
                    data={indicatori.rataStocurilor}
                    {years}
                    mode="structure"
                />
                <IndicatorChart
                    label="Rata creanțelor"
                    data={indicatori.rataCreantelor}
                    {years}
                    mode="structure"
                />
                <IndicatorChart
                    label="Rata disponibilităților"
                    data={indicatori.rataDisponibilitatilor}
                    {years}
                    mode="structure"
                />
                <IndicatorChart
                    label="Rata numerar + echivalente"
                    data={indicatori.rataNumerarEchivalente}
                    {years}
                    mode="structure"
                />

                <IndicatorChart
                    label="Rata stabilității financiare"
                    data={indicatori.rataStabilitatiiFinanciare}
                    {years}
                    mode="structure"
                />
                <IndicatorChart
                    label="Rata autonomiei financiare"
                    data={indicatori.rataAutonomieiFinanciare}
                    {years}
                    mode="structure"
                />
                <IndicatorChart
                    label="Rata îndatorării globale"
                    data={indicatori.rataIndatorariiGlobale}
                    {years}
                    mode="structure"
                />

                <IndicatorChart
                    label="Rata lichidității generale"
                    data={indicatori.rataLichiditatiiGenerale}
                    {years}
                    mode="time"
                />
                <IndicatorChart
                    label="Rata lichidității imediate"
                    data={indicatori.rataLichiditatiiImediate}
                    {years}
                    mode="time"
                />
                <IndicatorChart
                    label="Rata lichidității la vedere"
                    data={indicatori.rataLichiditatiiLaVedere}
                    {years}
                    mode="time"
                />
                <IndicatorChart
                    label="Rata solvabilității generale"
                    data={indicatori.rataSolvabilitatiiGenerale}
                    {years}
                    mode="time"
                />
                <IndicatorChart
                    label="Rata solvabilității patrimoniale"
                    data={indicatori.rataSolvabilitatiiPatrimoniale}
                    {years}
                    mode="time"
                />

                <IndicatorChart
                    label="Fond de rulment"
                    data={indicatori.fondRulment}
                    {years}
                    type="line"
                    mode="time"
                />
                <IndicatorChart
                    label="Necesar de fond de rulment"
                    data={indicatori.necesarFondRulment}
                    {years}
                    type="line"
                    mode="time"
                />
                <IndicatorChart
                    label="Trezorerie netă"
                    data={indicatori.trezorerieNet}
                    {years}
                    type="line"
                    mode="time"
                />
            </div>
        {:else}
            <p class="text-center text-gray-500 text-sm italic mt-2 py-12">
                Pentru a genera rezultatul analizei financiare, vă rugăm să
                completați datele necesare și să calculați indicatorii.
            </p>
        {/if}

        <div class="w-full mt-12 p-6 rounded-lg border border-gray-200">
            <h3 class="text-2xl font-semibold mb-4 text-center">
                Recomandarea AI
            </h3>
            <div
                class="text-sm whitespace-pre-line text-gray-800 leading-relaxed max-w-4xl mx-auto"
            >
                {aiResponse}
            </div>
        </div>

        {#if Object.keys(indicatori).length > 0}
            <div
                class="w-full max-w-6xl rounded-2xl p-6 overflow-auto mt-14 mx-auto"
            >
                <h2 class="text-2xl font-semibold mb-4 text-center">
                    Rezultate Indicatori
                </h2>
                <table class="table-auto w-full border border-gray-300 text-sm">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="border px-2 py-1">Indicator</th>
                            {#each years as year}
                                <th class="border px-2 py-1">{year}</th>
                            {/each}
                        </tr>
                    </thead>
                    <tbody>
                        {#each Object.entries(indicatori) as [name, values]}
                            {#if !["PEX", "MC", "CI"].includes(name)}
                                <tr>
                                    <td class="border px-2 py-1 font-medium"
                                        >{name}</td
                                    >
                                    {#each years as year}
                                        <td class="border px-2 py-1 text-right">
                                            {typeof values[year] === "number"
                                                ? values[year].toFixed(2)
                                                : "—"}
                                        </td>
                                    {/each}
                                </tr>
                            {/if}
                        {/each}
                    </tbody>
                </table>
            </div>
        {/if}

        <div class="text-center my-8">
            <button
                on:click={downloadPDF}
                class="mt-6 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition no-print mx-auto mb-10"
                disabled={isDownloadingPDF}
            >
                {isDownloadingPDF
                    ? "Se generează PDF-ul..."
                    : "Descarcă raportul PDF"}
            </button>
        </div>
    {/if}
</div>

<style>
    .print-pdf-fix {
        --tw-bg-opacity: 1;
        background-color: white !important;
        color: black !important;
        margin-bottom: 25px;
    }

    .print-pdf-fix input {
        background-color: white !important;
        border-color: black !important;
        color: black !important;
    }

    .print-pdf-fix .border-gray-300 {
        border-color: black !important;
    }

    .print-pdf-fix .bg-gray-100,
    .print-pdf-fix .bg-gray-200 {
        background-color: #eee !important;
    }

    .print-pdf-fix .text-gray-800 {
        color: black !important;
    }

    /* Hide buttons from PDF */
    .print-only-hide {
        display: none !important;
    }

    #print-report * {
        color: black !important;
        background-color: white !important;
    }

    @media print {
        .no-print {
            display: none !important;
        }
    }

    #printable-content {
        width: 100%;
        overflow: visible;
    }

    table {
        table-layout: auto !important;
        width: 100% !important;
    }

    .overlay-loader {
        background-color: rgba(0, 0, 0, 0.94);
    }
</style>
