import type { Locale } from "./config";

export type AboutText = {
  eyebrow: string;
  title: string;
  p1: string;
  p2: string;
  signature: string;
  alt: string;
};

// "Über uns" — Gründer-Sektion, in allen 15 Sprachen.
export const aboutText: Record<Locale, AboutText> = {
  de: {
    eyebrow: "Hinter GetDocu",
    title: "Ein Mensch, eine Mission",
    p1: "Ich habe immer wieder erlebt, wie Menschen wegen fehlender Sprachkenntnisse — oder weil sie nicht wussten, wie ein gutes Dokument aussieht — schlechtere Chancen hatten: bei der Wohnung, im Job, bei Behörden. Das wollte ich ändern.",
    p2: "GetDocu gibt jedem in wenigen Minuten ein sauberes, korrektes Dokument — in vielen Sprachen, ohne Konto, ohne Abo. Deine Daten werden nach der Erstellung sofort gelöscht.",
    signature: "Lukas · Gründer von GetDocu",
    alt: "Lukas, Gründer von GetDocu",
  },
  en: {
    eyebrow: "Behind GetDocu",
    title: "One person, one mission",
    p1: "Time and again I saw people end up with worse chances — because of a language barrier, or because they didn't know what a good document looks like: with housing, at work, with the authorities. I wanted to change that.",
    p2: "GetDocu gives everyone a clean, correct document in minutes — in many languages, no account, no subscription. Your data is deleted immediately after creation.",
    signature: "Lukas · Founder of GetDocu",
    alt: "Lukas, Founder of GetDocu",
  },
  fr: {
    eyebrow: "Derrière GetDocu",
    title: "Une personne, une mission",
    p1: "J'ai vu à maintes reprises des personnes avoir moins de chances — par manque de connaissances linguistiques, ou parce qu'elles ne savaient pas à quoi ressemble un bon document : pour un logement, au travail, face aux administrations. Je voulais changer cela.",
    p2: "GetDocu offre à chacun un document propre et correct en quelques minutes — en plusieurs langues, sans compte, sans abonnement. Vos données sont supprimées immédiatement après la création.",
    signature: "Lukas · Fondateur de GetDocu",
    alt: "Lukas, fondateur de GetDocu",
  },
  it: {
    eyebrow: "Dietro GetDocu",
    title: "Una persona, una missione",
    p1: "Ho visto tante volte persone avere meno possibilità — per mancanza di competenze linguistiche o perché non sapevano come deve essere un buon documento: per la casa, sul lavoro, con gli uffici pubblici. Volevo cambiare questo.",
    p2: "GetDocu offre a tutti un documento pulito e corretto in pochi minuti — in molte lingue, senza account, senza abbonamento. I tuoi dati vengono eliminati subito dopo la creazione.",
    signature: "Lukas · Fondatore di GetDocu",
    alt: "Lukas, fondatore di GetDocu",
  },
  sq: {
    eyebrow: "Prapa GetDocu",
    title: "Një njeri, një mision",
    p1: "Kam parë shpesh se si njerëzit kishin më pak shanse — për shkak të mungesës së njohurive gjuhësore, ose sepse nuk dinin si duket një dokument i mirë: për banesën, në punë, te institucionet. Këtë doja ta ndryshoja.",
    p2: "GetDocu i jep secilit një dokument të pastër dhe të saktë brenda pak minutash — në shumë gjuhë, pa llogari, pa abonim. Të dhënat e tua fshihen menjëherë pas krijimit.",
    signature: "Lukas · Themelues i GetDocu",
    alt: "Lukas, themelues i GetDocu",
  },
  pt: {
    eyebrow: "Por trás da GetDocu",
    title: "Uma pessoa, uma missão",
    p1: "Vi muitas vezes pessoas com menos oportunidades — por falta de conhecimentos linguísticos, ou por não saberem como é um bom documento: na habitação, no trabalho, junto das autoridades. Quis mudar isso.",
    p2: "A GetDocu dá a todos um documento limpo e correto em poucos minutos — em várias línguas, sem conta, sem subscrição. Os teus dados são eliminados imediatamente após a criação.",
    signature: "Lukas · Fundador da GetDocu",
    alt: "Lukas, fundador da GetDocu",
  },
  es: {
    eyebrow: "Detrás de GetDocu",
    title: "Una persona, una misión",
    p1: "Vi una y otra vez cómo había personas con menos oportunidades — por falta de conocimientos del idioma, o porque no sabían cómo es un buen documento: para la vivienda, en el trabajo, ante las autoridades. Quise cambiar eso.",
    p2: "GetDocu ofrece a todos un documento limpio y correcto en pocos minutos — en muchos idiomas, sin cuenta, sin suscripción. Tus datos se eliminan de inmediato tras la creación.",
    signature: "Lukas · Fundador de GetDocu",
    alt: "Lukas, fundador de GetDocu",
  },
  sr: {
    eyebrow: "Iza GetDocu",
    title: "Jedan čovek, jedna misija",
    p1: "Više puta sam video kako ljudi imaju manje šanse — zbog nedostatka znanja jezika, ili zato što nisu znali kako izgleda dobar dokument: za stan, na poslu, pred institucijama. To sam želeo da promenim.",
    p2: "GetDocu svakome daje uredan i ispravan dokument za nekoliko minuta — na mnogo jezika, bez naloga, bez pretplate. Tvoji podaci se brišu odmah nakon kreiranja.",
    signature: "Lukas · Osnivač GetDocu",
    alt: "Lukas, osnivač GetDocu",
  },
  ar: {
    eyebrow: "خلف GetDocu",
    title: "شخص واحد، مهمة واحدة",
    p1: "رأيت مرارًا كيف تقل فرص الناس — بسبب نقص المعرفة اللغوية، أو لأنهم لا يعرفون كيف يبدو المستند الجيد: في السكن، وفي العمل، وأمام الجهات الرسمية. أردت تغيير ذلك.",
    p2: "يمنح GetDocu كل شخص مستندًا نظيفًا وصحيحًا في دقائق — بلغات عديدة، دون حساب ودون اشتراك. تُحذف بياناتك فورًا بعد الإنشاء.",
    signature: "لوكاس · مؤسس GetDocu",
    alt: "لوكاس، مؤسس GetDocu",
  },
  pl: {
    eyebrow: "Za GetDocu",
    title: "Jeden człowiek, jedna misja",
    p1: "Wielokrotnie widziałem, jak ludzie mieli mniejsze szanse — z powodu braku znajomości języka lub dlatego, że nie wiedzieli, jak wygląda dobry dokument: przy mieszkaniu, w pracy, w urzędach. Chciałem to zmienić.",
    p2: "GetDocu daje każdemu czysty, poprawny dokument w kilka minut — w wielu językach, bez konta, bez abonamentu. Twoje dane są usuwane natychmiast po utworzeniu.",
    signature: "Lukas · Założyciel GetDocu",
    alt: "Lukas, założyciel GetDocu",
  },
  hu: {
    eyebrow: "A GetDocu mögött",
    title: "Egy ember, egy küldetés",
    p1: "Újra és újra láttam, hogyan volt kevesebb esélyük az embereknek — a nyelvtudás hiánya miatt, vagy mert nem tudták, hogyan néz ki egy jó dokumentum: lakhatásnál, munkában, a hivatalokban. Ezen akartam változtatni.",
    p2: "A GetDocu percek alatt mindenkinek tiszta, helyes dokumentumot ad — több nyelven, fiók és előfizetés nélkül. Az adataidat a létrehozás után azonnal töröljük.",
    signature: "Lukas · A GetDocu alapítója",
    alt: "Lukas, a GetDocu alapítója",
  },
  tr: {
    eyebrow: "GetDocu'nun arkasında",
    title: "Bir insan, bir misyon",
    p1: "İnsanların — dil bilgisi eksikliği yüzünden ya da iyi bir belgenin nasıl göründüğünü bilmedikleri için — nasıl daha az şansa sahip olduğunu defalarca gördüm: konutta, işte, resmi kurumlarda. Bunu değiştirmek istedim.",
    p2: "GetDocu herkese dakikalar içinde temiz ve doğru bir belge sunar — birçok dilde, hesap yok, abonelik yok. Verileriniz oluşturulduktan hemen sonra silinir.",
    signature: "Lukas · GetDocu'nun kurucusu",
    alt: "Lukas, GetDocu'nun kurucusu",
  },
  ru: {
    eyebrow: "За GetDocu",
    title: "Один человек, одна миссия",
    p1: "Я снова и снова видел, как у людей было меньше шансов — из-за недостатка знания языка или потому что они не знали, как выглядит хороший документ: с жильём, на работе, в учреждениях. Я хотел это изменить.",
    p2: "GetDocu за несколько минут даёт каждому аккуратный, правильный документ — на многих языках, без аккаунта и без подписки. Ваши данные удаляются сразу после создания.",
    signature: "Лукас · Основатель GetDocu",
    alt: "Лукас, основатель GetDocu",
  },
  uk: {
    eyebrow: "За GetDocu",
    title: "Одна людина, одна місія",
    p1: "Я знову і знову бачив, як люди мали менше шансів — через брак знання мови або тому, що не знали, який вигляд має хороший документ: із житлом, на роботі, в установах. Я хотів це змінити.",
    p2: "GetDocu за кілька хвилин дає кожному охайний, правильний документ — багатьма мовами, без облікового запису й без підписки. Ваші дані видаляються одразу після створення.",
    signature: "Лукас · Засновник GetDocu",
    alt: "Лукас, засновник GetDocu",
  },
  ta: {
    eyebrow: "GetDocu-வின் பின்னால்",
    title: "ஒரு மனிதர், ஒரு நோக்கம்",
    p1: "மொழி அறிவு இல்லாததால், அல்லது ஒரு நல்ல ஆவணம் எப்படி இருக்கும் என்று தெரியாததால், மக்கள் — வீடு, வேலை, அரசு அலுவலகங்களில் — குறைவான வாய்ப்புகளைப் பெறுவதை நான் பலமுறை பார்த்தேன். அதை மாற்ற விரும்பினேன்.",
    p2: "GetDocu ஒவ்வொருவருக்கும் சில நிமிடங்களில் சுத்தமான, சரியான ஆவணத்தை வழங்குகிறது — பல மொழிகளில், கணக்கு இல்லாமல், சந்தா இல்லாமல். உங்கள் தரவு உருவாக்கியவுடன் உடனடியாக நீக்கப்படும்.",
    signature: "Lukas · GetDocu நிறுவனர்",
    alt: "Lukas, GetDocu நிறுவனர்",
  },
};
