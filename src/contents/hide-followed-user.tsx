import type { PlasmoCSConfig } from "plasmo"
import { useEffect } from "react"

import { useStorage } from "@plasmohq/storage/hook"

export const config: PlasmoCSConfig = {
  run_at: "document_end",
  matches: ["*://x.com/*/following"]
}

export default function () {
  const [isCollapsed, setIsCollapsed] = useStorage<boolean>(
    "followedUsersCollapsed",
    false
  )

  useEffect(() => {
    // フォローされているユーザーを折りたたむ関数
    const collapseFollowedUsers = () => {
      // フォローされているユーザーの要素を取得
      const followedUsers = document.querySelectorAll(
        '[data-testid="userFollowIndicator"]'
      )

      // 各ユーザーの親要素を折りたたむ
      followedUsers.forEach((element) => {
        // ユーザーセルの親要素を取得
        const userCell = element.closest('[data-testid="UserCell"]')
        if (userCell) {
          const element = userCell as HTMLElement

          // 折りたたみ状態に応じて表示/非表示を切り替え
          element.style.display = isCollapsed ? "none" : "block"
        }
      })
    }

    // 初期実行
    collapseFollowedUsers()

    // ページの変更を監視
    const observer = new MutationObserver(collapseFollowedUsers)
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    // backgroundからのメッセージを受け取る
    const handleMessage = (message: { isCollapsed: boolean }) => {
      setIsCollapsed(message.isCollapsed)
    }

    chrome.runtime.onMessage.addListener(handleMessage)

    // クリーンアップ
    return () => {
      observer.disconnect()
      chrome.runtime.onMessage.removeListener(handleMessage)
    }
  }, [isCollapsed])

  return null
}
