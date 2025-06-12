import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabase';
import DishCard from '../components/DishCard';
import Logo from '../components/Logo';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function HomePage() {
    const { signOut } = useAuth();
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredDishes, setFilteredDishes] = useState([]);

    // 获取菜品数据
    useEffect(() => {
        const fetchDishes = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
            .from('dishes')
            .select('*')
            .order('created_at', { ascending: false });

            if (error) throw error;
            
            setDishes(data || []);
            setFilteredDishes(data || []);
        } catch (error) {
            console.error('Error fetching dishes:', error.message);
        } finally {
            setLoading(false);
        }
        };

        fetchDishes();
    }, []);

    // 搜索功能
    useEffect(() => {
        if (!searchTerm) {
        setFilteredDishes(dishes);
        return;
        }
        
        const filtered = dishes.filter(dish => 
        dish.dish_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (dish.ingredients && dish.ingredients.some(ingredient => 
            ingredient.toLowerCase().includes(searchTerm.toLowerCase())
        )
        ));
        
        setFilteredDishes(filtered);
    }, [searchTerm, dishes]);

    // 删除菜品
    const handleDelete = async (dishId) => {
        if (!window.confirm('Are you sure you want to delete this dish?')) return;
        
        try {
            const response = await fetch(`${API_URL}/api/dishes/${dishId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to delete dish');
            }
            
            // 更新本地状态
            setDishes(dishes.filter(dish => dish.id !== dishId));
        } catch (error) {
            console.error('Error deleting dish:', error.message);
            alert('Failed to delete dish: ' + error.message);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            // The AuthContext will handle the redirect
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
        {/* 导航栏 */}
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0">
                            <Logo size={40} name='favicon.ico' />
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link 
                            to="/add" 
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Add Dish
                        </Link>
                        <button
                            onClick={handleSignOut}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 9a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L12 15.586V12z" clipRule="evenodd" />
                            </svg>
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        {/* 主内容区 */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* 搜索和标题区域 */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">My Dish Collection</h1>
                <p className="mt-2 text-sm text-gray-500">
                {dishes.length} {dishes.length === 1 ? 'dish' : 'dishes'} in your collection
                </p>
            </div>
            
            <div className="mt-4 md:mt-0">
                <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Search dishes or ingredients..."
                    className="py-2 pl-10 pr-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                </div>
            </div>
            </div>

            {/* 加载状态 */}
            {loading && (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
            )}

            {/* 菜品列表 */}
            {!loading && (
            <>
                {filteredDishes.length === 0 ? (
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No dishes found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                    {searchTerm ? 'Try another search term' : 'Get started by adding your first dish'}
                    </p>
                    <div className="mt-6">
                    <Link
                        to="/add"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add Dish
                    </Link>
                    </div>
                </div>
                ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDishes.map((dish) => (
                    <DishCard 
                        key={dish.id} 
                        dish={dish} 
                        onDelete={handleDelete} 
                    />
                    ))}
                </div>
                )}
            </>
            )}
        </main>

        {/* 页脚 */}
        <footer className="bg-white mt-12">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
                © {new Date().getFullYear()} Foodie Notebook. All rights reserved.
            </p>
            </div>
        </footer>
        </div>
    );
}

export default HomePage;