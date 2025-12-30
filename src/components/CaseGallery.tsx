import { createSignal, For, Show, createMemo } from "solid-js";

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface CaseImage {
  src: string;
  alt: string;
  stage?: "before" | "during" | "after" | "xray" | "other";
}

interface Case {
  id: string;
  title: string;
  category: string;
  date: string;
  patientAge?: number;
  patientGender?: "male" | "female";
  toothNumber?: string;
  chiefComplaint?: string;
  diagnosis?: string;
  treatment: string;
  materials?: string[];
  difficulties?: string[];
  learnings?: string;
  outcome?: "excellent" | "good" | "satisfactory" | "needs-follow-up";
  followUp?: string;
  images: CaseImage[];
  thumbnail?: string;
  featured?: boolean;
  tags?: string[];
}

interface Props {
  cases: Case[];
  categories: Category[];
}

const categoryLabels: Record<string, string> = {
  restorations: "Restorations",
  endodontics: "Endodontics",
  "fixed-prosthodontics": "Fixed Prosthodontics",
  extractions: "Extractions",
  periodontics: "Periodontics",
  other: "Other",
};

const outcomeColors: Record<string, string> = {
  excellent: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  good: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  satisfactory: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "needs-follow-up": "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

export default function CaseGallery(props: Props) {
  const [activeCategory, setActiveCategory] = createSignal("all");
  const [searchQuery, setSearchQuery] = createSignal("");
  const [viewMode, setViewMode] = createSignal<"grid" | "list">("grid");

  const filteredCases = createMemo(() => {
    return props.cases.filter((c) => {
      const matchesCategory =
        activeCategory() === "all" || c.category === activeCategory();
      const searchLower = searchQuery().toLowerCase();
      const matchesSearch =
        searchLower === "" ||
        c.title.toLowerCase().includes(searchLower) ||
        c.treatment.toLowerCase().includes(searchLower) ||
        c.tags?.some((t) => t.toLowerCase().includes(searchLower)) ||
        c.toothNumber?.includes(searchLower);
      return matchesCategory && matchesSearch;
    });
  });

  const categoryCounts = createMemo(() => {
    const counts: Record<string, number> = {};
    props.cases.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return counts;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      {/* Controls Header */}
      <div class="mb-12 space-y-8">
        {/* Search & Layout Toggles */}
        {/* <div class="flex flex-col gap-6 items-center w-full"> */}
        {/*   <div class="relative w-full max-w-2xl group"> */}
        {/*     <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"> */}
        {/*       <svg */}
        {/*         class="w-5 h-5 text-slate-500 group-focus-within:text-teal-400 transition-colors" */}
        {/*         fill="none" */}
        {/*         stroke="currentColor" */}
        {/*         viewBox="0 0 24 24" */}
        {/*       > */}
        {/*         <path */}
        {/*           stroke-linecap="round" */}
        {/*           stroke-linejoin="round" */}
        {/*           stroke-width="2" */}
        {/*           d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" */}
        {/*         /> */}
        {/*       </svg> */}
        {/*     </div> */}
        {/*     <input */}
        {/*       type="text" */}
        {/*       placeholder="Search detailed cases..." */}
        {/*       value={searchQuery()} */}
        {/*       onInput={(e) => setSearchQuery(e.currentTarget.value)} */}
        {/*       class="w-full pl-11 pr-4 py-3 rounded-full bg-slate-900/50 border border-slate-700/50 focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 focus:bg-slate-800 transition-all text-slate-200 placeholder-slate-500 backdrop-blur-sm" */}
        {/*     /> */}
        {/*   </div> */}
        {/**/}
        {/*   <div class="flex items-center gap-4 justify-center"> */}
        {/*     <p class="text-slate-500 text-sm"> */}
        {/*       <span class="font-medium text-slate-300"> */}
        {/*         {filteredCases().length} */}
        {/*       </span>{" "} */}
        {/*       cases found */}
        {/*     </p> */}
        {/*     {/* <div class="flex p-1 bg-slate-900/50 backdrop-blur-sm rounded-lg border border-slate-700/50"> */}
        {/*       <button */}
        {/*         onClick={() => setViewMode("grid")} */}
        {/*         class={`p-2 rounded-md transition-all ${viewMode() === "grid" */}
        {/*           ? "bg-slate-700 text-teal-400 shadow-sm" */}
        {/*           : "text-slate-400 hover:text-slate-200" */}
        {/*           }`} */}
        {/*         title="Grid View" */}
        {/*       > */}
        {/*         <svg */}
        {/*           class="w-5 h-5" */}
        {/*           fill="none" */}
        {/*           stroke="currentColor" */}
        {/*           viewBox="0 0 24 24" */}
        {/*         > */}
        {/*           <path */}
        {/*             stroke-linecap="round" */}
        {/*             stroke-linejoin="round" */}
        {/*             stroke-width="2" */}
        {/*             d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" */}
        {/*           /> */}
        {/*         </svg> */}
        {/*       </button> */}
        {/*       <button */}
        {/*         onClick={() => setViewMode("list")} */}
        {/*         class={`p-2 rounded-md transition-all ${viewMode() === "list" */}
        {/*           ? "bg-slate-700 text-teal-400 shadow-sm" */}
        {/*           : "text-slate-400 hover:text-slate-200" */}
        {/*           }`} */}
        {/*         title="List View" */}
        {/*       > */}
        {/*         <svg */}
        {/*           class="w-5 h-5" */}
        {/*           fill="none" */}
        {/*           stroke="currentColor" */}
        {/*           viewBox="0 0 24 24" */}
        {/*         > */}
        {/*           <path */}
        {/*             stroke-linecap="round" */}
        {/*             stroke-linejoin="round" */}
        {/*             stroke-width="2" */}
        {/*             d="M4 6h16M4 12h16M4 18h16" */}
        {/*           /> */}
        {/*         </svg> */}
        {/*       </button> */}
        {/*     </div> */}
        {/*   </div> */}
        {/* </div> */}

        {/* Category Pills */}
        <div class="flex flex-wrap gap-2 justify-center">
          <For each={props.categories}>
            {(category) => (
              <button
                onClick={() => setActiveCategory(category.id)}
                class={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border flex items-center gap-2 ${activeCategory() === category.id
                    ? "bg-teal-500/10 text-teal-400 border-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.15)]"
                    : "bg-slate-800/30 text-slate-400 border-slate-700/50 hover:border-slate-500 hover:text-slate-200 hover:bg-slate-800"
                  }`}
              >
                <span class="opacity-75">{category.icon}</span>
                <span>{category.name}</span>
                <span
                  class={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full transition-colors ${activeCategory() === category.id
                      ? "bg-teal-500/20 text-teal-300"
                      : "bg-slate-700/50 text-slate-500"
                    }`}
                >
                  {category.id === "all"
                    ? props.cases.length
                    : categoryCounts()[category.id] || 0}
                </span>
              </button>
            )}
          </For>
        </div>
      </div>

      {/* Gallery Grid */}
      <Show
        when={filteredCases().length > 0}
        fallback={
          <div class="flex flex-col items-center justify-center py-24 text-center border border-dashed border-slate-800 rounded-3xl bg-slate-900/20">
            <div class="bg-slate-800/50 p-4 rounded-full mb-4">
              <svg
                class="w-8 h-8 text-slate-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-medium text-slate-200 mb-2">
              No cases found
            </h3>
            <p class="text-slate-500 max-w-xs mx-auto">
              We couldn't find any cases matching your search. Try different
              keywords or filters.
            </p>
          </div>
        }
      >
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <For each={filteredCases()}>
            {(caseItem) => <GridCard case={caseItem} formatDate={formatDate} />}
          </For>
        </div>
      </Show>
    </div>
  );
}

function GridCard(props: { case: Case; formatDate: (date: string) => string }) {
  return (
    <a
      href={`${import.meta.env.BASE_URL}cases/${props.case.id}`}
      class="group relative flex flex-col h-full bg-slate-900/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-800 hover:border-teal-500/30 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.24)] hover:-translate-y-1"
    >
      {/* Featured Indicator */}
      <Show when={props.case.featured}>
        <div class="absolute top-3 left-3 z-20">
          <div class="bg-amber-500/10 backdrop-blur-md border border-amber-500/20 text-amber-300 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <span>⭐</span>
          </div>
        </div>
      </Show>

      {/* Image Container */}
      <div class="relative w-full aspect-[4/3] overflow-hidden bg-slate-800">
        <Show
          when={props.case.thumbnail || props.case.images.length > 0}
          fallback={
            <div class="absolute inset-0 flex items-center justify-center text-slate-600">
              <svg
                class="w-12 h-12 opacity-20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          }
        >
          <img
            src={props.case.thumbnail || props.case.images[0].src}
            alt={props.case.images[0]?.alt || props.case.title}
            class="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
          />
        </Show>

        {/* Overlay Gradient */}
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

        {/* Image Badge */}
        <Show when={props.case.images.length > 1}>
          <div class="absolute bottom-3 right-3 bg-black/40 backdrop-blur-md border border-white/10 text-white/90 text-[10px] font-medium px-2 py-1 rounded-full">
            +{props.case.images.length - 1} images
          </div>
        </Show>
      </div>

      {/* Content */}
      <div class="flex-1 p-5 flex flex-col relative">
        <div class="flex items-center gap-3 mb-3 text-xs">
          <span class="text-teal-400 font-medium tracking-wide">
            {categoryLabels[props.case.category] || props.case.category}
          </span>
          <span class="text-slate-600">•</span>
          <span class="text-slate-500">
            {props.formatDate(props.case.date)}
          </span>
        </div>

        <h3
          class="font-serif text-lg font-semibold text-slate-100 mb-2 leading-tight group-hover:text-teal-300 transition-colors"
          style={{ "view-transition-name": `case-title-${props.case.id}` }}
        >
          {props.case.title}
        </h3>

        <p class="text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed flex-1">
          {props.case.treatment}
        </p>

        <div class="pt-4 border-t border-slate-800 flex items-center justify-between mt-auto">
          <div class="flex items-center gap-2">
            <Show when={props.case.outcome}>
              <span
                class={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded ${outcomeColors[props.case.outcome!]}`}
              >
                {props.case.outcome?.replace("-", " ")}
              </span>
            </Show>
            <Show when={props.case.toothNumber}>
              <span class="px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] rounded border border-slate-700/50">
                #{props.case.toothNumber}
              </span>
            </Show>
          </div>

          <span class="text-teal-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 flex items-center gap-1 text-sm font-medium">
            View Case <span class="text-lg leading-none">→</span>
          </span>
        </div>
      </div>
    </a>
  );
}

function ListCard(props: { case: Case; formatDate: (date: string) => string }) {
  return (
    <a
      href={`${import.meta.env.BASE_URL}cases/${props.case.id}`}
      class="group relative flex bg-slate-900/40 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-800 hover:border-teal-500/30 transition-all duration-300 hover:bg-slate-800/60"
    >
      {/* Image */}
      <div class="w-48 flex-shrink-0 relative overflow-hidden">
        <Show
          when={props.case.thumbnail || props.case.images.length > 0}
          fallback={
            <div class="w-full h-full bg-slate-800 flex items-center justify-center">
              <svg
                class="w-8 h-8 text-slate-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          }
        >
          <img
            src={props.case.thumbnail || props.case.images[0].src}
            alt={props.case.images[0]?.alt || props.case.title}
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Show>
        <div class="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/10 group-hover:to-transparent transition-all" />
      </div>

      {/* Content */}
      <div class="flex-1 p-5 flex flex-col justify-center">
        <div class="flex items-center gap-3 mb-1">
          <span class="text-xs font-medium text-teal-400">
            {categoryLabels[props.case.category] || props.case.category}
          </span>
          <Show when={props.case.featured}>
            <span class="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-1.5 rounded">
              Featured
            </span>
          </Show>
        </div>

        <h3 class="text-lg font-semibold text-slate-100 group-hover:text-teal-300 transition-colors mb-1">
          {props.case.title}
        </h3>

        <p class="text-slate-400 text-sm line-clamp-1 mb-3">
          {props.case.treatment}
        </p>

        <div class="flex items-center gap-4 text-xs text-slate-500 mt-auto">
          <span>{props.formatDate(props.case.date)}</span>
          <Show when={props.case.toothNumber}>
            <span>Tooth #{props.case.toothNumber}</span>
          </Show>
          <Show when={props.case.images.length > 0}>
            <span class="flex items-center gap-1">
              <svg
                class="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {props.case.images.length}
            </span>
          </Show>
        </div>
      </div>

      {/* Arrow */}
      <div class="pr-6 flex items-center justify-center text-slate-700 group-hover:text-teal-400 transition-colors">
        <svg
          class="w-6 h-6 transform group-hover:translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </a>
  );
}
