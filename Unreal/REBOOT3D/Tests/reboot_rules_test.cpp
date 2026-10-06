#include "../Source/REBOOT3D/Public/RebootRules.h"

#include <cstdlib>
#include <cstring>
#include <iostream>
#include <limits>

namespace
{
int Checks = 0;

void Check(bool Condition, const char* Description)
{
    if (!Condition)
    {
        std::cerr << "FAIL: " << Description << '\n';
        std::exit(EXIT_FAILURE);
    }
    ++Checks;
}

bool SameSession(const Reboot::Session& A, const Reboot::Session& B)
{
    return A.GameMode == B.GameMode && A.Day == B.Day && A.Slot == B.Slot &&
        A.XP == B.XP && A.Chips == B.Chips && A.TotalDays == B.TotalDays &&
        A.BestBalance == B.BestBalance && A.Ended == B.Ended &&
        A.Values.Energy == B.Values.Energy && A.Values.Focus == B.Values.Focus &&
        A.Values.Mood == B.Values.Mood && A.Values.Balance == B.Values.Balance &&
        A.Values.Social == B.Values.Social;
}

void TestInitialState()
{
    for (const auto Mode : {Reboot::Mode::Story, Reboot::Mode::Endless, Reboot::Mode::Daily})
    {
        const auto Run = Reboot::StartSession(Mode);
        Check(Run.GameMode == Mode, "start preserves selected mode");
        Check(Run.Day == 1 && Run.Slot == 0 && !Run.Ended, "start begins at first slot");
        Check(Run.XP == 0 && Run.Chips == 0 && Run.TotalDays == 0 && Run.BestBalance == 0,
            "start resets run progress");
        Check(Run.Values.Energy == 78 && Run.Values.Focus == 76 && Run.Values.Mood == 72 &&
            Run.Values.Balance == 60 && Run.Values.Social == 62, "start initializes all stats");
    }
}

void TestFiniteModes()
{
    for (const auto Mode : {Reboot::Mode::Story, Reboot::Mode::Daily})
    {
        auto Run = Reboot::StartSession(Mode);
        const int Days = Mode == Reboot::Mode::Story ? 21 : 3;
        const int Choices = Days * 6;
        for (int Choice = 1; Choice <= Choices; ++Choice)
        {
            Reboot::ApplyChoice(Run, {});
            Check(Run.Slot == Choice % 6, "each choice advances exactly one slot");
            Check(Run.Day == 1 + Choice / 6 && Run.TotalDays == Choice / 6,
                "day progress advances only after six choices");
            Check(Run.Ended == (Choice == Choices), "finite run ends at the exact final choice");
        }
        Check(Run.Day == Days + 1 && Run.Slot == 0 && Run.TotalDays == Days,
            "completed run retains all finished days");
        Check(Run.BestBalance == 60, "completed days record balance");
        const auto Finished = Run;
        Reboot::Impact Change;
        Change.Energy = -100;
        Change.XP = 500;
        Change.Chips = 50;
        Reboot::ApplyChoice(Run, Change);
        Reboot::ApplyMiniResult(Run, 100);
        Check(SameSession(Run, Finished), "ended runs reject choice and mini rewards");
    }
}

void TestEndlessAndBestBalance()
{
    auto Run = Reboot::StartSession(Reboot::Mode::Endless);
    Reboot::Impact Up;
    Up.Balance = 30;
    Reboot::ApplyChoice(Run, Up);
    Check(Run.BestBalance == 0, "best balance is recorded at day completion");
    for (int Slot = 1; Slot < 6; ++Slot)
    {
        Reboot::ApplyChoice(Run, {});
    }
    Check(Run.BestBalance == 90 && Run.Day == 2, "first finished day sets best balance");
    Reboot::Impact Down;
    Down.Balance = -50;
    Reboot::ApplyChoice(Run, Down);
    for (int Choice = 7; Choice < 27 * 6; ++Choice)
    {
        Reboot::ApplyChoice(Run, {});
    }
    Check(!Run.Ended && Run.Day == 28 && Run.TotalDays == 27 && Run.Slot == 0,
        "endless continues beyond day 21");
    Check(Run.BestBalance == 90, "later lower balance preserves previous best");
}

void TestStatClampsAndRewards()
{
    auto Run = Reboot::StartSession(Reboot::Mode::Story);
    Reboot::Impact Down;
    Down.Energy = Down.Focus = Down.Mood = Down.Balance = Down.Social = -1000;
    Down.XP = Down.Chips = -1000;
    Reboot::ApplyChoice(Run, Down);
    Check(Run.Values.Energy == 0 && Run.Values.Focus == 0 && Run.Values.Mood == 0 &&
        Run.Values.Balance == 0 && Run.Values.Social == 0, "all stats clamp at zero");
    Check(Run.XP == 0 && Run.Chips == 0, "rewards cannot become negative");
    Reboot::Impact Up;
    Up.Energy = Up.Focus = Up.Mood = Up.Balance = Up.Social = 1000;
    Up.XP = 15;
    Up.Chips = 4;
    Reboot::ApplyChoice(Run, Up);
    Check(Run.Values.Energy == 100 && Run.Values.Focus == 100 && Run.Values.Mood == 100 &&
        Run.Values.Balance == 100 && Run.Values.Social == 100, "all stats clamp at 100");
    Check(Run.XP == 15 && Run.Chips == 4, "positive rewards accumulate");
    Down.XP = -6;
    Down.Chips = -2;
    Reboot::ApplyChoice(Run, Down);
    Check(Run.XP == 9 && Run.Chips == 2, "negative deltas spend existing rewards");
    Up.XP = Up.Chips = std::numeric_limits<int>::max();
    Reboot::ApplyChoice(Run, Up);
    Check(Run.XP == std::numeric_limits<int>::max() && Run.Chips == std::numeric_limits<int>::max(),
        "reward accumulation does not overflow");
    Down.Energy = std::numeric_limits<int>::min();
    Reboot::ApplyChoice(Run, Down);
    Check(Run.Values.Energy == 0, "extreme negative stat delta is safe");
}

void TestMiniRewards()
{
    struct Example { int Percent; int XP; int Chips; };
    constexpr Example Examples[] = {
        {-50, 0, 0}, {0, 0, 0}, {44, 4, 0}, {45, 4, 1},
        {74, 7, 1}, {75, 7, 2}, {100, 10, 2}, {500, 10, 2}
    };
    for (const auto& Example : Examples)
    {
        auto Run = Reboot::StartSession(Reboot::Mode::Daily);
        Reboot::ApplyChoice(Run, {});
        Reboot::ApplyMiniResult(Run, Example.Percent);
        Check(Run.XP == Example.XP && Run.Chips == Example.Chips, "mini score thresholds award expected rewards");
        Check(Run.Day == 1 && Run.Slot == 1 && Run.TotalDays == 0 && !Run.Ended,
            "mini rewards do not advance story time");
        Check(Run.Values.Energy == 78 && Run.Values.Focus == 76 && Run.Values.Mood == 72 &&
            Run.Values.Balance == 60 && Run.Values.Social == 62, "mini rewards leave stats unchanged");
    }
}

void TestModules()
{
    constexpr int Costs[] = {4, 5, 6, 8, 10};
    for (int Module = 0; Module < 5; ++Module)
    {
        unsigned Mask = 0;
        int Bank = Costs[Module] - 1;
        Check(!Reboot::UnlockModule(Bank, Mask, Module) && Bank == Costs[Module] - 1 && Mask == 0,
            "insufficient chips leave module and balance unchanged");
        ++Bank;
        Check(Reboot::UnlockModule(Bank, Mask, Module) && Bank == 0 && Mask == (1U << Module),
            "exact module price purchases the correct bit");
        Bank = 100;
        Check(!Reboot::UnlockModule(Bank, Mask, Module) && Bank == 100 && Mask == (1U << Module),
            "duplicate purchase does not charge chips");
    }
    unsigned Mask = 0x80000000U;
    int Bank = 33;
    for (int Module = 0; Module < 5; ++Module)
    {
        Check(Reboot::UnlockModule(Bank, Mask, Module), "all module purchases can share a bank");
    }
    Check(Bank == 0 && Mask == 0x8000001FU, "purchases preserve unrelated mask bits");
    for (const int Invalid : {-1, 5, std::numeric_limits<int>::max()})
    {
        Check(!Reboot::UnlockModule(Bank, Mask, Invalid) && Bank == 0 && Mask == 0x8000001FU,
            "invalid module index leaves state unchanged");
    }
}

void TestTitles()
{
    for (int Day = 1; Day <= 21; ++Day)
    {
        Check(std::strlen(Reboot::TitleForDay(Day)) > 0, "each story day has a title");
        for (int Earlier = 1; Earlier < Day; ++Earlier)
        {
            Check(std::strcmp(Reboot::TitleForDay(Day), Reboot::TitleForDay(Earlier)) != 0,
                "story beats have distinct titles");
        }
        Check(std::strcmp(Reboot::TitleForDay(Day + 21), Reboot::TitleForDay(Day)) == 0,
            "endless titles wrap after 21 days");
    }
    Check(std::strcmp(Reboot::TitleForDay(0), Reboot::TitleForDay(1)) == 0 &&
        std::strcmp(Reboot::TitleForDay(std::numeric_limits<int>::min()), Reboot::TitleForDay(1)) == 0,
        "invalid day safely falls back to the opening beat");
}
}

int main()
{
    TestInitialState();
    TestFiniteModes();
    TestEndlessAndBestBalance();
    TestStatClampsAndRewards();
    TestMiniRewards();
    TestModules();
    TestTitles();
    std::cout << "PASS: " << Checks << " checks (126 story choices, 18 daily choices, endless, "
        "clamps, ended guards, modules, mini rewards, German story titles).\n";
    return EXIT_SUCCESS;
}
