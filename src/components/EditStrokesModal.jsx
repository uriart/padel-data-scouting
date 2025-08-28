import React, { useState } from 'react';

export function EditStrokesModal({ strokeTypes, setStrokeTypes, onClose }) {
    const [newStroke, setNewStroke] = useState('');

    const handleAdd = () => {
        const trimmed = newStroke.trim();
        if (trimmed && !strokeTypes.find(s => s.toLowerCase() === trimmed.toLowerCase())) {
            setStrokeTypes(prev => [...prev, trimmed]);
            setNewStroke('');
        } else {
            alert("El tipo de golpe no puede estar vacío o ya existe.");
        }
    };

    const handleDelete = (strokeToDelete) => {
        setStrokeTypes(prev => prev.filter(s => s !== strokeToDelete));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">Editar Tipos de Golpe</h3>
                </div>

                <div className="p-5 overflow-y-auto">
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={newStroke}
                            onChange={(e) => setNewStroke(e.target.value)}
                            placeholder="Nuevo tipo de golpe"
                            className="flex-grow p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
                            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                        />
                        <button onClick={handleAdd} className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">Añadir</button>
                    </div>

                    <ul className="space-y-2">
                        {strokeTypes.map(stroke => (
                            <li key={stroke} className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                                <span>{stroke}</span>
                                <button onClick={() => handleDelete(stroke)} className="text-red-500 hover:text-red-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="p-4 mt-auto bg-gray-50 dark:bg-gray-700/50 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-gray-500 rounded-md hover:bg-gray-600">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
