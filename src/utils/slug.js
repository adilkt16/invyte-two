export function generateSlug(name, existingInvitees = []) {
  if (!name) return '';
  // Convert to lowercase, trim spaces, remove special characters except hyphens and spaces
  let baseSlug = name
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^\w\s-]/g, '') // remove special characters
    .replace(/\s+/g, '-'); // replace spaces with hyphens

  let slug = baseSlug;
  let count = 2;

  // If slug is empty or duplicate, resolve it
  if (!slug) slug = 'guest';

  while (existingInvitees.some(inv => inv.slug === slug)) {
    slug = `${baseSlug}-${count}`;
    count++;
  }

  return slug;
}
