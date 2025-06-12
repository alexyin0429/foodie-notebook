import { useState } from 'react';
import ImageUploader from './ImageUploader';

function DishForm({ onSubmit, initialData = {}, isEditing = false, isSaving = false }) {
    const [dishName, setDishName] = useState(initialData.dishName || '');
    const [ingredients, setIngredients] = useState(initialData.ingredients || '');
    const [imageFile, setImageFile] = useState(null);
    const [currentImageUrl, setCurrentImageUrl] = useState(initialData.imageUrl || null);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
        dishName,
        ingredients: ingredients.split(',').map(i => i.trim()),
        image: imageFile
        });
    };

    return (
        <form id="dish-form" onSubmit={handleSubmit} className="space-y-6">
        <div>
            <label htmlFor="dishName" className="block text-sm font-medium text-gray-700">
            Dish Name
            </label>
            <input
            type="text"
            id="dishName"
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
            disabled={isSaving}
            />
        </div>

        <div>
            <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700">
            Ingredients (comma separated)
            </label>
            <textarea
            id="ingredients"
            rows={3}
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
            disabled={isSaving}
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">
            Dish Image
            </label>
            
            {isEditing && currentImageUrl && (
            <div className="mt-2 mb-4">
                <p className="text-sm text-gray-500 mb-2">Current Image:</p>
                <div className="relative inline-block">
                <img 
                    src={currentImageUrl} 
                    alt="Current dish" 
                    className="h-40 w-40 rounded-md object-cover border"
                />
                {imageFile && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                    <span className="text-white text-sm font-medium">New Image Selected</span>
                    </div>
                )}
                </div>
            </div>
            )}
            
            <ImageUploader 
            onImageUpload={setImageFile} 
            disabled={isSaving}
            label={isEditing ? "Upload new image" : "Upload image"}
            />
            
            <p className="mt-1 text-sm text-gray-500">
            {isEditing ? "Upload a new image to replace the current one" : "Upload a high-quality image of your dish"}
            </p>
        </div>
        </form>
    );
}

export default DishForm;