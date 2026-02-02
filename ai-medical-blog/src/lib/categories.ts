import { Category, CategorySlug } from '@/types'

export const categories: Record<CategorySlug, Category> = {
  'ia-odontologia': {
    slug: 'ia-odontologia',
    name: 'IA en Odontología',
    description: 'Inteligencia artificial aplicada a la salud dental',
    color: '#3b82f6', // blue-500
    pubmedTerms: [
      'artificial intelligence dentistry',
      'machine learning dental',
      'deep learning oral health',
      'AI dental diagnosis',
    ],
  },
  'ia-medicina': {
    slug: 'ia-medicina',
    name: 'IA en Medicina',
    description: 'Aplicaciones de IA en medicina general',
    color: '#22c55e', // green-500
    pubmedTerms: [
      'artificial intelligence medicine',
      'AI healthcare',
      'machine learning clinical',
      'deep learning medical',
    ],
  },
  'ia-radiologia': {
    slug: 'ia-radiologia',
    name: 'IA en Radiología',
    description: 'IA para análisis de imágenes médicas',
    color: '#a855f7', // purple-500
    pubmedTerms: [
      'AI radiology',
      'deep learning medical imaging',
      'machine learning radiograph',
      'artificial intelligence diagnostic imaging',
    ],
  },
  investigacion: {
    slug: 'investigacion',
    name: 'Investigación',
    description: 'Estudios y avances en investigación con IA',
    color: '#f97316', // orange-500
    pubmedTerms: [
      'AI clinical research',
      'machine learning diagnosis study',
      'artificial intelligence medical research',
    ],
  },
}

export const categoryList = Object.values(categories)

export function getCategory(slug: CategorySlug): Category | undefined {
  return categories[slug]
}

export function getCategoryColor(slug: CategorySlug): string {
  return categories[slug]?.color ?? '#6b7280'
}
