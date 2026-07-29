// Datenbasis für spanischsprachige Anbieter-/Kündigungsseiten ("dar de baja").
// Bewusst vom deutschen `lib/brands.ts` getrennt.
//
// LEITLINIE: Auch online/telefonisch kündbare Anbieter sind hier willkommen (SEO-Reichweite).
// Wichtig ist EHRLICHKEIT: cancelChannel korrekt setzen — bei "online" zeigt die Seite die
// Schritt-für-Schritt-Anleitung im Vordergrund und das Tool nur dezent; bei "brief"/"beides"
// steht die carta de baja im Vordergrund. Nie so tun, als wäre ein Brief nötig, wenn er es nicht ist.
//
// WICHTIG: Kanäle, Fristen und Bedingungen pro Marke recherchieren und den Stand im
// sourceNote festhalten. Nichts erfinden — falsche Angaben schaden Vertrauen und Ranking.
// Neue Marke: hier einen Eintrag ergänzen — die Seite unter
// /es/ratgeber/dar-de-baja/<slug> entsteht automatisch (sitemap zieht die Slugs automatisch).

export interface BrandEs {
  slug: string;
  name: string;
  category: string;        // z.B. "Gimnasios"
  countryCode: string;     // "ES" | "MX" | "CO" | "AR" — steuert die Länder-Voreinstellung im Tool
  countryName: string;     // Anzeigename des Landes ("España", ...)
  intro: string;           // 1–2 Sätze Einstieg
  address?: string[];      // Postalische Kündigungsadresse (Zeilen) — wird ans Tool übergeben
  cancelMethods: string[]; // Wie man kündigt (Schriftform/Burofax, tienda, email …)
  facts: string[];         // Kernfakten (permanencia, preaviso, plazos …)
  faq: { q: string; a: string }[];
  sourceNote: string;      // Stand / Verifizierungshinweis
  global?: boolean;        // Marke ohne Länderbezug (Streaming etc.) — Seite spricht alle es-Länder an
  // Kündigungsweg: "online" (App/Konto reicht) | "brief" (Schriftform nötig) | "beides"
  cancelChannel?: "online" | "brief" | "beides";
  // Schritt-für-Schritt für die Online-Kündigung
  onlineSteps?: string[];
  // Direktlink zur Kündigungs-/Kontoseite
  onlineUrl?: string;
}

export const brandsEs: Record<string, BrandEs> = {
  // ── Gimnasios (España) ────────────────────────────────────────────────
  // Echter Dokument-Fall: Kündigung per Burofax/carta certificada mit 30 Tagen Frist.
  mcfit: {
    slug: "mcfit",
    name: "McFit",
    category: "Gimnasios",
    countryCode: "ES",
    countryName: "España",
    intro:
      "¿Vas a darte de baja de McFit? Aquí tienes cómo comunicar la baja, el preaviso y cómo generar una carta de baja formal en minutos, lista para enviar por burofax o correo.",
    address: ["McFit España", "C/ Fuencarral 6, 3ª planta", "28004 Madrid"],
    cancelMethods: [
      "Por escrito con 30 días de preaviso: burofax o carta certificada al centro, correo a C/ Fuencarral 6, 3ª planta, 28004 Madrid, fax al 91 182 90 01 o email a atencioncliente@mcfit.com.",
      "También puedes acudir a tu gimnasio y comunicar la baja al personal (te pedirán un formulario o carta).",
    ],
    facts: [
      "Indica tu nombre y apellidos, tu número de socio y que solicitas la BAJA DEFINITIVA del contrato.",
      "El preaviso es de 30 días y aplica tanto a contratos de duración determinada como indefinida.",
      "Tienes 14 días naturales desde la firma para desistir del contrato.",
      "Un burofax o carta certificada con acuse de recibo es la forma más segura de dejar constancia de tu baja.",
    ],
    faq: [
      {
        q: "¿Cómo me doy de baja de McFit?",
        a: "Por escrito con 30 días de preaviso: burofax o carta certificada al centro, email a atencioncliente@mcfit.com, fax al 91 182 90 01, o en tu gimnasio. Indica tu número de socio y que pides la baja definitiva.",
      },
      {
        q: "¿Cuánto preaviso pide McFit?",
        a: "30 días, tanto para contratos de duración determinada como indefinida.",
      },
      {
        q: "¿Por qué enviar un burofax?",
        a: "Porque deja constancia legal de la fecha en que solicitaste la baja: es tu prueba si siguen cobrándote.",
      },
    ],
    sourceNote:
      "Datos verificados en la ayuda oficial de McFit, julio 2026. Las condiciones pueden cambiar; confirma en tu contrato y en la web oficial antes de tramitar.",
  },
  // ── Streaming (global, online) ────────────────────────────────────────
  netflix: {
    slug: "netflix",
    name: "Netflix",
    category: "Streaming",
    countryCode: "ES",
    countryName: "España",
    global: true,
    cancelChannel: "online",
    intro:
      "Netflix se cancela directamente desde tu cuenta, sin cartas ni llamadas. Aquí tienes el paso a paso y lo que debes tener en cuenta.",
    onlineSteps: [
      "Inicia sesión en netflix.com desde el navegador.",
      "Abre tu perfil (arriba a la derecha) y entra en «Cuenta».",
      "En «Membresía», pulsa «Cancelar membresía» y confirma.",
      "Recibirás un correo de confirmación; podrás seguir viendo hasta el final del período ya pagado.",
    ],
    onlineUrl: "https://www.netflix.com/cancelplan",
    cancelMethods: [
      "Desde tu cuenta en netflix.com: «Cuenta» → «Cancelar membresía». No hace falta llamar ni escribir.",
      "Si pagas a través de Apple, Google o tu operadora, cancela directamente con ese proveedor.",
    ],
    facts: [
      "No hay plazo de preaviso: cancelas cuando quieras y el servicio sigue activo hasta el final del período pagado.",
      "Tu perfil y tus listas se guardan 10 meses por si vuelves.",
      "No hay reembolso proporcional: se disfruta el período ya pagado y luego termina.",
    ],
    faq: [
      { q: "¿Cómo cancelo Netflix?", a: "Desde tu cuenta en netflix.com: «Cuenta» → «Cancelar membresía». Se confirma en un clic." },
      { q: "¿Hay permanencia o preaviso?", a: "No. Cancelas cuando quieras y el servicio termina al final del período ya pagado." },
      { q: "Pago por Apple/Google, ¿dónde cancelo?", a: "Directamente en las suscripciones del App Store o de Google Play — no en Netflix." },
    ],
    sourceNote: "Datos verificados en la ayuda oficial de Netflix, julio 2026.",
  },

  spotify: {
    slug: "spotify",
    name: "Spotify",
    category: "Streaming",
    countryCode: "ES",
    countryName: "España",
    global: true,
    cancelChannel: "online",
    intro:
      "Spotify Premium se cancela en pocos clics desde el navegador — no desde la app. Aquí tienes el camino exacto.",
    onlineSteps: [
      "Abre spotify.com/account en el navegador e inicia sesión (desde la app no se puede).",
      "Entra en «Gestionar plan» / «Planes disponibles».",
      "Pulsa «Cancelar» en tu plan Premium y confirma.",
      "En tu cuenta verás hasta qué fecha sigue activo Premium.",
    ],
    onlineUrl: "https://www.spotify.com/account/",
    cancelMethods: [
      "Desde spotify.com/account en el navegador: «Gestionar plan» → «Cancelar». En la app no es posible.",
      "Si contrataste Premium a través de un tercero (Apple, tu operadora…), cancela con ese proveedor.",
    ],
    facts: [
      "Tras cancelar conservas tu cuenta, tus playlists y tus seguidores — solo pasas a la versión gratuita con anuncios.",
      "Premium sigue activo hasta el final del período ya pagado.",
      "No hay permanencia ni preaviso.",
    ],
    faq: [
      { q: "¿Cómo cancelo Spotify Premium?", a: "En spotify.com/account desde el navegador: «Gestionar plan» → «Cancelar». Desde la app no se puede." },
      { q: "¿Pierdo mis playlists?", a: "No. Tu cuenta y tus playlists se mantienen; solo pasas al plan gratuito con anuncios." },
      { q: "¿Cuándo deja de cobrarme?", a: "No habrá más cobros tras cancelar; Premium sigue hasta el final del período ya pagado." },
    ],
    sourceNote: "Datos verificados en la ayuda oficial de Spotify, julio 2026.",
  },

  "disney-plus": {
    slug: "disney-plus",
    name: "Disney+",
    category: "Streaming",
    countryCode: "ES",
    countryName: "España",
    global: true,
    cancelChannel: "online",
    intro:
      "Disney+ se cancela online desde tu cuenta — o desde Apple, Google o Amazon si contrataste por ahí. Aquí tienes el paso a paso.",
    onlineSteps: [
      "Inicia sesión en disneyplus.com desde el navegador.",
      "Abre tu perfil y entra en «Cuenta».",
      "Selecciona tu suscripción y pulsa «Cancelar suscripción», luego confirma.",
      "Podrás seguir viendo hasta el final del período ya pagado.",
    ],
    onlineUrl: "https://www.disneyplus.com/account",
    cancelMethods: [
      "Desde tu cuenta en disneyplus.com: «Cuenta» → tu suscripción → «Cancelar suscripción».",
      "Si contrataste a través de Apple, Google o Amazon, cancela en las suscripciones de ese proveedor.",
    ],
    facts: [
      "No hay reembolso proporcional: el acceso dura hasta el final del período pagado (mes o año).",
      "Con el plan anual conviene ponerse un recordatorio antes de la renovación.",
      "No hay permanencia ni preaviso.",
    ],
    faq: [
      { q: "¿Cómo cancelo Disney+?", a: "En disneyplus.com: «Cuenta» → tu suscripción → «Cancelar suscripción» y confirmar." },
      { q: "Contraté por Apple/Google/Amazon, ¿dónde cancelo?", a: "En las suscripciones del proveedor correspondiente: App Store, Google Play o tu cuenta de Amazon." },
      { q: "¿Me devuelven dinero?", a: "Por lo general no: el servicio sigue hasta el final del período ya pagado y luego termina." },
    ],
    sourceNote: "Datos verificados en la ayuda oficial de Disney+, julio 2026.",
  },

  // ── Telecomunicaciones (España) ───────────────────────────────────────
  movistar: {
    slug: "movistar",
    name: "Movistar",
    category: "Telecomunicaciones",
    countryCode: "ES",
    countryName: "España",
    cancelChannel: "beides",
    intro:
      "¿Quieres darte de baja de Movistar? Se tramita llamando al 1004, pero una carta de baja te da constancia por escrito. Aquí tienes ambos caminos.",
    onlineSteps: [
      "Llama gratis al 1004 (debe llamar el titular de la línea).",
      "Ten a mano tu DNI/NIE y el número de línea o contrato; no debe haber facturas pendientes.",
      "Indica si la baja es total o parcial (línea, fibra, TV o pack).",
      "Pide el número de expediente y la fecha prevista de la baja efectiva.",
    ],
    onlineUrl: "https://www.movistar.es/atencion-cliente/baja-linea-servicio",
    cancelMethods: [
      "Por teléfono: llamando al 1004 como titular, con DNI/NIE y número de contrato a mano.",
      "Por escrito con constancia: burofax o carta certificada solicitando la baja — tu prueba de la fecha si luego hay problemas de facturación.",
    ],
    facts: [
      "Movistar puede aplicar hasta un mes de preaviso antes de ejecutar la baja (Ley 11/2022).",
      "Si tienes router, decodificador u otros equipos de alquiler, devuélvelos en tienda o pide recogida en unos 15 días naturales tras la baja.",
      "Si tienes permanencia vigente, puede aplicarse una penalización — consúltala antes de tramitar.",
    ],
    faq: [
      { q: "¿Cómo me doy de baja de Movistar?", a: "Llamando al 1004 como titular, con DNI y número de contrato. Pide número de expediente y fecha de baja efectiva." },
      { q: "¿Hay preaviso?", a: "Movistar puede exigir hasta un mes de preaviso antes de ejecutar la baja." },
      { q: "¿Para qué sirve una carta de baja?", a: "Deja constancia escrita de cuándo solicitaste la baja — útil como prueba si siguen facturándote." },
    ],
    sourceNote: "Datos recopilados de fuentes públicas, julio 2026. Confirma condiciones y permanencia en tu contrato.",
  },

  "vodafone-es": {
    slug: "vodafone-es",
    name: "Vodafone",
    category: "Telecomunicaciones",
    countryCode: "ES",
    countryName: "España",
    cancelChannel: "beides",
    intro:
      "¿Quieres darte de baja de Vodafone? Lo más rápido es llamar al 22123, pero también puedes hacerlo por escrito con constancia. Aquí tienes ambos caminos.",
    onlineSteps: [
      "Llama gratis al 22123 (disponible 24 horas para clientes).",
      "Comunica al agente que quieres darte de baja; debe llamar el titular.",
      "Consulta antes tu permanencia en la app Mi Vodafone para saber si hay penalización.",
      "Pide confirmación por escrito y el número de solicitud.",
    ],
    cancelMethods: [
      "Por teléfono: llamando al 22123 como titular de la línea.",
      "Por correo postal: escrito a Vodafone España, Att. Departamento de Bajas, Avda. América 115, 28042 Madrid — mejor por burofax o carta certificada para dejar constancia.",
    ],
    address: ["Vodafone España", "Att. Departamento de Bajas", "Avda. América 115", "28042 Madrid"],
    facts: [
      "Si tu permanencia no ha terminado, se aplica una penalización — puedes consultarla en Mi Vodafone o llamando al 123.",
      "Derecho de desistimiento: 14 días naturales si contrataste a distancia (7 días en tienda física).",
      "La baja tarda hasta 2 días laborables en hacerse efectiva.",
    ],
    faq: [
      { q: "¿Cómo me doy de baja de Vodafone?", a: "Llamando al 22123 como titular, o por escrito al Departamento de Bajas (Avda. América 115, 28042 Madrid), mejor por burofax." },
      { q: "¿Qué pasa si tengo permanencia?", a: "Se aplica una penalización proporcional. Consúltala en la app Mi Vodafone o llamando al 123 antes de tramitar la baja." },
      { q: "¿Cuánto tarda la baja?", a: "Hasta 2 días laborables desde la solicitud." },
    ],
    sourceNote: "Datos recopilados de fuentes públicas, julio 2026. Confirma condiciones y permanencia en tu contrato.",
  },

  // ── Telecomunicaciones (México) ───────────────────────────────────────
  telcel: {
    slug: "telcel",
    name: "Telcel",
    category: "Telecomunicaciones",
    countryCode: "MX",
    countryName: "México",
    cancelChannel: "beides",
    intro:
      "¿Quieres cancelar tu plan de renta Telcel? Se tramita por teléfono o en un Centro de Atención a Clientes — y una carta de cancelación te deja constancia por escrito.",
    onlineSteps: [
      "Llama al 800 220 9595 o acude a un Centro de Atención a Clientes (CAC) con identificación oficial.",
      "Ten a mano tu número telefónico; el trámite debe hacerlo el titular.",
      "Verifica antes tu plazo forzoso: marcando *111 desde tu Telcel conoces la penalización si aún no termina.",
      "Liquida cualquier adeudo pendiente y pide comprobante o folio de la cancelación.",
    ],
    cancelMethods: [
      "Por teléfono al 800 220 9595 o en persona en un CAC, con identificación oficial y sin adeudos.",
      "Por escrito: una carta de cancelación entregada o enviada con acuse deja constancia de la fecha de tu solicitud.",
    ],
    facts: [
      "Si el plazo forzoso sigue vigente, la penalización es del 20% de la renta mensual por cada mes restante.",
      "Si compraste un equipo con el plan, debe estar liquidado para cancelar.",
      "La cancelación en sí es gratuita; conserva el folio como prueba.",
    ],
    faq: [
      { q: "¿Cómo cancelo mi plan Telcel?", a: "Llamando al 800 220 9595 o en un Centro de Atención a Clientes, con identificación oficial y sin adeudos pendientes." },
      { q: "¿Qué pasa si mi plazo forzoso no ha terminado?", a: "Pagas una penalización del 20% de tu renta mensual por cada mes que falte. Marca *111 para conocer el monto exacto." },
      { q: "¿Puedo conservar mi número?", a: "Sí, mediante portabilidad: contrata con el nuevo operador y él gestiona el cambio — así no pierdes tu número." },
    ],
    sourceNote: "Datos recopilados de fuentes públicas, julio 2026. Confirma condiciones en tu contrato Telcel.",
  },

  izzi: {
    slug: "izzi",
    name: "izzi",
    category: "Telecomunicaciones",
    countryCode: "MX",
    countryName: "México",
    cancelChannel: "beides",
    intro:
      "¿Quieres cancelar izzi? Se tramita por teléfono o en sucursal — y una carta de cancelación te deja constancia por escrito de la fecha.",
    onlineSteps: [
      "Llama al 050 desde tu línea izzi o al 800 120 5000 desde cualquier teléfono.",
      "Elige la opción de alta, baja y modificación del servicio y luego cancelación; debe llamar el titular con identificación oficial.",
      "Anota el número de folio que te den — lo necesitarás en la sucursal.",
      "Devuelve los equipos (módem, decodificadores) en una sucursal izzi presentando el folio.",
    ],
    cancelMethods: [
      "Por teléfono: 050 desde tu línea izzi o 800 120 5000, como titular y sin adeudos.",
      "En sucursal: con identificación oficial, los equipos del servicio y el folio de la llamada.",
      "Por escrito: una carta de cancelación con acuse deja constancia de la fecha de tu solicitud.",
    ],
    facts: [
      "Si tienes plazo forzoso vigente, deberás liquidar los meses restantes.",
      "La baja tarda de 2 a 3 días hábiles en hacerse efectiva.",
      "No olvides devolver todos los equipos para evitar cargos adicionales.",
    ],
    faq: [
      { q: "¿Cómo cancelo izzi?", a: "Llama al 050 desde tu línea izzi o al 800 120 5000, pide la cancelación como titular y anota el folio. Luego devuelve los equipos en sucursal." },
      { q: "¿Qué necesito para cancelar?", a: "Ser titular, identificación oficial (INE, pasaporte…), no tener adeudos y devolver los equipos." },
      { q: "¿Cuánto tarda la cancelación?", a: "De 2 a 3 días hábiles tras la solicitud." },
    ],
    sourceNote: "Datos recopilados de la ayuda oficial de izzi y fuentes públicas, julio 2026.",
  },

  // ── Gimnasios (LatAm) ─────────────────────────────────────────────────
  "smart-fit": {
    slug: "smart-fit",
    name: "Smart Fit",
    category: "Gimnasios",
    countryCode: "MX",
    countryName: "México",
    cancelChannel: "beides",
    intro:
      "¿Quieres cancelar tu plan de Smart Fit? La cancelación se hace en tu gimnasio base — y conviene hacerla con 30 días de anticipación. Aquí tienes el paso a paso.",
    onlineSteps: [
      "Acude a tu unidad base (el gimnasio donde te inscribiste) con una identificación oficial.",
      "Solicita la cancelación en recepción al menos 30 días antes de tu próximo cargo mensual.",
      "Revisa tu contrato (plan Smart o Black) por posibles condiciones de permanencia.",
      "Pide un comprobante por escrito de la cancelación.",
    ],
    cancelMethods: [
      "En persona en tu unidad base, con identificación oficial y 30 días antes del siguiente cargo.",
      "En algunos países (p. ej. Colombia) también mediante el formulario oficial de contacto de Smart Fit.",
      "Una carta de cancelación entregada con acuse te deja constancia de la fecha de tu solicitud.",
    ],
    facts: [
      "Cancela al menos 30 días antes de tu próximo cargo para evitar un cobro adicional.",
      "La cancelación se tramita en tu unidad base, no en cualquier sucursal (según país).",
      "Guarda el comprobante de cancelación por si aparecen cargos posteriores.",
    ],
    faq: [
      { q: "¿Cómo cancelo mi plan Smart Fit?", a: "En tu unidad base, con identificación oficial y al menos 30 días antes del próximo cargo mensual." },
      { q: "¿Por qué 30 días antes?", a: "Porque el cobro del mes siguiente ya está programado: cancelando con 30 días solo se aplica ese último cargo." },
      { q: "¿Puedo cancelar online?", a: "Depende del país: en Colombia existe un formulario oficial; en México la vía habitual es presencial en tu unidad base." },
    ],
    sourceNote: "Datos de las páginas oficiales de ayuda de Smart Fit (México y Colombia), julio 2026.",
  },

  // ── Seguros (España) ──────────────────────────────────────────────────
  mapfre: {
    slug: "mapfre",
    name: "Mapfre",
    category: "Seguros",
    countryCode: "ES",
    countryName: "España",
    cancelChannel: "brief",
    intro:
      "¿Quieres dar de baja tu seguro de Mapfre? La ley exige comunicarlo por escrito con un mes de antelación al vencimiento. Aquí tienes cómo hacerlo con constancia.",
    address: ["Mapfre España", "Carretera de Pozuelo 50", "28222 Majadahonda", "Madrid"],
    cancelMethods: [
      "Por escrito con al menos 1 mes de antelación al vencimiento (art. 22 Ley de Contrato de Seguro): burofax o carta certificada a Carretera de Pozuelo 50, 28222 Majadahonda (Madrid).",
      "También desde el Área de Cliente de Mapfre o por fax al 915 815 252 — guarda siempre el justificante.",
    ],
    facts: [
      "El preaviso legal es de 1 mes antes del vencimiento de la póliza; si lo dejas pasar, se renueva un año más.",
      "Indica número de póliza, tomador y la solicitud expresa de no renovación / baja.",
      "Si vendes el vehículo asegurado, puedes cancelar sin esperar al vencimiento presentando el justificante de venta.",
    ],
    faq: [
      { q: "¿Cuánto preaviso pide Mapfre?", a: "1 mes antes del vencimiento de la póliza, según el art. 22 de la Ley de Contrato de Seguro." },
      { q: "¿Cómo comunico la baja?", a: "Por escrito con constancia: burofax o carta certificada a Carretera de Pozuelo 50, 28222 Majadahonda (Madrid), o desde el Área de Cliente." },
      { q: "¿Y si vendí el coche?", a: "La venta del vehículo es una excepción: puedes cancelar el seguro sin esperar al vencimiento, aportando el justificante de la venta." },
    ],
    sourceNote: "Datos recopilados de fuentes públicas, julio 2026. Confirma condiciones en tu póliza.",
  },

  sanitas: {
    slug: "sanitas",
    name: "Sanitas",
    category: "Seguros",
    countryCode: "ES",
    countryName: "España",
    cancelChannel: "brief",
    intro:
      "¿Quieres dar de baja tu seguro de salud de Sanitas? Hay que comunicarlo con un mes de antelación al vencimiento de la póliza. Aquí tienes cómo hacerlo con constancia.",
    cancelMethods: [
      "Por escrito con al menos 1 mes de antelación al vencimiento: correo a atencioncliente@sanitas.es o carta certificada / burofax — guarda el justificante.",
      "También por teléfono (91 752 28 52 / 93 362 34 49) o en una oficina de Sanitas, pero pide siempre confirmación por escrito.",
    ],
    facts: [
      "Si no comunicas la baja con 1 mes de antelación al vencimiento, la póliza se renueva automáticamente un año más.",
      "Incluye tus datos personales, el número de póliza y la solicitud expresa de baja.",
      "Si tienes varias pólizas con Sanitas, cada una se cancela por separado — dar de baja una no cancela las demás.",
    ],
    faq: [
      { q: "¿Cuánto preaviso pide Sanitas?", a: "1 mes antes del vencimiento de la póliza. Si no, se renueva automáticamente por otro año." },
      { q: "¿Cómo comunico la baja?", a: "Por escrito a atencioncliente@sanitas.es o por carta certificada/burofax, indicando número de póliza y solicitud expresa de baja." },
      { q: "Tengo varias pólizas, ¿basta una carta?", a: "No. Cada póliza tiene su número y su vencimiento: comunica la baja de cada producto por separado." },
    ],
    sourceNote: "Datos recopilados de fuentes públicas, julio 2026. Confirma condiciones en tu póliza.",
  },
};

export const allBrandEsSlugs = Object.keys(brandsEs);

export function getBrandEs(slug: string): BrandEs | undefined {
  return brandsEs[slug];
}
