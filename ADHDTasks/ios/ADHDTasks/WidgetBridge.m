#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(WidgetBridge, NSObject)

RCT_EXTERN_METHOD(sendTextToWidget:(NSString *)text)
RCT_EXTERN_METHOD(clearWidget)

@end
