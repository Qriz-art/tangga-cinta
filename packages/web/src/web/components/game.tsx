import { useEffect, useRef, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRight,
  Check,
  ChevronRight,
  CircleHelp,
  Dices,
  Heart,
  Layers,
  Leaf,
  Pencil,
  RotateCcw,
  Trophy,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";

const snakes: Record<number, number> = { 23: 6, 35: 18, 49: 30, 60: 42 };
const ladders: Record<number, number> = { 4: 20, 13: 28, 26: 45, 39: 56 };
const cardSquares = [9, 16, 21, 32, 38, 47, 54, 62];
const questions = [
  [
    "Lucu",
    "Kalau aku jadi makanan, aku jadi apa? Kenapa?",
    "Jawab sejujurnya. Tapi jangan bilang kerupuk melempem.",
  ],
  [
    "Tantangan",
    "Tirukan ekspresi pasanganmu waktu lagi ngambek.",
    "Sepuluh detik saja. Setelah itu, kasih pelukan damai.",
  ],
  [
    "Lucu",
    "Kalau kita ikut reality show, siapa yang bakal bikin drama duluan?",
    "Boleh kasih contoh. Jangan sampai jadi drama beneran.",
  ],
  [
    "Tantangan",
    "Buat iklan 15 detik yang menjual kehebatan pasanganmu.",
    "Pakai suara presenter paling heboh yang kamu punya.",
  ],
  [
    "Lucu",
    "Kebiasaan anehku apa yang diam-diam kamu suka?",
    "Yang kecil-kecil juga boleh. Kita tidak sedang sidang.",
  ],
  [
    "Tantangan",
    "Tatap mata pasangan selama 15 detik tanpa tertawa.",
    "Yang ketawa duluan harus bikin satu pantun cinta.",
  ],
  [
    "Lucu",
    "Kalau kita tukar badan sehari, hal pertama apa yang kamu lakukan?",
    "Jawaban kreatif dapat tepuk tangan ekstra.",
  ],
  [
    "Tantangan",
    "Nyanyikan satu kalimat biasa seperti lagu cinta.",
    "Contoh: “Tolong ambilin charger aku.”",
  ],
  [
    "Lucu",
    "Siapa yang paling mungkin tersesat meskipun pakai maps?",
    "Ceritakan satu perjalanan paling absurd kalian.",
  ],
  [
    "Kenal lebih dekat",
    "Hal kecil apa yang bikin kamu merasa disayang?",
    "Bukan ujian. Ini kesempatan buat saling mengerti.",
  ],
  ["Lucu", "Apa nama band kita kalau kita jadi duo musisi?", "Sekalian kasih judul album pertama."],
  [
    "Tantangan",
    "Sampaikan tiga pujian tanpa memakai kata “cantik” atau “ganteng”.",
    "Boleh tentang sifat, kebiasaan, atau hal kecilnya.",
  ],
  [
    "Lucu",
    "Kalau hubungan kita jadi film, judulnya apa?",
    "Romcom, dokumenter, atau komedi penuh plot twist?",
  ],
  [
    "Tantangan",
    "Bikin salam rahasia kalian dalam tiga gerakan.",
    "Latihan sekali, lalu lakukan bareng-bareng.",
  ],
  [
    "Lucu",
    "Siapa yang lebih mungkin menghabiskan gaji untuk jajanan?",
    "Sebutkan jajanan yang tidak bisa ditolak.",
  ],
  [
    "Kenal lebih dekat",
    "Kencan sederhana seperti apa yang ingin kamu coba?",
    "Bukan harus mahal, yang penting berdua.",
  ],
  [
    "Tantangan",
    "Gambarkan pasanganmu pakai tiga suara, bukan kata-kata.",
    "Pasangan harus menebak maksudnya.",
  ],
  [
    "Lucu",
    "Kalau aku jadi superhero, apa kekuatan paling nggak bergunaku?",
    "Kostum dan nama superhero juga wajib ada.",
  ],
  [
    "Tantangan",
    "Ceritakan pertama kali kalian bertemu seperti komentator bola.",
    "Semakin dramatis, semakin bagus.",
  ],
  [
    "Lucu",
    "Siapa yang paling mungkin bilang “terserah” tapi punya pilihan sendiri?",
    "Berikan pembelaan dalam satu kalimat.",
  ],
  [
    "Tantangan",
    "Buat pantun spontan dengan kata “tangga” dan “sayang”.",
    "Tidak harus bagus. Justru yang receh lebih seru.",
  ],
  [
    "Kenal lebih dekat",
    "Kenangan kecil kita mana yang paling sering bikin kamu senyum?",
    "Cerita satu momen, lalu dengarkan versi pasangan.",
  ],
  [
    "Lucu",
    "Kalau kita punya kafe, siapa yang masak dan siapa yang cuma nyicip?",
    "Sekalian tentukan menu andalan kalian.",
  ],
  [
    "Tantangan",
    "Ambil selfie dengan ekspresi paling konyol kalian.",
    "Tidak perlu diunggah. Cukup jadi kenangan berdua.",
  ],
];
type Card = { id: number; player: number; square: number };
type GameState = {
  names: string[];
  positions: number[];
  turn: number;
  dice: number;
  moves: number;
  cards: Card[];
  pending: Card | null;
  winner: number | null;
  message: string;
};
const initial = (): GameState => ({
  names: ["Cewek", "Cowok"],
  positions: [1, 1],
  turn: 0,
  dice: 1,
  moves: 0,
  cards: [],
  pending: null,
  winner: null,
  message: "Cerita seru kalian dimulai dari sini.",
});
function load(): GameState {
  try {
    const s = JSON.parse(localStorage.getItem("tangga-cinta-v1") || "null");
    if (s && Array.isArray(s.positions) && s.positions.length === 2 && Array.isArray(s.cards))
      return s;
  } catch {}
  return initial();
}
function point(n: number) {
  const row = Math.floor((n - 1) / 8);
  const col = row % 2 === 0 ? (n - 1) % 8 : 7 - ((n - 1) % 8);
  return { x: col * 100 + 50, y: (7 - row) * 100 + 50 };
}
function Avatar({ player, small = false }: { player: number; small?: boolean }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={`avatar ${small ? "small" : ""}`}
      aria-label={player === 0 ? "Pemain cewek" : "Pemain cowok"}
    >
      <circle cx="32" cy="32" r="30" fill={player === 0 ? "#e9afa4" : "#b4c9aa"} />
      <path
        d={player === 0 ? "M14 52V27C14 3 49 4 50 27V52Z" : "M15 35V24C15 6 49 6 49 25V35Z"}
        fill={player === 0 ? "#574039" : "#364d38"}
      />
      <path d="M13 64Q15 44 32 45Q51 45 52 64" fill={player === 0 ? "#e1847b" : "#5d805b"} />
      <rect x="26" y="39" width="12" height="13" rx="5" fill="#f2c99d" />
      <ellipse cx="32" cy="29" rx="14" ry="18" fill="#f7d6b0" />
      <path
        d={
          player === 0
            ? "M17 28Q14 8 33 10Q51 8 47 27Q38 25 31 16Q29 26 17 28"
            : "M17 24L17 16Q23 5 38 10Q51 12 47 26L41 19Q31 24 17 24"
        }
        fill={player === 0 ? "#574039" : "#364d38"}
      />
      <circle cx="26" cy="30" r="1.5" fill="#493d30" />
      <circle cx="38" cy="30" r="1.5" fill="#493d30" />
      <path
        d="M28 37Q32 41 36 37"
        stroke="#b77967"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {player === 0 && <path d="M46 15L52 10L54 22L46 19Z" fill="#f7a6a4" />}
    </svg>
  );
}
function Dice({ value, rolling = false }: { value: number; rolling?: boolean }) {
  const dots = [[4], [0, 8], [0, 4, 8], [0, 2, 6, 8], [0, 2, 4, 6, 8], [0, 2, 3, 5, 6, 8]][
    value - 1
  ] || [4];
  return (
    <div className={`dice ${rolling ? "rolling" : ""}`} aria-label={`Dadu ${value}`}>
      {Array.from({ length: 9 }, (_, i) => (
        <span key={i} className={dots.includes(i) ? "dot" : "empty-dot"} />
      ))}
    </div>
  );
}
function Board({ positions, turn }: { positions: number[]; turn: number }) {
  return (
    <div className="board-frame">
      <div className="board-grid">
        {Array.from({ length: 64 }, (_, i) => {
          const row = Math.floor(i / 8);
          const n = (7 - row) * 8 + (row % 2 === 0 ? 8 - (i % 8) : (i % 8) + 1);
          return (
            <div
              className={`square square-${(row + (i % 8)) % 3} ${cardSquares.includes(n) ? "question-square" : ""} ${n === 64 ? "finish-square" : ""} ${n === 1 ? "start-square" : ""}`}
              key={n}
            >
              <span className="square-number">{n}</span>
              {n === 64 ? (
                <>
                  <Trophy />
                  <b>FINISH</b>
                </>
              ) : n === 1 ? (
                <b>MULAI</b>
              ) : cardSquares.includes(n) ? (
                <>
                  <Heart className="tile-heart" />
                  <span className="tile-q">?</span>
                </>
              ) : null}
            </div>
          );
        })}
      </div>
      <svg className="board-art" viewBox="0 0 800 800" aria-hidden="true">
        <defs>
          <filter id="shadow">
            <feDropShadow dx="0" dy="4" stdDeviation="2" floodOpacity=".15" />
          </filter>
        </defs>
        {Object.entries(ladders).map(([start, end]) => {
          const a = point(+start),
            b = point(end);
          const dx = b.x - a.x,
            dy = b.y - a.y,
            l = Math.hypot(dx, dy),
            px = (-dy / l) * 13,
            py = (dx / l) * 13;
          return (
            <g key={start} filter="url(#shadow)" strokeLinecap="round">
              <path
                d={`M${a.x + px} ${a.y + py}L${b.x + px} ${b.y + py}M${a.x - px} ${a.y - py}L${b.x - px} ${b.y - py}`}
                stroke="#b49358"
                strokeWidth="10"
              />
              <path
                d={`M${a.x + px - 2} ${a.y + py}L${b.x + px - 2} ${b.y + py}M${a.x - px - 2} ${a.y - py}L${b.x - px - 2} ${b.y - py}`}
                stroke="#e6c482"
                strokeWidth="5"
              />
              {Array.from({ length: Math.floor(l / 28) }, (_, i) => {
                const t = (i + 0.5) / Math.floor(l / 28);
                const x = a.x + dx * t,
                  y = a.y + dy * t;
                return (
                  <line
                    key={i}
                    x1={x - px}
                    y1={y - py}
                    x2={x + px}
                    y2={y + py}
                    stroke="#dcc086"
                    strokeWidth="7"
                  />
                );
              })}
            </g>
          );
        })}
        {Object.entries(snakes).map(([start, end], i) => {
          const a = point(+start),
            b = point(end);
          const d = `M${b.x} ${b.y} C${b.x + 90} ${b.y - 30},${a.x - 90} ${a.y + 90},${a.x} ${a.y}`;
          const color = ["#94a86b", "#da9b91", "#87a28a", "#ccae68"][i];
          return (
            <g key={start} filter="url(#shadow)">
              <path d={d} stroke={color} strokeWidth="22" fill="none" strokeLinecap="round" />
              <path
                d={d}
                stroke="#ffffff"
                strokeOpacity=".32"
                strokeWidth="4"
                fill="none"
                strokeDasharray="3 17"
                strokeLinecap="round"
              />
              <ellipse
                cx={a.x}
                cy={a.y - 3}
                rx="18"
                ry="22"
                fill={color}
                transform={`rotate(20 ${a.x} ${a.y})`}
              />
              <circle cx={a.x - 7} cy={a.y - 9} r="4" fill="white" />
              <circle cx={a.x + 6} cy={a.y - 13} r="4" fill="white" />
              <circle cx={a.x - 7} cy={a.y - 10} r="2" fill="#354939" />
              <circle cx={a.x + 6} cy={a.y - 14} r="2" fill="#354939" />
              <path
                d={`M${a.x - 3} ${a.y - 22}l-2 -9m2 2l5 -3`}
                stroke="#ab6b66"
                strokeWidth="2"
                fill="none"
              />
            </g>
          );
        })}
      </svg>
      {positions.map((n, p) => {
        const a = point(n);
        const shared = positions[0] === positions[1];
        return (
          <div
            key={p}
            className={`board-token token-${p} ${turn === p ? "active-token" : ""}`}
            style={{
              left: `${(a.x + (shared ? (p === 0 ? -16 : 16) : 0)) / 8}%`,
              top: `${a.y / 8}%`,
            }}
          >
            <Avatar player={p} small />
            <span>{p === 0 ? "C" : "L"}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function Game() {
  const [game, setGame] = useState<GameState>(load);
  const [busy, setBusy] = useState(false);
  const [displayDice, setDisplayDice] = useState(game.dice);
  const [modal, setModal] = useState<"rules" | "names" | "collection" | "reset" | null>(null);
  const [draft, setDraft] = useState(game.names);
  const [sound, setSound] = useState(false);
  const [filter, setFilter] = useState(-1);
  const modalRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    try {
      localStorage.setItem("tangga-cinta-v1", JSON.stringify(game));
    } catch {}
  }, [game]);
  useEffect(() => {
    if (modal || game.pending || game.winner !== null) modalRef.current?.focus();
  }, [modal, game.pending, game.winner]);
  function tick() {
    if (!sound) return;
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 500;
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
      osc.onended = () => ctx.close();
    } catch {}
  }
  const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
  async function roll() {
    if (busy || game.pending || game.winner !== null) return;
    setBusy(true);
    const p = game.turn;
    const result = (crypto.getRandomValues(new Uint32Array(1))[0] % 6) + 1;
    for (let i = 0; i < 9; i++) {
      setDisplayDice((i % 6) + 1);
      tick();
      await wait(65 + i * 9);
    }
    setDisplayDice(result);
    setGame((s) => ({ ...s, dice: result, moves: s.moves + 1 }));
    let target = game.positions[p] + result;
    if (target > 64) {
      setGame((s) => ({
        ...s,
        turn: 1 - p,
        message: `${s.names[p]} perlu angka pas untuk sampai 64. Giliran berikutnya!`,
      }));
      setBusy(false);
      return;
    }
    for (let n = game.positions[p] + 1; n <= target; n++) {
      setGame((s) => ({ ...s, positions: s.positions.map((v, i) => (i === p ? n : v)) }));
      tick();
      await wait(150);
    }
    let msg = `${game.names[p]} maju ${result} langkah ke petak ${target}.`;
    const snake = snakes[target];
    const ladder = ladders[target];
    const landed = target;
    if (snake || ladder) {
      await wait(380);
      target = snake || ladder;
      setGame((s) => ({ ...s, positions: s.positions.map((v, i) => (i === p ? target : v)) }));
      msg = snake
        ? `Ups, kena ular! Turun dari ${landed} ke ${target}. Ambil satu kartu, yuk.`
        : `Asyik, naik tangga! Dari ${landed} langsung ke ${target}.`;
      await wait(300);
    }
    if (target === 64) {
      setGame((s) => ({ ...s, winner: p, message: `${s.names[p]} sampai di garis finish!` }));
    } else if (snake || cardSquares.includes(landed)) {
      const used = game.cards.map((c) => c.id);
      const available = questions.map((_, i) => i).filter((i) => !used.includes(i));
      const pool = available.length ? available : questions.map((_, i) => i);
      const id = pool[crypto.getRandomValues(new Uint32Array(1))[0] % pool.length];
      setGame((s) => ({ ...s, pending: { id, player: p, square: landed }, message: msg }));
    } else setGame((s) => ({ ...s, turn: 1 - p, message: msg }));
    setBusy(false);
  }
  function resolveCard(collect: boolean) {
    setGame((s) => ({
      ...s,
      cards: collect && s.pending ? [...s.cards, s.pending] : s.cards,
      pending: null,
      turn: 1 - s.turn,
      message: collect
        ? "Satu kartu, satu cerita baru. Sekarang giliran pasanganmu!"
        : "Tidak apa-apa melewati kartu. Lanjut ke giliran pasanganmu!",
    }));
  }
  function reset() {
    const names = game.names;
    setGame({ ...initial(), names });
    setDisplayDice(1);
    setModal(null);
  }
  const player = game.turn;
  return (
    <div className="app-shell">
      <header className="header">
        <a className="brand" href="/" aria-label="Tangga Cinta beranda">
          <span className="brand-icon">
            <Heart size={21} fill="currentColor" />
          </span>
          Tangga<span>Cinta</span>
          <span className="brand-dot">.</span>
        </a>
        <nav>
          <span className="made-for">
            <span /> Dibuat untuk berdua
          </span>
          <button className="rules-link" onClick={() => setModal("rules")}>
            <CircleHelp size={17} /> Cara main
          </button>
          <div className="nav-divider" />
          <button
            className="icon-btn"
            aria-label={sound ? "Matikan suara" : "Aktifkan suara"}
            onClick={() => setSound(!sound)}
          >
            {sound ? <Volume2 size={19} /> : <VolumeX size={19} />}
          </button>
        </nav>
      </header>
      <main>
        <section className="intro">
          <div>
            <h1>
              Naik tangga. <span>Jatuh cinta.</span>
            </h1>
            <p>Lempar dadu, temukan cerita, dan kenali pasanganmu lebih dekat.</p>
          </div>
          <div className="couple-note">
            <Heart size={22} />
            <span>
              Bukan soal siapa menang.
              <br />
              <b>Tapi serunya jalan bareng.</b>
            </span>
            <svg viewBox="0 0 100 35">
              <path
                d="M4 7Q58 40 94 10m-15 1l16-2-5 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </section>
        <div className="game-layout">
          <section className="board-section">
            <div className="section-heading">
              <div>
                <span className="tiny-dot" /> PAPAN PERMAINAN
              </div>
              <span>
                8 × 8 <span className="heading-separator">/</span> Petak penuh cerita
              </span>
            </div>
            <Board positions={game.positions} turn={game.turn} />
            <div className="board-legend">
              <span>
                <i className="legend-ladder">
                  <ArrowUpRight size={15} />
                </i>
                Tangga: naik lebih dekat
              </span>
              <span>
                <i className="legend-snake">
                  <ArrowDownLeft size={15} />
                </i>
                Ular: turun, lalu cerita
              </span>
              <span>
                <i className="legend-card">
                  <Heart size={12} />
                </i>
                Petak kartu
              </span>
            </div>
          </section>
          <aside className="sidebar">
            <section className="players-panel">
              <div className="panel-heading">
                <h2>Partner bermain</h2>
                <button
                  className="text-btn"
                  disabled={busy}
                  onClick={() => {
                    setDraft(game.names);
                    setModal("names");
                  }}
                >
                  <Pencil size={13} /> Ubah nama
                </button>
              </div>
              {game.names.map((name, p) => (
                <div className={`player-row player-${p} ${player === p ? "current" : ""}`} key={p}>
                  <Avatar player={p} />
                  <div className="player-info">
                    <h3>
                      {name}
                      {player === p && <span>GILIRANMU</span>}
                    </h3>
                    <p>
                      Petak <b>{game.positions[p]}</b>
                      <span>·</span>
                      {game.cards.filter((c) => c.player === p).length} kartu
                    </p>
                  </div>
                  <span className="player-number">0{p + 1}</span>
                </div>
              ))}
            </section>
            <section className="roll-panel">
              <span className="turn-tag">
                <span />
                GILIRAN {game.names[player].toUpperCase()}
              </span>
              <h2>
                {game.winner !== null
                  ? "Sampai di finish!"
                  : busy
                    ? "Dadu lagi menari…"
                    : "Siap untuk cerita baru?"}
              </h2>
              <p>
                {busy
                  ? "Ke mana langkah kalian selanjutnya?"
                  : "Satu lemparan, satu kejutan kecil."}
              </p>
              <div className="dice-stage">
                <span className="dice-spark spark-one">✦</span>
                <Dice value={displayDice} rolling={busy} />
                <span className="dice-spark spark-two">✧</span>
                <div className="dice-shadow" />
              </div>
              <button
                className="roll-button"
                onClick={roll}
                disabled={busy || !!game.pending || game.winner !== null}
              >
                <Dices size={20} />
                {busy ? "Melangkah…" : "Lempar dadu"}
              </button>
              <div className="roll-tip">
                {game.moves === 0
                  ? "Giliran pertama? Mulai aja dulu."
                  : `Lemparan terakhir: ${game.dice} · ${game.moves} giliran dimainkan`}
              </div>
            </section>
            <button
              className="collection-link"
              onClick={() => {
                setFilter(-1);
                setModal("collection");
              }}
            >
              <div className="stack-icon">
                <Layers size={23} />
              </div>
              <div>
                <h3>Koleksi cerita</h3>
                <p>{game.cards.length} kartu, banyak kenangan</p>
              </div>
              <ChevronRight size={19} />
            </button>
            <div className="game-actions">
              <span>
                <span className="save-dot" /> Progres tersimpan otomatis
              </span>
              <button disabled={busy} onClick={() => setModal("reset")}>
                <RotateCcw size={13} /> Mulai ulang
              </button>
            </div>
          </aside>
        </div>
        <output className="status-bar">
          <span className="status-icon">
            <Leaf size={18} />
          </span>
          <p>{game.message}</p>
          <span className="status-label">NIKMATI PERJALANANNYA</span>
        </output>
        <section className="bottom-tips">
          <div>
            <span className="tip-number">01</span>
            <p>
              <b>Lempar & melangkah</b>
              <span>Bergantian menuju petak 64.</span>
            </p>
          </div>
          <div>
            <span className="tip-number">02</span>
            <p>
              <b>Kena ular? Saatnya cerita.</b>
              <span>Jawab pertanyaan atau lakukan tantangan.</span>
            </p>
          </div>
          <div>
            <span className="tip-number">03</span>
            <p>
              <b>Yang penting, berdua.</b>
              <span>Tidak nyaman? Kartu boleh dilewati.</span>
            </p>
          </div>
        </section>
      </main>
      <footer>
        <span>
          Tangga Cinta <Heart size={11} /> Waktu berkualitas, versi seru.
        </span>
        <span>
          2 pemain <i /> 15–30 menit <i /> Banyak cerita
        </span>
      </footer>
      {(modal || game.pending || game.winner !== null) && (
        <div className="modal-backdrop">
          <dialog
            open
            className="modal"
            aria-modal="true"
            aria-label={
              game.pending ? "Kartu cerita" : modal === "rules" ? "Cara main" : "Tangga Cinta"
            }
            tabIndex={-1}
            ref={modalRef}
            onKeyDown={(e) => {
              if (e.key === "Escape" && modal) setModal(null);
              if (e.key === "Tab") {
                const buttons = Array.from(
                  e.currentTarget.querySelectorAll<HTMLElement>("button,input"),
                );
                const first = buttons[0],
                  last = buttons[buttons.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                  e.preventDefault();
                  last?.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                  e.preventDefault();
                  first?.focus();
                }
              }
            }}
          >
            {modal && (
              <button
                className="modal-close icon-btn"
                onClick={() => setModal(null)}
                aria-label="Tutup"
              >
                <X size={20} />
              </button>
            )}
            {game.pending && !modal ? (
              <>
                <div className="card-emblem">
                  <Heart size={30} />
                </div>
                <div className="eyebrow">
                  KARTU CERITA · {questions[game.pending.id][0].toUpperCase()}
                </div>
                <h2>{questions[game.pending.id][1]}</h2>
                <p>{questions[game.pending.id][2]}</p>
                <div className="card-for">
                  <Avatar player={game.pending.player} small />
                  <span>
                    Untuk {game.names[game.pending.player]} · Petak {game.pending.square}
                  </span>
                </div>
                <button className="primary" onClick={() => resolveCard(true)}>
                  <Check size={18} /> Sudah! Simpan kartu
                </button>
                <button className="skip-button" onClick={() => resolveCard(false)}>
                  Lewati kartu ini
                </button>
              </>
            ) : game.winner !== null && !modal ? (
              <>
                <div className="card-emblem">
                  <Trophy size={32} />
                </div>
                <div className="eyebrow">SAMPAI DI PUNCAK</div>
                <h2>{game.names[game.winner]} menang!</h2>
                <p>
                  Yang kalah harus bilang <b>&ldquo;Aku sayanggg bangett sama kamu&rdquo;</b>, pakai
                  nada bagus.
                </p>
                <button className="primary" onClick={reset}>
                  <RotateCcw size={18} /> Main lagi
                </button>
                <button className="skip-button" onClick={() => setModal("collection")}>
                  Lihat koleksi cerita
                </button>
              </>
            ) : modal === "rules" ? (
              <>
                <div className="eyebrow">SEBELUM MULAI</div>
                <h2>Cara main, gampang kok.</h2>
                <ol className="rules-list">
                  <li>
                    <b>Siapkan partner.</b> Ubah nama kalian, lalu bermain bergantian di perangkat
                    ini.
                  </li>
                  <li>
                    <b>Lempar dadu.</b> Bergerak sesuai angka. Tangga membawa kamu naik; ular
                    membuat kamu turun.
                  </li>
                  <li>
                    <b>Ambil kartu cerita.</b> Setiap kena ular atau mendarat di petak hati, jawab
                    pertanyaan lucu atau coba tantangan ringan.
                  </li>
                  <li>
                    <b>Sampai ke 64.</b> Angka dadu harus pas. Kalau berlebih, kamu tetap di tempat
                    dan giliran berganti.
                  </li>
                </ol>
                <div className="gentle-note">
                  <Heart size={18} /> Semua kartu boleh dilewati. Tidak perlu memaksakan jawaban
                  atau tantangan.
                </div>
                <button className="primary" onClick={() => setModal(null)}>
                  Oke, siap bermain <ArrowRight size={17} />
                </button>
              </>
            ) : modal === "names" ? (
              <>
                <div className="eyebrow">KENALAN DULU, YUK</div>
                <h2>Siapa partner ceritamu?</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setGame((s) => ({
                      ...s,
                      names: draft.map((n, i) => n.trim() || (i === 0 ? "Cewek" : "Cowok")),
                    }));
                    setModal(null);
                  }}
                >
                  {draft.map((n, i) => (
                    <label className="name-field" key={i}>
                      <span>
                        Pemain {i + 1} · {i === 0 ? "Cewek" : "Cowok"}
                      </span>
                      <input
                            aria-label={`Nama pemain ${i + 1}`}
                        autoFocus={i === 0}
                        value={n}
                        maxLength={18}
                        onChange={(e) =>
                          setDraft((d) => d.map((v, j) => (i === j ? e.target.value : v)))
                        }
                      />
                    </label>
                  ))}
                  <button className="primary" type="submit">
                    Simpan nama <Check size={18} />
                  </button>
                </form>
              </>
            ) : modal === "reset" ? (
              <>
                <div className="card-emblem">
                  <RotateCcw size={28} />
                </div>
                <h2>Mulai cerita dari awal?</h2>
                <p>Posisi, giliran, dan koleksi kartu akan direset. Nama kalian tetap tersimpan.</p>
                <button className="primary" onClick={reset}>
                  Ya, mulai ulang
                </button>
                <button className="skip-button" onClick={() => setModal(null)}>
                  Lanjut permainan ini
                </button>
              </>
            ) : modal === "collection" ? (
              <>
                <div className="eyebrow">KENANGAN SEPANJANG JALAN</div>
                <h2>
                  Koleksi cerita kalian<span className="count-bubble">{game.cards.length}</span>
                </h2>
                <div className="collection-filters">
                  {["Semua", ...game.names].map((name, i) => (
                    <button
                      className={filter === i - 1 ? "selected" : ""}
                      key={i}
                      onClick={() => setFilter(i - 1)}
                    >
                      {name}
                    </button>
                  ))}
                </div>
                <div className="collected-list">
                  {game.cards.filter((c) => filter === -1 || c.player === filter).length === 0 ? (
                    <div className="empty-collection">
                      <Layers size={40} />
                      <h3>Belum ada cerita di sini.</h3>
                      <p>
                        Lempar dadu dan temukan kartu pertamamu di petak hati atau saat kena ular.
                      </p>
                    </div>
                  ) : (
                    game.cards
                      .filter((c) => filter === -1 || c.player === filter)
                      .map((c, i) => (
                        <article key={i}>
                          <span>
                            {questions[c.id][0]} · {game.names[c.player]}
                          </span>
                          <h3>{questions[c.id][1]}</h3>
                          <p>{questions[c.id][2]}</p>
                        </article>
                      ))
                  )}
                </div>
                <button className="primary" onClick={() => setModal(null)}>
                  Kembali bermain <ArrowRight size={18} />
                </button>
              </>
            ) : null}
          </dialog>
        </div>
      )}
    </div>
  );
}
