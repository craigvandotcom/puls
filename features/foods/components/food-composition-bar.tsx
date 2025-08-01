"use client";

import type { Ingredient } from "@/lib/types";
import {
  getZoneColor,
  getZoneBgClass,
  getZoneBgStyle,
} from "@/lib/utils/zone-colors";

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
  const greenCount = safeIngredients.filter(ing => ing.zone === "green").length;
  const yellowCount = safeIngredients.filter(
    ing => ing.zone === "yellow"
  ).length;
  const redCount = safeIngredients.filter(ing => ing.zone === "red").length;
  const analyzedCount = greenCount + yellowCount + redCount;

  if (analyzedCount === 0) {
    // No zone data, show default state
    return (
      <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden border border-gray-400">
        <div
          className="transition-all duration-500"
          style={{
            backgroundColor: getZoneColor("yellow"),
            width: "100%",
            height: "100%",
          }}
          title="Unanalyzed ingredients"
        ></div>
      </div>
    );
  }

  const greenPercent = (greenCount / analyzedCount) * 100;
  const yellowPercent = (yellowCount / analyzedCount) * 100;
  const redPercent = (redCount / analyzedCount) * 100;

  return (
    <div
      className="flex h-3 w-full rounded-full overflow-hidden border border-gray-400 bg-gray-200"
      title={`Green: ${greenCount}, Yellow: ${yellowCount}, Red: ${redCount}`}
    >
      {greenPercent > 0 && (
        <div
          className={`${getZoneBgClass("green")} transition-all duration-500`}
          style={{
            width: `${greenPercent}%`,
            minWidth: greenPercent > 0 ? "2px" : "0px",
            ...getZoneBgStyle("green"), // Fallback inline style
          }}
        />
      )}
      {yellowPercent > 0 && (
        <div
          className={`${getZoneBgClass("yellow")} transition-all duration-500`}
          style={{
            width: `${yellowPercent}%`,
            minWidth: yellowPercent > 0 ? "2px" : "0px",
            ...getZoneBgStyle("yellow"), // Fallback inline style
          }}
        />
      )}
      {redPercent > 0 && (
        <div
          className={`${getZoneBgClass("red")} transition-all duration-500`}
          style={{
            width: `${redPercent}%`,
            minWidth: redPercent > 0 ? "2px" : "0px",
            ...getZoneBgStyle("red"), // Fallback inline style
          }}
        />
      )}
    </div>
  );
}
