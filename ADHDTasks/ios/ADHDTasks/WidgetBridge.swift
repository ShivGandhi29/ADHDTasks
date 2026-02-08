import Foundation
import WidgetKit

@objc(WidgetBridge)
class WidgetBridge: NSObject {

  let appGroup = "group.com.adhdtasks.app"

  @objc(sendTextToWidget:)
  func sendTextToWidget(_ text: String) {
    let defaults = UserDefaults(suiteName: appGroup)
    defaults?.set(text, forKey: "widgetTaskData")
    defaults?.synchronize()

    if #available(iOS 14.0, *) {
      WidgetCenter.shared.reloadAllTimelines()
    }
  }

  @objc(clearWidget)
  func clearWidget() {
    let defaults = UserDefaults(suiteName: appGroup)
    defaults?.removeObject(forKey: "widgetTaskData")
    defaults?.synchronize()

    if #available(iOS 14.0, *) {
      WidgetCenter.shared.reloadAllTimelines()
    }
  }

  @objc static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
