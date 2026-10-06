#include "RebootGameMode.h"
#include "RebootWorld.h"
#include "RebootCharacter.h"
#include "RebootHUD.h"
#include "RebootSaveGame.h"
#include "Kismet/GameplayStatics.h"
#include "GameFramework/PlayerController.h"
#include "Camera/PlayerCameraManager.h"
#include "Engine/StaticMeshActor.h"
#include "Components/StaticMeshComponent.h"
#include "Engine/StaticMesh.h"
#include "Engine/World.h"
#include "Materials/MaterialInstanceDynamic.h"
#include "Materials/MaterialInterface.h"
#include "Dom/JsonObject.h"
#include "Serialization/JsonSerializer.h"
#include "Serialization/JsonWriter.h"
#include "Misc/FileHelper.h"
#include "Misc/Paths.h"
#include "HAL/FileManager.h"

namespace
{
const TCHAR* SaveSlot = TEXT("REBOOT3D_Profile_v1");
const TCHAR* ShieldMessages[] = {
    TEXT("Sami: Der Labortermin wurde verschoben."), TEXT("Deine Streak endet gleich!"),
    TEXT("Familie: Wir holen dich um 17 Uhr ab."), TEXT("LIMITED DROP! Jetzt kaufen!"),
    TEXT("Nora: Treffen am Parkeingang?"), TEXT("Noch 12 Clips fuer dich!"),
    TEXT("Mia: Kannst du mir die Folie schicken?"), TEXT("Dein Feed vermisst dich!")
};
const TCHAR* HubNames[] = {TEXT("Campus"),TEXT("LOOP Plaza"),TEXT("Reset Park"),TEXT("FocusBand Lab"),TEXT("One More Arena"),TEXT("Night Garden")};
}
ARebootGameMode::ARebootGameMode()
{
    DefaultPawnClass = ARebootCharacter::StaticClass();
    HUDClass = ARebootHUD::StaticClass();
    PrimaryActorTick.bCanEverTick = true;
}
void ARebootGameMode::BeginPlay()
{
    Super::BeginPlay();
    Campus = GetWorld()->SpawnActor<ARebootWorld>();
    Save = Cast<URebootSaveGame>(UGameplayStatics::LoadGameFromSlot(SaveSlot,0));
    if (!Save || Save->SchemaVersion != 1)
        Save = Cast<URebootSaveGame>(UGameplayStatics::CreateSaveGameObject(URebootSaveGame::StaticClass()));
    if (Save)
    {
        Save->AccountXP=FMath::Max(0,Save->AccountXP);
        Save->BankChips=FMath::Max(0,Save->BankChips);
        Save->TotalRuns=FMath::Max(0,Save->TotalRuns); Save->TotalDays=FMath::Max(0,Save->TotalDays);
        Save->BestBalance=FMath::Clamp(Save->BestBalance,0,100);
        Save->Modules &= 31U; Save->Achievements &= 31U;
        if(Save->Relationships.Num()!=4)Save->Relationships={50,50,50,50};
        for(int32& Value:Save->Relationships)Value=FMath::Clamp(Value,0,100);
        const bool ValidRun=Save->Vitals.Num()==5 && Save->RunMode>=0 && Save->RunMode<=2 &&
            Save->Day>=1 && Save->RunDays==Save->Day-1 && Save->Slot>=0 && Save->Slot<6 && Save->RunDays>=0 &&
            (Save->RunMode!=0 || Save->RunDays<Reboot::StoryDays) &&
            (Save->RunMode!=2 || Save->RunDays<Reboot::DailyDays);
        if(!ValidRun)Save->InProgress=false;
    }
    if (Save && Save->InProgress)
    {
        Session.GameMode=static_cast<Reboot::Mode>(FMath::Clamp(Save->RunMode,0,2));
        Session.Day=FMath::Max(1,Save->Day); Session.Slot=FMath::Clamp(Save->Slot,0,5);
        Session.XP=FMath::Max(0,Save->RunXP); Session.Chips=FMath::Max(0,Save->RunChips);
        Session.TotalDays=FMath::Max(0,Save->RunDays); Session.BestBalance=FMath::Clamp(Save->RunBestBalance,0,100);
        Session.Values={FMath::Clamp(Save->Vitals[0],0,100),FMath::Clamp(Save->Vitals[1],0,100),FMath::Clamp(Save->Vitals[2],0,100),FMath::Clamp(Save->Vitals[3],0,100),FMath::Clamp(Save->Vitals[4],0,100)};
        PlayedMinis=Save->PlayedMinis & 15U;
    }
    Random.Initialize(2121);
    if (APlayerController* PC=GetWorld()->GetFirstPlayerController())
    {
        PC->SetInputMode(FInputModeGameOnly()); PC->bShowMouseCursor=false;
    }
}
bool ARebootGameMode::CanMove() const { return Screen==ERebootScreen::Explore && Mini==ERebootMini::None; }
bool ARebootGameMode::CanLook() const { return Screen==ERebootScreen::Explore && (Mini==ERebootMini::None || Mini==ERebootMini::Focus); }
float ARebootGameMode::DistanceToHub() const
{
    const APawn* Pawn=GetWorld()->GetFirstPlayerController() ? GetWorld()->GetFirstPlayerController()->GetPawn() : nullptr;
    return Pawn ? FVector::Dist2D(Pawn->GetActorLocation(),ARebootWorld::HubLocation(Session.Slot)) : 99999.f;
}
FString ARebootGameMode::Chapter() const { return UTF8_TO_TCHAR(Reboot::TitleForDay(Session.Day)); }
FRebootScene ARebootGameMode::Scene() const
{
    FRebootScene Event;
    // Six spatial stops form a day. Chapters and changing alternatives vary the route.
    const bool Alternate = Session.Day % 2 == 0;
    switch (Session.Slot)
    {
    case 0:
        Event={Alternate?TEXT("Pruefungsdruck"):TEXT("Notification Storm"),
            Alternate?TEXT("Nora fragt, wie du fuer den Test lernen willst. Der Klassenchat blinkt neben deinen Unterlagen."):
            TEXT("Im Unterricht erklaert ihr Signalrauschen. Dein Handy vibriert. Nora wartet auf eure gemeinsame Aufgabe."),TEXT("Nora"),3,
            {{TEXT("25 Minuten Fokus, dann Pause"),{1,7,0,5,1,8,1}}, {TEXT("Wichtige Nachrichten zuerst, dann Fokus"),{0,3,2,2,3,5,0}}, {TEXT("Feed nebenbei offen lassen"),{-3,-6,3,-4,0,3,0}}}};
        break;
    case 1:
        Event={Alternate?TEXT("Perfekte Leben im Feed"):TEXT("Der Klassenchat"),
            Alternate?TEXT("Mia vergleicht sich mit perfekten Posts. Was koennte euch aus dem endlosen Scrollen holen?"):
            TEXT("Mias Post bekommt viele Reaktionen. Gleichzeitig warten Freunde am Platz. Wie teilst du deine Aufmerksamkeit?"),TEXT("Mia"),0,
            {{TEXT("Handy weg und mit Mia reden"),{2,4,4,6,7,7,1}}, {TEXT("10-Minuten-Timer und dann Freunde"),{0,1,3,2,4,5,0}}, {TEXT("Alle neuen Clips direkt anschauen"),{-4,-5,4,-6,1,3,0}}}};
        break;
    case 2:
        Event={TEXT("Training oder Couch?"),TEXT("Im Reset Park startet Nora das Training. Dein Squad ist gerade online. Es gibt mehr als einen brauchbaren Kompromiss."),TEXT("Nora"),3,
            {{TEXT("Gemeinsam raus und bewegen"),{5,2,6,6,6,7,1}}, {TEXT("Kurz spielen, dann zum Park"),{1,1,4,2,3,5,0}}, {TEXT("Heute komplett online bleiben"),{-4,-2,5,-4,2,3,0}}}};
        break;
    case 3:
        Event={Alternate?TEXT("Privacy by Design"):TEXT("Signalrauschen im Lab"),
            Alternate?TEXT("Sami will den FocusBand-Prototyp vorstellen. Welche Daten muss ein Wearable wirklich speichern?"):
            TEXT("Euer Sensorsimulator schwankt. Sami fragt: Ursache untersuchen, Werte glaetten oder einfach weitermachen?"),TEXT("Sami"),2,
            {{TEXT("Kalibrieren und nur notwendige Daten speichern"),{0,6,2,6,2,10,2}}, {TEXT("Referenztest und pseudonyme IDs"),{0,4,1,5,3,8,2}}, {TEXT("Alles sammeln, Ursache spaeter klaeren"),{0,-3,0,-5,0,4,1}}}};
        break;
    case 4:
        Event={TEXT("ONE MORE?"),TEXT("Leon: Wir sind einen Sieg vor Promotion. Morgen ist Abgabe. Du entscheidest, wie der Abend endet."),TEXT("Leon"),1,
            {{TEXT("Jetzt Schluss, morgen zusammen weiter"),{5,4,1,7,1,7,1}}, {TEXT("Ein Match mit klarem Timer"),{-1,1,5,2,4,5,0}}, {TEXT("Ranked bis offen Ende"),{-9,-5,7,-7,6,3,0}}}};
        break;
    default:
        Event={Alternate?TEXT("Bist du noch wach?"):TEXT("23:08 - LOOP zieht"),
            Alternate?TEXT("Mia ist wegen einer Praesentation gestresst. Du kannst sie unterstuetzen und trotzdem Schlaf schuetzen."):
            TEXT("Im Night Garden ist es ruhig. Ein Clip fuehrt zum naechsten. Wann legst du das Handy weg?"),TEXT("Mia"),0,
            {{TEXT("Kurz antworten, morgen reden, schlafen"),{7,6,2,7,3,7,1}}, {TEXT("Noch zehn Minuten, Timer laeuft"),{-2,-1,3,1,3,5,0}}, {TEXT("Bis zwei Uhr weiter online"),{-12,-9,5,-9,4,3,0}}}};
        break;
    }
    return Event;
}
FString ARebootGameMode::Prompt() const
{
    if (DistanceToHub()<260.f) return FString::Printf(TEXT("[E] Mit %s sprechen"),*Scene().Speaker);
    return FString::Printf(TEXT("Naechster Ort: %s  |  %.0f m"),HubNames[Session.Slot],DistanceToHub()/100.f);
}
void ARebootGameMode::Start(Reboot::Mode Mode)
{
    CancelMini(); Session=Reboot::StartSession(Mode);
    if (Mode==Reboot::Mode::Daily) Session.Values={70,70,70,55,60};
    PlayedMinis=0; Save->Timeline.Reset(); Save->Relationships={50,50,50,50};
    Screen=ERebootScreen::Explore;
    Notice=TEXT("Folge dem leuchtenden Ort. E sprechen, F Minigame, Tab Lab.");
    Persist();
}
void ARebootGameMode::Select(int32 Choice)
{
    if (Screen==ERebootScreen::Menu) { Start(static_cast<Reboot::Mode>(FMath::Clamp(Choice,0,2))); return; }
    if (Mini==ERebootMini::Memory && Screen==ERebootScreen::Explore)
    {
        if (MiniTime<3.5f || MiniSteps>=MemorySequence.Num()) return;
        if (MemorySequence[MiniSteps]==Choice) ++MiniScore;
        if (++MiniSteps>=MemorySequence.Num()) FinishMini(MiniScore*100/5);
        return;
    }
    if (Screen==ERebootScreen::Lab) { SelectedModule=FMath::Clamp(Choice,0,2); return; }
    if (Screen!=ERebootScreen::Dialogue) return;
    const FRebootScene Event=Scene();
    if (!Event.Choices.IsValidIndex(Choice)) return;
    Screen=ERebootScreen::Explore; // One key event can commit only once.
    const int32 PreviousDay=Session.Day;
    Reboot::Impact Effect=Event.Choices[Choice].Effect;
    if (Session.Slot==5 && (Save->Modules&2U) && Effect.Energy<0) Effect.Energy+=2;
    Reboot::ApplyChoice(Session,Effect);
    if (Save->Relationships.IsValidIndex(Event.Person))
        Save->Relationships[Event.Person]=FMath::Clamp(Save->Relationships[Event.Person]+(Choice==2?-2:4),0,100);
    Save->Timeline.Add(FString::Printf(TEXT("Tag %d | %s | %s"),PreviousDay,*Event.Title,*Event.Choices[Choice].Label));
    if (Session.Day!=PreviousDay && !Session.Ended)
    {
        PlayedMinis=0;
        if (Save->Modules&4U) Session.Values.Focus=FMath::Min(100,Session.Values.Focus+4);
        if (Save->Modules&16U) Session.Values.Balance=FMath::Min(100,Session.Values.Balance+5);
        Notice=FString::Printf(TEXT("Tag %d: %s"),Session.Day,*Chapter());
    }
    else Notice=TEXT("Entscheidung gespeichert. Dein naechster Ort leuchtet.");
    if (Session.Ended) Finish(); else Persist();
}
void ARebootGameMode::Interact()
{
    if (Mini==ERebootMini::Focus) { Confirm(); return; }
    if (Screen==ERebootScreen::Explore && Mini==ERebootMini::None && DistanceToHub()<260.f)
        Screen=ERebootScreen::Dialogue;
}
void ARebootGameMode::Persist()
{
    if (!Save) return;
    Save->InProgress=!Session.Ended && Screen!=ERebootScreen::Menu;
    Save->RunMode=static_cast<int32>(Session.GameMode);
    Save->Day=Session.Day; Save->Slot=Session.Slot; Save->RunXP=Session.XP; Save->RunChips=Session.Chips;
    Save->RunDays=Session.TotalDays; Save->RunBestBalance=Session.BestBalance; Save->PlayedMinis=PlayedMinis;
    const auto& V=Session.Values;
    Save->Vitals={V.Energy,V.Focus,V.Mood,V.Balance,V.Social};
    if (!UGameplayStatics::SaveGameToSlot(Save,SaveSlot,0))
        Notice=TEXT("Speichern fehlgeschlagen. Bitte Schreibzugriff pruefen.");
}
void ARebootGameMode::Finish()
{
    CancelMini();
    Save->AccountXP=Reboot::ClampSum(Save->AccountXP,Session.XP,std::numeric_limits<int>::max());
    Save->BankChips=Reboot::ClampSum(Save->BankChips,Session.Chips,std::numeric_limits<int>::max());
    Save->TotalDays=Reboot::ClampSum(Save->TotalDays,Session.TotalDays,std::numeric_limits<int>::max());
    Save->TotalRuns=Reboot::ClampSum(Save->TotalRuns,1,std::numeric_limits<int>::max());
    Save->BestBalance=FMath::Max(Save->BestBalance,FMath::Max(Session.BestBalance,Session.Values.Balance));
    Save->Achievements|=1U;
    if (Session.Values.Balance>=75) Save->Achievements|=2U;
    if (Session.Values.Focus>=80) Save->Achievements|=4U;
    if (Save->Relationships.ContainsByPredicate([](int32 Value){return Value>=75;})) Save->Achievements|=8U;
    Screen=ERebootScreen::Complete;
    Persist();
}
void ARebootGameMode::ToggleLab()
{
    if (Screen==ERebootScreen::Lab) { Screen=ERebootScreen::Explore; return; }
    if (Screen!=ERebootScreen::Explore || Mini!=ERebootMini::None) return;
    Screen=ERebootScreen::Lab;
}
void ARebootGameMode::ToggleMenu()
{
    if (Screen==ERebootScreen::Dialogue || Screen==ERebootScreen::Lab) {Screen=ERebootScreen::Explore;return;}
    if (Screen==ERebootScreen::Pause) {Screen=PausedScreen;return;}
    if (Screen==ERebootScreen::Explore) {PausedScreen=Screen;Screen=ERebootScreen::Pause;Persist();}
}
void ARebootGameMode::Next()
{
    if (Screen==ERebootScreen::Menu && Save->InProgress) {Screen=ERebootScreen::Explore;return;}
    if (Screen==ERebootScreen::Complete) {Screen=ERebootScreen::Menu;return;}
    if (Screen==ERebootScreen::Pause) {CancelMini();Screen=ERebootScreen::Menu;return;}
    if (Screen==ERebootScreen::Lab)
    {
        unsigned Mask=Save->Modules;
        // Chips from this run are spendable immediately; no need to finish 21 days first.
        int Available=Reboot::ClampSum(Save->BankChips,Session.Chips,std::numeric_limits<int>::max());
        const int Before=Available;
        if (Reboot::UnlockModule(Available,Mask,SelectedModule))
        {
            int Cost=Before-Available;
            int FromRun=FMath::Min(Cost,Session.Chips); Session.Chips-=FromRun; Cost-=FromRun;
            Save->BankChips-=Cost; Save->Modules=Mask; Notice=TEXT("Modul freigeschaltet.");Persist();
        }
        else Notice=TEXT("Bereits freigeschaltet oder zu wenig Chips.");
    }
}
void ARebootGameMode::CancelMini()
{
    if (FocusTarget) FocusTarget->Destroy(); FocusTarget=nullptr;
    Mini=ERebootMini::None;
}
void ARebootGameMode::BeginMini()
{
    if (Screen!=ERebootScreen::Explore || Mini!=ERebootMini::None) return;
    int32 Type=0;
    while (Type<4 && (PlayedMinis&(1U<<Type))) ++Type;
    if (Type==4) {Notice=TEXT("Alle Minigames fuer heute gespielt. Morgen geht es weiter.");return;}
    Mini=static_cast<ERebootMini>(Type+1); MiniTime=0; NextBeat=0; MiniScore=0; MiniSteps=0; ShieldIndex=0; ShieldResolved=false;
    if (Mini==ERebootMini::Memory)
    {
        MemorySequence.Reset(); for(int32 I=0;I<5;++I)MemorySequence.Add(Random.RandRange(0,2));
    }
    if (Mini==ERebootMini::Focus) SpawnFocusTarget();
}
void ARebootGameMode::SpawnFocusTarget()
{
    if (FocusTarget) FocusTarget->Destroy(); FocusTarget=nullptr;
    APlayerCameraManager* Camera=UGameplayStatics::GetPlayerCameraManager(this,0);
    if (!Camera) return;
    const FRotator Rotation=Camera->GetCameraRotation();
    const FVector Position=Camera->GetCameraLocation()+Rotation.Vector()*420.f+
        FRotationMatrix(Rotation).GetUnitAxis(EAxis::Y)*Random.FRandRange(-130.f,130.f)+FVector(0,0,Random.FRandRange(-65.f,70.f));
    FocusTarget=GetWorld()->SpawnActor<AStaticMeshActor>(Position,FRotator::ZeroRotator);
    if (!FocusTarget) return;
    auto* Mesh=FocusTarget->GetStaticMeshComponent();
    Mesh->SetMobility(EComponentMobility::Movable);
    Mesh->SetStaticMesh(LoadObject<UStaticMesh>(nullptr,TEXT("/Engine/BasicShapes/Sphere.Sphere")));
    Mesh->SetWorldScale3D(FVector(.48f));
    Mesh->SetCollisionEnabled(ECollisionEnabled::QueryOnly);
    Mesh->SetCollisionResponseToAllChannels(ECR_Block);
    if (UMaterialInterface* Base=LoadObject<UMaterialInterface>(nullptr,TEXT("/Game/REBOOT/Materials/M_REBOOT.M_REBOOT")))
    {
        auto* Material=UMaterialInstanceDynamic::Create(Base,FocusTarget);
        Material->SetVectorParameterValue(TEXT("Tint"),FLinearColor(.1f,1.f,.8f));
        Material->SetScalarParameterValue(TEXT("Glow"),4.f); Mesh->SetMaterial(0,Material);
    }
}
void ARebootGameMode::Confirm()
{
    if (Screen==ERebootScreen::Lab) {SelectedModule=(SelectedModule+1)%5;return;}
    if (Screen!=ERebootScreen::Explore) return;
    if (Mini==ERebootMini::Focus && FocusTarget)
    {
        APlayerCameraManager* Camera=UGameplayStatics::GetPlayerCameraManager(this,0);
        if (!Camera) return;
        FHitResult Hit; FCollisionQueryParams Query;
        if (APawn* Pawn=UGameplayStatics::GetPlayerPawn(this,0)) Query.AddIgnoredActor(Pawn);
        GetWorld()->LineTraceSingleByChannel(Hit,Camera->GetCameraLocation(),Camera->GetCameraLocation()+Camera->GetCameraRotation().Vector()*1100.f,ECC_Visibility,Query);
        if (Hit.GetActor()==FocusTarget.Get()) {++MiniScore;FocusTarget->Destroy();FocusTarget=nullptr;}
    }
    else if (Mini==ERebootMini::Signal)
    {
        MiniScore+=FMath::Clamp(FMath::RoundToInt(100.f-FMath::Abs(MiniValue()-.69f)*250.f),0,100);
        if (++MiniSteps>=4) FinishMini(MiniScore/4);
    }
    else if (Mini==ERebootMini::Shield && !ShieldResolved)
    {
        ShieldResolved=true; MiniScore+=(ShieldIndex%2==0)?1:-1;
    }
}
void ARebootGameMode::FinishMini(int32 Percent)
{
    if (Mini==ERebootMini::None) return;
    const uint32 Bit=1U<<(static_cast<int32>(Mini)-1);
    PlayedMinis|=Bit;
    CancelMini();
    Reboot::ApplyMiniResult(Session,Percent);
    if (Save->Modules&1U) Session.Values.Energy=FMath::Min(100,Session.Values.Energy+2);
    if (Percent>=80) Save->Achievements|=16U;
    Notice=FString::Printf(TEXT("Minigame: %d%%. XP und Chips gespeichert."),FMath::Clamp(Percent,0,100));
    Persist();
}
float ARebootGameMode::MiniValue() const {return (FMath::Sin(MiniTime*2.4f)+1.f)*.5f;}
FString ARebootGameMode::MiniMessage() const
{
    switch(Mini)
    {
    case ERebootMini::Focus:return FString::Printf(TEXT("FOCUS RUSH | %d / 12 | Ziele anvisieren und [Space]"),MiniScore);
    case ERebootMini::Shield:return FString::Printf(TEXT("NOTIFICATION SHIELD | %s | Space nur wenn wichtig"),ShieldMessages[FMath::Clamp(ShieldIndex,0,7)]);
    case ERebootMini::Signal:return FString::Printf(TEXT("SIGNAL CALIBRATION | %d / 4 | Space im gruenen Fenster"),MiniSteps);
    case ERebootMini::Memory:
        if(MiniTime<3.5f)
        {
            int32 Index=FMath::Clamp(FMath::FloorToInt(MiniTime/.7f),0,4);
            return FString::Printf(TEXT("MEMORY PULSE | Merke dir: %d"),MemorySequence.IsValidIndex(Index)?MemorySequence[Index]+1:0);
        }
        return FString::Printf(TEXT("MEMORY PULSE | Wiederhole mit 1 / 2 / 3 | %d / 5"),MiniSteps);
    default:return TEXT("");
    }
}
void ARebootGameMode::Tick(float DeltaSeconds)
{
    Super::Tick(DeltaSeconds);
    if(Campus)Campus->SetActiveHub(Session.Slot);
    if(Screen!=ERebootScreen::Explore || Mini==ERebootMini::None)return;
    MiniTime+=DeltaSeconds;
    if(Mini==ERebootMini::Focus)
    {
        const float Duration=(Save->Modules&8U)?1.3f:1.f;
        if(MiniTime >= (MiniSteps+1)*Duration)
        {
            ++MiniSteps;
            if(MiniSteps>=12)FinishMini(MiniScore*100/12);else SpawnFocusTarget();
        }
    }
    else if(Mini==ERebootMini::Shield && MiniTime >= (ShieldIndex+1)*2.f)
    {
        if(!ShieldResolved && ShieldIndex%2==1)++MiniScore;
        ShieldResolved=false;
        if(++ShieldIndex>=8)FinishMini(FMath::Clamp(MiniScore,0,8)*100/8);
    }
}
void ARebootGameMode::Export()
{
    if (!Save) return;
    TSharedRef<FJsonObject> Document=MakeShared<FJsonObject>();
    Document->SetStringField(TEXT("game"),TEXT("REBOOT3D"));
    Document->SetNumberField(TEXT("schemaVersion"),1);
    Document->SetNumberField(TEXT("day"),Session.Day);
    Document->SetNumberField(TEXT("xp"),Reboot::ClampSum(Save->AccountXP,Session.Ended?0:Session.XP,std::numeric_limits<int>::max()));
    Document->SetNumberField(TEXT("balance"),Session.Values.Balance);
    Document->SetNumberField(TEXT("chips"),Reboot::ClampSum(Save->BankChips,Session.Ended?0:Session.Chips,std::numeric_limits<int>::max()));
    TArray<TSharedPtr<FJsonValue>> Timeline;
    for(const FString& Entry:Save->Timeline)Timeline.Add(MakeShared<FJsonValueString>(Entry));
    Document->SetArrayField(TEXT("timeline"),Timeline);
    FString Json; auto Writer=TJsonWriterFactory<>::Create(&Json);
    FJsonSerializer::Serialize(Document,Writer);
    const FString Folder=FPaths::Combine(FPaths::ProjectSavedDir(),TEXT("Exports"));
    IFileManager::Get().MakeDirectory(*Folder,true);
    const FString Filename=FPaths::Combine(Folder,TEXT("reboot-profile.json"));
    Notice=FFileHelper::SaveStringToFile(Json,*Filename)?TEXT("Export: Saved/Exports/reboot-profile.json"):TEXT("Export fehlgeschlagen.");
}
