import React, { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Heart,
  Search,
  ShoppingCart,
  Music2,
  Star,
  Filter,
  ChevronRight,
  Plus,
  Moon,
  Sun,
  Trash2,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Toggle } from "@/components/ui/toggle";

// -----------------------------
// Données mock pour démarrer
// -----------------------------
const DEMO_BEATS = [
  {
    id: "b1",
    title: "Midnight Drive",
    producer: "Marion",
    bpm: 92,
    key: "Am",
    mood: ["Dark", "Trap"],
    price: 29,
    rating: 4.8,
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop",
    preview: "/audio/midnight-drive.mp3", // à remplacer par vos liens
    tags: ["Drill", "808", "Punchy"],
  },
  {
    id: "b2",
    title: "Sunset Bounce",
    producer: "Marion",
    bpm: 140,
    key: "Gm",
    mood: ["Bounce", "West Coast"],
    price: 39,
    rating: 4.6,
    cover: "https://images.unsplash.com/photo-1550409175-6d2b2a6c83f7?q=80&w=1200&auto=format&fit=crop",
    preview: "/audio/sunset-bounce.mp3",
    tags: ["Groovy", "G-Funk", "Talkbox"],
  },
  {
    id: "b3",
    title: "Cloud City",
    producer: "Marion",
    bpm: 76,
    key: "Cm",
    mood: ["Lofi", "Chill"],
    price: 24,
    rating: 4.4,
    cover: "https://images.unsplash.com/photo-1546443046-ed1ce6ffd1dc?q=80&w=1200&auto=format&fit=crop",
    preview: "/audio/cloud-city.mp3",
    tags: ["Lofi", "Jazz", "Mellow"],
  },
  {
    id: "b4",
    title: "Arena",
    producer: "Marion",
    bpm: 160,
    key: "Em",
    mood: ["Drill", "Epic"],
    price: 49,
    rating: 4.9,
    cover: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200&auto=format&fit=crop",
    preview: "/audio/arena.mp3",
    tags: ["Orchestre", "Hard", "Sub"],
  },
];

// Utilitaire pour format prix
const euro = (n) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);

// Composant bouton animé (press feedback)
const PressButton = ({ children, className = "", ...props }) => (
  <motion.button
    whileTap={{ scale: 0.96 }}
    whileHover={{ y: -1 }}
    transition={{ type: "spring", stiffness: 400, damping: 20 }}
    className={`inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium shadow-md hover:shadow-lg bg-white/10 backdrop-blur border border-white/20 ${className}`}
    {...props}
  >
    {children}
  </motion.button>
);

// Chip/Badge animé
const Chip = ({ children }) => (
  <motion.span layout className="px-2 py-1 rounded-full text-xs bg-white/10 border border-white/20">
    {children}
  </motion.span>
);

// Playable cover card
const BeatCard = ({ beat, isPlaying, onPlayToggle, onAddToCart, onFav }) => {
  const audioRef = useRef(null);

  // Synchronise play/pause
  React.useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.play().catch(() => {});
    else audioRef.current.pause();
  }, [isPlaying]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="group relative overflow-hidden rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/15 backdrop-blur shadow-lg"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img src={beat.cover} alt={beat.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div>
            <div className="text-white/90 text-xs">{beat.producer}</div>
            <div className="text-white text-lg font-semibold">{beat.title}</div>
          </div>
          <motion.button
            onClick={onPlayToggle}
            whileTap={{ scale: 0.9 }}
            className="h-12 w-12 rounded-full bg-white text-black flex items-center justify-center shadow-xl"
            aria-label={isPlaying ? "Pause" : "Lecture"}
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </motion.button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <Badge variant="secondary" className="bg-white/10 border-white/20">{beat.bpm} BPM</Badge>
          <Badge variant="secondary" className="bg-white/10 border-white/20">{beat.key}</Badge>
          {beat.mood.map((m) => (
            <Badge key={m} variant="outline" className="bg-white/5 border-white/20">{m}</Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-yellow-300">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm text-white/80">{beat.rating}</span>
          </div>
          <div className="text-white font-semibold">{euro(beat.price)}</div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <PressButton onClick={onAddToCart} className="grow">
            <ShoppingCart className="h-4 w-4 mr-2" /> Ajouter au panier
          </PressButton>
          <PressButton onClick={onFav} aria-label="Favori" className="px-3">
            <Heart className="h-5 w-5" />
          </PressButton>
        </div>

        {/* Audio */}
        <audio ref={audioRef} src={beat.preview} preload="none" />
      </CardContent>
    </motion.div>
  );
};

export default function InstruMarion() {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("Tous");
  const [bpmRange, setBpmRange] = useState([60, 180]);
  const [cart, setCart] = useState([]); // {id, qty}
  const [playingId, setPlayingId] = useState(null);
  const [dark, setDark] = useState(true);

  const allTags = useMemo(() => {
    const set = new Set(["Tous", ...DEMO_BEATS.flatMap((b) => b.tags)]);
    return Array.from(set);
  }, []);

  const filtered = useMemo(() => {
    return DEMO_BEATS.filter((b) => {
      const q = query.trim().toLowerCase();
      const inQuery = !q || [b.title, b.producer, ...b.tags, ...b.mood].join(" ").toLowerCase().includes(q);
      const inTag = activeTag === "Tous" || b.tags.includes(activeTag);
      const inBpm = b.bpm >= bpmRange[0] && b.bpm <= bpmRange[1];
      return inQuery && inTag && inBpm;
    });
  }, [query, activeTag, bpmRange]);

  const total = useMemo(() => cart.reduce((sum, item) => {
    const b = DEMO_BEATS.find((x) => x.id === item.id);
    return sum + (b ? b.price * item.qty : 0);
  }, 0), [cart]);

  const addToCart = (beat) => {
    setCart((prev) => {
      const exist = prev.find((i) => i.id === beat.id);
      if (exist) return prev.map((i) => (i.id === beat.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { id: beat.id, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

  const togglePlay = (id) => setPlayingId((p) => (p === id ? null : id));

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.25),transparent_40%),radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.25),transparent_40%)] dark:bg-black text-white/90">
        {/* Header */}
        <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/10 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
            <Music2 className="h-7 w-7" />
            <div className="font-black tracking-tight text-xl">Instru-<span className="text-fuchsia-400">Marion</span></div>

            <div className="ml-auto flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-3 py-1.5">
                <Search className="h-4 w-4" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher un beat, un mood, un tag…"
                  className="bg-transparent outline-none text-sm w-64 placeholder:text-white/40"
                />
              </div>

              <Toggle
                pressed={dark}
                onPressedChange={() => setDark((d) => !d)}
                className="rounded-2xl border border-white/20 bg-white/10"
                aria-label="Basculer thème"
              >
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Toggle>

              <Sheet>
                <SheetTrigger asChild>
                  <PressButton className="">
                    <ShoppingCart className="h-4 w-4 mr-2" /> Panier
                    <span className="ml-2 rounded-full bg-white/20 px-2 text-xs">{cart.reduce((a, b) => a + b.qty, 0)}</span>
                  </PressButton>
                </SheetTrigger>
                <SheetContent className="bg-black/90 text-white border-l border-white/10">
                  <SheetHeader>
                    <SheetTitle>Votre panier</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {cart.length === 0 && (
                      <div className="text-white/60">Votre panier est vide.</div>
                    )}
                    {cart.map((item) => {
                      const b = DEMO_BEATS.find((x) => x.id === item.id)!;
                      return (
                        <div key={item.id} className="flex items-center gap-3 border border-white/10 rounded-2xl p-3">
                          <img src={b.cover} alt="" className="h-16 w-16 rounded-xl object-cover" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{b.title}</div>
                            <div className="text-xs text-white/60">{b.bpm} BPM • {b.key}</div>
                          </div>
                          <div className="text-sm mr-2">x{item.qty}</div>
                          <div className="font-semibold mr-2">{euro(b.price * item.qty)}</div>
                          <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="hover:bg-white/10">
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 border-t border-white/10 pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-white/70">Total</div>
                      <div className="text-lg font-bold">{euro(total)}</div>
                    </div>

                    {/* CTA paiement (placeholder) */}
                    <div className="grid grid-cols-2 gap-3">
                      <PressButton className="w-full py-3" disabled title="À connecter">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/3/39/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-4" />
                      </PressButton>
                      <PressButton className="w-full py-3" disabled title="À connecter">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
                      </PressButton>
                      <PressButton className="col-span-2 py-3" disabled title="À connecter">
                        <ChevronRight className="h-4 w-4 mr-2" /> Procéder au paiement
                      </PressButton>
                    </div>
                    <div className="text-xs text-white/50">Les paiements seront ajoutés plus tard. Les boutons sont déjà animés au clic.</div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="relative">
          <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 grid md:grid-cols-2 gap-8 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                Des <span className="text-fuchsia-400">instrumentales</span> prêtes à poser
              </h1>
              <p className="mt-4 text-white/80 max-w-xl">
                Instru-Marion, c'est ta nouvelle source d'instrus rap modernes : Trap, Drill, Lofi, West Coast.
                Écoute, filtre par BPM, ajoute au panier et reviens plus tard pour le paiement.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <PressButton onClick={() => document.getElementById("browse")?.scrollIntoView({ behavior: "smooth" })}>
                  Parcourir le catalogue <ChevronRight className="h-4 w-4 ml-2" />
                </PressButton>
                <PressButton onClick={() => alert("Uploader à brancher plus tard")} className="border-fuchsia-400/40">
                  <Plus className="h-4 w-4 mr-2" /> Uploader vos instrus
                </PressButton>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-white/60">
                <Star className="h-4 w-4" /> Qualité studio • Licences claires • Pré-écoute instantanée
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="relative rounded-3xl border border-white/15 bg-white/5 p-4 backdrop-blur shadow-2xl">
                <div className="aspect-video rounded-2xl overflow-hidden bg-black/60 grid place-items-center">
                  <Music2 className="h-16 w-16 opacity-60" />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  {DEMO_BEATS.map((b) => (
                    <div key={b.id} className="rounded-xl border border-white/10 p-2 bg-white/5">
                      <div className="font-medium truncate">{b.title}</div>
                      <div className="text-white/60">{b.bpm} BPM</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filtres + Catalogue */}
        <section id="browse" className="max-w-7xl mx-auto px-4 pb-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex md:hidden items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-3 py-1.5">
              <Search className="h-4 w-4" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un beat, un mood, un tag…"
                className="bg-transparent outline-none text-sm w-full placeholder:text-white/40"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <PressButton>
                  <Filter className="h-4 w-4 mr-2" /> Filtres
                </PressButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/90 text-white border-white/10">
                <div className="p-3 w-72">
                  <div className="text-xs text-white/60 mb-2">Plage de BPM</div>
                  <Slider
                    value={bpmRange}
                    onValueChange={(v) => setBpmRange(v as [number, number])}
                    min={60}
                    max={200}
                    step={1}
                    className="mb-2"
                  />
                  <div className="text-sm">{bpmRange[0]} – {bpmRange[1]} BPM</div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Tabs defaultValue="Tous" value={activeTag} onValueChange={setActiveTag} className="ml-auto">
              <TabsList className="bg-white/10 border border-white/20 rounded-2xl">
                {allTags.slice(0, 5).map((t) => (
                  <TabsTrigger key={t} value={t} className="data-[state=active]:bg-white/20 rounded-xl">
                    {t}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value={activeTag} />
            </Tabs>
          </div>

          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {filtered.map((b) => (
                <BeatCard
                  key={b.id}
                  beat={b}
                  isPlaying={playingId === b.id}
                  onPlayToggle={() => togglePlay(b.id)}
                  onAddToCart={() => addToCart(b)}
                  onFav={() => alert("Ajouté aux favoris ✨")}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <div className="text-center text-white/60 mt-10">Aucun résultat. Essayez d'autres filtres.</div>
          )}
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="font-bold text-lg mb-2">Instru-<span className="text-fuchsia-400">Marion</span></div>
              <p className="text-white/70">Marketplace d'instrumentales rap modernes. Développé avec React + Tailwind + Framer Motion.</p>
            </div>
            <div>
              <div className="font-semibold mb-2">Réseaux</div>
              <div className="flex gap-2">
                <PressButton onClick={() => alert("Partager…")}> <Share2 className="h-4 w-4 mr-2"/> Partager</PressButton>
                <PressButton onClick={() => alert("Instagram à connecter")}>Instagram</PressButton>
                <PressButton onClick={() => alert("YouTube à connecter")}>YouTube</PressButton>
              </div>
            </div>
            <div>
              <div className="font-semibold mb-2">Légal</div>
              <div className="text-white/60">Conditions • Licences • Confidentialité (à compléter)</div>
            </div>
          </div>
          <div className="text-center text-xs text-white/40 pb-8">© {new Date().getFullYear()} Instru-Marion — Tous droits réservés.</div>
        </footer>
      </div>
    </div>
  );
}
