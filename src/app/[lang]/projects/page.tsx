import React from 'react';

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Mis Proyectos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((project) => (
          <div key={project} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">Proyecto {project}</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Descripción breve del proyecto {project} y las tecnologías utilizadas.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
