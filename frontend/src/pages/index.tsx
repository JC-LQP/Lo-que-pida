import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">
          Frontend Limpio
        </h1>
        <p className="text-lg opacity-80 mb-8">
          Listo para comenzar con una nueva estructura dinámica
        </p>
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
          <p className="text-sm opacity-70">
            Componentes anteriores eliminados<br/>
            Estructura limpia<br/>
            Lista para desarrollo dinámico
          </p>
        </div>
      </div>
    </div>
  );
}
