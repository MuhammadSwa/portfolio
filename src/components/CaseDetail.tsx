import { createSignal, createEffect, onCleanup, For, Show } from 'solid-js';

interface CaseImage {
  src: string;
  alt: string;
  stage?: 'before' | 'during' | 'after' | 'xray' | 'other';
  attributes?: Record<string, any>;
}

interface CaseData {
  id: string;
  title: string;
  category: string;
  date: string;
  images: CaseImage[];
  [key: string]: any;
}

interface Props {
  caseData: CaseData;
}

const stageLabels: Record<string, { label: string; color: string }> = {
  'before': { label: 'Before', color: 'bg-rose-950/80 text-rose-200 border-rose-800 ring-rose-900' },
  'during': { label: 'During', color: 'bg-amber-950/80 text-amber-200 border-amber-800 ring-amber-900' },
  'after': { label: 'After', color: 'bg-emerald-950/80 text-emerald-200 border-emerald-800 ring-emerald-900' },
  'xray': { label: 'X-Ray', color: 'bg-indigo-950/80 text-indigo-200 border-indigo-800 ring-indigo-900' },
  'other': { label: 'Other', color: 'bg-slate-800/80 text-slate-300 border-slate-600 ring-slate-700' },
};

export default function CaseDetail(props: Props) {
  const [selectedImageIndex, setSelectedImageIndex] = createSignal(0);
  const [lightboxOpen, setLightboxOpen] = createSignal(false);

  // Touch handling state
  let touchStartX = 0;
  let touchEndX = 0;

  const currentImage = () => props.caseData.images[selectedImageIndex()];

  const nextImage = () => {
    setSelectedImageIndex((i) => (i + 1) % props.caseData.images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((i) => (i - 1 + props.caseData.images.length) % props.caseData.images.length);
  };

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  // Keyboard navigation
  createEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if images exist
      if (props.caseData.images.length === 0) return;

      if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'Escape') {
        if (lightboxOpen()) closeLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    onCleanup(() => window.removeEventListener('keydown', handleKeyDown));
  });

  // Swipe handling
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const threshold = 50;
    const swipeDistance = touchStartX - touchEndX;

    if (Math.abs(swipeDistance) > threshold) {
      if (swipeDistance > 0) {
        // Swiped Left -> Next
        nextImage();
      } else {
        // Swiped Right -> Prev
        prevImage();
      }
    }
  };

  return (
    <Show when={props.caseData.images.length > 0}>
      <div class="mb-12 select-none">
        {/* Main Image Display Container */}
        <div
          class="relative bg-slate-900 rounded-2xl overflow-hidden mb-6 group shadow-2xl ring-1 ring-white/10"
          // Responsive height that adapts better than aspect-video
          classList={{
            'h-[300px] sm:h-[450px] md:h-[550px]': true
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Blurred Background Layer */}
          <div
            class="absolute inset-0 bg-cover bg-center opacity-30 blur-2xl scale-110 transition-all duration-700 ease-in-out"
            style={{
              "background-image": `url(${currentImage().src})`,
              "transform": "scale(1.2)"
            }}
          />

          {/* Main Image Layer */}
          <div class="absolute inset-0 flex items-center justify-center p-2 sm:p-4 transition-opacity duration-300">
            <img
              src={currentImage().src}
              alt={currentImage().alt}
              {...currentImage().attributes}
              class="max-w-full max-h-full object-contain drop-shadow-xl cursor-zoom-in transition-transform duration-300 hover:scale-[1.01]"
              onClick={() => openLightbox(selectedImageIndex())}
            />
          </div>

          {/* Gradient Overlay for Controls visibility */}
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 opacity-60 pointer-events-none" />

          {/* Top Bar: Stage Badge */}
          <div class="absolute top-4 left-4 right-4 flex justify-between items-start z-10 pointer-events-none">
            <Show when={currentImage().stage}>
              <span class={`px-4 py-1.5 text-sm font-semibold rounded-full border backdrop-blur-md shadow-lg ${stageLabels[currentImage().stage!]?.color || 'bg-slate-800 text-white'}`}>
                {stageLabels[currentImage().stage!]?.label}
              </span>
            </Show>
          </div>

          {/* Zoom Hint */}
          <div class="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hidden sm:block">
            <span class="px-3 py-1.5 bg-black/50 text-white text-sm font-medium rounded-full backdrop-blur-md border border-white/10 flex items-center gap-2 shadow-lg">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
              Click to zoom
            </span>
          </div>

          {/* Navigation Arrows */}
          <Show when={props.caseData.images.length > 1}>
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/20 hover:bg-black/50 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110 active:scale-95 z-20 flex group/btn"
              aria-label="Previous image"
            >
              <svg class="w-6 h-6 group-hover/btn:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/20 hover:bg-black/50 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110 active:scale-95 z-20 flex group/btn"
              aria-label="Next image"
            >
              <svg class="w-6 h-6 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Pagination Dots (Mobile optimized) */}
            <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              <For each={props.caseData.images}>
                {(_, i) => (
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(i()); }}
                    class={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${i() === selectedImageIndex() ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60 w-1.5'
                      }`}
                    aria-label={`Go to image ${i() + 1}`}
                  />
                )}
              </For>
            </div>
          </Show>
        </div>

        {/* Image Caption */}
        <div class="text-center mb-8 px-4">
          <p class="text-slate-300 text-lg font-medium leading-relaxed">
            {currentImage().alt}
          </p>
          <div class="text-slate-500 text-sm mt-1 uppercase tracking-widest font-semibold">
            Image {selectedImageIndex() + 1} of {props.caseData.images.length}
          </div>
        </div>

        {/* Enhanced Thumbnail Strip */}
        <Show when={props.caseData.images.length > 1}>
          <div class="relative group/thumbs">
            <div class="flex gap-4 overflow-x-auto pb-4 px-2 justify-start sm:justify-center scrollbar-hide snap-x">
              <For each={props.caseData.images}>
                {(image, index) => (
                  <button
                    onClick={() => setSelectedImageIndex(index())}
                    class={`flex-shrink-0 relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden transition-all duration-300 snap-center border-2 ${selectedImageIndex() === index()
                      ? 'border-teal-500 ring-2 ring-teal-500/30 opacity-100 scale-105'
                      : 'border-transparent opacity-50 hover:opacity-100 hover:border-slate-600'
                      }`}
                  >
                    <div class="absolute inset-0 bg-slate-800 animate-pulse" />
                    <img
                      src={image.src}
                      alt={image.alt}
                      {...image.attributes}
                      class="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                    <Show when={image.stage}>
                      <div class="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-[2px] py-0.5">
                        <span class={`block text-center text-[9px] uppercase font-bold tracking-wider ${(stageLabels[image.stage!]?.color || '').includes('text-') ? 'text-white' : 'text-slate-200'
                          }`}>
                          {stageLabels[image.stage!]?.label}
                        </span>
                      </div>
                    </Show>
                  </button>
                )}
              </For>
            </div>
          </div>
        </Show>
      </div>

      {/* Enhanced Lightbox */}
      <Show when={lightboxOpen()}>
        <div
          class="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center animate-fade-in select-none"
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            class="absolute top-4 right-4 sm:top-6 sm:right-6 w-12 h-12 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white transition-colors z-50 border border-white/10"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div class="relative w-full h-full flex items-center justify-center p-2 sm:p-12">
            <img
              src={currentImage().src}
              alt={currentImage().alt}
              {...currentImage().attributes}
              class="max-w-full max-h-full object-contain shadow-2xl transition-opacity duration-300"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <Show when={props.caseData.images.length > 1}>
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              class="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/40 hover:bg-teal-600/80 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all transform hover:scale-105 flex border border-white/10"
              aria-label="Previous image"
            >
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              class="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/40 hover:bg-teal-600/80 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all transform hover:scale-105 flex border border-white/10"
              aria-label="Next image"
            >
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Mobile Swipe Hint/Counter */}
            <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
              <div class="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white/90 text-sm font-medium border border-white/10">
                {selectedImageIndex() + 1} / {props.caseData.images.length}
              </div>
            </div>
          </Show>
        </div>
      </Show>
    </Show>
  );
}
