import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-navy dark:text-white">
                AI Medical News
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              Tu fuente de noticias sobre inteligencia artificial aplicada a la
              medicina y odontología. Artículos actualizados automáticamente
              desde PubMed.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-navy dark:text-white mb-4">
              Categorías
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/categoria/ia-odontologia"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                >
                  IA en Odontología
                </Link>
              </li>
              <li>
                <Link
                  href="/categoria/ia-medicina"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                >
                  IA en Medicina
                </Link>
              </li>
              <li>
                <Link
                  href="/categoria/ia-radiologia"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                >
                  IA en Radiología
                </Link>
              </li>
              <li>
                <Link
                  href="/categoria/investigacion"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                >
                  Investigación
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-navy dark:text-white mb-4">
              Recursos
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://pubmed.ncbi.nlm.nih.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                >
                  PubMed
                </a>
              </li>
              <li>
                <a
                  href="https://www.ncbi.nlm.nih.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                >
                  NCBI
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-gray-500 dark:text-gray-500 text-sm">
            © {currentYear} AI Medical News. Contenido actualizado
            automáticamente desde PubMed.
          </p>
        </div>
      </div>
    </footer>
  )
}
