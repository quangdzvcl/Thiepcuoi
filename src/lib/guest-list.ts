export type Guest = {
  id: string; created_at: string; name: string; phone: string; side: 'groom' | 'bride';
  attendance: 'yes' | 'no' | 'maybe'; guests: number; wishes: string;
  publish_wish: boolean; wish_approved: boolean;
};
export const attendanceLabels = { yes: 'Sẽ tham dự', no: 'Không tham dự', maybe: 'Chưa chắc' };
export const sideLabels = { groom: 'Nhà trai', bride: 'Nhà gái' };
export function csvCell(value: unknown) {
  let text = String(value ?? '');
  if (/^[\s]*[=+@-]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}
