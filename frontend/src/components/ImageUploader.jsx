import { useState } from 'react';

export default function ImageUploader({ onImageUpload, disabled = false, label = "Dish Image" }) {
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
            onImageUpload(file);
        };
        reader.readAsDataURL(file);
        }
    };

    return (
        <div className="mt-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <div className="flex items-center">
            <label 
            htmlFor="file-upload" 
            className={`cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4 ${
                disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-indigo-500'
            }`}
            style={{ width: '160px', height: '160px' }}
            >
            {previewUrl ? (
                <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-full object-cover rounded"
                />
            ) : (
                <div className="flex flex-col items-center">
                {/* 修复：添加尺寸类名 */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span className="mt-2 text-sm text-gray-600 text-center">
                    Click to upload
                </span>
                </div>
            )}
            <input 
                id="file-upload" 
                name="file-upload" 
                type="file" 
                className="sr-only" 
                onChange={handleFileChange}
                accept="image/*"
                disabled={disabled}
            />
            </label>
        </div>
        </div>
    );
    }