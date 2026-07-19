// Datenbasis für spanischsprachige Anbieter-/Kündigungsseiten ("dar de baja").
// Bewusst vom deutschen `lib/brands.ts` getrennt: In Spanien/Lateinamerika läuft die
// Kündigung meist über Telefon, Área de Cliente/App oder Portabilidad — nicht über eine
// feste Postadresse wie in DACH. Deshalb ein methodenorientiertes Modell (cancelMethods)
// statt erfundener Adressen/Fristen.
//
// WICHTIG: Telefonnummern, Kanäle und Bedingungen pro Marke recherchieren und den Stand
// im sourceNote festhalten. Nichts erfinden — falsche Angaben schaden Vertrauen und Ranking.
// Neue Marke: hier einen Eintrag ergänzen — die Seite unter
// /es/ratgeber/dar-de-baja/<slug> entsteht automatisch (Eintrag in app/sitemap.ts nicht vergessen).

export interface BrandEs {
  slug: string;
  name: string;
  category: string;        // z.B. "Móvil e internet", "Streaming"
  countryCode: string;     // "ES" | "MX" | "CO" | "AR" — steuert die Länder-Voreinstellung im Tool
  countryName: string;     // Anzeigename des Landes ("España", ...)
  intro: string;           // 1–2 Sätze Einstieg
  cancelMethods: string[]; // Wie man kündigt (Telefon, Área de Cliente/App, tienda, email …)
  facts: string[];         // Kernfakten (permanencia, portabilidad, equipos, plazos …)
  faq: { q: string; a: string }[];
  sourceNote: string;      // Stand / Verifizierungshinweis
}

export const brandsEs: Record<string, BrandEs> = {
  movistar: {
    slug: "movistar",
    name: "Movistar",
    category: "Móvil e internet",
    countryCode: "ES",
    countryName: "España",
    intro:
      "¿Quieres dar de baja tu línea de Movistar (móvil, fibra o TV)? Aquí tienes cómo hacerlo, qué necesitas y cómo generar una carta de baja formal en minutos para dejar constancia por escrito.",
    cancelMethods: [
      "Por teléfono: llama gratis al 1004. Solo puede pedir la baja el titular del contrato y no debes tener facturas pendientes.",
      "Online: entra en tu Área de Cliente o en la app Mi Movistar y cancela los servicios que quieras.",
      "En persona: en cualquier tienda Movistar.",
    ],
    facts: [
      "Movistar no aplica permanencia general, así que normalmente no hay penalización por darte de baja. Puede haber excepciones si contrataste una oferta o un dispositivo con compromiso.",
      "Si te cambias de compañía y quieres conservar tu número, no pidas la baja: solicita la portabilidad en la nueva operadora y ellos gestionan la cancelación con Movistar.",
      "Si tienes fibra, TV o un equipo en alquiler, devuelve los aparatos en 15 días naturales (en tienda o con recogida a domicilio).",
      "Pide siempre el número de referencia de la baja al terminar: es tu prueba si hay algún problema posterior con la facturación.",
    ],
    faq: [
      {
        q: "¿Qué teléfono es para dar de baja Movistar?",
        a: "El 1004, gratuito. Solo el titular del contrato puede tramitar la baja y no debes tener facturas pendientes de pago.",
      },
      {
        q: "¿Tengo que pagar penalización al darme de baja de Movistar?",
        a: "En general no, porque Movistar no tiene permanencia. Puede haber excepciones si contrataste una promoción o un terminal con compromiso de permanencia.",
      },
      {
        q: "¿Cómo conservo mi número al dejar Movistar?",
        a: "Con una portabilidad a otra compañía: la nueva operadora gestiona la baja con Movistar y tú mantienes tu número. Si pides la baja directa, perderás el número.",
      },
    ],
    sourceNote:
      "Datos verificados en fuentes públicas (web oficial de Movistar y comparadores), julio 2026. Los teléfonos y condiciones pueden cambiar; confirma siempre en la web oficial antes de tramitar.",
  },

  orange: {
    slug: "orange",
    name: "Orange",
    category: "Móvil e internet",
    countryCode: "ES",
    countryName: "España",
    intro:
      "¿Necesitas dar de baja tu contrato de Orange? Te explicamos el teléfono, los pasos y qué documentación te pedirán — y puedes generar una carta de baja formal en minutos como respaldo.",
    cancelMethods: [
      "Por teléfono: llama gratis al 1470 (particulares) o al 1471 (empresas), de lunes a viernes de 9:00 a 21:00.",
      "El agente te enviará por email un formulario de baja; tendrás que adjuntar una copia del DNI/NIE del titular del contrato.",
    ],
    facts: [
      "Las tiendas Orange no tramitan la baja del contrato (eso se hace por teléfono), pero sí son el canal para devolver el router o el descodificador de TV una vez confirmada.",
      "Para conservar tu número, solicita la portabilidad en la nueva compañía en lugar de pedir la baja directamente.",
      "Si aún tienes permanencia, pagarás una penalización que se prorratea según los días que te queden de compromiso.",
    ],
    faq: [
      {
        q: "¿Qué número marco para darme de baja de Orange?",
        a: "El 1470 si eres particular o el 1471 si eres empresa, gratuitos, de lunes a viernes de 9:00 a 21:00.",
      },
      {
        q: "¿Puedo darme de baja de Orange en una tienda?",
        a: "No. La baja se tramita por teléfono; en la tienda solo puedes devolver los equipos (router, descodificador) después de confirmar la cancelación.",
      },
      {
        q: "¿Cómo mantengo mi número al dejar Orange?",
        a: "Pide una portabilidad a la nueva operadora en vez de la baja: así conservas tu número y ellos cancelan el servicio con Orange.",
      },
    ],
    sourceNote:
      "Datos verificados en fuentes públicas (ayuda oficial de Orange y comparadores), julio 2026. Los teléfonos y condiciones pueden cambiar; confirma siempre en la web oficial antes de tramitar.",
  },

  vodafone: {
    slug: "vodafone",
    name: "Vodafone",
    category: "Móvil e internet",
    countryCode: "ES",
    countryName: "España",
    intro:
      "¿Quieres dar de baja Vodafone (fibra, móvil o TV)? Aquí tienes los teléfonos, los pasos online y los plazos — más una carta de baja formal lista en minutos para dejar constancia.",
    cancelMethods: [
      "Por teléfono: llama gratis al 22123 (o al 912 222 123) y di «Bajas», de lunes a viernes de 9:00 a 21:00.",
      "Online: en la web o en la app Mi Vodafone; te llega un código por SMS, seleccionas los productos y confirmas la baja.",
    ],
    facts: [
      "Puedes resolver el contrato en cualquier momento avisando con dos días hábiles de antelación; la baja puede tardar hasta 2 días laborables en hacerse efectiva.",
      "Para conservar tu número, haz una portabilidad a otra compañía en lugar de pedir la baja.",
      "Si no ha terminado tu periodo de permanencia, tendrás que pagar la penalización correspondiente.",
    ],
    faq: [
      {
        q: "¿Qué teléfono es para dar de baja Vodafone?",
        a: "El 22123 (gratuito) o el 912 222 123, indicando «Bajas», de lunes a viernes de 9:00 a 21:00. También puedes iniciarla en la app Mi Vodafone.",
      },
      {
        q: "¿Cuánto tarda la baja de Vodafone?",
        a: "Puede tardar hasta dos días laborables. Tienes derecho a resolver el contrato avisando con dos días hábiles de antelación.",
      },
      {
        q: "¿Perderé mi número al darme de baja?",
        a: "Sí, si pides la baja directa. Para conservarlo, solicita una portabilidad a la nueva operadora.",
      },
    ],
    sourceNote:
      "Datos verificados en fuentes públicas (ayuda oficial de Vodafone y comparadores), julio 2026. Los teléfonos y condiciones pueden cambiar; confirma siempre en la web oficial antes de tramitar.",
  },

  yoigo: {
    slug: "yoigo",
    name: "Yoigo",
    category: "Móvil e internet",
    countryCode: "ES",
    countryName: "España",
    intro:
      "¿Vas a dar de baja tu línea de Yoigo? Te contamos el teléfono, qué datos necesitas y cómo evitar penalizaciones — y puedes crear una carta de baja formal en minutos.",
    cancelMethods: [
      "Por teléfono: llama al 622 (o al 622 622 622 desde otro operador).",
      "Online: desde tu área de clientes Mi Yoigo, en la web o la app.",
      "En persona: en una tienda Yoigo.",
    ],
    facts: [
      "Ten a mano el DNI/NIE del titular, el número de línea o servicio y la cuenta bancaria asociada para la factura final.",
      "Revisa tu permanencia en Mi Yoigo antes de pedir la baja: la penalización puede llegar hasta unos 150 €.",
      "Si tienes fibra, es obligatorio devolver los equipos (router, descodificador, mando y cables), que están en régimen de cesión.",
      "La baja se tramita en un máximo de dos días hábiles. Para conservar tu número, haz una portabilidad.",
    ],
    faq: [
      {
        q: "¿Qué teléfono uso para darme de baja de Yoigo?",
        a: "El 622, o el 622 622 622 si llamas desde otro operador. También puedes hacerlo desde Mi Yoigo o en una tienda.",
      },
      {
        q: "¿Cuánto es la penalización por permanencia en Yoigo?",
        a: "Depende del tiempo que te quede; puede llegar hasta unos 150 €. Consulta tu permanencia exacta en Mi Yoigo antes de tramitar la baja.",
      },
      {
        q: "¿Tengo que devolver el router de Yoigo?",
        a: "Sí, si tienes fibra. Los equipos están en cesión y hay que devolverlos; si no, Yoigo cobra una penalización por su valor.",
      },
    ],
    sourceNote:
      "Datos verificados en fuentes públicas (ayuda oficial de Yoigo y comparadores), julio 2026. Los teléfonos y condiciones pueden cambiar; confirma siempre en la web oficial antes de tramitar.",
  },

  masmovil: {
    slug: "masmovil",
    name: "MásMóvil",
    category: "Móvil e internet",
    countryCode: "ES",
    countryName: "España",
    intro:
      "¿Quieres dar de baja MásMóvil? Aquí tienes los teléfonos, el email y los pasos — más una carta de baja formal lista en minutos para dejar constancia por escrito.",
    cancelMethods: [
      "Por teléfono: llama al 2373 (desde una línea MásMóvil) o al 911 333 333 (desde otro operador), de lunes a domingo de 8:00 a 00:00.",
      "Por email: escribe a hola@masmovil.com comunicando tu baja y adjuntando una copia de tu DNI y tus datos.",
      "Por WhatsApp: al 605 51 54 54.",
    ],
    facts: [
      "Si tienes compromiso de permanencia, recibirás una factura adicional con la penalización pendiente además de la última factura de consumo.",
      "Devuelve el router de fibra en un plazo de 30 días hábiles; si no lo haces, tendrás que abonar su importe.",
      "Guarda tus últimas facturas antes de la baja: una vez tramitada no podrás recuperarlas. Para conservar tu número, haz una portabilidad.",
    ],
    faq: [
      {
        q: "¿Qué teléfono es para dar de baja MásMóvil?",
        a: "El 2373 desde una línea MásMóvil o el 911 333 333 desde otro operador, de lunes a domingo de 8:00 a 00:00. También por email a hola@masmovil.com.",
      },
      {
        q: "¿Puedo darme de baja de MásMóvil por email?",
        a: "Sí. Escribe a hola@masmovil.com indicando tu decisión de finalizar el contrato y adjunta una copia de tu DNI y tus datos.",
      },
      {
        q: "¿Hasta cuándo puedo devolver el router de MásMóvil?",
        a: "Dispones de 30 días hábiles para devolver el router de fibra. Si no lo devuelves, MásMóvil te cobrará su importe.",
      },
    ],
    sourceNote:
      "Datos verificados en fuentes públicas (ayuda oficial de MásMóvil y comparadores), julio 2026. Los teléfonos y condiciones pueden cambiar; confirma siempre en la web oficial antes de tramitar.",
  },

  // ── México ─────────────────────────────────────────────
  "telcel-mx": {
    slug: "telcel-mx",
    name: "Telcel",
    category: "Móvil e internet",
    countryCode: "MX",
    countryName: "México",
    intro:
      "¿Quieres cancelar tu plan de Telcel en México? Te explicamos cómo dar de baja tu línea pospago, qué necesitas y cómo generar una carta de baja formal en minutos para dejar constancia.",
    cancelMethods: [
      "Atención a clientes: marca *264 desde tu línea Telcel, 800 220 9518 o 01800 123 1114 desde otro teléfono (24 h).",
      "En persona: la vía segura para cancelar un plan pospago es acudir a un Centro de Atención a Clientes (CAC) Telcel; internet y teléfono no siempre completan la baja.",
    ],
    facts: [
      "Si tienes plan de prepago (Amigo), no hace falta dar de baja: basta con dejar de recargar. Esto aplica solo a los planes pospago.",
      "Solo el titular del contrato (o su representante legal) puede solicitar la cancelación.",
      "Cancela cuando ya cumpliste el plazo forzoso para evitar cargos por cancelación anticipada.",
      "Acude el día del corte de tu ciclo para que no te cobren un mes más, y pide el folio o comprobante de la baja.",
    ],
    faq: [
      {
        q: "¿Cómo cancelo mi plan Telcel pospago?",
        a: "La forma segura es acudir a un Centro de Atención a Clientes (CAC) Telcel. También puedes llamar a atención a clientes al *264 o 800 220 9518, pero la cancelación definitiva suele confirmarse de forma presencial.",
      },
      {
        q: "¿Me cobran penalización por cancelar Telcel?",
        a: "Si aún estás dentro del plazo forzoso del contrato, puede haber un cargo por cancelación anticipada. Si ya cumpliste el plazo, normalmente no hay penalización.",
      },
      {
        q: "¿Tengo que dar de baja mi línea prepago Telcel?",
        a: "No. El prepago (Amigo) no requiere baja: si dejas de recargar, la línea se da de baja por inactividad según las condiciones vigentes.",
      },
    ],
    sourceNote:
      "Datos verificados en fuentes públicas (comparadores y atención a clientes de Telcel), julio 2026. Los teléfonos y condiciones pueden cambiar; confirma en un CAC o en la web oficial antes de tramitar.",
  },

  "att-mx": {
    slug: "att-mx",
    name: "AT&T",
    category: "Móvil e internet",
    countryCode: "MX",
    countryName: "México",
    intro:
      "¿Vas a cancelar tu plan de AT&T en México? Aquí tienes los teléfonos, los requisitos y cómo generar una carta de baja formal en minutos como respaldo.",
    cancelMethods: [
      "Por teléfono: marca *611 desde tu línea AT&T o 800 101 0288 desde cualquier teléfono.",
      "Por la app Mi AT&T, o en una tienda/sucursal AT&T.",
    ],
    facts: [
      "Si tienes prepago (AT&T Prepago), no necesitas dar de baja: basta con dejar de recargar. Esto aplica a los planes pospago.",
      "Necesitas la cuenta en cero y al corriente de pago para que procesen la cancelación.",
      "Si aún tienes vigencia, AT&T aplica una penalización por cancelación anticipada que el asesor te confirma; ten a mano INE, comprobante de domicilio y último recibo.",
      "Exige siempre el folio de cancelación con fecha y nombre del asesor: es tu comprobante más importante.",
    ],
    faq: [
      {
        q: "¿Qué número marco para cancelar AT&T México?",
        a: "El *611 desde tu línea AT&T o el 800 101 0288 desde cualquier teléfono. También puedes hacerlo en la app Mi AT&T o en una sucursal.",
      },
      {
        q: "¿Qué necesito para cancelar mi plan AT&T?",
        a: "Tener la cuenta al corriente y en cero, tu INE vigente, comprobante de domicilio y último recibo. Si hay vigencia, se aplica una penalización que confirma el asesor.",
      },
      {
        q: "¿Qué es el folio de cancelación?",
        a: "Es el comprobante que acredita tu baja. Guárdalo con la fecha y el nombre del asesor; te sirve si después aparece algún cargo.",
      },
    ],
    sourceNote:
      "Datos verificados en fuentes públicas (comparadores y atención a clientes de AT&T México), julio 2026. Los teléfonos y condiciones pueden cambiar; confirma en la web oficial antes de tramitar.",
  },

  "movistar-mx": {
    slug: "movistar-mx",
    name: "Movistar",
    category: "Móvil e internet",
    countryCode: "MX",
    countryName: "México",
    intro:
      "¿Quieres dar de baja tu línea de Movistar en México? Te explicamos cómo hacerlo por teléfono, app o sucursal — y puedes generar una carta de baja formal en minutos para dejar constancia.",
    cancelMethods: [
      "Por teléfono: marca *611 desde tu línea Movistar o 800 888 8366 desde otro teléfono.",
      "Por la app Mi Movistar: entra en «Mi línea» y selecciona «Cancelar línea».",
      "En persona: en un centro de atención a clientes Movistar.",
    ],
    facts: [
      "El prepago no requiere baja: basta con dejar de recargar. Esto aplica a los planes pospago.",
      "Debes ser el titular y aportar datos de validación (nombre, dirección, fecha de nacimiento y RFC).",
      "Si contrataste un paquete con permanencia, puede haber penalización por cancelación anticipada. El proceso tarda hasta 48 horas.",
      "Ten en cuenta que Telefónica está en proceso de salida del mercado mexicano; confirma el estado de tu servicio y los canales vigentes al tramitar.",
    ],
    faq: [
      {
        q: "¿Cómo cancelo mi línea Movistar en México?",
        a: "Llamando al *611 (desde tu línea) o al 800 888 8366, desde la app Mi Movistar («Mi línea» → «Cancelar línea») o en un centro de atención. Solo el titular puede hacerlo.",
      },
      {
        q: "¿Cuánto tarda la baja de Movistar México?",
        a: "El proceso de cancelación puede tardar hasta 48 horas en completarse.",
      },
      {
        q: "¿Hay penalización por cancelar Movistar?",
        a: "Solo si contrataste un paquete con permanencia y cancelas antes de la fecha acordada; la penalización varía según los términos del plan.",
      },
    ],
    sourceNote:
      "Datos verificados en fuentes públicas (web y atención a clientes de Movistar México), julio 2026. Telefónica está saliendo del mercado mexicano, por lo que canales y condiciones pueden cambiar; confirma en la web oficial antes de tramitar.",
  },

  // ── Colombia ───────────────────────────────────────────
  "claro-co": {
    slug: "claro-co",
    name: "Claro",
    category: "Móvil e internet",
    countryCode: "CO",
    countryName: "Colombia",
    intro:
      "¿Necesitas cancelar tu plan pospago de Claro en Colombia? Te explicamos los canales, los plazos y qué necesitas — y puedes generar una carta de baja formal en minutos.",
    cancelMethods: [
      "Por teléfono: marca *611 desde tu celular Claro o 01 8000 341 818 desde cualquier teléfono.",
      "Por WhatsApp: al 311 200 0000.",
      "Online: radica una PQR en claro.com.co (Legal y Regulatorio → PQR), o acude a un Centro de Atención y Ventas (CAV).",
    ],
    facts: [
      "El prepago no requiere baja: basta con dejar de recargar. Esto aplica a los planes pospago.",
      "Debes estar al día con todas tus facturas; con saldo pendiente, Claro no procesa la cancelación.",
      "Claro tiene hasta 15 días hábiles para responder tu solicitud (y hasta 15 más si piden documentación adicional).",
      "Si tu plan tiene cláusula de permanencia, puede cobrarse una penalización proporcional al tiempo restante. Para conservar tu número, haz la portabilidad.",
    ],
    faq: [
      {
        q: "¿Cómo cancelo mi plan Claro Colombia?",
        a: "Radicando una PQR en la web de Claro, llamando al *611 o 01 8000 341 818, por WhatsApp al 311 200 0000, o en un Centro de Atención y Ventas (CAV).",
      },
      {
        q: "¿Cuánto tarda la cancelación en Claro?",
        a: "Claro dispone de hasta 15 días hábiles para responder; si solicitan documentación adicional, pueden sumarse otros 15 días hábiles.",
      },
      {
        q: "¿Debo estar al día para cancelar?",
        a: "Sí. Si tienes saldo pendiente, Claro no procesará la baja hasta que regularices tus facturas.",
      },
    ],
    sourceNote:
      "Datos verificados en fuentes públicas (asistencia oficial de Claro Colombia y comparadores), julio 2026. Los teléfonos y condiciones pueden cambiar; confirma en la web oficial antes de tramitar.",
  },

  "movistar-co": {
    slug: "movistar-co",
    name: "Movistar",
    category: "Móvil e internet",
    countryCode: "CO",
    countryName: "Colombia",
    intro:
      "¿Quieres cancelar tu plan pospago de Movistar en Colombia? Te explicamos cómo hacerlo por el portal, teléfono o de forma presencial — y puedes generar una carta de baja formal en minutos.",
    cancelMethods: [
      "Online: en el portal o la app Mi Movistar (selecciona «Móvil» → «Cancelación del servicio»); suele procesarse en un máximo de 3 días hábiles.",
      "Por teléfono: marca #611 desde tu línea Movistar.",
      "En persona: en una tienda o Centro de Experiencia Movistar (conviene agendar cita).",
    ],
    facts: [
      "El prepago no requiere baja: basta con dejar de recargar. Esto aplica a los planes pospago.",
      "Por regulación de la CRC puedes cancelar cuando quieras, pero debes estar al día (paz y salvo) con tu factura.",
      "Presenta la solicitud con varios días hábiles de antelación a tu fecha de corte para evitar un ciclo de facturación extra.",
      "Si tu plan tiene permanencia (fibra hogar o equipo subsidiado), se factura una terminación anticipada proporcional al tiempo restante.",
    ],
    faq: [
      {
        q: "¿Cómo cancelo mi plan Movistar en Colombia?",
        a: "Desde el portal o app Mi Movistar («Móvil» → «Cancelación del servicio»), llamando al #611 o en un Centro de Experiencia. Necesitas estar al día con tu factura.",
      },
      {
        q: "¿Con cuánta antelación debo pedir la baja?",
        a: "Con varios días hábiles antes de tu fecha de corte, para no pagar un ciclo de facturación adicional.",
      },
      {
        q: "¿Puedo cancelar aunque tenga permanencia?",
        a: "Sí, pero si hay cláusula de permanencia vigente Movistar factura una terminación anticipada proporcional al tiempo que falte.",
      },
    ],
    sourceNote:
      "Datos verificados en fuentes públicas (atención a clientes de Movistar Colombia y comparadores), julio 2026. Los teléfonos y condiciones pueden cambiar; confirma en la web oficial antes de tramitar.",
  },

  "tigo-co": {
    slug: "tigo-co",
    name: "Tigo",
    category: "Móvil e internet",
    countryCode: "CO",
    countryName: "Colombia",
    intro:
      "¿Vas a cancelar tu plan pospago de Tigo en Colombia? Te explicamos los teléfonos, los plazos y qué necesitas — y puedes generar una carta de baja formal en minutos.",
    cancelMethods: [
      "Por teléfono: marca *300 desde tu línea Tigo, 118 desde un fijo, o 01 8000 422 222 / 604 444 4141.",
      "Por WhatsApp: al 300 333 0000.",
    ],
    facts: [
      "El prepago no requiere baja: basta con dejar de recargar. Esto aplica a los planes pospago.",
      "Debes ser el titular y no tener deudas pendientes con Tigo.",
      "Tigo recomienda cancelar al menos 3 días antes de tu fecha de corte para no pagar otro mes; la cancelación total se aplica el mismo día.",
      "Ten a mano tu cédula y el número de cuenta o contrato (aparece en tu factura), y guarda el número de trámite como comprobante.",
    ],
    faq: [
      {
        q: "¿Qué número marco para cancelar Tigo Colombia?",
        a: "El *300 desde tu línea Tigo, el 118 desde un fijo, o el 01 8000 422 222 / 604 444 4141. También por WhatsApp al 300 333 0000.",
      },
      {
        q: "¿Con cuánta antelación conviene cancelar en Tigo?",
        a: "Al menos 3 días antes de tu fecha de corte, para no pagar otro mes de servicio.",
      },
      {
        q: "¿Puedo pasar de pospago a prepago en Tigo?",
        a: "Sí, Tigo permite cambiar tu línea de pospago a prepago si no quieres perder el número.",
      },
    ],
    sourceNote:
      "Datos verificados en fuentes públicas (ayuda oficial de Tigo Colombia y comparadores), julio 2026. Los teléfonos y condiciones pueden cambiar; confirma en la web oficial antes de tramitar.",
  },

  // ── Argentina ──────────────────────────────────────────
  "personal-ar": {
    slug: "personal-ar",
    name: "Personal",
    category: "Móvil e internet",
    countryCode: "AR",
    countryName: "Argentina",
    intro:
      "¿Querés dar de baja tu línea de Personal (Flow) en Argentina? Te explicamos todos los canales y cómo generar una carta de baja formal en minutos para dejar constancia.",
    cancelMethods: [
      "Por teléfono: llamá al 0800 444 0800 o marcá *111 desde tu celular Personal.",
      "Por WhatsApp: al +54 9 11 7195 0001 (elegí «Trámites» → «Pedir la baja» y confirmá con tu DNI).",
      "Online: desde la app o el sitio Mi Personal Flow, «Quiero dar de baja mi plan». También de forma presencial en una oficina.",
    ],
    facts: [
      "El prepago no requiere baja: basta con dejar de cargar crédito. Esto aplica a los planes pospago.",
      "Dar de baja es gratuito: la empresa no puede cobrarte penalización ni cargo por cancelación.",
      "Si pedís la baja perdés tu número; para conservarlo, hacé la portabilidad a otra compañía antes de darte de baja.",
      "Pedí y guardá el número de gestión de la baja como comprobante.",
    ],
    faq: [
      {
        q: "¿Cómo doy de baja mi línea Personal?",
        a: "Llamando al 0800 444 0800 o al *111, por WhatsApp al +54 9 11 7195 0001, desde Mi Personal Flow o en una oficina. El trámite es gratuito.",
      },
      {
        q: "¿Me pueden cobrar por dar de baja Personal?",
        a: "No. La baja es gratuita y la empresa no puede aplicar penalización ni cargo por cancelación.",
      },
      {
        q: "¿Pierdo mi número al darme de baja?",
        a: "Sí, si pedís la baja directa. Para conservarlo, hacé una portabilidad a otro operador antes de cancelar.",
      },
    ],
    sourceNote:
      "Datos verificados en fuentes públicas (comparadores y atención a clientes de Personal), julio 2026. Los teléfonos y condiciones pueden cambiar; confirmá en la web oficial antes de tramitar.",
  },

  "claro-ar": {
    slug: "claro-ar",
    name: "Claro",
    category: "Móvil e internet",
    countryCode: "AR",
    countryName: "Argentina",
    intro:
      "¿Querés dar de baja tu línea de Claro en Argentina? Te explicamos el teléfono, el botón de baja online y qué necesitás — y podés generar una carta de baja formal en minutos.",
    cancelMethods: [
      "Por teléfono: marcá *611 desde tu celular Claro o llamá al 0800 123 0611 desde cualquier teléfono.",
      "Online: usá el botón de baja en la web con tu DNI y número de línea.",
      "En persona: en una sucursal Claro.",
    ],
    facts: [
      "El prepago no requiere baja: basta con dejar de cargar crédito. Esto aplica a los planes pospago.",
      "Debés ser el titular de la línea y no tener facturas adeudadas.",
      "Por regulación, las operadoras deben ofrecer un botón de baja online que permite cancelar sin llamar.",
      "Pedí la baja definitiva y el número de gestión; guardá el comprobante. Para conservar tu número, hacé la portabilidad antes de la baja.",
    ],
    faq: [
      {
        q: "¿Cómo doy de baja mi línea Claro en Argentina?",
        a: "Llamando al *611 o al 0800 123 0611, usando el botón de baja online (con DNI y número de línea) o en una sucursal Claro. Debés ser el titular y estar al día.",
      },
      {
        q: "¿Qué es el botón de baja?",
        a: "Es una opción online obligatoria para las operadoras en Argentina que te permite solicitar la cancelación sin necesidad de llamar por teléfono.",
      },
      {
        q: "¿Cómo conservo mi número al dejar Claro?",
        a: "Hacé una portabilidad a otro operador antes de dar de baja; si pedís la baja directa, perdés el número.",
      },
    ],
    sourceNote:
      "Datos verificados en fuentes públicas (asistencia oficial de Claro Argentina y comparadores), julio 2026. Los teléfonos y condiciones pueden cambiar; confirmá en la web oficial antes de tramitar.",
  },

  "movistar-ar": {
    slug: "movistar-ar",
    name: "Movistar",
    category: "Móvil e internet",
    countryCode: "AR",
    countryName: "Argentina",
    intro:
      "¿Querés dar de baja tu servicio de Movistar en Argentina? Te explicamos los canales, los plazos legales y cómo generar una carta de baja formal en minutos.",
    cancelMethods: [
      "Online: entrá en movistar.com.ar, buscá «¿En qué te podemos ayudar hoy?» y usá el botón «Baja de servicio».",
      "Por teléfono: llamá al 0800 333 7733, al 611 o al 0800 321 0611 (24 h).",
      "Por la app Mi Movistar, o en una sucursal (conviene sacar turno previo).",
    ],
    facts: [
      "El prepago no requiere baja: basta con dejar de cargar crédito. Esto aplica a los planes pospago.",
      "Solo el titular de la línea puede gestionar la baja; tené listo tu DNI y el número de cuenta o línea.",
      "Por la Resolución 733/2013 del ENACOM, la operadora debe procesar la baja dentro de las 24 horas de recibido el pedido.",
      "Para conservar tu número, hacé la portabilidad a otro operador antes de darte de baja.",
    ],
    faq: [
      {
        q: "¿Cómo doy de baja Movistar en Argentina?",
        a: "Desde movistar.com.ar con el botón «Baja de servicio», llamando al 0800 333 7733 / 611 / 0800 321 0611, por la app Mi Movistar o en una sucursal. Solo el titular puede hacerlo.",
      },
      {
        q: "¿Cuánto tarda la baja de Movistar?",
        a: "Por la Resolución 733/2013 del ENACOM, la baja debe procesarse dentro de las 24 horas de recibido el pedido.",
      },
      {
        q: "¿Qué necesito para dar de baja?",
        a: "Ser el titular y tener a mano tu DNI y el número de cuenta o línea que querés cancelar.",
      },
    ],
    sourceNote:
      "Datos verificados en fuentes públicas (ayuda oficial de Movistar Argentina y comparadores), julio 2026. Los teléfonos y condiciones pueden cambiar; confirmá en la web oficial antes de tramitar.",
  },
};

export const allBrandEsSlugs = Object.keys(brandsEs);

export function getBrandEs(slug: string): BrandEs | undefined {
  return brandsEs[slug];
}
