#pragma once

#include <algorithm>
#include <limits>

namespace Reboot
{
enum class Mode { Story, Endless, Daily };

struct Stats
{
    int Energy = 78;
    int Focus = 76;
    int Mood = 72;
    int Balance = 60;
    int Social = 62;
};

struct Session
{
    Mode GameMode = Mode::Story;
    int Day = 1;
    int Slot = 0;
    int XP = 0;
    int Chips = 0;
    int TotalDays = 0;
    int BestBalance = 0;
    Stats Values;
    bool Ended = false;
};

struct Impact
{
    int Energy = 0;
    int Focus = 0;
    int Mood = 0;
    int Balance = 0;
    int Social = 0;
    int XP = 0;
    int Chips = 0;
};

inline constexpr int SlotsPerDay = 6;
inline constexpr int StoryDays = 21;
inline constexpr int DailyDays = 3;

// Widen before adding so even extreme imported deltas cannot overflow an int.
inline int ClampSum(int Value, int Delta, int Maximum)
{
    const long long Sum = static_cast<long long>(Value) + Delta;
    return static_cast<int>(std::clamp(Sum, 0LL, static_cast<long long>(Maximum)));
}

inline Session StartSession(Mode GameMode)
{
    Session Result;
    Result.GameMode = GameMode;
    return Result;
}

inline void ApplyChoice(Session& Current, const Impact& Change)
{
    if (Current.Ended)
    {
        return;
    }

    Current.Values.Energy = ClampSum(Current.Values.Energy, Change.Energy, 100);
    Current.Values.Focus = ClampSum(Current.Values.Focus, Change.Focus, 100);
    Current.Values.Mood = ClampSum(Current.Values.Mood, Change.Mood, 100);
    Current.Values.Balance = ClampSum(Current.Values.Balance, Change.Balance, 100);
    Current.Values.Social = ClampSum(Current.Values.Social, Change.Social, 100);
    Current.XP = ClampSum(Current.XP, Change.XP, std::numeric_limits<int>::max());
    Current.Chips = ClampSum(Current.Chips, Change.Chips, std::numeric_limits<int>::max());

    ++Current.Slot;
    if (Current.Slot >= SlotsPerDay)
    {
        Current.Slot = 0;
        Current.Day = ClampSum(Current.Day, 1, std::numeric_limits<int>::max());
        Current.TotalDays = ClampSum(Current.TotalDays, 1, std::numeric_limits<int>::max());
        Current.BestBalance = std::max(Current.BestBalance, Current.Values.Balance);
        Current.Ended =
            (Current.GameMode == Mode::Story && Current.TotalDays >= StoryDays) ||
            (Current.GameMode == Mode::Daily && Current.TotalDays >= DailyDays);
    }
}

inline void ApplyMiniResult(Session& Current, int Percent)
{
    if (Current.Ended)
    {
        return;
    }

    const int Score = std::clamp(Percent, 0, 100);
    Current.XP = ClampSum(Current.XP, Score / 10, std::numeric_limits<int>::max());
    const int Reward = Score >= 75 ? 2 : Score >= 45 ? 1 : 0;
    Current.Chips = ClampSum(Current.Chips, Reward, std::numeric_limits<int>::max());
}

// Module indices are zero-based. The bit mask remains owned by the profile.
inline bool UnlockModule(int& BankChips, unsigned& Mask, int Module)
{
    constexpr int Costs[] = {4, 5, 6, 8, 10};
    if (Module < 0 || Module >= 5)
    {
        return false;
    }

    const unsigned Bit = 1U << static_cast<unsigned>(Module);
    if ((Mask & Bit) != 0U || BankChips < Costs[Module])
    {
        return false;
    }

    BankChips -= Costs[Module];
    Mask |= Bit;
    return true;
}

inline const char* TitleForDay(int Day)
{
    static constexpr const char* Titles[StoryDays] = {
        "Neustart",
        "Der Klassenchat",
        "Eine Nacht zu lang",
        "Freundschaft braucht Zeit",
        "Der erste Fokus-Test",
        "Gaming mit Grenzen",
        "Deine erste Wochenbilanz",
        "Das MedTech-Projekt",
        "Benachrichtigungen im Griff",
        "Gemeinsam statt allein",
        "Der Prüfungsdruck",
        "Eine Pause für den Kopf",
        "Das FocusBand-Labor",
        "Deine zweite Wochenbilanz",
        "Der perfekte Feed",
        "Mut zum Abschalten",
        "Ein Abend mit Freunden",
        "Der letzte Labortest",
        "Rückschläge gehören dazu",
        "Dein eigener Rhythmus",
        "Du bestimmst deinen Tag"
    };
    const int Index = Day <= 0 ? 0 : (Day - 1) % StoryDays;
    return Titles[Index];
}
}
