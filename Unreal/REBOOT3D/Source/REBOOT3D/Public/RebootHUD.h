#pragma once
#include "CoreMinimal.h"
#include "GameFramework/HUD.h"
#include "RebootHUD.generated.h"

UCLASS()
class REBOOT3D_API ARebootHUD : public AHUD
{
    GENERATED_BODY()
public:
    virtual void DrawHUD() override;
private:
    float Scale=1.f;
    void Text(const FString& Value,float X,float Y,float Size=1.f,FLinearColor Color=FLinearColor::White);
    void Panel(float X,float Y,float W,float H);
    float Paragraph(const FString& Value,float X,float Y,float Width,float Size=1.f);
};
