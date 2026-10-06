#pragma once
#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "RebootWorld.generated.h"

class UStaticMesh;
class UMaterialInterface;
class UMaterialInstanceDynamic;
class ATextRenderActor;

UCLASS()
class REBOOT3D_API ARebootWorld : public AActor
{
    GENERATED_BODY()
public:
    ARebootWorld();
    virtual void BeginPlay() override;
    virtual void Tick(float DeltaSeconds) override;
    static FVector HubLocation(int32 Hub);
    static FLinearColor HubColor(int32 Hub);
    void SetActiveHub(int32 Hub);
private:
    UPROPERTY() TObjectPtr<UStaticMesh> Cube;
    UPROPERTY() TObjectPtr<UStaticMesh> Sphere;
    UPROPERTY() TObjectPtr<UStaticMesh> Cylinder;
    UPROPERTY() TObjectPtr<UMaterialInterface> Surface;
    UPROPERTY() TArray<TObjectPtr<UMaterialInstanceDynamic>> HubMaterials;
    UPROPERTY() TArray<TObjectPtr<ATextRenderActor>> Signs;
    int32 ActiveHub = 0;
    float Clock = 0.f;
    UMaterialInstanceDynamic* Shape(UStaticMesh* Mesh, FVector Position, FVector Size, FLinearColor Color, float Glow = 0.f, FRotator Rotation = FRotator::ZeroRotator, bool Collision = true);
    void Light(FVector Position, FLinearColor Color, float Intensity, float Radius);
    void Sign(const FString& Text, FVector Position, float Size, FColor Color);
};
