// ── Sayraa Voice Engine ─────────────────────────────────────────────────
// Sweet FEMALE Hinglish voice (TTS) + Hinglish voice input (STT) for the
// portfolio chatbot. Self-contained — uses only the browser Web Speech API,
// no extra dependencies.
//
//   speakSayraa(text)            → Sayraa SPEAKS a reply aloud
//   stopSayraaSpeaking()         → stop / cancel all speech
//   createHinglishRecognizer()   → mic: listen Hinglish, live transcript
//   playListenChime()            → subtle tone when the mic opens
//   detectVoiceHint(text)        → 'hinglish' | 'english' from user's text
//
// Sayraa always speaks with a cute, sweet FEMALE voice — in English AND in
// Hinglish. Browsers expose many English voices and often rank a male one
// first (Microsoft David, Google UK English Male, ...), so every candidate is
// scored and male voices are pushed to the very bottom of the list.
// NOTE: check order matters — "male" is a substring of "female", so a voice is
// only treated as male when it did NOT already match the female list.

const FEMALE_VOICE_NAMES = [
  // English
  "zira", "aria", "jenny", "michelle", "samantha", "victoria", "karen", "moira",
  "tessa", "fiona", "emma", "ava", "allison", "susan", "joanna", "salli",
  "kimberly", "ivy", "kendra", "female",
  // Warm/soft English voices that sound sweet rather than robotic
  "hazel", "libby", "sonia", "ana", "clara", "nancy", "amber", "ashley", "cora",
  "elizabeth", "monica", "sara", "denise", "jane", "amy", "nicole", "olivia",
  "mia", "linda", "heather", "emily", "serena", "allie", "kate", "stephanie",
  "catherine", "paula", "jessa", "ruth", "danielle",
  // Hindi / Indian English
  "swara", "kalpana", "neerja", "heera", "raveena", "ananya", "aarohi",
];

const MALE_VOICE_NAMES = [
  // English
  "david", "mark", "guy", "george", "james", "ryan", "alex", "daniel", "fred",
  "oliver", "thomas", "male",
  // Hindi / Indian
  "hemant", "madhur", "prabhat", "ravi", "rishi",
];

// Legacy SAPI "Desktop" voices are the flattest, most robotic ones a machine
// can have. They make Sayraa sound like a narration box instead of a sweet
// assistant, so they are penalised — never banned, because on some machines
// they are the only voices available.
const FLAT_VOICE_NAMES = [
  "zira", "desktop", "david", "mark", "hemant", "madhur", "ravi", "prabhat",
];

// True for voices that are clearly female (name tag or the voice's own gender).
const isFemaleVoice = (v, name) =>
  v.gender === "female" || FEMALE_VOICE_NAMES.some((f) => name.includes(f));

// True only for voices that are clearly male.
const isMaleVoice = (v, name) =>
  v.gender === "male" ||
  (!isFemaleVoice(v, name) && MALE_VOICE_NAMES.some((m) => name.includes(m)));

// Pick the clearest available Hindi voice (female preferred) for TTS.
// Ranked so high-quality "Natural"/"Online"/Google voices win over the legacy
// robotic SAPI voices (e.g. Microsoft Hemant) that Chrome/Edge otherwise
// return first.
const getSweetHindiVoice = (synth) => {
  const voices = synth.getVoices().filter(
    (v) =>
      v.lang === "hi-IN" ||
      (v.lang && v.lang.startsWith("hi")) ||
      v.name.includes("हिन्दी")
  );
  if (!voices.length) return null;

  const score = (v) => {
    const n = v.name.toLowerCase();
    let s = 0;
    // High-quality neural/online voices are far clearer than legacy SAPI ones
    if (n.includes("natural") || n.includes("online")) s += 8;
    if (n.includes("google")) s += 6;
    // Chrome's Hindi voice is listed as "Google हिन्दी" (female) — the name has
    // no gender word, so give the Indian-Hindi voices an explicit bonus.
    if (n.includes("हिन्दी") || n.includes("hindi")) s += 5;
    // Known sweet female Hindi voices (Microsoft Swara, Kalpana, Google हिन्दी)
    if (n.includes("swara") || n.includes("kalpana") || n.includes("neerja")) s += 6;
    // Sayraa is a sweet female character — always prefer a female voice
    if (isFemaleVoice(v, n)) s += 7;
    // Male voices — last resort only (they made Sayraa sound like a man)
    if (isMaleVoice(v, n)) s -= 10;
    // Flat legacy "Desktop" voices sound like a narration box
    if (FLAT_VOICE_NAMES.some((f) => n.includes(f))) s -= 5;
    return s;
  };

  return voices.sort((a, b) => score(b) - score(a))[0];
};

// Indian-English voices pronounce Hinglish (Hindi written in Roman letters)
// far more naturally than a US/UK voice, so this is the first fallback when
// the machine has no Hindi voice installed.
// Returns null (rather than a male voice) when no FEMALE Indian-English voice
// exists — Sayraa must stay female.
const getSweetIndianEnglishVoice = (synth) => {
  const femaleVoices = synth.getVoices().filter((v) => {
    const isIndian =
      v.lang === "en-IN" || (v.name && v.name.toLowerCase().includes("en-in"));
    return isIndian && !isMaleVoice(v, v.name.toLowerCase());
  });
  if (!femaleVoices.length) return null;

  const score = (v) => {
    const n = v.name.toLowerCase();
    let s = 0;
    if (n.includes("natural") || n.includes("online") || n.includes("neural")) s += 8;
    if (n.includes("google") || n.includes("microsoft")) s += 4;
    if (isFemaleVoice(v, n)) s += 7;
    return s;
  };

  return femaleVoices.sort((a, b) => score(b) - score(a))[0];
};

// Pick the clearest available English voice for TTS (used when the user writes
// in English and no Indian voice family exists on the machine).
const getSweetEnglishVoice = (synth) => {
  const voices = synth.getVoices().filter(
    (v) => v.lang === "en-US" || (v.lang && v.lang.startsWith("en"))
  );
  if (!voices.length) return null;

  const score = (v) => {
    const n = v.name.toLowerCase();
    let s = 0;
    if (n.includes("wavenet") || n.includes("neural") || n.includes("online")) s += 8;
    if (n.includes("natural")) s += 6;
    if (n.includes("google") || n.includes("azure") || n.includes("amazon")) s += 5;
    // A sweet FEMALE English voice is what Sayraa should always sound like
    if (isFemaleVoice(v, n)) s += 7;
    // Chrome's "Google US English" is female even though its name does not say
    // so — an exact match can never accidentally tag a "... Male" voice.
    if (n === "google us english") s += 7;
    // A male voice must never win, even if it is technically higher quality
    if (isMaleVoice(v, n)) s -= 10;
    if (v.lang === "en-US") s += 6;
    if (
      n.includes("microsoft") &&
      !n.includes("natural") &&
      !n.includes("online") &&
      !n.includes("neural")
    )
      s -= 3;
    if (FLAT_VOICE_NAMES.some((f) => n.includes(f))) s -= 5;
    return s;
  };

  return voices.sort((a, b) => score(b) - score(a))[0];
};

// Optional manual override, so the sweetest voice on a given machine can be
// pinned from the console without a rebuild:
//   localStorage.setItem('sayraaVoice', 'Swara')  → use that voice
const getForcedVoice = (synth) => {
  try {
    const wanted = localStorage.getItem("sayraaVoice");
    if (!wanted) return null;
    return (
      synth
        .getVoices()
        .find((v) => v.name.toLowerCase().includes(wanted.toLowerCase())) || null
    );
  } catch {
    return null;
  }
};

// Sweet delivery settings. Using the SAME voice with the SAME prosody in both
// languages is what makes an English reply sound as sweet as a Hinglish one.
const SWEET_ENGLISH_PROSODY = { rate: 0.96, pitch: 1.2 };
const SWEET_HINGLISH_PROSODY = { rate: 0.97, pitch: 1.15 };

// True for Hindi / Indian-English voices — they share the same soft timbre,
// so they get the identical (sweetest) delivery in either language.
const isIndianVoice = (v) => {
  if (!v) return false;
  const lang = (v.lang || "").toLowerCase();
  const name = (v.name || "").toLowerCase();
  return (
    lang.startsWith("hi") ||
    lang.startsWith("en-in") ||
    /hindi|हिन्दी|swara|kalpana|neerja|heera|raveena/.test(name)
  );
};

// Voice mode (localStorage "sayraaVoiceMode"):
//   "match"  (default) → English speaks with the same sweet Indian/Hindi voice
//                        family as Hinglish, so both sound like one person
//   "native"           → English uses a native (US/UK) female voice instead
const getVoiceMode = () => {
  try {
    return localStorage.getItem("sayraaVoiceMode") === "native" ? "native" : "match";
  } catch {
    return "match";
  }
};

/**
 * Single decision point for Sayraa's voice, so English and Hinglish can never
 * drift apart in tone. Returns { voice, lang, rate, pitch }.
 */
const chooseSayraaVoice = (synth, lang = "hinglish") => {
  const wantsHindi = lang !== "english";
  const hindiVoice = getSweetHindiVoice(synth);
  const indianVoice = getSweetIndianEnglishVoice(synth);
  const englishVoice = getSweetEnglishVoice(synth);
  const pinned = getForcedVoice(synth);

  // 1. An explicit pin (localStorage 'sayraaVoice') overrides everything.
  if (pinned) {
    const pinnedIsIndian = isIndianVoice(pinned);
    const prosody =
      !wantsHindi && !pinnedIsIndian ? SWEET_ENGLISH_PROSODY : SWEET_HINGLISH_PROSODY;
    return { voice: pinned, lang: pinned.lang || "en-US", ...prosody };
  }

  // 2. Hinglish → Hindi female voice when installed, else Indian-English female.
  if (wantsHindi) {
    if (hindiVoice) {
      return { voice: hindiVoice, lang: hindiVoice.lang || "hi-IN", ...SWEET_HINGLISH_PROSODY };
    }
    if (indianVoice) {
      return { voice: indianVoice, lang: indianVoice.lang || "en-IN", ...SWEET_HINGLISH_PROSODY };
    }
    return { voice: englishVoice, lang: "en-US", ...SWEET_HINGLISH_PROSODY };
  }

  // 3. English replies. Default "match" mode REUSES the very same sweet voice
  //    Hinglish uses, so an English answer sounds identical in tone instead of
  //    dropping to a flatter native voice.
  if (getVoiceMode() === "match") {
    if (hindiVoice) {
      return { voice: hindiVoice, lang: hindiVoice.lang || "hi-IN", ...SWEET_HINGLISH_PROSODY };
    }
    if (indianVoice) {
      return { voice: indianVoice, lang: indianVoice.lang || "en-IN", ...SWEET_HINGLISH_PROSODY };
    }
  }

  return { voice: englishVoice, lang: "en-US", ...SWEET_ENGLISH_PROSODY };
};

const applyVoiceChoice = (utterance, choice) => {
  if (choice.voice) utterance.voice = choice.voice;
  if (choice.lang) utterance.lang = choice.lang;
  utterance.rate = choice.rate;
  utterance.pitch = choice.pitch;
};

// Chrome loads voices ASYNC — getVoices() is empty on the very first calls.
// Wait (max ~2s) until at least one voice exists, then speak.
const waitForVoicesReady = (speak, { attempts = 8, delay = 250 } = {}) => {
  if (typeof window === "undefined") return;
  const synth = window.speechSynthesis;
  if (!synth || !synth.getVoices || synth.getVoices().length > 0) {
    speak();
    return;
  }
  let tries = 0;
  const attempt = () => {
    if (!synth.getVoices || synth.getVoices().length > 0 || tries >= attempts) {
      speak();
      return;
    }
    tries++;
    setTimeout(attempt, delay);
  };
  attempt();
};

// Chrome's autoplay policy can reject speech that starts before the user has
// interacted with the page ("not-allowed"). The first tap/click/keypress is
// enough to be allowed — so re-try once, then.
const armGestureRetry = (speak) => {
  if (typeof window === "undefined") return;
  let armed = true;
  const fire = () => {
    if (!armed) return;
    armed = false;
    window.removeEventListener("pointerdown", fire, true);
    window.removeEventListener("keydown", fire, true);
    window.removeEventListener("touchstart", fire, true);
    const synth = window.speechSynthesis;
    // Only re-speak if nothing else took over the audio channel meanwhile
    if (synth && !synth.speaking && !synth.pending) speak();
  };
  window.addEventListener("pointerdown", fire, true);
  window.addEventListener("keydown", fire, true);
  window.addEventListener("touchstart", fire, true);
};

// ---- Devanagari → English letters (Hinglish) transliteration ----
// The browser recognizer ("hi-IN") writes Hinglish speech in Devanagari
// (e.g. "सबहम के प्रोजेक्ट्स दिखाओ"). The chat shows/sends it in English
// letters, and when the machine has NO Hindi TTS voice, Devanagari text would
// be completely silent — so we transliterate in both cases.
const INDIC_CONSONANTS = {
  "क": "k", "ख": "kh", "ग": "g", "घ": "gh", "ङ": "n",
  "च": "ch", "छ": "chh", "ज": "j", "झ": "jh", "ञ": "n",
  "ट": "t", "ठ": "th", "ड": "d", "ढ": "dh", "ण": "n",
  "त": "t", "थ": "th", "द": "d", "ध": "dh", "न": "n",
  "प": "p", "फ": "ph", "ब": "b", "भ": "bh", "म": "m",
  "य": "y", "र": "r", "ल": "l", "व": "v", "श": "sh",
  "ष": "sh", "स": "s", "ह": "h", "ळ": "l", "़": "",
};
const INDIC_VOWELS = {
  "अ": "a", "आ": "aa", "इ": "i", "ई": "i", "उ": "u", "ऊ": "u",
  "ए": "e", "ऐ": "ai", "ओ": "o", "औ": "au", "ऋ": "ri",
  "ऑ": "o", "ऍ": "e",
};
const INDIC_MATRAS = {
  "ा": "a", "ि": "i", "ी": "i", "ु": "u", "ू": "u", "ृ": "ri",
  "े": "e", "ै": "ai", "ो": "o", "ौ": "au",
  "ॉ": "o", "ॅ": "e",
};
const INDIC_VIRAMAS = ["्"];
const INDIC_ANUSVARAS = ["ं", "ँ"];

const toEnglishLetters = (text) => {
  if (!text) return text;
  // Normalise nukta clusters first (ज़→ज, ड़→ड, ...) so they map cleanly
  const src = text
    .replace(/क़/g, "क").replace(/ख़/g, "ख").replace(/ग़/g, "ग")
    .replace(/ज़/g, "ज").replace(/ड़/g, "ड").replace(/ढ़/g, "ढ")
    .replace(/फ़/g, "फ").replace(/य़/g, "य");

  let out = "";
  let inherentAIndex = -1; // position of the implicit "a" after a consonant

  const dropInherentA = () => {
    if (inherentAIndex === out.length - 1) out = out.slice(0, -1);
    inherentAIndex = -1;
  };

  for (const ch of src) {
    if (INDIC_CONSONANTS[ch] !== undefined) {
      out += INDIC_CONSONANTS[ch] + "a";
      inherentAIndex = out.length - 1;
    } else if (INDIC_VIRAMAS.includes(ch)) {
      // Halant kills the implicit "a" (क् = "k" not "ka")
      dropInherentA();
    } else if (INDIC_MATRAS[ch]) {
      // Vowel sign replaces the implicit "a" (का = "ka" not "kaa")
      dropInherentA();
      out += INDIC_MATRAS[ch];
    } else if (INDIC_VOWELS[ch]) {
      out += INDIC_VOWELS[ch];
      inherentAIndex = -1;
    } else if (INDIC_ANUSVARAS.includes(ch)) {
      out += "n";
      inherentAIndex = -1;
    } else if (ch === "ः") {
      out += "h";
      inherentAIndex = -1;
    } else if (ch === "।" || ch === "॥") {
      dropInherentA();
      out += ".";
    } else {
      dropInherentA();
      out += ch;
    }
  }
  dropInherentA();
  return out;
};
// ---- End transliteration ----

// Detect whether the USER's message is Hinglish/Hindi/Odia or English, so the
// spoken reply mirrors the user's language ("hinglish" is Sayraa's home voice).
const HINGLISH_HINT_RE =
  /\b(kya|kaise|kyun|kyu|kaisa|kaisi|hai|hain|ho|karo|kar|karna|karne|karega|karegi|mujhe|aap|aapka|tum|tumhara|mera|meri|apna|apni|kaun|kahan|kab|kaisa|batao|bata|bataiye|pooch|dikhao|dikha|chahiye|nahi|haan|acha|accha|thik|theek|matlab|sakte|sakta|sakti|hun|hoon|raha|rahi|rahe|wala|wali|bhai|yaar|bhi|aur|mein|ka|ki|ke|ko|se|par|pe|na|karenge|kaisi)\b/i;

export const detectVoiceHint = (text) => {
  if (!text) return "hinglish"; // default: Sayraa's home language
  if (/[\u0900-\u097F]/.test(text)) return "hinglish"; // Devanagari (Hindi)
  if (/[\u0B00-\u0B7F]/.test(text)) return "hinglish"; // Odia script → closest Indian voice
  return HINGLISH_HINT_RE.test(text) ? "hinglish" : "english";
};

// Prepare bot text for SPEAKING (it is displayed with markdown/emojis, but those
// sound terrible aloud: "asterisk asterisk Suraksha...").
const cleanTextForSpeech = (text) =>
  text
    .replace(/```[\s\S]*?```/g, " ") // fenced code blocks
    .replace(/`([^`]*)`/g, "$1") // inline code
    .replace(/\*\*([^*]+)\*\*/g, "$1") // **bold**
    .replace(/__([^_]+)__/g, "$1") // __bold__
    .replace(/\*([^*\n]+)\*/g, "$1") // *italic*
    .replace(/^#{1,6}\s*/gm, "") // markdown headings
    .replace(/^[\s]*[-•▪◦*]\s+/gm, "") // bullet markers (keeps the sentence)
    .replace(/https?:\/\/(www\.)?/gi, "") // speak "github.com/..." not "https://"
    .replace(/Sayraa/gi, "Sigh-raa") // pronunciation of the assistant's name
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}]/gu, "") // emojis are shown, never read aloud ("smiling face" etc.)
    .replace(/\uFE0F/g, "") // emoji variation selectors
    .replace(/\u200D/g, "") // zero-width joiners (ZWJ emoji sequences)
    .replace(/\u20E3/g, "") // keycap combining marks
    .replace(/\s{2,}/g, " ")
    .trim();

export const isSpeechSynthesisSupported = () =>
  typeof window !== "undefined" && !!window.speechSynthesis;

// ── Speaking state (drives the animated "video-style" avatar UI) ────
// True whenever at least one Sayraa utterance is actually playing.
const activeUtterances = new Set();
let speakingListener = null;
const notifySpeaking = () => {
  if (speakingListener) speakingListener(activeUtterances.size > 0);
};

// Subscribe to Sayraa's speaking state. Returns an unsubscribe function.
export const onSayraaSpeakingChange = (cb) => {
  speakingListener = cb;
  cb(activeUtterances.size > 0);
  return () => {
    if (speakingListener === cb) speakingListener = null;
  };
};

export const stopSayraaSpeaking = () => {
  try {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  } catch {
    /* ignore */
  }
  // Cancel wipes every queued utterance — reset the visual speaking state too
  activeUtterances.clear();
  notifySpeaking();
};

/**
 * Sayraa SPEAKS a reply aloud with her sweet female voice.
 * @param {string} text  reply text (may contain markdown/emojis — cleaned first)
 * @param {object} opts  { lang: 'hinglish' | 'english', append: bool,
 *                         sweet: bool → extra-sweet delivery for greetings }
 */
export const speakSayraa = (text, { lang = "hinglish", append = false, sweet = false } = {}) => {
  if (typeof window === "undefined") return;
  const synth = window.speechSynthesis;
  if (!synth) return;

  // Cancel any ongoing speech to avoid delays — but when the caller asked to
  // APPEND (progressive speech), leave the current sentence playing.
  const wasSpeaking = synth.speaking || synth.pending;
  if (!append) synth.cancel();

  const spokenText = cleanTextForSpeech(text);
  if (!spokenText) return;

  const speak = () => {
    // ONE decision point picks both the voice and its prosody, so English and
    // Hinglish always share the same sweet tone.
    const choice = chooseSayraaVoice(synth, lang);
    const hasHindiVoice =
      !!choice.voice && (choice.lang || "").toLowerCase().startsWith("hi");

    // Devanagari can ONLY be voiced by a Hindi voice. Sent to an English voice
    // Chrome reads it as literally nothing — so when no Hindi voice exists,
    // transliterate the Devanagari into Roman Hinglish, which every voice can
    // pronounce.
    let speakable = spokenText;
    if (lang !== "english" && !hasHindiVoice && /[\u0900-\u097F]/.test(speakable)) {
      speakable = toEnglishLetters(speakable).replace(/\s{2,}/g, " ").trim();
    }

    const utterance = new SpeechSynthesisUtterance(speakable);
    applyVoiceChoice(utterance, choice);

    // Greeting delivery — a touch slower and higher for extra cuteness
    if (sweet) {
      utterance.rate = 0.95;
      utterance.pitch = 1.25;
    }

    utterance.onstart = () => {
      activeUtterances.add(utterance);
      notifySpeaking();
    };
    utterance.onend = () => {
      if (activeUtterances.delete(utterance)) notifySpeaking();
    };

    // If Chrome blocks speech until the user interacts (autoplay policy), retry
    // once on the very first click / key press / tap.
    utterance.onerror = (e) => {
      if (activeUtterances.delete(utterance)) notifySpeaking();
      const err = (e && e.error) || "";
      if (err === "not-allowed" || err === "not_allowed") {
        console.warn("Speech blocked before user interaction — retrying on first gesture.");
        armGestureRetry(() => synth.speak(utterance));
      }
    };

    if (append) {
      // Queue natively right behind the sentence that is currently playing.
      synth.speak(utterance);
    } else if (wasSpeaking) {
      // Chrome sometimes swallows an utterance that starts in the same tick as
      // cancel(), so give the engine a moment to flush the previous speech.
      setTimeout(() => synth.speak(utterance), 80);
    } else {
      synth.speak(utterance);
    }
  };

  waitForVoicesReady(speak);
};

// ---- Subtle chime when the mic opens ----
// Tells the user the mic is listening WITHOUT Sayraa speaking (a spoken line
// would collide with the recognizer and get recorded into the transcript).
export const playListenChime = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(660, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.18);
    setTimeout(() => {
      try {
        ctx.close();
      } catch { /* ignore */ }
    }, 250);
  } catch {
    // AudioContext blocked or not supported — silent fail
  }
};

export const isVoiceInputSupported = () =>
  typeof window !== "undefined" &&
  !!(window.SpeechRecognition || window.webkitSpeechRecognition);

/**
 * Hinglish speech recognizer (Web Speech API).
 * - lang "hi-IN" so Hindi speech transcribes accurately (then transliterated
 *   to Roman letters); English words mixed in (Hinglish) still come through.
 * - continuous + interim results → live transcription while speaking.
 * - auto-finalizes after `silenceMs` of silence, or when stop() is pressed.
 * Returns { stop, abort } or null when unsupported.
 *   stop()  → finalize NOW and send what was heard (mic pressed again)
 *   abort() → discard everything, no callbacks (chat closed / unmount)
 * Callbacks: onInterim(text), onFinal(text|''), onError(messageOrNull)
 */
export const createHinglishRecognizer = ({
  onInterim,
  onFinal,
  onError,
  silenceMs = 1200,
  maxMs = 25000,
} = {}) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return null;

  let recognition = null;
  let silenceTimer = null;
  let maxTimer = null;
  let retryTimer = null;
  let finalTranscript = "";
  let gotResult = false;
  let hadError = false;
  let sent = false;
  let audioStarted = false;
  let aborted = false;

  const clearTimers = () => {
    if (silenceTimer) clearTimeout(silenceTimer);
    if (maxTimer) clearTimeout(maxTimer);
    if (retryTimer) clearTimeout(retryTimer);
    silenceTimer = null;
    maxTimer = null;
    retryTimer = null;
  };

  const finish = (deliver) => {
    if (sent) return;
    sent = true;
    clearTimers();
    try {
      recognition.stop();
    } catch {
      /* already stopped */
    }
    if (!deliver || aborted || !onFinal) return;
    const raw = toEnglishLetters(finalTranscript.replace(/\s+/g, " ").trim());
    onFinal(raw.trim()); // '' when nothing usable was heard → silent cancel
  };

  const begin = (isRetry) => {
    // Create a FRESH instance every time — reusing an old instance after it
    // has ended is unreliable in Chrome (mic stops recognizing words).
    recognition = new SpeechRecognition();
    recognition.continuous = true; // mic stays open for the WHOLE sentence
    recognition.interimResults = true; // live transcription while speaking
    recognition.lang = "hi-IN";
    // Alternatives → keep the MOST CONFIDENT transcription of each chunk
    recognition.maxAlternatives = 3;

    recognition.onaudiostart = () => {
      audioStarted = true;
    };

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          gotResult = true;
          // Among the alternatives keep the one Chrome is MOST confident about
          let best = result[0];
          for (let j = 1; j < result.length; j++) {
            if ((result[j].confidence || 0) > (best.confidence || 0)) best = result[j];
          }
          // Accumulate — do NOT send yet, the sentence may continue
          finalTranscript += best.transcript + " ";
        } else {
          interim += result[0].transcript;
        }
      }
      // Live transcription (in English letters) of everything heard so far
      const liveText = toEnglishLetters(
        (finalTranscript + " " + interim).replace(/\s+/g, " ").trim()
      );
      if (liveText && onInterim) onInterim(liveText);
      // Still hearing speech → keep waiting for the rest of the sentence
      if (silenceTimer) clearTimeout(silenceTimer);
      silenceTimer = setTimeout(() => finish(true), silenceMs);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      hadError = true;
      sent = true; // don't auto-send after an error
      clearTimers();
      try {
        recognition.stop();
      } catch { /* already stopped */ }

      if (!aborted && onError) {
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          onError(
            "Mic permission blocked hai! Address bar ke 🔒 icon pe click karke microphone ALLOW karo, page reload karo. 🎙️"
          );
        } else if (event.error === "no-speech") {
          onError("Kuch sunai nahi diya... mic ke paas aake thoda aur clearly bolo na! 🎙️");
        } else if (event.error === "network") {
          onError("Network problem hai! Voice input ke liye internet chahiye. 📶");
        } else if (event.error === "audio-capture") {
          onError("Mic detect nahi hua! Microphone connect karo aur fir se try karo. 🎙️");
        } else if (event.error === "language-not-supported") {
          onError("Ye browser ye language recognize nahi kar pa raha! Chrome try karo. 🎙️");
        } else if (event.error !== "aborted") {
          onError("Oops! Speech samajh nahi aaya, fir se bolo na...");
        } else {
          onError(null); // 'aborted' = we cancelled it ourselves — stay quiet
        }
      }
    };

    recognition.onend = () => {
      if (aborted || sent) return;
      // Chrome sometimes ends the session by itself (silence cut-off) —
      // deliver whatever full sentence we managed to hear
      if (gotResult && finalTranscript.trim()) {
        finish(true);
        return;
      }
      if (hadError) {
        finish(false);
        return;
      }
      // Recognition ended BEFORE the mic even opened — this happens when TTS
      // was still holding the audio channel. Retry once silently.
      if (!audioStarted && !isRetry) {
        console.warn("Recognition ended before audio start — retrying...");
        retryTimer = setTimeout(() => begin(true), 400);
        return;
      }
      finish(true); // heard nothing → silent cancel
    };

    try {
      recognition.start();
    } catch (err) {
      console.error("SpeechRecognition start failed:", err);
      sent = true;
      if (!aborted && onError) onError(null);
    }
  };

  begin(false);

  // Hard cap for very long listening sessions
  maxTimer = setTimeout(() => finish(true), maxMs);

  return {
    // Press-the-mic-again → send immediately what was heard so far
    stop: () => finish(true),
    // Chat closed / component unmounted → discard everything quietly
    abort: () => {
      aborted = true;
      sent = true;
      clearTimers();
      try {
        recognition.stop();
      } catch { /* already stopped */ }
    },
  };
};