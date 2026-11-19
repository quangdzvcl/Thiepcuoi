export function allowedAdmin(user: { email?: string; email_confirmed_at?: string | null }, emails: string) {
  const allowed = emails.split(',').map(value => value.trim().toLowerCase()).filter(Boolean);
  return !!user.email_confirmed_at && !!user.email && allowed.includes(user.email.toLowerCase());
}
