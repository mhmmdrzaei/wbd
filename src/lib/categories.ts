export function normalizeCategoryValue(category: string) {
  return category.trim().replace(/\s+/g, ' ').toLowerCase();
}

export function formatCategoryLabel(category: string) {
  return category.trim().replace(/\s+/g, ' ');
}

export function dedupeCategories(categories: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const category of categories) {
    const formatted = formatCategoryLabel(category);

    if (!formatted) {
      continue;
    }

    const normalized = normalizeCategoryValue(formatted);

    if (seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    result.push(formatted);
  }

  return result;
}
