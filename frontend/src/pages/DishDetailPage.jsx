import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import LoadingSpinner from '../components/LoadingSpinner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function DishDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [dish, setDish] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // 加载菜品数据
    useEffect(() => {
        const fetchDish = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/dishes/${id}`);
            const data = await response.json();

            if (data.error) throw new Error(data.error);
            setDish(data);
        } catch (error) {
            setError(error.message);
            console.error('Error fetching dish:', error);
        } finally {
            setLoading(false);
        }
        };

        fetchDish();
    }, [id]);

    // 删除菜品
    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this dish?')) return;
        
        setIsDeleting(true);
        try {
            const response = await fetch(`${API_URL}/api/dishes/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to delete dish');
            }

            // 删除成功，返回首页
            navigate('/', { state: { message: 'Dish deleted successfully!' } });
        } catch (error) {
            setError(error.message);
            console.error('Error deleting dish:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) {
        return (
        <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="large" />
        </div>
        );
    }

    if (error) {
        return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Error loading dish</h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <div className="mt-6">
                <button
                onClick={() => navigate('/')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                >
                Back to Home
                </button>
            </div>
            </div>
        </div>
        );
    }

    if (!dish) {
        return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Dish not found</h3>
            <p className="mt-1 text-sm text-gray-500">The dish you're looking for doesn't exist or may have been deleted.</p>
            <div className="mt-6">
                <button
                onClick={() => navigate('/')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                >
                Back to Home
                </button>
            </div>
            </div>
        </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            {/* 图片区域 */}
            <div className="relative h-96 w-full">
                {dish.image_url ? (
                <img 
                    src={dish.image_url} 
                    alt={dish.dish_name} 
                    className="w-full h-full object-cover"
                />
                ) : (
                <div className="bg-gray-200 border-2 border-dashed w-full h-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                )}
                
                {/* 返回按钮 */}
                <button
                onClick={() => navigate(-1)}
                className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                </button>
            </div>
            
            {/* 菜品信息 */}
            <div className="p-6 md:p-8">
                <div className="flex flex-wrap justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{dish.dish_name}</h1>
                    
                    {/* 创建时间 */}
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span>
                        Added on {new Date(dish.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                        })}
                    </span>
                    </div>
                </div>
                
                {/* 操作按钮 */}
                <div className="mt-4 sm:mt-0 flex space-x-3">
                    <Link 
                    to={`/edit/${dish.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit Dish
                    </Link>
                    <button 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none disabled:opacity-70"
                    >
                    {isDeleting ? (
                        <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Deleting...
                        </>
                    ) : (
                        <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Delete
                        </>
                    )}
                    </button>
                </div>
                </div>
                
                {/* 分隔线 */}
                <div className="mt-6 border-t border-gray-200"></div>
                
                {/* 食材列表 */}
                <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-900">Ingredients</h2>
                <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {dish.ingredients && dish.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start">
                        <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        </div>
                        <p className="ml-3 text-gray-700">{ingredient}</p>
                    </li>
                    ))}
                </ul>
                </div>
                
                {/* 备注区域 */}
                <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900">Notes</h2>
                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">
                    {dish.notes || "No notes added for this dish."}
                    </p>
                </div>
                </div>
            </div>
            </div>
            
            {/* 相关菜品推荐 */}
            <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Dishes You Might Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 这里可以添加相关菜品卡片 */}
                <div className="bg-white rounded-lg shadow p-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-32" />
                <h3 className="mt-3 text-lg font-medium text-gray-900">Spaghetti Carbonara</h3>
                <p className="mt-1 text-sm text-gray-500">Pasta, Eggs, Pancetta, Cheese</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-32" />
                <h3 className="mt-3 text-lg font-medium text-gray-900">Chicken Curry</h3>
                <p className="mt-1 text-sm text-gray-500">Chicken, Curry Powder, Coconut Milk</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-32" />
                <h3 className="mt-3 text-lg font-medium text-gray-900">Vegetable Stir Fry</h3>
                <p className="mt-1 text-sm text-gray-500">Mixed Vegetables, Soy Sauce, Garlic</p>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
}

export default DishDetailPage;