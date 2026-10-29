import { NongVuRecord, TriThuc } from '../types.ts';

/**
 * Tạo chuỗi trích dẫn nguồn chỉ chứa các trường thực sự có trong dữ liệu
 * (Tên tài liệu, Tác giả/đơn vị cung cấp, Năm xuất bản nếu có, Đường dẫn tham khảo)
 */
export function buildSourceCitation(item: NongVuRecord | TriThuc): string {
  if (!item.nguon_tu_lieu || !item.nguon_tu_lieu.trim()) {
    return '';
  }

  const parts: string[] = [];

  if (item.tac_gia_don_vi && item.tac_gia_don_vi.trim()) {
    parts.push(item.tac_gia_don_vi.trim());
  }

  if ('nam_xuat_ban' in item && item.nam_xuat_ban && item.nam_xuat_ban.trim()) {
    parts.push(`(${item.nam_xuat_ban.trim()})`);
  }

  parts.push(item.nguon_tu_lieu.trim());

  if (item.duong_dan_tham_khao && item.duong_dan_tham_khao.trim()) {
    parts.push(`Đường dẫn tham khảo: ${item.duong_dan_tham_khao.trim()}`);
  }

  return parts.join('. ');
}

/**
 * Kiểm tra xem bản ghi có bị thiếu nguồn tư liệu hay không
 */
export function hasSource(item: { nguon_tu_lieu?: string }): boolean {
  return Boolean(item.nguon_tu_lieu && item.nguon_tu_lieu.trim().length > 0);
}

/**
 * Kiểm tra xem lịch nông vụ có chưa xác định rõ khu vực hoặc thời gian áp dụng không
 */
export function isRegionOrTimeUnspecified(item: NongVuRecord): boolean {
  if (item.khu_vuc_chua_xac_dinh || item.thoi_gian_chua_xac_dinh) {
    return true;
  }
  const area = (item.khu_vuc_ap_dung || '').toLowerCase();
  const plantTime = (item.thoi_gian_gieo_trong || '').toLowerCase();
  
  if (!area || area.includes('chưa xác định') || area.includes('phân tán') || area.trim() === '') {
    return true;
  }
  if (!plantTime || plantTime.includes('chưa xác định') || plantTime.trim() === '') {
    return true;
  }
  return false;
}
