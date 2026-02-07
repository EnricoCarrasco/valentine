"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Copy,
  Check,
  MessageCircleHeart,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import {
  valentineMessages,
  type ValentineMessage,
} from "@/lib/valentine-messages";

/* ------------------------------------------------------------------ */
/*  Floating hearts (same pattern as homepage)                         */
/* ------------------------------------------------------------------ */
const floatingHearts = [
  { top: "10%", left: "5%", size: 24, opacity: 0.15, animation: "animate-float" },
  { top: "20%", right: "8%", size: 32, opacity: 0.1, animation: "animate-float-delayed" },
  { top: "45%", left: "3%", size: 20, opacity: 0.12, animation: "animate-float-slow" },
  { top: "60%", right: "5%", size: 28, opacity: 0.08, animation: "animate-float" },
  { top: "75%", left: "10%", size: 18, opacity: 0.15, animation: "animate-float-delayed" },
  { top: "85%", right: "12%", size: 22, opacity: 0.1, animation: "animate-float-slow" },
  { top: "30%", left: "90%", size: 16, opacity: 0.12, animation: "animate-float" },
  { top: "55%", left: "92%", size: 26, opacity: 0.08, animation: "animate-float-delayed" },
];

/* ------------------------------------------------------------------ */
/*  Fisher-Yates shuffle                                               */
/* ------------------------------------------------------------------ */
function shuffle<T>(array: T[]): T[] {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ------------------------------------------------------------------ */
/*  Heart burst particles                                              */
/* ------------------------------------------------------------------ */
function HeartBurst() {
  const particles = Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2;
    const distance = 40 + Math.random() * 20;
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.5,
    };
  });

  return (
    <div className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2">
      {particles.map((p, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
          animate={{
            opacity: 0,
            x: p.x,
            y: p.y,
            scale: p.scale,
            rotate: p.rotation,
          }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="absolute text-xs"
        >
          <Heart className="h-3 w-3 text-accent" fill="#FF5A5F" strokeWidth={0} />
        </motion.span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Single chat bubble                                                 */
/* ------------------------------------------------------------------ */
function ChatBubble({
  message,
  isLatest,
  copiedId,
  onCopy,
}: {
  message: ValentineMessage;
  isLatest: boolean;
  copiedId: number | null;
  onCopy: (msg: ValentineMessage) => void;
}) {
  const isCopied = copiedId === message.id;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="relative flex items-start gap-3"
    >
      {/* Emoji badge */}
      <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-soft-pink text-lg shadow-sm">
        {message.emoji}
      </span>

      {/* Bubble */}
      <div className="relative min-w-0 flex-1 rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-md">
        <p className="pr-8 text-sm leading-relaxed text-primary sm:text-base">
          {message.text}
        </p>

        {/* Copy button */}
        <button
          type="button"
          onClick={() => onCopy(message)}
          className="absolute right-2 top-2 rounded-full p-1.5 text-muted/50 transition-colors hover:bg-soft-pink hover:text-accent"
          aria-label={isCopied ? "Copied" : "Copy message"}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isCopied ? (
              <motion.span
                key="check"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Check className="h-4 w-4 text-green-500" />
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Copy className="h-4 w-4" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Heart burst on newest bubble */}
        {isLatest && <HeartBurst />}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */
export default function MessagePage() {
  const [revealedMessages, setRevealedMessages] = useState<ValentineMessage[]>(
    [],
  );
  const [availablePool, setAvailablePool] = useState<ValentineMessage[]>(() =>
    shuffle(valentineMessages),
  );
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [latestId, setLatestId] = useState<number | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const allRevealed = availablePool.length === 0;

  /* Auto-scroll to newest message */
  useEffect(() => {
    if (revealedMessages.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [revealedMessages.length]);

  /* Reveal next message */
  const revealMessage = useCallback(() => {
    if (availablePool.length === 0) return;
    const [next, ...rest] = availablePool;
    setRevealedMessages((prev) => [...prev, next]);
    setAvailablePool(rest);
    setLatestId(next.id);
  }, [availablePool]);

  /* Start over */
  const startOver = useCallback(() => {
    setRevealedMessages([]);
    setAvailablePool(shuffle(valentineMessages));
    setLatestId(null);
    setCopiedId(null);
  }, []);

  /* Copy to clipboard */
  const handleCopy = useCallback((msg: ValentineMessage) => {
    const text = `${msg.emoji} ${msg.text}`;

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }

    setCopiedId(msg.id);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => setCopiedId(null), 2000);
  }, []);

  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-background">
      {/* Floating hearts background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {floatingHearts.map((heart, i) => (
          <svg
            key={i}
            className={`absolute ${heart.animation} animate-pulse-soft`}
            style={{
              top: heart.top,
              left: heart.left,
              right: (heart as Record<string, unknown>).right as string | undefined,
              opacity: heart.opacity,
            }}
            width={heart.size}
            height={heart.size}
            viewBox="0 0 24 24"
            fill="#FF5A5F"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 px-5 pt-10 pb-4 text-center sm:px-8 sm:pt-12">
        <div className="mb-3 inline-flex items-center justify-center">
          <MessageCircleHeart
            className="h-9 w-9 text-accent sm:h-10 sm:w-10"
            strokeWidth={1.8}
          />
        </div>
        <h1 className="mb-2 font-[family-name:var(--font-playfair)] text-2xl font-bold tracking-tight text-primary sm:text-3xl">
          Your{" "}
          <span className="gradient-romantic">Valentine Messages</span>
        </h1>
        <p className="text-sm text-muted sm:text-base">
          Tap below to reveal heartfelt messages, one by one
        </p>
      </header>

      {/* Chat area */}
      <div className="no-scrollbar relative z-10 flex-1 overflow-y-auto px-4 pb-4 sm:px-6">
        <div className="mx-auto flex max-w-lg flex-col gap-4">
          {/* Empty state */}
          {revealedMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Heart
                  className="h-14 w-14 text-accent"
                  fill="#FF5A5F"
                  strokeWidth={0}
                />
              </motion.div>
              <p className="mt-5 text-sm text-muted sm:text-base">
                Tap below to reveal your first message
              </p>
            </div>
          )}

          {/* Message bubbles */}
          <AnimatePresence initial={false}>
            {revealedMessages.map((msg) => (
              <ChatBubble
                key={msg.id}
                message={msg}
                isLatest={msg.id === latestId}
                copiedId={copiedId}
                onCopy={handleCopy}
              />
            ))}
          </AnimatePresence>

          {/* All-revealed congrats */}
          {allRevealed && revealedMessages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-2 py-4 text-center text-sm text-muted"
            >
              <Sparkles className="h-4 w-4 text-accent" />
              <span>You&apos;ve revealed all 20 messages!</span>
              <Sparkles className="h-4 w-4 text-accent" />
            </motion.div>
          )}

          {/* Scroll anchor */}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Sticky bottom action bar */}
      <div className="sticky bottom-0 z-20 border-t border-accent/10 bg-background/90 px-5 py-4 backdrop-blur-sm sm:px-8">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
          {/* Counter */}
          <span className="text-xs font-medium text-muted sm:text-sm">
            {revealedMessages.length} / {valentineMessages.length} revealed
          </span>

          {/* Action button */}
          {allRevealed ? (
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={startOver}
              className="btn-cta"
            >
              <RefreshCw className="h-5 w-5" />
              Start Over
            </motion.button>
          ) : (
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={revealMessage}
              className="btn-cta"
            >
              <Heart className="h-5 w-5" fill="white" strokeWidth={0} />
              Reveal a Message
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Clipboard fallback for older browsers                              */
/* ------------------------------------------------------------------ */
function fallbackCopy(text: string) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}
