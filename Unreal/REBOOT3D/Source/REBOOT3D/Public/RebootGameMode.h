#pragma once
#include "CoreMinimal.h"
#include "GameFramework/GameModeBase.h"
#include "RebootRules.h"
#include "RebootGameMode.generated.h"

class ARebootWorld;
class AStaticMeshActor;
class URebootSaveGame;

// UI modes use a single state so inputs cannot apply to two screens at once.
enum class ERebootScreen : uint8 { Menu, Explore, Dialogue, Lab, Pause, Complete };
enum class ERebootMini : uint8 { None, Focus, Shield, Signal, Memory };
struct FRebootChoice { FString Label; Reboot::Impact Effect; };
struct FRebootScene
{
    FString Title;
    FString Body;
    FString Speaker;
    int32 Person = 0;
    TArray<FRebootChoice> Choices;
};

UCLASS()
class REBOOT3D_API ARebootGameMode : public AGameModeBase
{
    GENERATED_BODY()
public:
    ARebootGameMode();
    virtual void BeginPlay() override;
    virtual void Tick(float DeltaSeconds) override;
    Reboot::Session Session;
    ERebootScreen Screen = ERebootScreen::Menu;
    ERebootMini Mini = ERebootMini::None;
    FRebootScene Scene() const;
    FString Chapter() const;
    FString Prompt() const;
    FString Notice;
    FString MiniMessage() const;
    float MiniValue() const;
    float DistanceToHub() const;
    bool CanMove() const;
    bool CanLook() const;
    const URebootSaveGame* Profile() const { return Save; }
    int32 MiniScore = 0;
    int32 SelectedModule = 0;
    void Interact();
    void Select(int32 Choice);
    void BeginMini();
    void Confirm();
    void ToggleLab();
    void ToggleMenu();
    void Next();
    void Export();
private:
    UPROPERTY() TObjectPtr<ARebootWorld> Campus;
    UPROPERTY() TObjectPtr<URebootSaveGame> Save;
    UPROPERTY() TObjectPtr<AStaticMeshActor> FocusTarget;
    ERebootScreen PausedScreen = ERebootScreen::Explore;
    uint32 PlayedMinis = 0;
    float MiniTime = 0.f;
    float NextBeat = 0.f;
    int32 MiniSteps = 0;
    int32 ShieldIndex = 0;
    bool ShieldResolved = false;
    TArray<int32> MemorySequence;
    FRandomStream Random;
    void Start(Reboot::Mode Mode);
    void Persist();
    void Finish();
    void FinishMini(int32 Percent);
    void CancelMini();
    void SpawnFocusTarget();
};
