# AI Medical News Blog

Blog de noticias sobre Inteligencia Artificial aplicada a la Medicina y Odontología. Actualizado automáticamente desde PubMed cada 12 horas.

## Tecnologías

- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Contenido:** MDX
- **Fuente de datos:** PubMed API (E-utilities)
- **CI/CD:** GitHub Actions
- **Deploy:** Vercel

## Categorías

- **IA en Odontología** - Aplicaciones de IA en salud dental
- **IA en Medicina** - IA en medicina general
- **IA en Radiología** - Análisis de imágenes médicas
- **Investigación** - Estudios y avances en investigación

## Instalación

```bash
# Clonar el repositorio
git clone <repo-url>
cd ai-medical-blog

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Iniciar servidor de desarrollo
npm run dev
```

## Scripts disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linter
npm run fetch-pubmed # Obtener artículos de PubMed
```

## Estructura del proyecto

```
ai-medical-blog/
├── .github/workflows/    # GitHub Actions
├── src/
│   ├── app/              # Páginas (App Router)
│   ├── components/       # Componentes React
│   ├── lib/              # Utilidades y APIs
│   └── types/            # Tipos TypeScript
├── content/posts/        # Artículos MDX por categoría
├── scripts/              # Scripts de automatización
└── public/               # Archivos estáticos
```

## Actualización automática

El workflow de GitHub Actions (`fetch-pubmed.yml`) se ejecuta cada 12 horas:

1. Busca nuevos artículos en PubMed por cada categoría
2. Genera archivos MDX para los artículos nuevos
3. Hace commit y push si hay cambios
4. Vercel detecta el push y hace deploy automático

## Configuración de Vercel

1. Conectar el repositorio en Vercel
2. Configurar el Root Directory como `ai-medical-blog`
3. Agregar las variables de entorno:
   - `PUBMED_API_KEY` (opcional)
   - `REVALIDATE_SECRET`

## Variables de entorno

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `PUBMED_API_KEY` | API key de NCBI para mayor rate limit | No |
| `REVALIDATE_SECRET` | Token para webhook de revalidación | Sí (producción) |

## Obtener PubMed API Key

1. Crear cuenta en [NCBI](https://www.ncbi.nlm.nih.gov/account/)
2. Ir a Settings > API Key Management
3. Generar nueva API key
4. Agregar a variables de entorno

## Licencia

MIT
