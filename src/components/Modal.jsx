import React from 'react';

export function Modal({ onSelectStroke, onClose, strokeTypes }) {
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto border border-gray-200 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
                <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">Selecciona el tipo de golpe</h3>
                </div>
                <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {strokeTypes.map(stroke => (
                        <button
                            key={stroke}
                            onClick={() => onSelectStroke(stroke.toLowerCase())}
                            className="w-full py-4 px-2 text-base font-medium text-gray-700 dark:text-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg shadow-sm hover:from-indigo-500 hover:to-indigo-600 hover:text-white dark:hover:from-indigo-600 dark:hover:to-indigo-700 transition-all duration-200 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                        >
                            {stroke}
                        </button>
                    ))}
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg shadow-sm hover:from-gray-600 hover:to-gray-700 transition-all duration-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
