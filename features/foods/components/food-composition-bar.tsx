"use client";

import { Ingredient } from "@/lib/types";

interface FoodCompositionBarProps {
  ingredients: Ingredient[];
}

export function FoodCompositionBar({ ingredients }: FoodCompositionBarProps) {
  const safeIngredients = ingredients || [];
  const totalIngredients = safeIngredients.length;

  if (totalIngredients === 0) {
    // Still analyzing or no ingredients
    return (
      <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden border border-gray-400">
        <div className="h-full bg-gray-300 w-full animate-pulse"></div>
      </div>
    );
  }

  // Use 'zone' property instead of 'healthCategory' to match our data structure
  // Handle ingredients that might not have zone data properly set
  const greenCount = safeIngredients.filter(ing => ing.zone === "green").length;
  const yellowCount = safeIngredients.filter(
    ing => ing.zone === "yellow"
  ).length;
  const redCount = safeIngredients.filter(ing => ing.zone === "red").length;
  const unzonedCount = safeIngredients.filter(ing => !ing.zone || !["green", "yellow", "red"].includes(ing.zone)).length;
  const analyzedCount = greenCount + yellowCount + redCount;

  // If we have ingredients but no zone data, treat unzoned as yellow (default)
  const effectiveYellowCount = yellowCount + unzonedCount;
  const effectiveAnalyzedCount = greenCount + effectiveYellowCount + redCount;

  if (effectiveAnalyzedCount === 0) {
    // This should rarely happen since we should have ingredients
    return (
      <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden border border-gray-400">
        <div
          className="h-full bg-gray-300 w-full"
          title="No ingredients to analyze"
        ></div>
      </div>
    );
  }

  const greenPercent = (greenCount / effectiveAnalyzedCount) * 100;
  const yellowPercent = (effectiveYellowCount / effectiveAnalyzedCount) * 100;
  const redPercent = (redCount / effectiveAnalyzedCount) * 100;

  return (
    <div
      className="flex h-3 w-full rounded-full overflow-hidden border border-gray-400 bg-gray-200"
      title={`Green: ${greenCount}, Yellow: ${effectiveYellowCount}${unzonedCount > 0 ? ` (${unzonedCount} unzoned)` : ''}, Red: ${redCount}`}
    >
      {greenPercent > 0 && (
        <div
          className="bg-emerald-500 transition-all duration-500"
          style={{
            width: `${greenPercent}%`,
            minWidth: greenPercent > 0 ? "2px" : "0px",
          }}
        />
      )}
      {yellowPercent > 0 && (
        <div
          className="bg-amber-500 transition-all duration-500"
          style={{
            width: `${yellowPercent}%`,
            minWidth: yellowPercent > 0 ? "2px" : "0px",
          }}
        />
      )}
      {redPercent > 0 && (
        <div
          className="bg-red-500 transition-all duration-500"
          style={{
            width: `${redPercent}%`,
            minWidth: redPercent > 0 ? "2px" : "0px",
          }}
        />
      )}
    </div>
  );
}
