import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import DishForm from '../components/DishForm';
import LoadingSpinner from '../components/LoadingSpinner';

function EditDishPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [dish, setDish] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // 加载菜品数据
    useEffect(() => {
        const fetchDish = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
            .from('dishes')
            .select('*')
            .eq('id', id)
            .single();

            if (error) throw error;
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

    // 更新菜品
    const handleUpdate = async (formData) => {
        setIsSaving(true);
        try {
            // Create FormData for multipart/form-data
            const form = new FormData();
            form.append('dish_name', formData.dishName);
            form.append('ingredients', formData.ingredients.join(','));
            
            if (formData.image) {
                form.append('image', formData.image);
            }

            // Send PUT request to backend API
            const response = await fetch(`http://localhost:8000/api/dishes/${id}`, {
                method: 'PUT',
                body: form
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to update dish');
            }

            // 更新成功，返回首页
            navigate('/', { state: { message: 'Dish updated successfully!' } });
        } catch (error) {
            setError(error.message);
            console.error('Error updating dish:', error);
        } finally {
            setIsSaving(false);
        }
    };

    // 删除菜品
    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this dish?')) return;

        try {
            const response = await fetch(`http://localhost:8000/api/dishes/${id}`, {
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

    // 准备表单初始数据
    const initialData = {
        dishName: dish.dish_name,
        ingredients: dish.ingredients ? dish.ingredients.join(', ') : '',
        imageUrl: dish.image_url
    };

    return (
        <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* 头部 */}
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Edit Dish</h1>
                    <p className="mt-1 text-sm text-gray-500">
                    Update your dish details below
                    </p>
                </div>
                <button
                    onClick={handleDelete}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Delete Dish
                </button>
                </div>
            </div>
            
            {/* 表单区域 */}
            <div className="p-6">
                <DishForm 
                onSubmit={handleUpdate} 
                initialData={initialData}
                isEditing={true}
                isSaving={isSaving}
                />
            </div>
            
            {/* 底部操作按钮 */}
            <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end">
                <button
                onClick={() => navigate('/')}
                className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                Cancel
                </button>
                <button
                type="submit"
                form="dish-form"
                disabled={isSaving}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
                >
                {isSaving ? (
                    <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                    </>
                ) : 'Save Changes'}
                </button>
            </div>
            </div>
        </div>
        </div>
    );
}

export default EditDishPage;