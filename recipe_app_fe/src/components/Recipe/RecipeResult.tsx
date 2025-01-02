import React from 'react';

interface Ingredient {
  name: string;
  quantity: string;
}

interface Step {
  step: string;
}

interface Recipe {
  title: string;
  description: string;
  ingredients: Ingredient[];
  steps: Step[];
}

interface RecipeResultProps {
  recipe: Recipe;
}

function RecipeResult({ recipe }: RecipeResultProps) {
  const { title, description, ingredients, steps } = recipe;

  return (
    <div className="bg-white p-6 shadow-md rounded">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-700 mb-4">{description}</p>

      <div className="mb-4">
        <h3 className="font-bold py-5">Ingredients:</h3>

        {Array.isArray(ingredients) && ingredients.length > 0 ? (

          <ul className="list-disc list-inside">
            {ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.quantity} {ingredient.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>No ingredients specified.</p>
        )}
      </div>

      <div>
        <h3 className="font-bold py-5">Steps:</h3>
        {Array.isArray(steps) && steps.length > 0 ? (
            <ul>
            {steps.map((stepObj, index) => (
              <li key={index}>
                <strong>Step {index + 1}:</strong> {stepObj.step}
              </li>
            ))}
          </ul>
        ) : (
          <p>No steps provided.</p>
        )}
      </div>
    </div>
  );
}

export default RecipeResult;
