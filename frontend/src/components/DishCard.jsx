import React from 'react';
import { Link } from 'react-router-dom';

function DishCard({ dish, onDelete }) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:shadow-lg hover:-translate-y-1">
        {/* 菜品图片 */}
        <div className="h-48 overflow-hidden">
            {dish.image_url ? (
            <img 
                src={dish.image_url} 
                alt={dish.dish_name} 
                className="w-full h-full object-cover"
            />
            ) : (
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
            )}
        </div>
        
        {/* 菜品信息 */}
        <div className="p-4">
            <div className="flex justify-between items-start">
            <Link 
                to={`/dish/${dish.id}`} 
                className="text-lg font-semibold text-gray-900 hover:text-indigo-600"
            >
                {dish.dish_name}
            </Link>
            
            {/* 操作按钮 */}
            <div className="flex space-x-2">
                <Link 
                to={`/edit/${dish.id}`}
                className="text-gray-500 hover:text-indigo-600"
                title="Edit"
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                </Link>
                <button 
                onClick={() => onDelete(dish.id)}
                className="text-gray-500 hover:text-red-600"
                title="Delete"
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                </button>
            </div>
            </div>
            
            {/* 食材列表 */}
            <div className="mt-3">
            <h3 className="text-sm font-medium text-gray-700">Ingredients:</h3>
            <div className="mt-1 flex flex-wrap gap-2">
                {dish.ingredients && dish.ingredients.map((ingredient, index) => (
                <span 
                    key={index} 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                    {ingredient}
                </span>
                ))}
            </div>
            </div>
            
            {/* 创建时间 */}
            <div className="mt-4 flex items-center text-sm text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span>
                {new Date(dish.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
                })}
            </span>
            </div>
        </div>
        </div>
    );
}

export default DishCard;