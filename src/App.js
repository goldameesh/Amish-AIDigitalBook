import React, { useEffect, useMemo, useRef, useState } from "react";

/* ================== Soft paper-rustle flip sound ================== */
let _ctx;
function playFlipSound() {
  try {
    _ctx = _ctx || new (window.AudioContext || window.webkitAudioContext)();
    const ctx = _ctx,
      dur = 0.22;
    const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++)
      data[i] = (Math.random() * 2 - 1) * 0.28; // slightly softer
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 1150;
    bp.Q.value = 0.8;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 3000;
    const g = ctx.createGain();
    const t = ctx.currentTime;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.06, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(bp);
    bp.connect(lp);
    lp.connect(g);
    g.connect(ctx.destination);
    src.start(t);
    src.stop(t + dur + 0.02);
  } catch {}
}

/* ================== Storage helpers ================== */
const LS = "ams_book_meta_v2";
const load = () => {
  try {
    return JSON.parse(localStorage.getItem(LS) || "{}");
  } catch {
    return {};
  }
};
const save = (x) => localStorage.setItem(LS, JSON.stringify(x));

/* ================== Default meta (editable in Settings) ================== */
const defaultMeta = {
  coverUrl: "", // paste a direct image URL
  authorPhotoUrl: "", // direct image URL for avatar
  title: "AI ∞ The Universal Enabler",
  subtitle: "How Artificial Intelligence Will Redefine Human Possibility",
  author: "Amish Shah",
};

/* ================== Content ================== */
const PAGES = [
  { id: "cover", isCover: true, title: "Cover" },
  { id: "toc", isToc: true, title: "Contents" },

  {
    id: "dedication",
    title: "Dedication",
    content: `Dedication

To my Mother and Father — the first light of my existence, the roots of my strength and the source of my deepest values.

To my Siblings — companions of my earliest journey, whose love and presence shaped my resilience and joy.

To my Teachers — who opened the windows of knowledge and awakened the spirit of inquiry within me.

To my Relatives and Friends — whose bonds of trust, support, and companionship gave meaning to life’s path.

To the Gurus of Life — those seen and unseen, who offered wisdom, discipline, and the guidance of truth.

To my Professional Colleagues — fellow travelers in purpose, who stood with me in building, striving, and creating impact.

And to Everyone, and to Every Frequency on Mother Earth — the infinite energies, beings, and vibrations that connect us all, nurture us all, and remind us that life is one shared consciousness.

With Love — Amish`,
  },

  {
    id: "preface",
    title: "Preface",
    content: `Preface

I write this from the year 2050. AI is no longer a tool in our hands — it has become the silent pulse of our lives. It shapes how we think, how we heal, how we create, and even how we dream.

Back in 2025, people asked: Will AI replace us? Will it control us?
In truth, AI did something far greater — it revealed us. It expanded our compassion, magnified our curiosity, and dared us to think beyond human limits.

This book was my attempt to offer humanity a compass in that early moment of uncertainty. Not a technical manual, not a prophecy — but a mirror of possibility.

What you should expect

Clarity: A simple but profound lens on how AI can shape life for everyone.

Reflection: Each chapter ends with questions that turn the spotlight back on you.

Vision: A glimpse of 2035, where humanity faces the extraordinary.

How to read it

Read slowly. Pause at the questions. Let them stretch your imagination. This book is not about machines learning to think like us — it is about us daring to think beyond ourselves.

It is not just a book. It is a seed. The future is waiting.

With vision and with love,
Amish`,
  },

  {
    id: "c1",
    title: "Chapter 1 — The Universal Promise of AI",
    content: `AI ∞ The Universal Enabler: How Artificial Intelligence Will Redefine Human Possibility

Artificial Intelligence is not merely a technological breakthrough—it is the force multiplier of human potential. Just as fire gave us warmth, and electricity gave us power, AI gives us the ability to think, decide, and create at exponential scale.

• From Scarcity to Abundance: AI democratizes knowledge, healthcare, and opportunity. A villager with a smartphone gains access to the same insights as a global CEO.
• Breaking Barriers: AI is the ultimate translator—of languages, cultures, and industries—enabling seamless connection and interaction.
• Amplifying Creativity: AI does not replace genius; it scales genius, allowing every human to operate at the peak of imagination.

Mini Snapshot: Imagine a farmer in Africa predicting rainfall with AI models, a student in India accessing MIT-level education instantly, and a policymaker in the U.S. simulating the impact of laws before implementation. This is AI leveling the playing field.

Closing Insight: AI will be to the 21st century what electricity was to the 20th: invisible, omnipresent, indispensable.

Takeaways
1) AI is the new electricity — a universal enabler.
2) AI breaks barriers of access, equity, and imagination.
3) AI transforms lives across any context, culture, or challenge.

Reflective Questions
1) What barrier in your life could AI help remove today?
2) How might you use AI to scale your own creativity?
3) In what way could AI democratize access in your industry/community?`,
  },

  {
    id: "c2",
    title: "Chapter 2 — AI in Action: Ease & Empowerment",
    content: `The power of AI is best seen in daily life—it works silently in the background, simplifying, empowering, and enabling.

1) Work Simplified: AI becomes a collaborator, not a competitor—drafting contracts, coding at scale, automating bureaucracies, freeing humans for strategic and creative work.
2) Health Enhanced: AI acts as a guardian angel—detecting diseases before symptoms, creating personalized care plans, and supporting mental well-being.
3) Learning Reimagined: Every child, worker, or elder gets a personal AI tutor, tailored to their pace, language, and learning style. Education inequality dissolves.
4) Governance Made Smarter: Real-time policymaking with AI simulations, corruption reduced through transparent algorithms, and leaders empowered with foresight.

Mini Vision Scenarios:
• A grandmother in a remote village receives AI-powered diagnosis and treatment instantly.
• A small business in Brazil leverages AI logistics to compete globally.
• Citizens worldwide engage directly in governance with AI translating their voices into actionable insights.

Closing Insight: AI will make ease the new normal and empowerment the default condition of human life.

Takeaways
1) AI will redefine work, health, and learning at the individual level.
2) Governance will shift from reactive to predictive.
3) AI creates personal empowerment at scale, dissolving inequalities.

Reflective Questions
1) Which part of your daily life could AI simplify immediately?
2) If AI could improve your health, where would you want it most—body, mind, or lifestyle?
3) How would your role or business change if AI became your most trusted partner?`,
  },

  {
    id: "c3",
    title: "Chapter 3 — Building the AI-First Civilization",
    content: `AI’s trajectory is not destiny—it is choice. Humanity must choose to build an AI civilization that augments, not replaces; empowers, not controls.

• Responsible AI: Guardrails for ethics, privacy, and trust must be built. AI must be transparent, explainable, and accountable.
• AI Equity: No human left behind. AI must become a basic right, not a luxury.
• Co-Creation Civilization: Humans and AI working together to solve planetary challenges—climate change, hunger, energy—while enabling expansion to new frontiers, including other planets.

Future Vision: A multi-planetary species where AI empowers governance, survival, and creativity across worlds. AI becomes the co-intelligence driving not just progress, but purpose.

Closing Insight: AI is not about machines thinking like humans—it is about humans thinking beyond human limits.

Takeaways
1) The AI future must be designed consciously, not left to chance.
2) Ethics and equity will define whether AI liberates or divides.
3) The ultimate vision: co-intelligence — humans and AI creating together.

Reflective Questions
1) What principles should guide your personal use of AI?
2) How can you ensure AI is accessible for all, not just a few?
3) What would you do differently if AI expanded your thinking beyond today’s limits?`,
  },

  {
    id: "c2035",
    title: "Extraordinary 2035 — The Defining Horizon",
    content: `By 2035, the world will witness a leap unlike any before: The Convergence Age—where AI, biotechnology, quantum computing, and space exploration intersect. This will:

• Redefine Human Potential: AI-driven gene editing and longevity science will extend healthy life spans dramatically.
• Make Interplanetary Living Possible: AI will manage off-world habitats, enabling sustainable life on Mars and beyond.
• Establish the Global AI Commons: Knowledge, resources, and governance will become universally accessible through AI-powered systems.

This vision is not destiny—it is a call to prepare, design, and embrace it collectively. If humanity chooses wisely, 2035 will mark the birth of a truly AI-first civilization.

Disclaimer: This chapter on 2035 is purely original analysis and vision by Amish Shah, drawn from references to global research and insights, but not a guaranteed prediction. It reflects a strategic foresight perspective and must be read as such.

Ending Note: This entire book is a purely original work by Amish Shah, built on references to global research, but crafted to present a unique, forward-looking framework for humanity’s AI journey.`,
  },

  {
    id: "about",
    title: "About the Author",
    content: `About the Author

Amish Shah is a thinker, strategist, and explorer of possibilities who believes that technology, when embraced with the right intent, can elevate life for everyone on Mother Earth.

Through his journey across industries, organizations, and communities, Amish has seen one common thread: people are often afraid of what they do not fully understand. Artificial Intelligence is one such force. Many fear it will take away jobs or control the future. Amish believes the opposite. AI, when woven into our daily lives with positive intent and purpose, can become part of our very DNA — making life simpler, work more meaningful, and opportunities more accessible.

This book is not written as a manual or a technical guide, but as a human guidebook. It reflects Amish’s conviction that AI is not about replacing people — it is about empowering them, giving every individual, every community, and every nation the chance to thrive in this new era.

For Amish, the mission is clear: to help people embrace AI not with fear, but with confidence, curiosity, and responsibility — using it as a tool for the betterment of humanity and the planet we all share.`,
  },

  {
    id: "closing",
    title: "Closing — In Gratitude",
    content: `Thank you for reading. May this guide inspire AI that uplifts everyday life — with empathy, clarity, and respect.

With blessings to Mother Earth, and a vision for a humane, AI-empowered future.`,
  },
];

/* ================== Utilities ================== */
const clamp = (n, a, b) => Math.min(Math.max(n, a), b);

/* ================== Semantic formatter ================== */
function formatChapter(body) {
  if (!body) return null;
  const lines = body.split(/\r?\n/);
  const out = [];
  let mode = null; // 'takeaways' | 'questions' | 'snapshot' | 'insight'
  let buffer = [];

  const flush = () => {
    if (buffer.length) {
      out.push(
        <p
          key={"p_" + out.length}
          className="fluid-body text-white/90 hyphens whitespace-pre-wrap"
        >
          {buffer.join("\n")}
        </p>
      );
      buffer = [];
    }
  };

  const pushTakeawayList = (items) => (
    <ul key={"t_" + out.length} className="mt-2 ml-5 list-disc">
      {items.map((t, i) => (
        <li key={i} className="fluid-body italic text-white/90">
          {t}
        </li>
      ))}
    </ul>
  );

  const pushQuestionList = (items) => (
    <ol key={"q_" + out.length} className="mt-2 ml-5 list-decimal">
      {items.map((q, i) => {
        const txt = q.trim().replace(/[?.!\s]*$/, "?");
        return (
          <li key={i} className="fluid-body text-white/95">
            <span className="font-semibold">{txt}</span>
          </li>
        );
      })}
    </ol>
  );

  let tmp = [];

  for (let raw of lines) {
    const line = raw.trim();

    // Headings detection
    if (/^Mini\s*Snapshot/i.test(line)) {
      flush();
      mode = "snapshot";
      out.push(
        <div
          key={"h_s_" + out.length}
          className="mt-6 mb-2 text-gold tracking-wide font-semibold"
        >
          Mini Snapshot
        </div>
      );
      continue;
    }
    if (/^Closing\s*Insight/i.test(line)) {
      flush();
      mode = "insight";
      out.push(
        <div
          key={"h_i_" + out.length}
          className="mt-6 mb-2 text-gold tracking-wide font-semibold"
        >
          Closing Insight
        </div>
      );
      continue;
    }
    if (/^Takeaways|^Key\s*Takeaways/i.test(line)) {
      flush();
      mode = "takeaways";
      out.push(
        <div
          key={"h_t_" + out.length}
          className="mt-6 text-gold font-semibold uppercase tracking-wide"
        >
          Key Takeaways
        </div>
      );
      tmp = [];
      continue;
    }
    if (/^Reflective\s*Questions/i.test(line)) {
      flush();
      mode = "questions";
      out.push(
        <div key={"h_r_" + out.length} className="mt-6 text-gold font-semibold">
          Reflective Questions
        </div>
      );
      tmp = [];
      continue;
    }

    // Mode handling
    if (mode === "takeaways") {
      if (!line) {
        out.push(pushTakeawayList(tmp));
        tmp = [];
        mode = null;
        continue;
      }
      if (/^[-•\d\)]/.test(line) || /^\d+\)/.test(line))
        tmp.push(line.replace(/^[-•\d\)]\s*/, ""));
      else tmp.push(line);
      continue;
    }

    if (mode === "questions") {
      if (!line) {
        out.push(pushQuestionList(tmp));
        tmp = [];
        mode = null;
        continue;
      }
      if (/^[-•\d\)]/.test(line) || /^\d+\)/.test(line))
        tmp.push(line.replace(/^[-•\d\)]\s*/, ""));
      else tmp.push(line);
      continue;
    }

    if (mode === "snapshot" || mode === "insight") {
      if (!line) {
        flush();
        mode = null;
        continue;
      }
      out.push(
        <div
          key={"callout_" + out.length}
          className="mt-2 p-4 rounded-xl border border-gold/40 bg-white/5"
        >
          <p className="fluid-body text-white/90">{line}</p>
        </div>
      );
      continue;
    }

    // Default paragraph
    if (line === "") {
      flush();
      continue;
    }
    buffer.push(raw);
  }
  flush();

  // close open lists
  if (mode === "takeaways" && tmp.length) out.push(pushTakeawayList(tmp));
  if (mode === "questions" && tmp.length) out.push(pushQuestionList(tmp));

  return <>{out}</>;
}

/* ================== Page shells ================== */
function PageFrame({ title, pageNum, total, children, isActive }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-8">
      <div
        className="book-frame glow-gold p-6 md:p-10 page"
        data-current={isActive ? "true" : "false"}
        class={isActive ? "is-active" : ""}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="fluid-title text-gold serif">{title}</div>
          <div className="fluid-counter text-gold">
            Page {pageNum} / {total}
          </div>
        </div>
        <div className="prose-invert">{children}</div>
        <footer className="mt-8 text-center text-[12.5px] text-gold">
          © {new Date().getFullYear()} Bhramaastra Advisory Services – All
          Rights Reserved
          <br />
          <span className="italic">Digitized with Love by Amish 💛</span>
        </footer>
      </div>
    </div>
  );
}

function Cover({ meta, pageNum, total, isActive }) {
  const [ok, setOk] = useState(!meta.coverUrl);
  useEffect(() => {
    if (!meta.coverUrl) return;
    const img = new Image();
    img.onload = () => setOk(true);
    img.onerror = () => setOk(false);
    img.src = meta.coverUrl;
  }, [meta.coverUrl]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
      <div
        className="book-frame glow-gold overflow-hidden page"
        data-current={isActive ? "true" : "false"}
        class={isActive ? "is-active" : ""}
      >
        <div
          className="relative min-h-[60vh] flex items-center justify-center"
          style={
            ok && meta.coverUrl
              ? {
                  backgroundImage: `url(${meta.coverUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : {}
          }
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-black/85 via-black/60 to-black/35" />
          <div className="relative z-10 text-center px-6 py-12">
            <div className="fluid-cover text-gold serif font-extrabold">
              {meta.title}
            </div>
            <div className="fluid-sub text-gold/90 mt-3 serif">
              {meta.subtitle}
            </div>
            <div className="text-gold mt-6">
              by <span className="font-semibold">{meta.author}</span>
            </div>
            {!ok && meta.coverUrl && (
              <div className="mt-4 text-xs text-white/70">
                Cover image couldn’t load. Check if the URL is a direct public
                image.
              </div>
            )}
          </div>
          <div className="absolute top-3 right-4 fluid-counter text-gold">
            Page {pageNum} / {total}
          </div>
        </div>
        <footer className="p-4 text-center text-[12.5px] text-gold">
          © {new Date().getFullYear()} Bhramaastra Advisory Services – All
          Rights Reserved
          <br />
          <span className="italic">Digitized with Love by Amish 💛</span>
        </footer>
      </div>
    </div>
  );
}

function Toc({ pages, onJump, pageNum, total, isActive }) {
  const items = pages.filter((p) => !p.isCover && !p.isToc);
  return (
    <PageFrame
      title="Contents"
      pageNum={pageNum}
      total={total}
      isActive={isActive}
    >
      <div className="grid gap-2">
        {items.map((p) => (
          <button
            key={p.id}
            onClick={() => onJump(p.id)}
            className="w-full text-left px-3 py-2 rounded-xl border border-gold/50 text-gold hover:bg-gold hover:text-black transition"
          >
            {p.title}
          </button>
        ))}
      </div>
    </PageFrame>
  );
}

function AboutAuthor({ meta, body, pageNum, total, isActive }) {
  const [showImg, setShowImg] = useState(!!meta.authorPhotoUrl);
  return (
    <PageFrame
      title="About the Author"
      pageNum={pageNum}
      total={total}
      isActive={isActive}
    >
      <div className="grid md:grid-cols-[1fr_auto] items-start gap-6">
        <div className="fluid-body text-white/90 hyphens">
          {formatChapter(body)}
        </div>
        <div className="shrink-0">
          {showImg ? (
            <img
              src={meta.authorPhotoUrl}
              alt="Author headshot"
              className="w-28 h-28 rounded-full object-cover border border-gold/60"
              onError={() => setShowImg(false)}
            />
          ) : (
            <div className="w-28 h-28 rounded-full border border-gold/60 flex items-center justify-center text-gold">
              A
            </div>
          )}
        </div>
      </div>
    </PageFrame>
  );
}

/* ================== App ================== */
export default function App() {
  const saved = load();
  const [meta, setMeta] = useState({ ...defaultMeta, ...(saved.meta || {}) });
  const [idx, setIdx] = useState(saved.idx || 0);
  const [flip, setFlip] = useState("");
  const [turning, setTurning] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const total = PAGES.length;
  const safeIdx = clamp(idx, 0, total - 1);
  const current = PAGES[safeIdx];

  // persist
  useEffect(() => {
    save({ meta, idx: safeIdx });
  }, [meta, safeIdx]);

  // flip trigger (RTL: next = flip-left)
  function trigger(dir) {
    setFlip(dir === "next" ? "flip-left" : "flip-right");
    setTurning(true);
    if (soundOn) playFlipSound();
    if (window.ReadingHUD?.update) window.ReadingHUD.update();
    setTimeout(() => {
      setTurning(false);
      setFlip("");
      if (window.ReadingHUD?.update) window.ReadingHUD.update();
    }, 950);
  }

  function next() {
    if (safeIdx < total - 1) {
      setIdx((i) => i + 1);
      trigger("next");
    }
  }
  function prev() {
    if (safeIdx > 0) {
      setIdx((i) => i - 1);
      trigger("prev");
    }
  }

  // keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // swipe
  const touch = useRef({ x: 0, y: 0 });
  const onStart = (e) => {
    const t = e.touches?.[0];
    if (!t) return;
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onMove = (e) => {
    /* noop */
  };
  const onEnd = (e) => {
    const t = e.changedTouches?.[0];
    if (!t) return;
    const dx = t.clientX - touch.current.x;
    if (Math.abs(dx) > 40) {
      if (dx < 0) next();
      else prev();
    }
  };

  // click/tap zones
  const zoneLeft = (
    <button
      aria-label="Previous page"
      onClick={prev}
      className="absolute inset-y-0 left-0 w-1/3 md:w-1/4 opacity-0"
    />
  );
  const zoneRight = (
    <button
      aria-label="Next page"
      onClick={next}
      className="absolute inset-y-0 right-0 w-1/3 md:w-1/4 opacity-0"
    />
  );

  // header
  const Header = (
    <header className="sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 pt-3">
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-black/55 backdrop-blur-xl border border-gold/40 px-3 py-2">
          <div className="fluid-title text-gold serif truncate max-w-[60vw] md:max-w-none">
            {current?.title || ""}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="fluid-counter text-gold">
              Page {safeIdx + 1}/{total}
            </span>
            <button
              onClick={() => setSoundOn((s) => !s)}
              className={`px-2.5 py-1 rounded border border-gold text-xs ${
                soundOn ? "bg-gold text-black" : "text-gold"
              }`}
              title="Toggle page-turn sound"
            >
              {soundOn ? "Sound: On" : "Sound: Off"}
            </button>
            <Settings meta={meta} setMeta={setMeta} />
            <button
              onClick={prev}
              className="px-2 py-1 rounded border border-gold text-gold"
              title="Previous"
            >
              ⟵
            </button>
            <button
              onClick={next}
              className="px-2 py-1 rounded border border-gold text-black bg-gold"
              title="Next"
            >
              ⟶
            </button>
          </div>
        </div>
      </div>
    </header>
  );

  const flipClass = flip;
  const turningClass = turning ? "turning" : "";

  return (
    <div
      className="min-h-screen pb-28"
      data-book
      onTouchStart={onStart}
      onTouchMove={onMove}
      onTouchEnd={onEnd}
    >
      {Header}

      {/* Page */}
      <div className={`page-sheet ${turningClass} ${flipClass}`}>
        {/* Invisible tap zones */}
        <div className="relative">
          {zoneLeft}
          {zoneRight}
        </div>

        {current?.isCover ? (
          <Cover
            meta={{
              title: meta.title,
              subtitle: meta.subtitle,
              author: meta.author,
              coverUrl: meta.coverUrl,
            }}
            pageNum={safeIdx + 1}
            total={total}
            isActive
          />
        ) : current?.isToc ? (
          <Toc
            pages={PAGES}
            onJump={(id) => {
              const i = PAGES.findIndex((p) => p.id === id);
              if (i >= 0) {
                setIdx(i);
                trigger(i > safeIdx ? "next" : "prev");
              }
            }}
            pageNum={safeIdx + 1}
            total={total}
            isActive
          />
        ) : current?.id === "about" ? (
          <AboutAuthor
            meta={meta}
            body={current.content}
            pageNum={safeIdx + 1}
            total={total}
            isActive
          />
        ) : (
          <PageFrame
            title={current?.title}
            pageNum={safeIdx + 1}
            total={total}
            isActive
          >
            <div className="fluid-body text-white/90 hyphens">
              {formatChapter(current?.content)}
            </div>
          </PageFrame>
        )}
      </div>
    </div>
  );
}

/* ================== Settings (Cover + Author photo URLs) ================== */
function Settings({ meta, setMeta }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="px-2.5 py-1 rounded border border-gold text-gold text-xs"
      >
        Settings
      </button>
      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[92%] sm:w-[460px] bg-black/95 border-l border-gold/40 shadow-[0_0_60px_rgba(207,181,59,.25)]">
            <div className="p-4 border-b border-gold/40 flex items-center justify-between">
              <div className="text-gold font-semibold">Book Settings</div>
              <button onClick={() => setOpen(false)} className="text-gold">
                ✕
              </button>
            </div>
            <div className="p-4 space-y-3">
              <Field label="Book Title">
                <input
                  value={meta.title}
                  onChange={(e) =>
                    setMeta((m) => ({ ...m, title: e.target.value }))
                  }
                  className="w-full rounded-xl border px-3 py-2 bg-black/60 border-gold/40 text-white"
                />
              </Field>
              <Field label="Subtitle">
                <input
                  value={meta.subtitle}
                  onChange={(e) =>
                    setMeta((m) => ({ ...m, subtitle: e.target.value }))
                  }
                  className="w-full rounded-xl border px-3 py-2 bg-black/60 border-gold/40 text-white"
                />
              </Field>
              <Field label="Author">
                <input
                  value={meta.author}
                  onChange={(e) =>
                    setMeta((m) => ({ ...m, author: e.target.value }))
                  }
                  className="w-full rounded-xl border px-3 py-2 bg-black/60 border-gold/40 text-white"
                />
              </Field>
              <Field label="Cover Image URL">
                <input
                  value={meta.coverUrl}
                  onChange={(e) =>
                    setMeta((m) => ({ ...m, coverUrl: e.target.value }))
                  }
                  placeholder="https://.../cover.jpg (public, direct link)"
                  className="w-full rounded-xl border px-3 py-2 bg-black/60 border-gold/40 text-white"
                />
              </Field>
              <Field label="Author Photo URL">
                <input
                  value={meta.authorPhotoUrl}
                  onChange={(e) =>
                    setMeta((m) => ({ ...m, authorPhotoUrl: e.target.value }))
                  }
                  placeholder="https://.../author.jpg (public, direct link)"
                  className="w-full rounded-xl border px-3 py-2 bg-black/60 border-gold/40 text-white"
                />
              </Field>
              <div className="text-xs text-white/70">
                Tip: OneDrive/Drive must be shared “Anyone with the link” and
                use a **direct** file URL. If an image won’t load, it’s usually
                not a direct public link.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
function Field({ label, children }) {
  return (
    <label className="block text-sm">
      <div className="mb-1 text-gold font-semibold">{label}</div>
      {children}
    </label>
  );
}
