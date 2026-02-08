#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(SharedStorage, NSObject)

RCT_EXTERN_METHOD(setItem:(NSString *)key
                  value:(NSString *)value
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getItem:(NSString *)key
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

@end
