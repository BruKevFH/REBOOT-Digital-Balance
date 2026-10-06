#pragma once
#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "RebootCharacter.generated.h"
class UCameraComponent;
class ARebootGameMode;

UCLASS()
class REBOOT3D_API ARebootCharacter : public ACharacter
{
    GENERATED_BODY()
public:
    ARebootCharacter();
    virtual void BeginPlay() override;
    virtual void SetupPlayerInputComponent(UInputComponent* Input) override;
private:
    UPROPERTY(VisibleAnywhere) TObjectPtr<UCameraComponent> Camera;
    ARebootGameMode* Game() const;
    void Forward(float Value);
    void Right(float Value);
    void Turn(float Value);
    void Look(float Value);
    void Interact(); void One(); void Two(); void Three();
    void Mini(); void Confirm(); void Lab(); void Menu(); void Export(); void Next();
    void SprintOn(); void SprintOff();
};
