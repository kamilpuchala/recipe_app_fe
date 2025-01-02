import React, { useState, FormEvent } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CircularProgress from '@mui/material/CircularProgress';
import { IRecipe } from '../../interfaces/recipe';

const DIET_TYPES = ["Keto", "Vegan"] as const;

interface RecipeFormProps {
  onResult: (recipeData: IRecipe) => void;
  onError: (errors: string[]) => void;
  onReset: () => void;
}

function RecipeForm({ onResult, onError, onReset }: RecipeFormProps) {
  const [ingredientFields, setIngredientFields] = useState<string[]>([""]);
  const [selectedDiet, setSelectedDiet] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const addIncludeField = () => {
    if (ingredientFields.length < 10) {
      setIngredientFields((prev) => [...prev, ""]);
    }
  };


  const removeIncludeField = (idx: number) => {
    setIngredientFields((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleIngredientChange = (value: string, idx: number) => {
    const updated = [...ingredientFields];
    updated[idx] = value;
    setIngredientFields(updated);
  };

  const nonEmptyIngredientCount = ingredientFields.filter((f) => f.trim() !== "").length;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    onReset();
    setLoading(true);

    const ingredient = ingredientFields.filter((f) => f.trim() !== "");

    const payload = {
      recipe: {
        ingredients: ingredient,
        diet_type: selectedDiet || null,
      },
    };

    try {
      const response = await fetch("http://localhost:3000/api/v1/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        let errors = errorData["errors"] || ["Something went wrong"];
        if (typeof errors === "string") {
          try {
            errors = JSON.parse(errors);
          } catch {
            errors = [errors];
          }
        }
        onError(errors);
        return;
      }
      const data = await response.json();

      if (data.recipe) {
        onResult(data.recipe as IRecipe);
      } else if (data.errors) {
        onError(data.errors);
      } else {
        onError(["No recipe found."]);
      }
    } catch (error) {
      onError(["Server/Network error"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded w-full max-w-3xl">
      <div className="mb-4">
        <label className="block font-bold mb-1">Diet Type (Optional):</label>
        <select
          className="border rounded p-2 w-full"
          value={selectedDiet}
          onChange={(e) => setSelectedDiet(e.target.value)}
        >
          <option value="">-- No specific diet --</option>
          {DIET_TYPES.map((dt) => (
            <option key={dt} value={dt}>
              {dt}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-row gap-4">
        <div className="flex-1">
          <h2 className="font-bold mb-2">Ingredients (min. 2 required)</h2>
          {ingredientFields.map((fieldValue, idx) => (
            <div key={`include-${idx}`} className="flex items-center mb-2">
              <input
                type="text"
                className="border rounded p-2 flex-1"
                placeholder={`Ingredient #${idx + 1}`}
                value={fieldValue}
                onChange={(e) => handleIngredientChange(e.target.value, idx)}
              />
              <button
                type="button"
                onClick={() => removeIncludeField(idx)}
                className="text-red-600 ml-2"
              >
                <RemoveCircleOutlineIcon />
              </button>
            </div>
          ))}
          {ingredientFields.length < 10 && (
            <button
              type="button"
              onClick={addIncludeField}
              className="text-blue-600 flex items-center mt-1"
            >
              <AddCircleOutlineIcon className="mr-1" />
              Add more ingredient
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center">
        <button
          type="submit"
          className={`bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 ${
            loading || nonEmptyIngredientCount < 2 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading || nonEmptyIngredientCount < 2}
        >
          {loading ? "Loading..." : "Create"}
        </button>
        {loading && (
          <div className="ml-4">
            <CircularProgress size={24} />
          </div>
        )}
      </div>
    </form>
  );
}

export default RecipeForm;
