useEffect(() => {
    const fetchDishes = async () => {
        const { data, error } = await supabase
        .from('dishes')
        .select('*');
        setDishes(data);
    }
    fetchDishes();
}, []);