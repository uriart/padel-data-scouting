import React from 'react';

export function Modal({ onSelectStroke, onClose, strokeTypes }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">Selecciona el tipo de golpe</h3>
                </div>
                <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {strokeTypes.map(stroke => (
                        <button
                            key={stroke}
                            onClick={() => onSelectStroke(stroke.toLowerCase())}
                            className="w-full py-4 px-2 text-base font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-all duration-200"
                        >
                            {stroke}
                        </button>
                    ))}
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-gray-500 rounded-md hover:bg-gray-600">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
