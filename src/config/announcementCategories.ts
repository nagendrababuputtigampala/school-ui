export interface AnnouncementCategoryOption {
  value: string;
  label: string;
  aliases?: string[];
}
export const ANNOUNCEMENT_CATEGORY_OPTIONS: AnnouncementCategoryOption[] = [
  { value: 'academic', label: 'Academic', aliases: ['academics'] },
  { value: 'exams', label: 'Exams', aliases: ['exam', 'assessment', 'assessments', 'tests', 'test'] },
  { value: 'sports', label: 'Sports', aliases: ['sport', 'athletics', 'games'] },
  { value: 'campus', label: 'Campus', aliases: ['event', 'events', 'general', 'news', 'campus life', 'activities'] },
  { value: 'parents', label: 'Parents', aliases: ['parent', 'family', 'families'] },
  { value: 'awards', label: 'Awards', aliases: ['achievement', 'achievements', 'recognition'] },
  { value: 'alert', label: 'Alert', aliases: ['urgent', 'emergency', 'health', 'safety'] },
];
const CATEGORY_ALIAS_MAP: Record<string, string> = ANNOUNCEMENT_CATEGORY_OPTIONS.reduce((acc, option) => {
  const normalizedValue = option.value.toLowerCase();
  acc[normalizedValue] = normalizedValue;
  (option.aliases || []).forEach((alias) => {
    const normalizedAlias = alias.trim().toLowerCase();
    if (normalizedAlias) {
      acc[normalizedAlias] = normalizedValue;
    }
  });
  return acc;
}, {} as Record<string, string>);
export function normalizeAnnouncementCategory(value: string): string {
  if (!value) return '';
  const normalizedKey = value.trim().toLowerCase();
  if (!normalizedKey) return '';
  return CATEGORY_ALIAS_MAP[normalizedKey] ?? normalizedKey;
}
export function normalizeAnnouncementCategoryList(categories: unknown): string[] {
  if (!categories && categories !== 0) {
    return [];
  }
  const rawValues: string[] = [];
  const addValue = (val: unknown) => {
    if (val === undefined || val === null) return;
    if (Array.isArray(val)) {
      val.forEach(addValue);
      return;
    }
    const text = String(val)
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean);
    rawValues.push(...text);
  };
  addValue(categories);
  if (!rawValues.length) {
    return [];
  }
  const normalizedValues = rawValues
    .map((value) => normalizeAnnouncementCategory(value))
    .filter(Boolean);
  return normalizedValues.filter((value, index) => normalizedValues.indexOf(value) === index);
}
export function formatAnnouncementCategoryLabel(category: string): string {
  if (!category) return '';
  const normalized = normalizeAnnouncementCategory(category);
  const option = ANNOUNCEMENT_CATEGORY_OPTIONS.find((item) => item.value === normalized);
  if (option) {
    return option.label;
  }
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}