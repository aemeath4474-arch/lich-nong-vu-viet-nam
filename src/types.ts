export interface NongVuRecord {
  id?: string;
  ten_cay_trong: string;
  ten_goi_khac: string;
  nhom_cay?: string;
  khu_vuc_ap_dung: string;
  mua_vu: string;
  thoi_gian_gieo_trong: string;
  thoi_gian_cham_soc: string;
  thoi_gian_thu_hoach: string;
  dieu_kien_canh_tac: string;
  phuong_phap_canh_tac_truyen_thong: string;
  kinh_nghiem_dan_gian: string;
  nguon_tu_lieu: string;
  tac_gia_don_vi?: string;
  nam_xuat_ban?: string;
  duong_dan_tham_khao?: string;
  loai_thong_tin?: 'truyen_thong' | 'hien_dai' | 'chua_xac_dinh';
  khu_vuc_chua_xac_dinh?: boolean;
  thoi_gian_chua_xac_dinh?: boolean;
}

export interface TietKhi {
  ten: string;
  thoi_gian: string;
  y_nghia_nong_vu: string;
}

export interface TriThuc {
  id: string;
  chu_de: string;
  phan_loai: string;
  tom_tat: string;
  chi_tiet: string;
  ca_dao_tuc_ngu: string;
  nguon_tu_lieu: string;
  tac_gia_don_vi?: string;
  nam_xuat_ban?: string;
  duong_dan_tham_khao?: string;
  loai_thong_tin?: 'truyen_thong' | 'hien_dai' | 'chua_xac_dinh';
}

export interface TaiLieu {
  id: string;
  ten_tai_lieu: string;
  tac_gia: string;
  nam_xuat_ban: string;
  loai_tai_lieu: string;
  mo_ta: string;
  gia_tri: string;
  duong_dan_tham_khao?: string;
}

export interface DongGopTuLieu {
  id: string;
  ho_ten: string;
  vai_tro: string;
  don_vi_dia_phuong: string;
  noi_dung_dong_gop: string;
  trang_thai_xac_nhan: boolean;
  dong_y_cong_khai: boolean;
  ngay_ghi_nhan: string;
}

export interface NhomCayTrong {
  id: string;
  ten: string;
  mo_ta: string;
  bieu_tuong: string;
}

export interface NongVuDatabase {
  cau_truc_mau_rong: Record<string, string>;
  danh_sach_nong_vu: NongVuRecord[];
  nhom_cay_trong: NhomCayTrong[];
  tiet_khi_24: TietKhi[];
  tri_thuc_canh_tac: TriThuc[];
  tai_lieu_tham_khao: TaiLieu[];
  danh_sach_dong_gop?: DongGopTuLieu[];
}

export interface GeminiAnswer {
  topic: string;
  region: string;
  source: string;
  answer: string;
  limitationNotice?: string | null;
  foundInDatabase?: boolean;
}

export type ActiveScreen = 'home' | 'calendar' | 'knowledge' | 'qa' | 'sources' | 'about';
