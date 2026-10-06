#include "RebootWorld.h"
#include "Components/SceneComponent.h"
#include "Components/StaticMeshComponent.h"
#include "Components/PointLightComponent.h"
#include "Components/LightComponent.h"
#include "Components/ExponentialHeightFogComponent.h"
#include "Components/TextRenderComponent.h"
#include "Engine/StaticMesh.h"
#include "Engine/PointLight.h"
#include "Engine/DirectionalLight.h"
#include "Engine/ExponentialHeightFog.h"
#include "Engine/SkyAtmosphere.h"
#include "Engine/TextRenderActor.h"
#include "Engine/World.h"
#include "Engine/PostProcessVolume.h"
#include "Materials/MaterialInstanceDynamic.h"
#include "Materials/MaterialInterface.h"
#include "Kismet/GameplayStatics.h"
#include "Camera/PlayerCameraManager.h"
#include "UObject/ConstructorHelpers.h"

ARebootWorld::ARebootWorld()
{
    PrimaryActorTick.bCanEverTick = true;
    RootComponent = CreateDefaultSubobject<USceneComponent>(TEXT("WorldRoot"));
    RootComponent->SetMobility(EComponentMobility::Static);
    static ConstructorHelpers::FObjectFinder<UStaticMesh> C(TEXT("/Engine/BasicShapes/Cube.Cube"));
    static ConstructorHelpers::FObjectFinder<UStaticMesh> S(TEXT("/Engine/BasicShapes/Sphere.Sphere"));
    static ConstructorHelpers::FObjectFinder<UStaticMesh> Y(TEXT("/Engine/BasicShapes/Cylinder.Cylinder"));
    Cube = C.Object; Sphere = S.Object; Cylinder = Y.Object;
}

FVector ARebootWorld::HubLocation(int32 Hub)
{
    const FVector Locations[] = { {0,750,0}, {-1100,-350,0}, {1050,-500,0}, {1100,800,0}, {-1100,850,0}, {0,-1350,0} };
    return Locations[FMath::Clamp(Hub, 0, 5)];
}
FLinearColor ARebootWorld::HubColor(int32 Hub)
{
    const FLinearColor Colors[] = { {1.f,.65f,.18f}, {1.f,.12f,.55f}, {.3f,1.f,.55f}, {.1f,.85f,1.f}, {.6f,.25f,1.f}, {.3f,.45f,1.f} };
    return Colors[FMath::Clamp(Hub, 0, 5)];
}
UMaterialInstanceDynamic* ARebootWorld::Shape(UStaticMesh* Mesh, FVector Position, FVector Size, FLinearColor Color, float Glow, FRotator Rotation, bool Collision)
{
    UStaticMeshComponent* Part = NewObject<UStaticMeshComponent>(this);
    AddInstanceComponent(Part);
    Part->SetupAttachment(RootComponent);
    Part->SetMobility(EComponentMobility::Static);
    Part->SetStaticMesh(Mesh);
    Part->SetRelativeLocation(Position);
    Part->SetRelativeScale3D(Size / 100.f);
    Part->SetRelativeRotation(Rotation);
    Part->SetCollisionEnabled(Collision ? ECollisionEnabled::QueryAndPhysics : ECollisionEnabled::NoCollision);
    Part->SetCollisionResponseToAllChannels(ECR_Block);
    UMaterialInstanceDynamic* Material = UMaterialInstanceDynamic::Create(Surface, this);
    if (Material)
    {
        Material->SetVectorParameterValue(TEXT("Tint"), Color);
        Material->SetScalarParameterValue(TEXT("Glow"), Glow);
        Part->SetMaterial(0, Material);
    }
    Part->RegisterComponent();
    return Material;
}
void ARebootWorld::Light(FVector Position, FLinearColor Color, float Intensity, float Radius)
{
    APointLight* Lamp = GetWorld()->SpawnActor<APointLight>(Position, FRotator::ZeroRotator);
    if (!Lamp) return;
    Lamp->GetPointLightComponent()->SetMobility(EComponentMobility::Movable);
    Lamp->GetPointLightComponent()->SetLightColor(Color);
    Lamp->GetPointLightComponent()->SetIntensity(Intensity);
    Lamp->GetPointLightComponent()->SetAttenuationRadius(Radius);
    Lamp->GetPointLightComponent()->SetCastShadows(false);
}
void ARebootWorld::Sign(const FString& Text, FVector Position, float Size, FColor Color)
{
    ATextRenderActor* Label = GetWorld()->SpawnActor<ATextRenderActor>(Position, FRotator::ZeroRotator);
    if (!Label) return;
    Label->GetTextRender()->SetMobility(EComponentMobility::Movable);
    Label->GetTextRender()->SetText(FText::FromString(Text));
    Label->GetTextRender()->SetHorizontalAlignment(EHTA_Center);
    Label->GetTextRender()->SetWorldSize(Size);
    Label->GetTextRender()->SetTextRenderColor(Color);
    Signs.Add(Label);
}
void ARebootWorld::BeginPlay()
{
    Super::BeginPlay();
    Surface = LoadObject<UMaterialInterface>(nullptr, TEXT("/Game/REBOOT/Materials/M_REBOOT.M_REBOOT"));
    if (!Surface) Surface = LoadObject<UMaterialInterface>(nullptr, TEXT("/Engine/BasicShapes/BasicShapeMaterial.BasicShapeMaterial"));
    Shape(Cube, {0,0,-45}, {7000,7000,90}, {.025f,.035f,.07f});
    // A walkable cross-shaped campus, with flat paths between all six hubs.
    Shape(Cube, {0,0,2}, {420,3600,4}, {.07f,.09f,.15f});
    Shape(Cube, {0,0,3}, {3400,360,5}, {.07f,.09f,.15f});
    for (int32 Side : {-1,1})
    {
        Shape(Cube, {float(Side*230),0,8}, {8,3600,8}, {.08f,.75f,1.f}, 2.f, {}, false);
        Shape(Cube, {0,float(Side*210),8}, {3400,8,8}, {.4f,.2f,1.f}, 2.f, {}, false);
    }
    // Deterministic skyline: geometry uses engine primitives, no downloaded assets.
    FRandomStream Random(2121);
    for (int32 Index = 0; Index < 28; ++Index)
    {
        const float Angle = Index * 2.f * PI / 28.f;
        const float Radius = Random.FRandRange(2350.f,3000.f);
        const float Height = Random.FRandRange(700.f,1600.f);
        FVector Position(FMath::Cos(Angle)*Radius,FMath::Sin(Angle)*Radius,Height*.5f);
        Shape(Cube, Position, {320,340,Height}, {.045f,.055f,.10f});
        const FLinearColor Accent = HubColor(Index % 6);
        for (float Z = 100; Z < Height - 40; Z += 135)
            Shape(Cube, {Position.X, Position.Y-173,Z}, {245,8,32}, Accent, 2.f, {}, false);
        Shape(Cube, {Position.X,Position.Y,Height+10}, {340,360,12}, Accent, 3.f);
    }
    const TCHAR* Names[] = {TEXT("CAMPUS // NORA"),TEXT("LOOP PLAZA // MIA"),TEXT("RESET PARK // NORA"),TEXT("FOCUSBAND LAB // SAMI"),TEXT("ONE MORE ARENA // LEON"),TEXT("NIGHT GARDEN // MIA")};
    for (int32 Hub = 0; Hub < 6; ++Hub)
    {
        FVector P = HubLocation(Hub);
        FLinearColor Color = HubColor(Hub);
        Shape(Cylinder, P+FVector(0,0,5), {480,480,10}, {.06f,.08f,.14f});
        HubMaterials.Add(Shape(Cylinder, P+FVector(0,0,12), {470,470,4}, Color, .35f, {}, false));
        Shape(Cylinder, P+FVector(0,100,62), {50,50,110}, Color, .35f);
        Shape(Sphere, P+FVector(0,100,143), {65,65,65}, Color, 1.2f);
        Shape(Cube, P+FVector(0,100,205), {100,8,6}, Color, 3.f, {}, false);
        Sign(Names[Hub], P+FVector(0,170,310), 38.f, Color.ToFColor(true));
        Light(P+FVector(0,70,300), Color, 2200.f, 700.f);
        for (int32 Column : {-1,1})
        {
            Shape(Cube, P+FVector(float(Column*280),160,200), {20,20,400}, {.08f,.1f,.16f});
            Shape(Cube, P+FVector(float(Column*280),147,200), {8,6,365}, Color, 4.f, {}, false);
        }
    }
    // Park trees, benches, lab tables and holographic arcade cabinets.
    for (int32 I = 0; I < 8; ++I)
    {
        FVector P = HubLocation(2) + FVector((I%4-1.5f)*180,350+(I/4)*180,0);
        Shape(Cylinder, P+FVector(0,0,80), {30,30,160}, {.12f,.08f,.06f});
        Shape(Sphere, P+FVector(0,0,200), {160,160,190}, {.05f,.35f,.18f});
    }
    Shape(Cube, HubLocation(3)+FVector(0,-140,65), {220,75,15}, {.15f,.2f,.27f});
    Shape(Cube, HubLocation(3)+FVector(0,-140,105), {60,40,60}, {.1f,.85f,1.f}, 1.7f);
    for (int32 I = 0; I < 3; ++I)
    {
        FVector P = HubLocation(4)+FVector(float(I*130-130),330,0);
        Shape(Cube,P+FVector(0,0,90),{90,75,180},{.08f,.05f,.15f});
        Shape(Cube,P+FVector(0,-40,130),{75,5,65},HubColor(4),2.f,{},false);
    }
    APostProcessVolume* FX = GetWorld()->SpawnActor<APostProcessVolume>();
    if (FX)
    {
        FX->bUnbound = true;
        FX->Settings.bOverride_BloomIntensity = true; FX->Settings.BloomIntensity = .7f;
        FX->Settings.bOverride_VignetteIntensity = true; FX->Settings.VignetteIntensity = .3f;
    }
    GetWorld()->SpawnActor<ASkyAtmosphere>();
    ADirectionalLight* Sun = GetWorld()->SpawnActor<ADirectionalLight>(FVector(0,0,1500),FRotator(-18,-35,0));
    if (Sun)
    {
        Sun->GetLightComponent()->SetMobility(EComponentMobility::Movable);
        Sun->GetLightComponent()->SetLightColor({.3f,.4f,1.f});
        Sun->GetLightComponent()->SetIntensity(2.f);
    }
    AExponentialHeightFog* Fog = GetWorld()->SpawnActor<AExponentialHeightFog>();
    if (Fog)
    {
        Fog->GetComponent()->SetFogDensity(.015f);
    }
    Sign(TEXT("REBOOT // OWN YOUR DAY"), {0,0,520}, 64.f, FColor(120,225,255));
}
void ARebootWorld::SetActiveHub(int32 Hub) { ActiveHub = Hub; }
void ARebootWorld::Tick(float DeltaSeconds)
{
    Super::Tick(DeltaSeconds); Clock += DeltaSeconds;
    for (int32 I=0; I<HubMaterials.Num(); ++I)
        if (HubMaterials[I]) HubMaterials[I]->SetScalarParameterValue(TEXT("Glow"),I==ActiveHub ? 1.8f+.6f*FMath::Sin(Clock*3.f) : .2f);
    APlayerCameraManager* Camera = UGameplayStatics::GetPlayerCameraManager(this,0);
    if (Camera)
        for (ATextRenderActor* Label : Signs)
            if (Label) Label->SetActorRotation((Camera->GetCameraLocation()-Label->GetActorLocation()).Rotation());
}
