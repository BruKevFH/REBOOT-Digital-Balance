#include "RebootCharacter.h"
#include "RebootGameMode.h"
#include "Camera/CameraComponent.h"
#include "Components/CapsuleComponent.h"
#include "Components/InputComponent.h"
#include "GameFramework/CharacterMovementComponent.h"
#include "GameFramework/PlayerController.h"
#include "Engine/World.h"

ARebootCharacter::ARebootCharacter()
{
    GetCapsuleComponent()->InitCapsuleSize(34.f,88.f);
    Camera = CreateDefaultSubobject<UCameraComponent>(TEXT("FirstPersonCamera"));
    Camera->SetupAttachment(GetCapsuleComponent());
    Camera->SetRelativeLocation(FVector(0,0,64));
    Camera->bUsePawnControlRotation = true;
    Camera->FieldOfView = 90.f;
    GetCharacterMovement()->MaxWalkSpeed = 460.f;
    GetCharacterMovement()->BrakingDecelerationWalking = 1800.f;
    bUseControllerRotationYaw = true;
}
void ARebootCharacter::BeginPlay()
{
    Super::BeginPlay();
    SetActorLocation(FVector(0,-450,100),false,nullptr,ETeleportType::TeleportPhysics);
    if (Controller) Controller->SetControlRotation(FRotator(0,90,0));
}
ARebootGameMode* ARebootCharacter::Game() const { return GetWorld()->GetAuthGameMode<ARebootGameMode>(); }
void ARebootCharacter::SetupPlayerInputComponent(UInputComponent* Input)
{
    Super::SetupPlayerInputComponent(Input);
    Input->BindAxis(TEXT("MoveForward"),this,&ARebootCharacter::Forward);
    Input->BindAxis(TEXT("MoveRight"),this,&ARebootCharacter::Right);
    Input->BindAxis(TEXT("Turn"),this,&ARebootCharacter::Turn);
    Input->BindAxis(TEXT("LookUp"),this,&ARebootCharacter::Look);
    Input->BindAction(TEXT("Interact"),IE_Pressed,this,&ARebootCharacter::Interact);
    Input->BindAction(TEXT("ChoiceOne"),IE_Pressed,this,&ARebootCharacter::One);
    Input->BindAction(TEXT("ChoiceTwo"),IE_Pressed,this,&ARebootCharacter::Two);
    Input->BindAction(TEXT("ChoiceThree"),IE_Pressed,this,&ARebootCharacter::Three);
    Input->BindAction(TEXT("Mini"),IE_Pressed,this,&ARebootCharacter::Mini);
    Input->BindAction(TEXT("Confirm"),IE_Pressed,this,&ARebootCharacter::Confirm);
    Input->BindAction(TEXT("Lab"),IE_Pressed,this,&ARebootCharacter::Lab);
    Input->BindAction(TEXT("Menu"),IE_Pressed,this,&ARebootCharacter::Menu);
    Input->BindAction(TEXT("Export"),IE_Pressed,this,&ARebootCharacter::Export);
    Input->BindAction(TEXT("Next"),IE_Pressed,this,&ARebootCharacter::Next);
    Input->BindAction(TEXT("Sprint"),IE_Pressed,this,&ARebootCharacter::SprintOn);
    Input->BindAction(TEXT("Sprint"),IE_Released,this,&ARebootCharacter::SprintOff);
}
void ARebootCharacter::Forward(float Value)
{
    if (Game() && Game()->CanMove() && Controller)
        AddMovementInput(FRotationMatrix(FRotator(0,Controller->GetControlRotation().Yaw,0)).GetUnitAxis(EAxis::X),Value);
}
void ARebootCharacter::Right(float Value)
{
    if (Game() && Game()->CanMove() && Controller)
        AddMovementInput(FRotationMatrix(FRotator(0,Controller->GetControlRotation().Yaw,0)).GetUnitAxis(EAxis::Y),Value);
}
void ARebootCharacter::Turn(float Value) { if(Game()&&Game()->CanLook())AddControllerYawInput(Value); }
void ARebootCharacter::Look(float Value) { if(Game()&&Game()->CanLook())AddControllerPitchInput(Value); }
void ARebootCharacter::Interact(){if(Game())Game()->Interact();}
void ARebootCharacter::One(){if(Game())Game()->Select(0);}
void ARebootCharacter::Two(){if(Game())Game()->Select(1);}
void ARebootCharacter::Three(){if(Game())Game()->Select(2);}
void ARebootCharacter::Mini(){if(Game())Game()->BeginMini();}
void ARebootCharacter::Confirm(){if(Game())Game()->Confirm();}
void ARebootCharacter::Lab(){if(Game())Game()->ToggleLab();}
void ARebootCharacter::Menu(){if(Game())Game()->ToggleMenu();}
void ARebootCharacter::Export(){if(Game())Game()->Export();}
void ARebootCharacter::Next(){if(Game())Game()->Next();}
void ARebootCharacter::SprintOn(){GetCharacterMovement()->MaxWalkSpeed=700.f;}
void ARebootCharacter::SprintOff(){GetCharacterMovement()->MaxWalkSpeed=460.f;}
