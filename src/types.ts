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
}

export interface TaiLieu {
  id: string;
  ten_tai_lieu: string;
  tac_gia: string;
  nam_xuat_ban: string;
  loai_tai_lieu: string;
  mo_ta: string;
  gia_tri: string;
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
