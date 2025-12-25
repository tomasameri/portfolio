import React from 'react';

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gunmetal dark:text-alice-blue">Mis Proyectos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((project) => (
          <div key={project} className="border border-dust-grey/30 dark:border-pale-sky/10 rounded-lg p-6 bg-alice-blue dark:bg-gunmetal hover:shadow-lg hover:border-cool-sky/30 dark:hover:border-cool-sky/20 transition-all">
            <h2 className="text-2xl font-semibold mb-2 text-gunmetal dark:text-alice-blue">Proyecto {project}</h2>
            <p className="text-gunmetal/70 dark:text-pale-sky/80">
              Descripción breve del proyecto {project} y las tecnologías utilizadas.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
