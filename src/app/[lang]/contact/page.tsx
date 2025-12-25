import React from 'react';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gunmetal dark:text-alice-blue">Contacto</h1>
      <div className="max-w-lg mx-auto">
        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gunmetal dark:text-pale-sky">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full rounded-md border-dust-grey/40 dark:border-pale-sky/20 bg-alice-blue dark:bg-gunmetal text-gunmetal dark:text-pale-sky shadow-sm focus:border-cool-sky focus:ring-cool-sky"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gunmetal dark:text-pale-sky">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full rounded-md border-dust-grey/40 dark:border-pale-sky/20 bg-alice-blue dark:bg-gunmetal text-gunmetal dark:text-pale-sky shadow-sm focus:border-cool-sky focus:ring-cool-sky"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gunmetal dark:text-pale-sky">
              Mensaje
            </label>
            <textarea
              id="message"
              rows={4}
              className="mt-1 block w-full rounded-md border-dust-grey/40 dark:border-pale-sky/20 bg-alice-blue dark:bg-gunmetal text-gunmetal dark:text-pale-sky shadow-sm focus:border-cool-sky focus:ring-cool-sky"
              defaultValue={''}
            />
          </div>
          <div>
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-cool-sky dark:bg-cool-sky py-2 px-4 text-sm font-medium text-gunmetal dark:text-gunmetal shadow-sm hover:bg-cool-sky/90 dark:hover:bg-cool-sky/90 focus:outline-none focus:ring-2 focus:ring-cool-sky focus:ring-offset-2 dark:focus:ring-offset-gunmetal transition-colors"
            >
              Enviar mensaje
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
