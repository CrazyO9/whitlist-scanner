// src/whitelist/model.rs
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// 給前端掃描用的單筆資料（例如 code / name）
/// 目前如果前端沒用到，可以先保留將來擴充掃描邏輯用
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct WhiteItem {
    pub code: String,
    pub name: String,
}

/// 代表「一份完整白名單」
/// file_name: 上傳檔名字串（不含副檔名或含都可以，但要一致）
/// columns:  {"HEADER A": ["row1", "row2", ...], "HEADER B": [...]} 這種結構
/// header_order: 保留原始檔的欄位順序
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct WhiteTable {
    pub file_name: String, // UI 用
    pub source_file: String,      // 原始檔名（含副檔名）
    pub columns: HashMap<String, Vec<String>>,
    pub header_order: Vec<String>
}
