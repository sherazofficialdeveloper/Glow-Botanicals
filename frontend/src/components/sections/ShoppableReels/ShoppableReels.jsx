"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Instagram,
  Play,
  ShoppingBag,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import {
  getInstagramReelId,
  getYouTubeVideoId,
  getMediaType,
  getReelUrl,
} from "@/utils/reelMedia";

const price = (value) =>
  value == null ? "" : `Rs ${Number(value).toLocaleString()}`;
const YouTubeEmbed = ({ url, title }) => {
  const id = getYouTubeVideoId(url);
  return id ? <iframe title={title || "YouTube video"} src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}`} className="w-full h-full border-0" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /> : null;
};const InstagramEmbed = ({ url, title, compact = false }) => {
  const id = getInstagramReelId(url);
  return id ? (
    <iframe
      title={title || "Instagram Reel"}
      src={`https://www.instagram.com/reel/${id}/embed/captioned/`}
      className="w-full h-full border-0"
      scrolling="no"
      allow="encrypted-media"
    />
  ) : null;
};
function Video({ reel, className, videoRef, onPlaying, onPause }) {
  return (
    <video
      ref={videoRef}
      src={getReelUrl(reel)}
      poster={reel.thumbnail || undefined}
      muted
      autoPlay
      playsInline
      loop
      preload="auto"
      className={className}
      onCanPlay={(e) => {
        e.currentTarget.muted = true;
        e.currentTarget.play().catch(() => {});
      }}
      onPlaying={onPlaying}
      onPause={onPause}
    />
  );
}
function ReelCard({ reel, product, onOpen }) {
  const ref = useRef(null);
  const media = getMediaType(
    getReelUrl(reel),
    reel.type || reel.platform,
    reel.videoPublicId,
    reel.sourceType,
  );
  useEffect(() => {
    if (media !== "video") return;
    let tries = 0;
    let timer;
    const play = () => {
      const video = ref.current;
      if (!video) return;
      video.muted = true;
      video.play().catch(() => {
        if (tries++ < 12) timer = setTimeout(play, 300);
      });
    };
    play();
    return () => clearTimeout(timer);
  }, [media, reel._id, reel.url, reel.videoUrl]);
  return (
    <button
      type="button"
      onClick={() => onOpen(reel)}
      className="flex-shrink-0 w-[200px] sm:w-[220px] lg:w-[230px] text-left bg-white rounded-xl border overflow-hidden shadow-sm hover:shadow-lg"
    >
      <div className="relative aspect-[3/4.2] bg-gray-100 overflow-hidden">
        {media === "video" ? (
          <Video
            reel={reel}
            videoRef={ref}
            className="w-full h-full object-cover pointer-events-none"
          />
        ) : media === "instagram" ? (
          <div className="w-full h-full pointer-events-none">
            <InstagramEmbed url={getReelUrl(reel)} title={reel.title} />
          </div>
        ) : media === "youtube" ? (
          <div className="w-full h-full pointer-events-none"><YouTubeEmbed url={getReelUrl(reel)} title={reel.title} /></div>
        ) : reel.thumbnail ? (
          <img
            src={reel.thumbnail}
            alt={reel.title || "Reel"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-gray-400">
            Unavailable
          </div>
        )}
        <div className="absolute inset-0 pointer-events-none grid place-items-center bg-black/10">
          <span className="w-10 h-10 rounded-full bg-white/90 text-[#d9006c] grid place-items-center">
            <Play className="w-4 h-4 fill-current" />
          </span>
        </div>
        {product && (
          <img
            src={product.images?.[0] || "/images/placeholder.png"}
            alt=""
            className="absolute left-2 bottom-2 w-9 h-9 p-0.5 bg-white rounded object-contain"
          />
        )}
      </div>
      <div className="p-3">
        <p className="font-bold text-sm truncate">
          {product?.name || "Product unavailable"}
        </p>
        <p className="text-[#bd002a] font-bold text-xs">
          {price(product?.price)}{" "}
          {product?.originalPrice && (
            <span className="ml-1 text-gray-400 line-through font-normal">
              {price(product.originalPrice)}
            </span>
          )}
        </p>
      </div>
    </button>
  );
}
export const ShoppableReels = ({
  reels = [],
  products = [],
  onAddToCart,
  loading = false,
}) => {
  const [active, setActive] = useState(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const row = useRef(null),
    drag = useRef({ active: false, moved: false, x: 0, scroll: 0 });
  const modalVideo = useRef(null);
  const ordered = useMemo(
    () =>
      [...reels].sort(
        (a, b) =>
          (a.order ?? a.displayOrder ?? 0) - (b.order ?? b.displayOrder ?? 0),
      ),
    [reels],
  );
  const productFor = (reel) => {
    const linked = reel.productId?._id ? reel.productId : reel.product;
    const id = linked?._id || reel.productId;
    return linked?.name
      ? linked
      : products.find((p) => String(p._id) === String(id)) || null;
  };
  const media =
    active &&
    getMediaType(
      getReelUrl(active),
      active.type || active.platform,
      active.videoPublicId,
      active.sourceType,
    );
  useEffect(() => {
    if (media !== "video") return;
    const video = modalVideo.current;
    if (video) {
      video.muted = true;
      video
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  }, [active, media]);
  if (loading)
    return (
      <section className="py-12 bg-white">
        <div className="w-8 h-8 mx-auto border-4 border-[#d9006c] border-t-transparent rounded-full animate-spin" />
      </section>
    );
  if (!ordered.length) return null;
  const stop = () => {
    drag.current.active = false;
    row.current?.classList.remove("is-dragging");
  };
  return (
    <section id="instagram-reels" className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="inline-flex gap-2 text-[#d9006c] text-xs font-bold">
            <Instagram className="w-4" />
            @GlowlyAngel
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Follow On Instagram
          </h2>
        </div>
        <div
          ref={row}
          className="reels-drag-scroll flex flex-nowrap gap-3 sm:gap-4 overflow-x-auto overflow-y-hidden pb-4 hide-scrollbar"
          onMouseDown={(e) => {
            if (e.button !== 0) return;
            drag.current = {
              active: true,
              moved: false,
              x: e.pageX,
              scroll: row.current.scrollLeft,
            };
            row.current.classList.add("is-dragging");
          }}
          onMouseMove={(e) => {
            if (!drag.current.active) return;
            const d = e.pageX - drag.current.x;
            if (Math.abs(d) > 5) drag.current.moved = true;
            row.current.scrollLeft = drag.current.scroll - d;
          }}
          onMouseUp={stop}
          onMouseLeave={stop}
        >
          {ordered.map((reel) => (
            <ReelCard
              key={reel._id}
              reel={reel}
              product={productFor(reel)}
              onOpen={(item) => {
                if (!drag.current.moved) setActive(item);
                drag.current.moved = false;
              }}
            />
          ))}
        </div>
      </div>
      {active && (
        <div
          className="fixed inset-0 z-50 p-4 bg-black/80 flex items-center justify-center"
          onClick={(e) => e.target === e.currentTarget && setActive(null)}
        >
          <div className="relative max-w-sm w-full bg-white rounded-2xl overflow-hidden">
            <button
              onClick={() => {
                modalVideo.current?.pause();
                setActive(null);
              }}
              className="absolute z-10 top-3 right-3 bg-black/60 text-white rounded-full p-2"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="relative aspect-[9/16] bg-black">
              {media === "instagram" ? (
                <InstagramEmbed url={getReelUrl(active)} title={active.title} />
              ) : media === "youtube" ? (
                <YouTubeEmbed url={getReelUrl(active)} title={active.title} />
              ) : media === "video" ? (
                <Video
                  reel={active}
                  videoRef={modalVideo}
                  className="w-full h-full object-cover"
                  onPlaying={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                />
              ) : (
                <div className="text-white grid place-items-center h-full">
                  Video unavailable
                </div>
              )}
              {media === "video" && (
                <button
                  onClick={() => {
                    const v = modalVideo.current;
                    v.muted = !v.muted;
                    setMuted(v.muted);
                  }}
                  className="absolute bottom-3 right-3 bg-black/50 text-white rounded-full p-2"
                >
                  {muted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
            <div className="p-4 flex justify-between items-center">
              <div>
                <p className="font-bold text-sm">
                  {productFor(active)?.name || "Product unavailable"}
                </p>
                <p className="text-[#bd002a] font-bold">
                  {price(productFor(active)?.price)}
                </p>
              </div>
              <button
                disabled={!productFor(active)}
                onClick={() => {
                  const p = productFor(active);
                  if (p) onAddToCart?.(p);
                  setActive(null);
                }}
                className="bg-[#d9006c] disabled:bg-gray-300 text-white px-4 py-2 rounded-full text-xs font-bold flex gap-1"
              >
                <ShoppingBag className="w-4" />
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          scrollbar-width: none;
        }
        .reels-drag-scroll {
          cursor: grab;
          touch-action: pan-x;
          user-select: none;
        }
        .reels-drag-scroll.is-dragging {
          cursor: grabbing;
          scroll-behavior: auto;
        }
      `}</style>
    </section>
  );
};
