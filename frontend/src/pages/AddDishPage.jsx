import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DishForm from '../components/DishForm';
import LoadingSpinner from '../components/LoadingSpinner';

function AddDishPage() {
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (formData) => {
        setIsSaving(true);
        setError(null);
        
        try {
        // 创建FormData对象（用于文件上传）
        const form = new FormData();
        form.append('dish_name', formData.dishName);
        form.append('ingredients', formData.ingredients.join(','));
        if (formData.image) {
            form.append('image', formData.image);
        }

        // 发送POST请求到后端API
        const response = await fetch('http://localhost:8000/api/dishes', {
            method: 'POST',
            body: form
        });
        // 检查响应状态
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to add dish');
        }

        // 添加成功，返回首页并显示成功消息
        navigate('/', { state: { message: 'Dish added successfully!' } });
        } catch (error) {
        setError(error.message);
        console.error('Error adding dish:', error);
        } finally {
        setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* 头部 */}
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Add New Dish</h1>
                    <p className="mt-1 text-sm text-gray-500">
                    Fill out the form below to add a new dish to your collection
                    </p>
                </div>
                </div>
            </div>
            
            {/* 表单区域 */}
            <div className="p-6">
                {error && (
                <div className="mb-6 p-4 bg-red-50 rounded-md">
                    <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error</h3>
                        <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                        </div>
                    </div>
                    </div>
                </div>
                )}
                
                <DishForm 
                onSubmit={handleSubmit} 
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
                    Adding...
                    </>
                ) : 'Add Dish'}
                </button>
            </div>
            </div>
            
            {/* 添加提示 */}
            <div className="mt-8 bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-md">
            <div className="flex">
                <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                </div>
                <div className="ml-3">
                <h3 className="text-sm font-medium text-indigo-800">Tips for adding great dishes</h3>
                <div className="mt-2 text-sm text-indigo-700">
                    <ul className="list-disc pl-5 space-y-1">
                    <li>Use high-quality, well-lit photos</li>
                    <li>List all ingredients including quantities</li>
                    <li>Be specific with dish names (e.g. "Spicy Chicken Tacos")</li>
                    <li>Add notes about special preparation methods</li>
                    </ul>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
}

export default AddDishPage;