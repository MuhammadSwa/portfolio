import { createSignal, For, Show, createMemo } from "solid-js";

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface CaseImage {
  src: string; // Already serialized to string URL by the Astro page
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
  excellent: "bg-emerald-900/50 text-emerald-300 border-emerald-700",
  good: "bg-blue-900/50 text-blue-300 border-blue-700",
  satisfactory: "bg-amber-900/50 text-amber-300 border-amber-700",
  "needs-follow-up": "bg-orange-900/50 text-orange-300 border-orange-700",
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
      {/* Filters */}
      <div class="mb-8 space-y-4">
        {/* Search Bar */}
        <div class="relative max-w-md mx-auto">
          <svg
            class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search cases, treatments, tags..."
            value={searchQuery()}
            onInput={(e) => setSearchQuery(e.currentTarget.value)}
            class="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-900 outline-none transition-all bg-slate-800 text-slate-100 placeholder-slate-400 shadow-sm"
          />
        </div>

        {/* Category Filter */}
        <div class="flex flex-wrap justify-center gap-2">
          <For each={props.categories}>
            {(category) => (
              <button
                onClick={() => setActiveCategory(category.id)}
                class={`group px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${activeCategory() === category.id
                  ? "bg-teal-500 text-white shadow-lg shadow-teal-500/25"
                  : "bg-slate-800 text-slate-300 border border-slate-700 hover:border-teal-500 hover:text-teal-400"
                  }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
                <span
                  class={`ml-1 text-xs px-2 py-0.5 rounded-full transition-colors ${activeCategory() === category.id
                    ? "bg-white/20 text-white"
                    : "bg-slate-700 text-slate-400 group-hover:bg-slate-600 group-hover:text-slate-200"
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

        {/* View Toggle & Results Count */}
        <div class="flex items-center justify-between">
          <p class="text-slate-400 text-sm">
            Showing{" "}
            <span class="font-semibold text-slate-200">
              {filteredCases().length}
            </span>{" "}
            cases
          </p>
          <div class="flex items-center gap-1 bg-slate-800 rounded-lg border border-slate-700 p-1">
            <button
              onClick={() => setViewMode("grid")}
              class={`p-2 rounded-md transition-colors ${viewMode() === "grid" ? "bg-teal-900 text-teal-400" : "text-slate-400 hover:text-slate-200"}`}
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              class={`p-2 rounded-md transition-colors ${viewMode() === "list" ? "bg-teal-900 text-teal-400" : "text-slate-400 hover:text-slate-200"}`}
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Cases Grid */}
      <Show
        when={filteredCases().length > 0}
        fallback={
          <div class="text-center py-16">
            <div class="text-6xl mb-4">🔍</div>
            <h3 class="text-xl font-semibold text-slate-200 mb-2">
              No cases found
            </h3>
            <p class="text-slate-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        }
      >
        <div
          class={
            viewMode() === "grid"
              ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-4"
          }
        >
          <For each={filteredCases()}>
            {(caseItem) => (
              <Show
                when={viewMode() === "grid"}
                fallback={<ListCard case={caseItem} formatDate={formatDate} />}
              >
                <GridCard case={caseItem} formatDate={formatDate} />
              </Show>
            )}
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
      class="group bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-700 hover:shadow-xl hover:shadow-teal-500/20 hover:border-teal-500 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div class="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
        <Show
          when={props.case.thumbnail || props.case.images.length > 0}
          fallback={
            <div class="w-full h-full flex items-center justify-center text-slate-600">
              <svg
                class="w-16 h-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          }
        >
          <img
            src={props.case.thumbnail || props.case.images[0].src}
            alt={props.case.images[0]?.alt || props.case.title}
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <Show when={props.case.images.length > 1}>
            <div class="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
              +{props.case.images.length - 1} more
            </div>
          </Show>
        </Show>

        {/* Featured Badge */}
        <Show when={props.case.featured}>
          <div class="absolute top-2 left-2 bg-amber-400 text-amber-900 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
            <span>⭐</span> Featured
          </div>
        </Show>
      </div>

      {/* Content */}
      <div class="p-5">
        <div class="flex items-center gap-2 mb-3">
          <span class="px-2 py-1 bg-teal-900/50 text-teal-300 text-xs font-medium rounded-md border border-teal-700">
            {categoryLabels[props.case.category] || props.case.category}
          </span>
          <Show when={props.case.outcome}>
            <span
              class={`px-2 py-1 text-xs font-medium rounded-md border ${outcomeColors[props.case.outcome!]}`}
            >
              {props.case.outcome}
            </span>
          </Show>
        </div>

        <h3 class="font-semibold text-slate-100 mb-2 group-hover:text-teal-400 transition-colors line-clamp-2">
          {props.case.title}
        </h3>

        <p class="text-slate-400 text-sm mb-3 line-clamp-2">
          {props.case.treatment}
        </p>

        <div class="flex items-center justify-between text-xs text-slate-500">
          <span>{props.formatDate(props.case.date)}</span>
          <Show when={props.case.toothNumber}>
            <span>🦷 #{props.case.toothNumber}</span>
          </Show>
        </div>

        <Show
          when={props.case.difficulties && props.case.difficulties.length > 0}
        >
          <div class="mt-3 pt-3 border-t border-slate-700">
            <span class="text-xs text-amber-400 font-medium flex items-center gap-1">
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              {props.case.difficulties!.length} challenge
              {props.case.difficulties!.length > 1 ? "s" : ""} documented
            </span>
          </div>
        </Show>
      </div>
    </a>
  );
}

function ListCard(props: { case: Case; formatDate: (date: string) => string }) {
  return (
    <a
      href={`${import.meta.env.BASE_URL}cases/${props.case.id}`}
      class="group bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-700 hover:shadow-lg hover:shadow-teal-500/20 hover:border-teal-500 transition-all duration-300 flex"
    >
      {/* Image */}
      <div class="w-32 sm:w-48 flex-shrink-0 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
        <Show
          when={props.case.thumbnail || props.case.images.length > 0}
          fallback={
            <div class="w-full h-full flex items-center justify-center text-slate-600">
              <svg
                class="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          }
        >
          <img
            src={props.case.thumbnail || props.case.images[0].src}
            alt={props.case.images[0]?.alt || props.case.title}
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Show>
      </div>

      {/* Content */}
      <div class="flex-1 p-4 flex flex-col justify-center">
        <div class="flex items-center gap-2 mb-2">
          <span class="px-2 py-1 bg-teal-900/50 text-teal-300 text-xs font-medium rounded-md border border-teal-700">
            {categoryLabels[props.case.category] || props.case.category}
          </span>
          <Show when={props.case.featured}>
            <span class="text-amber-500 text-sm">⭐</span>
          </Show>
          <span class="text-slate-500 text-xs ml-auto">
            {props.formatDate(props.case.date)}
          </span>
        </div>

        <h3 class="font-semibold text-slate-100 group-hover:text-teal-400 transition-colors">
          {props.case.title}
        </h3>

        <p class="text-slate-400 text-sm mt-1 line-clamp-1">
          {props.case.treatment}
        </p>

        <div class="flex items-center gap-4 mt-2 text-xs text-slate-500">
          <Show when={props.case.toothNumber}>
            <span>🦷 #{props.case.toothNumber}</span>
          </Show>
          <Show when={props.case.images.length > 0}>
            <span>
              📷 {props.case.images.length} image
              {props.case.images.length > 1 ? "s" : ""}
            </span>
          </Show>
          <Show
            when={props.case.difficulties && props.case.difficulties.length > 0}
          >
            <span class="text-amber-400">
              ⚠️ {props.case.difficulties!.length} challenge
              {props.case.difficulties!.length > 1 ? "s" : ""}
            </span>
          </Show>
        </div>
      </div>
    </a>
  );
}
