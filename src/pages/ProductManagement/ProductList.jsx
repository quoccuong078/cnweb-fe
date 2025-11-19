import { useState } from 'react';
import ProductForm from './ProductForm';

const ProductList = () => {
    const [products, setProducts] = useState([
        { id: 1, name: 'Sản phẩm A', price: 150000, description: 'Mô tả A' },
        { id: 2, name: 'Sản phẩm B', price: 250000, description: 'Mô tả B' },
    ]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const handleAdd = () => {
        setEditingProduct(null);
        setIsFormOpen(true);
    };
    const handleEdit = (prod) => {
        setEditingProduct(prod);
        setIsFormOpen(true);
    };
    const handleDelete = (id) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };
    const handleSave = (prod) => {
        if (prod.id) {
            setProducts(prev => prev.map(p => p.id === prod.id ? prod : p));
        } else {
            setProducts(prev => [{ ...prod, id: Date.now() }, ...prev]);
        }
        setIsFormOpen(false);
    };

    return (
        <div className="pt-20 min-h-screen bg-gray-50 px-4 py-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl text-indigo-700">Quản lý sản phẩm</h1>
                    <button
                        onClick={handleAdd}
                        className="px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-md transition"
                    >
                        <i className="fa-solid fa-plus"></i> Thêm sản phẩm
                    </button>
                </div>

                <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
                    <table className="min-w-full table-auto text-sm text-left text-gray-700">
                        <thead className="bg-indigo-600 text-white">
                            <tr>
                                <th className="px-6 py-4">Tên sản phẩm</th>
                                <th className="px-6 py-4">Mô tả</th>
                                <th className="px-6 py-4">Giá</th>
                                <th className="px-6 py-4 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {products.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">{p.name}</td>
                                    <td className="px-6 py-4">{p.description}</td>
                                    <td className="px-6 py-4">{p.price.toLocaleString()}₫</td>
                                    <td className="px-6 py-4 text-center space-x-2">
                                        <button
                                            onClick={() => handleEdit(p)}
                                            className="px-4 py-1 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(p.id)}
                                            className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>

            {isFormOpen && (
                <ProductForm
                    initialData={editingProduct}
                    onClose={() => setIsFormOpen(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default ProductList;
