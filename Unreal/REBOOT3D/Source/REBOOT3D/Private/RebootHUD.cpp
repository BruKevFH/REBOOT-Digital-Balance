#include "RebootHUD.h"
#include "RebootGameMode.h"
#include "RebootSaveGame.h"
#include "RebootWorld.h"
#include "Engine/Canvas.h"
#include "Engine/Engine.h"
#include "Engine/Font.h"
#include "Engine/World.h"
#include "GameFramework/PlayerController.h"

void ARebootHUD::Text(const FString& Value,float X,float Y,float Size,FLinearColor Color)
{
    DrawText(Value,Color,X*Scale,Y*Scale,GEngine->GetMediumFont(),Size*Scale,false);
}
void ARebootHUD::Panel(float X,float Y,float W,float H)
{
    DrawRect({.015f,.025f,.055f,.94f},X*Scale,Y*Scale,W*Scale,H*Scale);
    DrawRect({.1f,.8f,1.f,.85f},X*Scale,Y*Scale,3.f*Scale,H*Scale);
}
float ARebootHUD::Paragraph(const FString& Value,float X,float Y,float Width,float Size)
{
    TArray<FString> Words; Value.ParseIntoArray(Words,TEXT(" "),true);
    FString Line; float Cursor=Y;
    for(const FString& Word:Words)
    {
        FString Candidate=Line.IsEmpty()?Word:Line+TEXT(" ")+Word;
        float W=0,H=0; Canvas->StrLen(GEngine->GetMediumFont(),Candidate,W,H);
        if(W*Size>Width && !Line.IsEmpty()) {Text(Line,X,Cursor,Size);Cursor+=26.f*Size;Line=Word;}
        else Line=Candidate;
    }
    if(!Line.IsEmpty()){Text(Line,X,Cursor,Size);Cursor+=26.f*Size;}
    return Cursor;
}
void ARebootHUD::DrawHUD()
{
    Super::DrawHUD();
    if(!Canvas||!GEngine)return;
    ARebootGameMode* Game=GetWorld()->GetAuthGameMode<ARebootGameMode>();
    if(!Game||!Game->Profile())return;
    Scale=FMath::Max(.35f,FMath::Min(Canvas->SizeX/1440.f,Canvas->SizeY/900.f));
    const float W=Canvas->SizeX/Scale,H=Canvas->SizeY/Scale;
    const auto& Run=Game->Session;
    const auto* Save=Game->Profile();
    const FLinearColor Cyan(.15f,.85f,1.f),Muted(.6f,.7f,.85f);
    if(Game->Screen==ERebootScreen::Menu)
    {
        Panel(90,120,840,640);
        Text(TEXT("REBOOT"),125,150,3.f,Cyan);
        Text(TEXT("NEON BALANCE // A 3D CAMPUS ADVENTURE"),125,220,1.1f);
        Paragraph(TEXT("Dein Screen. Dein Tag. Deine Entscheidungen. Erkunde den Campus, triff Mia, Leon, Nora und Sami und baue deinen FocusBand-Prototyp."),125,275,740,1.2f);
        Text(TEXT("[1] 21-Tage-Story"),125,390,1.4f);
        Text(TEXT("[2] Endless Balance"),125,440,1.4f);
        Text(TEXT("[3] Daily Challenge (3 Tage)"),125,490,1.4f);
        if(Save->InProgress)Text(TEXT("[Enter] Gespeicherten Run fortsetzen"),125,550,1.2f,Cyan);
        Text(TEXT("WASD bewegen | Maus ansehen | E sprechen | Shift sprinten"),125,610,.9f,Muted);
        Text(TEXT("Neue Modi starten einen neuen Run. Dein Account bleibt erhalten."),125,650,.85f,Muted);
        Text(TEXT("Ein Lernmodell, keine medizinische Diagnose."),125,700,.85f,Muted);
        return;
    }
    Panel(24,20,W-48,105);
    const TCHAR* Mode=Run.GameMode==Reboot::Mode::Story?TEXT("STORY"):Run.GameMode==Reboot::Mode::Daily?TEXT("DAILY"):TEXT("ENDLESS");
    Text(FString::Printf(TEXT("REBOOT // %s // TAG %d"),Mode,Run.Day),43,32,1.25f,Cyan);
    Text(Game->Chapter(),43,68,.95f);
    const TCHAR* Labels[]={TEXT("ENERGY"),TEXT("FOCUS"),TEXT("MOOD"),TEXT("BALANCE"),TEXT("SOCIAL")};
    const int32 Values[]={Run.Values.Energy,Run.Values.Focus,Run.Values.Mood,Run.Values.Balance,Run.Values.Social};
    const float Start=W-660;
    for(int32 I=0;I<5;++I)
    {
        float X=Start+I*126.f;
        Text(FString::Printf(TEXT("%s %d"),Labels[I],Values[I]),X,41,.75f);
        DrawRect({.12f,.17f,.26f,1.f},X*Scale,82*Scale,108*Scale,5*Scale);
        DrawRect(Cyan,X*Scale,82*Scale,Values[I]*1.08f*Scale,5*Scale);
    }
    Panel(24,H-126,W-48,102);
    Text(Game->Notice,43,H-109,.88f,Cyan);
    Text(TEXT("E sprechen | 1/2/3 entscheiden | F Minigame | Tab Lab | Esc Pause | F5 Export"),43,H-75,.8f,Muted);
    Text(FString::Printf(TEXT("Run: %d XP / %d Chips   Account: Level %d / %d Chips"),Run.XP,Run.Chips,1+Save->AccountXP/120,Save->BankChips),43,H-47,.8f);
    if(Game->Screen==ERebootScreen::Dialogue)
    {
        const FRebootScene Event=Game->Scene();
        Panel(190,210,W-380,455);
        Text(Event.Speaker.ToUpper(),220,232,.9f,Cyan);
        Text(Event.Title,220,266,1.6f);
        float Y=Paragraph(Event.Body,220,322,W-455,1.1f)+28;
        for(int32 I=0;I<Event.Choices.Num();++I)
        {
            Paragraph(FString::Printf(TEXT("[%d] %s"),I+1,*Event.Choices[I].Label),220,Y,W-450,1.05f);Y+=68;
        }
        return;
    }
    if(Game->Screen==ERebootScreen::Lab)
    {
        Panel(180,180,W-360,565);
        Text(TEXT("FOCUSBAND // PROTOTYPE LAB"),210,203,1.6f,Cyan);
        const TCHAR* Names[]={TEXT("Pulse Sensor"),TEXT("Light Sense"),TEXT("Haptic Nudge"),TEXT("Focus Filter"),TEXT("Privacy Core")};
        const TCHAR* Perks[]={TEXT("+2 Energy nach Minigames"),TEXT("Weniger Energy-Verlust bei Night-Screen"),TEXT("+4 Focus zum Tagesbeginn"),TEXT("Mehr Zeit fuer Focus-Rush-Ziele"),TEXT("+5 Balance zum Tagesbeginn")};
        const int32 Costs[]={4,5,6,8,10};
        for(int32 I=0;I<5;++I)
        {
            const bool Owned=(Save->Modules&(1U<<I))!=0;
            const float Y=285+I*76;
            Text(FString::Printf(TEXT("%s %s // %s"),Game->SelectedModule==I?TEXT(">>"):TEXT("  "),Names[I],Owned?TEXT("UNLOCKED"):*FString::Printf(TEXT("%d Chips"),Costs[I])),210,Y,1.05f,Game->SelectedModule==I?Cyan:FLinearColor::White);
            Text(Perks[I],247,Y+31,.8f,Muted);
        }
        Text(TEXT("Space: Modul wechseln | Enter: freischalten | Tab: zurueck"),210,695,.85f);
        return;
    }
    if(Game->Screen==ERebootScreen::Pause)
    {
        Panel(300,285,W-600,270);
        Text(TEXT("RUN PAUSIERT"),330,315,1.8f,Cyan);
        Text(TEXT("[Esc] Weiterspielen"),330,390,1.15f);
        Text(TEXT("[Enter] Zum Startmenue"),330,435,1.15f);
        Text(TEXT("Dein Fortschritt ist lokal gespeichert."),330,495,.85f,Muted);
        return;
    }
    if(Game->Screen==ERebootScreen::Complete)
    {
        Panel(220,210,W-440,490);
        Text(TEXT("RUN COMPLETE"),250,240,2.2f,Cyan);
        Text(FString::Printf(TEXT("%d Tage // %d XP // %d Chips"),Run.TotalDays,Run.XP,Run.Chips),250,335,1.4f);
        Text(FString::Printf(TEXT("Balance %d // Focus %d // Social %d"),Run.Values.Balance,Run.Values.Focus,Run.Values.Social),250,395,1.2f);
        Text(FString::Printf(TEXT("Achievements: First Reboot %s | Balanced %s | Locked In %s"),Save->Achievements&1U?TEXT("+"):TEXT("-"),Save->Achievements&2U?TEXT("+"):TEXT("-"),Save->Achievements&4U?TEXT("+"):TEXT("-")),250,450,.9f);
        Paragraph(TEXT("Balance bedeutet bewusste Entscheidungen. Kein Wert muss immer 100 sein."),250,510,W-500,1.1f);
        Text(TEXT("[Enter] Neuer Run   |   [F5] JSON-Export"),250,610,1.1f,Cyan);
        return;
    }
    if(Game->Mini!=ERebootMini::None)
    {
        Panel(160,H-270,W-320,105);
        Paragraph(Game->MiniMessage(),185,H-249,W-365,1.1f);
        if(Game->Mini==ERebootMini::Signal)
        {
            const float BarX=190,BarY=H-194,BarW=W-380;
            DrawRect({.14f,.2f,.3f,1.f},BarX*Scale,BarY*Scale,BarW*Scale,10*Scale);
            DrawRect({.2f,1.f,.5f,1.f},(BarX+BarW*.60f)*Scale,BarY*Scale,BarW*.18f*Scale,10*Scale);
            DrawRect(FLinearColor::White,(BarX+BarW*Game->MiniValue())*Scale,(BarY-8)*Scale,5*Scale,26*Scale);
        }
    }
    else
    {
        Panel(24,145,510,84);
        Text(Game->Prompt(),43,164,1.f,Cyan);
        Text(FString::Printf(TEXT("Entscheidung %d / 6 | Beziehungen: M %d / L %d / S %d / N %d"),Run.Slot+1,
            Save->Relationships.IsValidIndex(0)?Save->Relationships[0]:50,Save->Relationships.IsValidIndex(1)?Save->Relationships[1]:50,
            Save->Relationships.IsValidIndex(2)?Save->Relationships[2]:50,Save->Relationships.IsValidIndex(3)?Save->Relationships[3]:50),43,201,.7f,Muted);
        const FVector Destination=ARebootWorld::HubLocation(Run.Slot)+FVector(0,0,225);
        FVector2D ScreenPoint;
        if(PlayerOwner && PlayerOwner->ProjectWorldLocationToScreen(Destination,ScreenPoint,true))
        {
            DrawRect(Cyan,ScreenPoint.X-5,ScreenPoint.Y-5,10,10);
            DrawText(TEXT("ZIEL"),Cyan,ScreenPoint.X+12,ScreenPoint.Y-8,GEngine->GetSmallFont(),1.f);
        }
    }
    DrawRect(Cyan,Canvas->SizeX*.5f-9,Canvas->SizeY*.5f,18,1);
    DrawRect(Cyan,Canvas->SizeX*.5f,Canvas->SizeY*.5f-9,1,18);
}
