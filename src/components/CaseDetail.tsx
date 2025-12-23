import { createSignal, For, Show } from 'solid-js';

interface CaseImage {
  src: string; // Already serialized to string URL by the Astro page
  alt: string;
  stage?: 'before' | 'during' | 'after' | 'xray' | 'other';
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
  'before': { label: 'Before', color: 'bg-red-900/50 text-red-300 border-red-700' },
  'during': { label: 'During', color: 'bg-amber-900/50 text-amber-300 border-amber-700' },
  'after': { label: 'After', color: 'bg-emerald-900/50 text-emerald-300 border-emerald-700' },
  'xray': { label: 'X-Ray', color: 'bg-blue-900/50 text-blue-300 border-blue-700' },
  'other': { label: 'Other', color: 'bg-slate-700/50 text-slate-300 border-slate-600' },
};

export default function CaseDetail(props: Props) {
  const [selectedImageIndex, setSelectedImageIndex] = createSignal(0);
  const [lightboxOpen, setLightboxOpen] = createSignal(false);

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
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  return (
    <Show when={props.caseData.images.length > 0}>
      <div class="mb-12">
        {/* Main Image Display */}
        <div class="relative bg-slate-900 rounded-2xl overflow-hidden mb-4 group">
          <div class="aspect-video relative">
            <img 
              src={currentImage().src}
              alt={currentImage().alt}
              class="w-full h-full object-contain cursor-zoom-in"
              onClick={() => openLightbox(selectedImageIndex())}
            />
            
            {/* Stage Badge */}
            <Show when={currentImage().stage}>
              <div class="absolute top-4 left-4">
                <span class={`px-3 py-1 text-sm font-medium rounded-full border ${stageLabels[currentImage().stage!]?.color}`}>
                  {stageLabels[currentImage().stage!]?.label}
                </span>
              </div>
            </Show>
            
            {/* Zoom Hint */}
            <div class="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <span class="px-3 py-1 bg-black/60 text-white text-sm rounded-full backdrop-blur-sm flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
                Click to zoom
              </span>
            </div>

            {/* Navigation Arrows */}
            <Show when={props.caseData.images.length > 1}>
              <button 
                onClick={prevImage}
                class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={nextImage}
                class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </Show>
          </div>
          
          {/* Image Counter */}
          <Show when={props.caseData.images.length > 1}>
            <div class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
              {selectedImageIndex() + 1} / {props.caseData.images.length}
            </div>
          </Show>
        </div>

        {/* Image Caption */}
        <p class="text-center text-slate-400 text-sm mb-6">
          {currentImage().alt}
        </p>

        {/* Thumbnail Strip */}
        <Show when={props.caseData.images.length > 1}>
          <div class="flex gap-3 overflow-x-auto pb-2 justify-center">
            <For each={props.caseData.images}>
              {(image, index) => (
                <button
                  onClick={() => setSelectedImageIndex(index())}
                  class={`flex-shrink-0 relative rounded-lg overflow-hidden transition-all duration-300 ${
                    selectedImageIndex() === index()
                      ? 'ring-2 ring-teal-500 ring-offset-2'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={image.src}
                    alt={image.alt}
                    class="w-20 h-20 object-cover"
                  />
                  <Show when={image.stage}>
                    <div class="absolute bottom-1 left-1 right-1">
                      <span class={`block text-center px-1 py-0.5 text-xs font-medium rounded ${stageLabels[image.stage!]?.color}`}>
                        {stageLabels[image.stage!]?.label}
                      </span>
                    </div>
                  </Show>
                </button>
              )}
            </For>
          </div>
        </Show>
      </div>

      {/* Lightbox */}
      <Show when={lightboxOpen()}>
        <div 
          class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button 
            class="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            onClick={closeLightbox}
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <img 
            src={currentImage().src}
            alt={currentImage().alt}
            class="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <Show when={props.caseData.images.length > 1}>
            <button 
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
            >
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
            >
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </Show>

          {/* Lightbox Counter */}
          <div class="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {selectedImageIndex() + 1} / {props.caseData.images.length}
          </div>
        </div>
      </Show>
    </Show>
  );
}
