// whitelist-scanner/src/hooks/useDoubleClickConfirm.js
import { useCallback, useState } from "react";

/**
 * 使用方式：
 *
 * const { isConfirming, try_action, reset_confirm } = useDoubleClickConfirm({
 *   onConfirm: () => { ...真正要做的事... },
 *   timeoutMs: 3000,
 * });
 *
 * 按鈕 onClick={try_action}
 * 根據 isConfirming 顯示「再按一次確認」之類的提示文字
 */
export function useDoubleClickConfirm({ onConfirm, timeoutMs = 3000 } = {}) {
  const [isConfirming, setIsConfirming] = useState(false);

  const reset_confirm = useCallback(() => {
    setIsConfirming(false);
  }, []);

  const try_action = useCallback(() => {
    if (!isConfirming) {
      setIsConfirming(true);

      if (timeoutMs > 0) {
        window.setTimeout(() => {
          setIsConfirming(false);
        }, timeoutMs);
      }

      return;
    }

    // 第二次點擊
    if (typeof onConfirm === "function") {
      onConfirm();
    }
    setIsConfirming(false);
  }, [isConfirming, onConfirm, timeoutMs]);

  return {
    isConfirming,
    try_action,
    reset_confirm,
  };
}
