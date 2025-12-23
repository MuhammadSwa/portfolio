import { createSignal, For, Show } from 'solid-js';

interface Props {
  categories: { id: string; name: string; icon: string }[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter(props: Props) {
  return (
    <div class="flex flex-wrap justify-center gap-2 mb-8">
      <For each={props.categories}>
        {(category) => (
          <button
            onClick={() => props.onCategoryChange(category.id)}
            class={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              props.activeCategory === category.id
                ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-teal-500 hover:text-teal-400'
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </button>
        )}
      </For>
    </div>
  );
}
