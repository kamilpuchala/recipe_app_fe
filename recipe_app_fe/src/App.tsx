import React, { useState } from 'react';
import Layout from './components/Layout';
import RecipeForm from './components/Recipe/RecipeForm';
import RecipeResult from './components/Recipe/RecipeResult';

import { IRecipe } from './interfaces/recipe';

function App() {
  const [recipe, setRecipe] = useState<IRecipe | null>(null);
  const [errorList, setErrorList] = useState<string[]>([]);

  const handleReset = () => {
    setRecipe(null);
    setErrorList([]);
  };

  return (
    <Layout>
      <div className="flex flex-col items-center mt-10 px-4">
        <h1 className="text-3xl font-bold mb-2">Let&apos;s create recipe!</h1>
        <p className="text-gray-600 mb-6 text-center">
          Provide a list of ingredients you have, any you don&apos;t want,
          and optionally choose your preferred diet type.
        </p>

        <RecipeForm
          onResult={(recipeData) => setRecipe(recipeData)}
          onError={(errors) => setErrorList(errors)}
          onReset={handleReset}
        />

        {errorList.length > 0 && (
          <div className="mt-4 p-4 bg-red-100 text-red-600 rounded w-full max-w-3xl">
            <h3 className="font-bold">Errors:</h3>
            <ul className="list-disc list-inside">
              {errorList.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {recipe && (
          <div className="mt-8 w-full max-w-3xl">
            <RecipeResult recipe={recipe} />
          </div>
        )}
      </div>
    </Layout>
  );
}

export default App;
