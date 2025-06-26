// Hook interface and hook-related metadata for use across the app

export interface Hook {
  name: string
  description: string
  category: string
  emoji: string
}

export const categories = [
  'User',
  'Product',
  'AR & 3D',
  'Storage',
  'Navigation',
  'Shop',
  'Utility',
]

// Minimalist category icons (single letters)
export const categoryIcons: Record<string, string> = {
  User: 'U',
  Product: 'P',
  'AR & 3D': 'A',
  Storage: 'S',
  Navigation: 'N',
  Shop: 'S',
  Utility: 'U',
}
