#pragma once
#include "CoreMinimal.h"
#include "GameFramework/SaveGame.h"
#include "RebootSaveGame.generated.h"

UCLASS()
class REBOOT3D_API URebootSaveGame : public USaveGame
{
    GENERATED_BODY()
public:
    UPROPERTY(SaveGame) int32 SchemaVersion = 1;
    UPROPERTY(SaveGame) int32 AccountXP = 0;
    UPROPERTY(SaveGame) int32 BankChips = 0;
    UPROPERTY(SaveGame) int32 TotalRuns = 0;
    UPROPERTY(SaveGame) int32 TotalDays = 0;
    UPROPERTY(SaveGame) int32 BestBalance = 0;
    UPROPERTY(SaveGame) uint32 Modules = 0;
    UPROPERTY(SaveGame) uint32 Achievements = 0;
    UPROPERTY(SaveGame) bool InProgress = false;
    UPROPERTY(SaveGame) int32 RunMode = 0;
    UPROPERTY(SaveGame) int32 Day = 1;
    UPROPERTY(SaveGame) int32 Slot = 0;
    UPROPERTY(SaveGame) int32 RunXP = 0;
    UPROPERTY(SaveGame) int32 RunChips = 0;
    UPROPERTY(SaveGame) int32 RunDays = 0;
    UPROPERTY(SaveGame) int32 RunBestBalance = 0;
    UPROPERTY(SaveGame) uint32 PlayedMinis = 0;
    UPROPERTY(SaveGame) TArray<int32> Vitals = {78,76,72,60,62};
    UPROPERTY(SaveGame) TArray<int32> Relationships = {50,50,50,50};
    UPROPERTY(SaveGame) TArray<FString> Timeline;
};
