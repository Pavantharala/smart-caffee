import React from 'react';
import { ProductCategory } from '../../../types';
import {
  Coffee,
  UtensilsCrossed,
  Soup,
  Cake,
  TrendingUp,
  Tag,
} from 'lucide-react';

interface CategoryNavProps {
  categories: ProductCategory[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  productsCountByCategory: (categoryId: string) => number;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  productsCountByCategory,
}) => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'coffee':
        return <Coffee className="w-4 h-4" />;
      case 'utensilscrossed':
      case 'burger':
      case 'sandwich':
        return <UtensilsCrossed className="w-4 h-4" />;
      case 'soup':
      case 'pizza':
        return <Soup className="w-4 h-4" />;
      case 'cake':
      case 'dessert':
        return <Cake className="w-4 h-4" />;
      case 'trendingup':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Tag className="w-4 h-4" />;
    }
  };

  return (
    <div className="sticky top-16 z-30 bg-stone-950/95 backdrop-blur-md py-3 -mx-4 px-4 sm:-mx-6 sm:px-6 border-b border-stone-800">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20 scale-102 font-black'
              : 'bg-stone-900/80 hover:bg-stone-850 text-stone-300 border border-stone-800/80'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>All Items</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              selectedCategory === 'all'
                ? 'bg-stone-950/20 text-stone-950 font-bold'
                : 'bg-stone-800 text-stone-400'
            }`}
          >
            {productsCountByCategory('all')}
          </span>
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = productsCountByCategory(cat.id);

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${
                isSelected
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20 scale-102 font-black'
                  : 'bg-stone-900/80 hover:bg-stone-850 text-stone-300 border border-stone-800/80'
              }`}
            >
              {getCategoryIcon(cat.icon)}
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? 'bg-stone-950/20 text-stone-950 font-bold'
                    : 'bg-stone-800 text-stone-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
