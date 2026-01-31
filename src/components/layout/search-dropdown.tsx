
'use client';

import { History, Search, X } from 'lucide-react';
import type { Product } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ProductSuggestionCard } from '../products/product-suggestion-card';

type SearchDropdownProps = {
  suggestions: Product[];
  recentSearches: string[];
  recommendedProducts: Product[];
  onSuggestionClick: (query: string) => void;
  onClearHistory: () => void;
};

export function SearchDropdown({
  suggestions,
  recentSearches,
  recommendedProducts,
  onSuggestionClick,
  onClearHistory,
}: SearchDropdownProps) {

  const hasSuggestions = suggestions.length > 0;
  const hasRecentSearches = recentSearches.length > 0;
  const hasRecommendations = recommendedProducts.length > 0;

  if (!hasSuggestions && !hasRecentSearches && !hasRecommendations) {
    return (
      <div className="p-6 text-center text-sm text-muted-foreground">
        <p>Start typing to search for products.</p>
      </div>
    );
  }

  return (
    <div className="p-2">
      {hasSuggestions ? (
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground px-3 py-2">Suggestions</h3>
          <ul>
            {suggestions.map((product) => (
              <li key={product.id}>
                <button
                  className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent"
                  onClick={() => onSuggestionClick(product.name)}
                >
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1">{product.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : hasRecentSearches ? (
         <div>
          <div className="flex justify-between items-center px-3 py-2">
            <h3 className="text-xs font-semibold text-muted-foreground">Recent Searches</h3>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={onClearHistory}>Clear</Button>
          </div>
          <ul>
            {recentSearches.map((term) => (
              <li key={term}>
                <button
                  className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent"
                  onClick={() => onSuggestionClick(term)}
                >
                  <History className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1">{term}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ): null}
      
      {(hasSuggestions || hasRecentSearches) && hasRecommendations && <div className="my-2 border-b"></div>}
      
      {hasRecommendations && !hasSuggestions && (
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground px-3 py-2">You might also like</h3>
          <div className="flex overflow-x-auto gap-3 px-3 pb-2 -mb-2">
            {recommendedProducts.map((product) => (
                <ProductSuggestionCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
