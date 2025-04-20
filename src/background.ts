import { Storage } from "@plasmohq/storage"

const storage = new Storage()

// アイコンの初期状態を設定
const setIconState = async () => {
  const isCollapsed = await storage.get<boolean>("followedUsersCollapsed")
  chrome.action.setBadgeText({ text: isCollapsed ? "✓" : "" })
  if (isCollapsed) {
    chrome.action.setBadgeTextColor({ color: "#c30c09" })
  }
}

// 初期状態を設定
setIconState()

// アイコンクリック時の処理
chrome.action.onClicked.addListener(async (tab) => {
  const isCollapsed = await storage.get<boolean>("followedUsersCollapsed")
  const newState = !isCollapsed
  await storage.set("followedUsersCollapsed", newState)

  // バッジテキストを更新
  chrome.action.setBadgeText({ text: newState ? "✓" : "" })
  if (newState) {
    chrome.action.setBadgeTextColor({ color: "#c30c09" })
  }

  // タブにメッセージを送信して状態を更新
  if (tab.id) {
    chrome.tabs.sendMessage(tab.id, { isCollapsed: newState })
  }
})
