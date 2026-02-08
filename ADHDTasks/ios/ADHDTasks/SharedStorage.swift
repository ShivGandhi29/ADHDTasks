import Foundation
import WidgetKit

@objc(SharedStorage)
class SharedStorage: NSObject {

  let appGroup = "group.com.adhdtasks.app"

  @objc(setItem:value:withResolver:withRejecter:)
  func setItem(key: String,
               value: String,
               resolve: @escaping RCTPromiseResolveBlock,
               reject: @escaping RCTPromiseRejectBlock) {
    guard let defaults = UserDefaults(suiteName: appGroup) else {
      reject("ERR", "App Group not found", nil)
      return
    }

    defaults.set(value, forKey: key)
    defaults.synchronize()

    if #available(iOS 14.0, *) {
      WidgetCenter.shared.reloadAllTimelines()
    }

    resolve(true)
  }

  @objc(getItem:withResolver:withRejecter:)
  func getItem(key: String,
               resolve: @escaping RCTPromiseResolveBlock,
               reject: @escaping RCTPromiseRejectBlock) {
    guard let defaults = UserDefaults(suiteName: appGroup) else {
      reject("ERR", "App Group not found", nil)
      return
    }

    let value = defaults.string(forKey: key)
    resolve(value)
  }

  @objc static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
