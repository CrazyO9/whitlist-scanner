// whitelist-scanner/src/utils/normalize.js

/**
 * 將條碼 / 商品代碼等輸入做統一規格
 * - 去掉前後空白
 * - 預設轉成全形以外的半形數字
 * - 可以選擇轉大寫
 */

export function normalize_code(input, options = {}) {
  const { toUpperCase = true, trim = true } = options;

  if (input == null) return "";

  let text = String(input);

  if (trim) {
    text = text.trim();
  }

  // 全形數字轉半形（只處理 ０-９ ）
  const fullWidthZeroCode = "０".charCodeAt(0);
  const fullWidthNineCode = "９".charCodeAt(0);

  let result = "";
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    if (code >= fullWidthZeroCode && code <= fullWidthNineCode) {
      const halfWidthDigit = String.fromCharCode(code - fullWidthZeroCode + "0".charCodeAt(0));
      result += halfWidthDigit;
    } else {
      result += ch;
    }
  }

  if (toUpperCase) {
    result = result.toUpperCase();
  }

  return result;
}

/**
 * 文字標準化，比較用：
 * - 去前後空白
 * - 預設轉小寫
 */
export function normalize_text(input, options = {}) {
  const { toLowerCase = true, trim = true } = options;

  if (input == null) return "";

  let text = String(input);

  if (trim) {
    text = text.trim();
  }

  if (toLowerCase) {
    text = text.toLowerCase();
  }

  return text;
}
