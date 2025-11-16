'use client';

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ui/ai/conversation';
import { Loader } from '@/components/ui/ai/loader';
import {
  Message,
  MessageAvatar,
  MessageContent,
} from '@/components/ui/ai/message';
import {
  PromptInput,
  PromptInputButton,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from '@/components/ui/ai/prompt-input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ChevronDown, MicIcon, PaperclipIcon, RotateCcwIcon, MoreHorizontal, TrendingUp } from 'lucide-react';
import { nanoid } from 'nanoid';
import Image from 'next/image';
import { type FormEventHandler, useCallback, useEffect, useState, useRef } from 'react';
import {
  BarChart,
  Bar,
  Line,
  LineChart,
  ComposedChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

type ChatMessage = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  reasoning?: string;
  sources?: Array<{ title: string; url: string }>;
  isStreaming?: boolean;
  component?: React.ReactNode;
  showPlayersCard?: boolean;
  showChartCard?: boolean;
  showTableCard?: boolean;
  showCompareCard?: boolean;
};

const models = [
  { id: 'gpt-4o', name: 'GPT-4o' },
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
  { id: 'llama-3.1-70b', name: 'Llama 3.1 70B' },
];

const sampleResponses = [
  {
    content:
      "I'd be happy to help you with that! React is a powerful JavaScript library for building user interfaces. What specific aspect would you like to explore?",
  },
  {
    content:
      'Next.js is an excellent framework built on top of React that provides server-side rendering, static site generation, and many other powerful features out of the box.',
  },
  {
    content:
      "TypeScript adds static type checking to JavaScript, which helps catch errors early and improves code quality. It's particularly valuable in larger applications.",
  },
];

// Generate random data for past 6 games with labels and teams
const generatePast6Games = () => {
  const formats = ['G', 'G/A', 'A'];
  const teams = [
    'Arsenal', 'Liverpool', 'Real Madrid', 'Barcelona', 'Manchester City',
    'Chelsea', 'Tottenham', 'Bayern Munich', 'PSG', 'Juventus',
    'Atletico Madrid', 'Inter Milan', 'AC Milan', 'Borussia Dortmund', 'Napoli'
  ];
  return Array.from({ length: 6 }, () => {
    const value = Math.floor(Math.random() * 5); // 0-4 (0 means no bar)
    const format = formats[Math.floor(Math.random() * formats.length)];
    const team = teams[Math.floor(Math.random() * teams.length)];
    const displayLabel = format === 'G/A' ? `${value}${format}` : `${value}${format}`;
    const tooltipLabel = format === 'G/A' 
      ? `${value} ${format}` 
      : `${value} ${format === 'G' ? 'Goal' : 'Assist'}${value > 1 ? 's' : ''}`;
    return {
      value: value > 0 ? value * 10 + 30 : 0, // Scale for visual display (40-70 range), 0 if no stat
      label: displayLabel, // For bar label: "1G", "2G/A", "1A"
      tooltipLabel: tooltipLabel, // For tooltip: "1 Goal", "2 G/A", "1 Assist"
      team: team,
      statValue: value, // Original stat value (0-4)
    };
  });
};

const players = [
  {
    id: 1,
    name: 'Kylian Mbappé',
    team: 'Real Madrid',
    league: 'La Liga',
    goalsAssists: 15,
    image: '/mbappe.webp',
    past6Games: generatePast6Games(),
  },
  {
    id: 2,
    name: 'Erling Haaland',
    team: 'Manchester City',
    league: 'Premier League',
    goalsAssists: 15,
    image: '/haalnd.jpg',
    past6Games: generatePast6Games(),
  },
  {
    id: 3,
    name: 'Luis Díaz',
    team: 'Bayern Munich',
    league: 'Bundesliga',
    goalsAssists: 10,
    image: '/luizdiaz.webp',
    past6Games: generatePast6Games(),
  },
  {
    id: 4,
    name: 'Julián Álvarez',
    team: 'Atlético Madrid',
    league: 'La Liga',
    goalsAssists: 9,
    image: '/alvarez.webp',
    past6Games: generatePast6Games(),
  },
  {
    id: 5,
    name: 'Lamine Yamal',
    team: 'Barcelona',
    league: 'La Liga',
    goalsAssists: 8,
    image: '/yamal.webp',
    past6Games: generatePast6Games(),
  },
  {
    id: 6,
    name: 'Antoine Semenyo',
    team: 'Bournemouth',
    league: 'Premier League',
    goalsAssists: 8,
    image: '/antoine.jpg',
    past6Games: generatePast6Games(),
  },
  {
    id: 7,
    name: 'Harry Kane',
    team: 'Bayern Munich',
    league: 'Bundesliga',
    goalsAssists: 7,
    image: '/harry_kane.jpg',
    past6Games: generatePast6Games(),
  },
  {
    id: 8,
    name: 'Lionel Messi',
    team: 'Inter Miami',
    league: 'MLS',
    goalsAssists: 6,
    image: '/messi.webp',
    past6Games: generatePast6Games(),
  },
  {
    id: 9,
    name: 'Victor Osimhen',
    team: 'Napoli',
    league: 'Serie A',
    goalsAssists: 4,
    image: '/victor.jpg',
    past6Games: generatePast6Games(),
  },
  {
    id: 10,
    name: 'Marcus Rashford',
    team: 'Manchester United',
    league: 'Premier League',
    goalsAssists: 3,
    image: '/rashford.webp',
    past6Games: generatePast6Games(),
  },
];

// Generate random FPL chart data
const generateFPLData = () => {
  return Array.from({ length: 12 }, (_, i) => ({
    gameweek: `GW${i + 1}`,
    averagePoints: Math.floor(Math.random() * 30) + 40, // Random between 40-70
    ojsPoints: Math.floor(Math.random() * 40) + 30, // Random between 30-70
  }));
};

const fplData = generateFPLData();

// Generate comparison stats for players
const generateComparisonStats = () => {
  return players.map((player) => {
    const goals = Math.floor(player.goalsAssists * 0.6);
    const assists = player.goalsAssists - goals;
    const appearances = Math.floor(Math.random() * 8) + 8; // 8-15
    const expectedGoals = (goals * 0.8 + Math.random() * 2).toFixed(2);
    const goalInvolvements = (player.goalsAssists / appearances).toFixed(2);
    const avgRating = (7.5 + Math.random() * 1.5).toFixed(1);
    const minutesPlayed = appearances * (Math.floor(Math.random() * 30) + 60); // 60-90 minutes per game
    const passAcc = Math.floor(Math.random() * 20) + 75; // 75-95%
    
    // Radar chart data (ATT, TEC, DEF, STA, PAS)
    const radarData = [
      { attribute: 'ATT', value: Math.min(10, goals * 0.6 + Math.random() * 2) },
      { attribute: 'TEC', value: Math.min(10, assists * 0.7 + Math.random() * 2) },
      { attribute: 'DEF', value: Math.min(10, Math.random() * 4 + 2) },
      { attribute: 'STA', value: Math.min(10, (minutesPlayed / appearances / 10) + Math.random() * 2) },
      { attribute: 'PAS', value: Math.min(10, (passAcc / 10) + Math.random() * 1) },
    ];

    return {
      ...player,
      goals,
      assists,
      appearances,
      expectedGoals: parseFloat(expectedGoals),
      goalInvolvements: parseFloat(goalInvolvements),
      avgRating: parseFloat(avgRating),
      minutesPlayed,
      passAcc,
      radarData,
    };
  });
};

const playersWithStats = generateComparisonStats();

// Generate league table data for each gameweek (1-11)
const generateLeagueTableData = () => {
  const teams = [
    { name: 'Inter', logo: 'I' },
    { name: 'Milan', logo: 'M' },
    { name: 'Juventus', logo: 'J' },
    { name: 'Bologna', logo: 'B' },
    { name: 'Roma', logo: 'R' },
    { name: 'Atalanta', logo: 'A' },
    { name: 'Lazio', logo: 'L' },
    { name: 'Napoli', logo: 'N' },
    { name: 'Fiorentina', logo: 'F' },
    { name: 'Torino', logo: 'T' },
    { name: 'Genoa', logo: 'G' },
    { name: 'Monza', logo: 'MZ' },
    { name: 'Lecce', logo: 'LEC' },
    { name: 'Sassuolo', logo: 'S' },
    { name: 'Frosinone', logo: 'FRO' },
    { name: 'Udinese', logo: 'U' },
    { name: 'Cagliari', logo: 'C' },
    { name: 'Verona', logo: 'V' },
    { name: 'Empoli', logo: 'E' },
    { name: 'Salernitana', logo: 'SAL' },
  ];

  const gameweekData: Record<number, Record<string, Array<{
    name: string;
    logo: string;
    games: number;
    wins: number;
    draws: number;
    losses: number;
    goalDiff: number;
    points: number;
  }>>> = {};

  // Predefined patterns to ensure visible position changes
  // Each team has different performance trajectories across gameweeks
  const teamPatterns = [
    // Inter - starts strong, dips mid-season, recovers
    [0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8],
    // Milan - slow start, strong middle, dips at end
    [0.4, 0.5, 0.6, 0.7, 0.75, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55],
    // Juventus - consistent throughout
    [0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6],
    // Bologna - starts weak, improves dramatically
    [0.3, 0.35, 0.4, 0.5, 0.6, 0.65, 0.7, 0.75, 0.7, 0.65, 0.6],
    // Roma - inconsistent, up and down
    [0.5, 0.6, 0.5, 0.4, 0.5, 0.6, 0.5, 0.4, 0.5, 0.6, 0.5],
    // Atalanta - strong start, weakens
    [0.7, 0.65, 0.6, 0.55, 0.5, 0.45, 0.4, 0.4, 0.4, 0.4, 0.4],
    // Lazio - weak start, strong finish
    [0.3, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75],
    // Napoli - strong throughout, slight dip
    [0.65, 0.65, 0.6, 0.55, 0.5, 0.55, 0.6, 0.65, 0.65, 0.65, 0.65],
    // Fiorentina - average, improving
    [0.4, 0.45, 0.5, 0.5, 0.55, 0.55, 0.6, 0.6, 0.6, 0.6, 0.6],
    // Torino - consistent mid-table
    [0.45, 0.45, 0.45, 0.45, 0.45, 0.45, 0.45, 0.45, 0.45, 0.45, 0.45],
    // Genoa - weak start, improves
    [0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.5, 0.5, 0.5, 0.5],
    // Monza - average throughout
    [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4],
    // Lecce - weak, improving slightly
    [0.2, 0.25, 0.3, 0.3, 0.35, 0.35, 0.4, 0.4, 0.4, 0.4, 0.4],
    // Sassuolo - declining
    [0.5, 0.45, 0.4, 0.35, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
    // Frosinone - very weak
    [0.15, 0.2, 0.2, 0.25, 0.25, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
    // Udinese - average, declining
    [0.45, 0.4, 0.4, 0.35, 0.35, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
    // Cagliari - weak throughout
    [0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25],
    // Verona - weak, improving
    [0.2, 0.2, 0.25, 0.3, 0.35, 0.35, 0.4, 0.4, 0.4, 0.4, 0.4],
    // Empoli - very weak
    [0.1, 0.15, 0.15, 0.2, 0.2, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25],
    // Salernitana - weakest
    [0.1, 0.1, 0.1, 0.15, 0.15, 0.15, 0.2, 0.2, 0.2, 0.2, 0.2],
  ];

  // Generate data for each gameweek
  for (let gw = 1; gw <= 11; gw++) {
    const allGames: Array<{
      name: string;
      logo: string;
      games: number;
      wins: number;
      draws: number;
      losses: number;
      goalDiff: number;
      points: number;
    }> = [];
    const homeGames: Array<{
      name: string;
      logo: string;
      games: number;
      wins: number;
      draws: number;
      losses: number;
      goalDiff: number;
      points: number;
    }> = [];
    const awayGames: Array<{
      name: string;
      logo: string;
      games: number;
      wins: number;
      draws: number;
      losses: number;
      goalDiff: number;
      points: number;
    }> = [];

    teams.forEach((team, index) => {
      const winRate = teamPatterns[index][gw - 1];
      const games = gw;
      const wins = Math.floor(games * winRate);
      const draws = Math.floor(games * (1 - winRate) * 0.3);
      const losses = games - wins - draws;
      const goalDiff = (wins * 2) - (losses * 1) + Math.floor(Math.random() * 3) - 1;
      const points = (wins * 3) + draws;

      const allStats = {
        name: team.name,
        logo: team.logo,
        games: games,
        wins: Math.max(0, wins),
        draws: Math.max(0, draws),
        losses: Math.max(0, losses),
        goalDiff: goalDiff,
        points: points,
      };

      // Home games: typically better performance (higher win rate)
      const homeWinRate = winRate * 1.2; // 20% boost at home
      const homeGamesCount = Math.ceil(games / 2);
      const homeWins = Math.floor(homeGamesCount * Math.min(1, homeWinRate));
      const homeDraws = Math.floor(homeGamesCount * (1 - Math.min(1, homeWinRate)) * 0.3);
      const homeLosses = homeGamesCount - homeWins - homeDraws;
      const homeGoalDiff = (homeWins * 2) - (homeLosses * 1) + Math.floor(Math.random() * 2);
      const homePoints = (homeWins * 3) + homeDraws;

      const homeStats = {
        name: team.name,
        logo: team.logo,
        games: homeGamesCount,
        wins: Math.max(0, homeWins),
        draws: Math.max(0, homeDraws),
        losses: Math.max(0, homeLosses),
        goalDiff: homeGoalDiff,
        points: homePoints,
      };

      // Away games: typically worse performance (lower win rate)
      const awayWinRate = winRate * 0.8; // 20% reduction away
      const awayGamesCount = Math.floor(games / 2);
      const awayWins = Math.floor(awayGamesCount * Math.min(1, awayWinRate));
      const awayDraws = Math.floor(awayGamesCount * (1 - Math.min(1, awayWinRate)) * 0.3);
      const awayLosses = awayGamesCount - awayWins - awayDraws;
      const awayGoalDiff = (awayWins * 2) - (awayLosses * 1) + Math.floor(Math.random() * 2) - 1;
      const awayPoints = (awayWins * 3) + awayDraws;

      const awayStats = {
        name: team.name,
        logo: team.logo,
        games: awayGamesCount,
        wins: Math.max(0, awayWins),
        draws: Math.max(0, awayDraws),
        losses: Math.max(0, awayLosses),
        goalDiff: awayGoalDiff,
        points: awayPoints,
      };

      allGames.push(allStats);
      homeGames.push(homeStats);
      awayGames.push(awayStats);
    });

    // Sort by points (descending), then by goal difference (descending)
    const sortStats = (stats: typeof allGames) => {
      stats.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        return b.goalDiff - a.goalDiff;
      });
    };

    sortStats(allGames);
    sortStats(homeGames);
    sortStats(awayGames);

    gameweekData[gw] = {
      'All Games': allGames,
      'Home': homeGames,
      'Away': awayGames,
    };
  }

  return gameweekData;
};

const leagueTableData = generateLeagueTableData();

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: nanoid(),
      content:
        "Welcome to FootChat! I'm your football statistics assistant. I can help you explore player performance data, league standings, and player comparisons.\n\nTo get started, try typing:\n• \"highest\" - View the top players by goals and assists in Europe\n• \"table\" - See the current league standings with gameweek filtering\n• \"compare\" - Compare player statistics side-by-side with radar charts\n\nWhat would you like to explore?",
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [selectedModel, setSelectedModel] = useState(models[0].id);
  const [selectedLeague, setSelectedLeague] = useState('All');
  const [tableSliderValue, setTableSliderValue] = useState(11);
  const [tableFilter, setTableFilter] = useState('All Games');
  const [isTyping, setIsTyping] = useState(false);
  const [expandedPlayerId, setExpandedPlayerId] = useState<number | null>(null);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null
  );
  const conversationContentRef = useRef<HTMLDivElement>(null);

  const simulateTyping = useCallback(
    (messageId: string, content: string) => {
      let currentIndex = 0;
      const typeInterval = setInterval(() => {
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === messageId) {
              const currentContent = content.slice(0, currentIndex);
              return {
                ...msg,
                content: currentContent,
                isStreaming: currentIndex < content.length,
              };
            }
            return msg;
          })
        );

        // Auto-scroll during streaming
        if (conversationContentRef.current) {
          conversationContentRef.current.scrollTop =
            conversationContentRef.current.scrollHeight;
        }

        currentIndex += Math.random() > 0.1 ? 1 : 0; // Simulate variable typing speed

        if (currentIndex >= content.length) {
          clearInterval(typeInterval);
          setIsTyping(false);
          setStreamingMessageId(null);
        }
      }, 50);
      return () => clearInterval(typeInterval);
    },
    []
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (event) => {
      event.preventDefault();

      if (!inputValue.trim() || isTyping) return;

      // Add user message
      const userMessage: ChatMessage = {
        id: nanoid(),
        content: inputValue.trim(),
        role: 'user',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setInputValue('');
      setIsTyping(true);

      // Scroll to bottom
      setTimeout(() => {
        if (conversationContentRef.current) {
          conversationContentRef.current.scrollTop =
            conversationContentRef.current.scrollHeight;
        }
      }, 100);

      // Check if input contains keywords (case-insensitive)
      const inputLower = inputValue.trim().toLowerCase();
      const containsHighest = inputLower.includes('highest');
      const containsTable = inputLower.includes('table');
      const containsCompare = inputLower.includes('compare');

      // Simulate AI response with delay
      setTimeout(() => {
        const assistantMessageId = nanoid();

        if (containsHighest) {
          // Response for "highest" - show Players Card with summary
          const topPlayers = players.slice(0, 3);
          const summary = `Here are the top performers in Europe by goals and assists. ${topPlayers[0].name} leads the way with ${topPlayers[0].goalsAssists} goal involvements for ${topPlayers[0].team} in the ${topPlayers[0].league}. ${topPlayers[1].name} is close behind with ${topPlayers[1].goalsAssists} contributions for ${topPlayers[1].team}, while ${topPlayers[2].name} has ${topPlayers[2].goalsAssists} goal involvements for ${topPlayers[2].team}. You can filter by league to see specific competitions, and expand any player row to view detailed statistics including their performance across different competitions.`;
          
          const assistantMessage: ChatMessage = {
            id: assistantMessageId,
            content: summary,
            role: 'assistant',
            timestamp: new Date(),
            showPlayersCard: true,
          };
          setMessages((prev) => [...prev, assistantMessage]);
          setIsTyping(false);
        } else if (containsTable) {
          // Response for "table" - show League Table with summary
          const currentData = leagueTableData[tableSliderValue]?.[tableFilter] || [];
          const topTeam = currentData[0];
          const summary = `Here's the current Serie A standings for Gameweek ${tableSliderValue}${tableFilter !== 'All Games' ? ` (${tableFilter})` : ''}. ${topTeam?.name || 'Inter'} currently leads the table with ${topTeam?.points || 0} points from ${topTeam?.games || 0} games, having won ${topTeam?.wins || 0} matches. Use the slider to navigate through different gameweeks and see how the table has evolved throughout the season. You can also filter between all games, home games, and away games to analyze team performance in different contexts.`;
          
          const assistantMessage: ChatMessage = {
            id: assistantMessageId,
            content: summary,
            role: 'assistant',
            timestamp: new Date(),
            showTableCard: true,
          };
          setMessages((prev) => [...prev, assistantMessage]);
          setIsTyping(false);
        } else if (containsCompare) {
          // Response for "compare" - show Player Comparison with summary
          const player1 = playersWithStats[0];
          const player2 = playersWithStats[1];
          const summary = `Comparing ${player1.name} and ${player2.name}: ${player1.name} has ${player1.goals} goals and ${player1.assists} assists (${player1.goalsAssists} total goal involvements) in ${player1.appearances} appearances for ${player1.team}, giving him ${player1.goalInvolvements} goal involvements per game. ${player2.name} has ${player2.goals} goals and ${player2.assists} assists (${player2.goalsAssists} total) in ${player2.appearances} appearances for ${player2.team}, averaging ${player2.goalInvolvements} goal involvements per game. ${player1.name} has an average rating of ${player1.avgRating} and ${player1.passAcc}% pass accuracy, while ${player2.name} has a ${player2.avgRating} rating and ${player2.passAcc}% pass accuracy. The radar charts below show their performance across key attributes: Attack, Technique, Defense, Stamina, and Passing.`;
          
          const assistantMessage: ChatMessage = {
            id: assistantMessageId,
            content: summary,
            role: 'assistant',
            timestamp: new Date(),
            showCompareCard: true,
          };
          setMessages((prev) => [...prev, assistantMessage]);
          setIsTyping(false);
        } else {
          // Regular response
          const responseData =
            sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
          const assistantMessage: ChatMessage = {
            id: assistantMessageId,
            content: '',
            role: 'assistant',
            timestamp: new Date(),
            isStreaming: true,
          };
          setMessages((prev) => [...prev, assistantMessage]);
          setStreamingMessageId(assistantMessageId);

          // Start typing simulation
          simulateTyping(assistantMessageId, responseData.content);
        }
      }, 800);
    },
    [inputValue, isTyping, simulateTyping]
  );

  const handleReset = useCallback(() => {
    setMessages([
      {
        id: nanoid(),
        content:
          "Welcome to FootChat! I'm your football statistics assistant. I can help you explore player performance data, league standings, and player comparisons.\n\nTo get started, try typing:\n• \"highest\" - View the top players by goals and assists in Europe\n• \"table\" - See the current league standings with gameweek filtering\n• \"compare\" - Compare player statistics side-by-side with radar charts\n\nWhat would you like to explore?",
        role: 'assistant',
        timestamp: new Date(),
      },
    ]);
    setInputValue('');
    setIsTyping(false);
    setStreamingMessageId(null);
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (conversationContentRef.current) {
      conversationContentRef.current.scrollTop =
        conversationContentRef.current.scrollHeight;
    }
  }, [messages.length]);

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border bg-background shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-green-500" />
              <span className="text-sm font-medium">AI Assistant</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <span className="text-xs text-muted-foreground">
              {models.find((m) => m.id === selectedModel)?.name}
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 px-2">
            <RotateCcwIcon className="size-4" />
            <span className="ml-1">Reset</span>
          </Button>
        </div>

        {/* Conversation Area */}
        <Conversation className="flex-1">
          <ConversationContent
            ref={conversationContentRef}
            className="space-y-4"
          >
            {messages.map((message) => (
              <Message key={message.id} from={message.role}>
                <MessageAvatar
                  name={message.role === 'user' ? 'You' : 'AI'}
                  className={cn(
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                />
                <MessageContent>
                  {message.component && (
                    <div className="mb-2 flex justify-start ml-4">{message.component}</div>
                  )}
                  {message.showPlayersCard && (
                    <div className="mb-2 flex justify-start ml-4">
                      <Card className="w-[500px]">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                          <CardTitle>Highest Goals+Assists in Europe</CardTitle>
                          <Select value={selectedLeague} onValueChange={setSelectedLeague}>
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="All">All</SelectItem>
                              <SelectItem value="Premier League">Premier League</SelectItem>
                              <SelectItem value="La Liga">La Liga</SelectItem>
                            </SelectContent>
                          </Select>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="px-6 pt-1 pb-2 flex justify-center">
                            <p className="text-sm font-medium text-muted-foreground ml-24">Past 6 Matches</p>
                          </div>
                          <div className="max-h-[250px] overflow-y-auto">
                            <div className="divide-y divide-border">
                            {players
                              .filter((player) =>
                                selectedLeague === 'All' ||
                                player.league === selectedLeague
                              )
                              .map((player, index) => {
                                const colors = ['#22c55e', '#ef4444', '#eab308'];
                                const graphColor = colors[index % colors.length];
                                return (
                                <div key={player.id}>
                                  <div
                                    className="flex items-center p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                                  >
                                    <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 relative mr-4">
            <Image
                                        src={player.image}
                                        alt={player.name}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0 max-w-[200px]">
                                      <div className="font-semibold">{player.name}</div>
                                      <div className="text-sm text-muted-foreground">
                                        {player.team}
                                      </div>
                                    </div>
                                    <div className="w-32 h-16 flex-shrink-0 -ml-12 mr-8">
                                      <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={player.past6Games.map((item, idx) => ({ ...item, index: idx }))} margin={{ top: 15, right: 5, bottom: 15, left: 5 }}>
                                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                          <XAxis 
                                            dataKey="index"
                                            axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
                                            tickLine={{ stroke: 'hsl(var(--border))' }}
                                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 8 }}
                                            height={15}
                                            hide
                                          />
                                          <YAxis 
                                            domain={[0, 4]}
                                            hide
                                          />
                                          <Tooltip
                                            content={({ active, payload }) => {
                                              if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                if (data.statValue === 0) return null;
                                                return (
                                                  <div className="bg-popover border rounded-md shadow-lg px-2 py-1 text-[10px]">
                                                    <p className="font-medium">{data.tooltipLabel} vs {data.team}</p>
                                                  </div>
                                                );
                                              }
                                              return null;
                                            }}
                                            position={{ y: -10 }}
                                          />
                                          <Line
                                            type="basis"
                                            dataKey="statValue"
                                            stroke={graphColor}
                                            strokeWidth={2}
                                            dot={false}
                                            isAnimationActive={false}
                                          >
                                            <LabelList
                                              dataKey="label"
                                              position="top"
                                              style={{ fill: '#000', fontSize: '9px', fontWeight: 'bold' }}
                                              content={({ value, payload }) => {
                                                if (payload && payload.statValue === 0) return null;
                                                return <text x={0} y={0} dy={-4} textAnchor="middle" fill="#000" fontSize="9px" fontWeight="bold">{value}</text>;
                                              }}
                                            />
                                          </Line>
                                        </LineChart>
                                      </ResponsiveContainer>
                                    </div>
                                    <div className="font-semibold -ml-2">
                                      {player.goalsAssists}
                                    </div>
                                    <ChevronDown 
                                      className={cn(
                                        "w-4 h-4 text-muted-foreground ml-2 transition-transform cursor-pointer",
                                        expandedPlayerId === player.id && "rotate-180"
                                      )}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setExpandedPlayerId(expandedPlayerId === player.id ? null : player.id);
                                      }}
                                    />
                                  </div>
                                  {expandedPlayerId === player.id && (
                                    <div className="px-2 pb-0 ml-8">
                                      <Card className="border border-gray-200 bg-gray-50/50 max-w-sm">
                                        <CardContent className="px-2 py-0">
                                          <div className="grid grid-cols-[1fr_2fr] grid-rows-2 gap-2">
                                            {/* Top-left: Total Goals card */}
                                            <div className="border border-gray-200 bg-white rounded-md p-2">
                                              <div className="text-xs text-gray-600 mb-1">Total Goals</div>
                                              <div className="flex items-end gap-2">
                                                <div className="text-2xl font-bold">10</div>
                                                <div className="bg-green-100 text-green-700 text-[7px] px-1.5 py-0.5 rounded-full mb-0.5">
                                                  1st in La Liga
                                                </div>
                                              </div>
                                            </div>
                                            
                                            {/* Top-right: Table */}
                                            <div className="border border-gray-200 bg-[#e0f2fe] rounded-md overflow-hidden">
                                              <table className="w-full text-[9px] border-collapse">
                                                <thead>
                                                  <tr className="bg-[#bae6fd] text-white">
                                                    <th className="px-1 py-0 text-left font-medium text-[8px]">LEAGUE</th>
                                                    <th className="px-1 py-0 text-left font-medium text-[8px]">GP</th>
                                                    <th className="px-1 py-0 text-left font-medium text-[8px]">G</th>
                                                    <th className="px-1 py-0 text-left font-medium text-[8px]">A</th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  <tr className="border-b border-gray-300">
                                                    <td className="px-1 py-0">La Liga</td>
                                                    <td className="px-1 py-0">10</td>
                                                    <td className="px-1 py-0">5</td>
                                                    <td className="px-1 py-0">4</td>
                                                  </tr>
                                                  <tr className="border-b border-gray-300">
                                                    <td className="px-1 py-0">Champions League</td>
                                                    <td className="px-1 py-0">4</td>
                                                    <td className="px-1 py-0">1</td>
                                                    <td className="px-1 py-0">3</td>
                                                  </tr>
                                                  <tr>
                                                    <td className="px-1 py-0">Copa Del Rey</td>
                                                    <td className="px-1 py-0">2</td>
                                                    <td className="px-1 py-0">1</td>
                                                    <td className="px-1 py-0">0</td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </div>
                                            
                                            {/* Bottom-left: Total Assists card */}
                                            <div className="border border-gray-200 bg-white rounded-md p-2">
                                              <div className="text-xs text-gray-600 mb-1">Total Assists</div>
                                              <div className="flex items-end gap-2">
                                                <div className="text-2xl font-bold">5</div>
                                                <div className="bg-red-100 text-red-700 text-[7px] px-1.5 py-0.5 rounded-full mb-0.5">
                                                  12th in La Liga
                                                </div>
                                              </div>
                                            </div>
                                            
                                            {/* Bottom-right: Two cards */}
                                            <div className="flex gap-2">
                                              <div className="border border-gray-200 bg-white rounded-md flex-1 p-2">
                                                <div className="text-xs text-gray-600 mb-1">Goals Per Game</div>
                                                <div className="flex items-end gap-2">
                                                  <div className="text-2xl font-bold">1.2</div>
                                                  <div className="bg-green-100 text-green-700 text-[7px] px-1.5 py-0.5 rounded-full mb-0.5">
                                                    1st in La Liga
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="border border-gray-200 bg-white rounded-md flex-1 p-2">
                                                <div className="text-xs text-gray-600 mb-1">Expected Goals</div>
                                                <div className="flex items-end gap-2">
                                                  <div className="text-2xl font-bold">11.3</div>
                                                  <div className="bg-yellow-100 text-yellow-700 text-[7px] px-1.5 py-0.5 rounded-full mb-0.5">
                                                    5th in the world
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </div>
                                  )}
                                </div>
                                );
                              })}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  {message.showChartCard && (
                    <div className="mb-2 flex justify-start ml-4">
                      <Card className="w-[600px]">
                        <CardHeader>
                          <CardTitle>OJ's FPL points</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-end gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded bg-purple-500" />
                              <span className="text-sm text-muted-foreground">Average Points</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded bg-blue-400" />
                              <span className="text-sm text-muted-foreground">OJ's Points</span>
                            </div>
                          </div>
                          <ResponsiveContainer width="100%" height={200}>
                            <ComposedChart data={fplData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                              <XAxis
                                dataKey="gameweek"
                                stroke="hsl(var(--muted-foreground))"
                                style={{ fontSize: '12px' }}
                              />
                              <YAxis
                                domain={[0, 90]}
                                stroke="hsl(var(--muted-foreground))"
                                style={{ fontSize: '12px' }}
                              />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: 'hsl(var(--popover))',
                                  border: '1px solid hsl(var(--border))',
                                  borderRadius: '6px',
                                }}
                              />
                              <Bar
                                dataKey="averagePoints"
                                fill="#a855f7"
                                name="Average Points"
                                radius={[4, 4, 0, 0]}
                              />
                              <Line
                                type="monotone"
                                dataKey="ojsPoints"
                                stroke="#60a5fa"
                                strokeWidth={2}
                                name="OJ's Points"
                                dot={{ fill: '#60a5fa', r: 4 }}
                              />
                            </ComposedChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  {message.showTableCard && (
                    <div className="mb-2 flex justify-start ml-4">
                      <Card className="w-[700px]">
                        <CardContent className="p-0">
                          <div className="bg-muted/50 border-b border-border px-4 py-3">
                            <div className="flex items-center gap-4">
                              <input
                                type="range"
                                min="1"
                                max="11"
                                value={tableSliderValue}
                                onChange={(e) => setTableSliderValue(Number(e.target.value))}
                                className="flex-1 h-2 rounded-lg appearance-none cursor-pointer slider border border-border"
                                style={{
                                  background: `linear-gradient(to right, #22c55e 0%, #22c55e ${((tableSliderValue - 1) / 10) * 100}%, #22c55e ${((tableSliderValue - 1) / 10) * 100}%, #22c55e 100%)`
                                }}
                              />
                              <span className="text-foreground text-sm font-medium min-w-[3rem] text-right">
                                GW{tableSliderValue}
                              </span>
                              <Select value={tableFilter} onValueChange={setTableFilter}>
                                <SelectTrigger className="w-[130px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="All Games">All Games</SelectItem>
                                  <SelectItem value="Home">Home</SelectItem>
                                  <SelectItem value="Away">Away</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="overflow-x-auto">
                            <div className="max-h-[400px] overflow-y-auto">
                              <table className="w-full text-sm">
                                <thead className="sticky top-0 bg-card z-10">
                                  <tr className="border-b border-border">
                                    <th className="px-4 py-3 text-left text-muted-foreground font-medium text-xs">#</th>
                                    <th className="px-4 py-3 text-left text-muted-foreground font-medium text-xs">Team</th>
                                    <th className="px-4 py-3 text-left text-muted-foreground font-medium text-xs">G</th>
                                    <th className="px-4 py-3 text-left text-muted-foreground font-medium text-xs">W</th>
                                    <th className="px-4 py-3 text-left text-muted-foreground font-medium text-xs">D</th>
                                    <th className="px-4 py-3 text-left text-muted-foreground font-medium text-xs">L</th>
                                    <th className="px-4 py-3 text-left text-muted-foreground font-medium text-xs">GD</th>
                                    <th className="px-4 py-3 text-left text-muted-foreground font-medium text-xs">Pts</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {leagueTableData[tableSliderValue]?.[tableFilter]?.map((team, index) => (
                                    <tr 
                                      key={team.name} 
                                      className="border-b border-border hover:bg-muted/50 transition-all duration-300 ease-in-out"
                                      style={{
                                        animation: 'slideIn 0.3s ease-out'
                                      }}
                                    >
                                      <td className="px-4 py-3 text-foreground transition-all duration-300">{index + 1}</td>
                                      <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-foreground">{team.logo}</div>
                                          <span className="text-foreground">{team.name}</span>
                                        </div>
                                      </td>
                                      <td className="px-4 py-3 text-foreground transition-all duration-300">{team.games}</td>
                                      <td className="px-4 py-3 text-foreground transition-all duration-300">{team.wins}</td>
                                      <td className="px-4 py-3 text-foreground transition-all duration-300">{team.draws}</td>
                                      <td className="px-4 py-3 text-foreground transition-all duration-300">{team.losses}</td>
                                      <td className="px-4 py-3 text-foreground transition-all duration-300">{team.goalDiff > 0 ? '+' : ''}{team.goalDiff}</td>
                                      <td className="px-4 py-3 text-foreground font-bold transition-all duration-300">{team.points}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  {message.showCompareCard && (
                    <div className="mb-2 flex justify-start ml-4">
                      <Card className="w-[800px]">
                        <CardHeader>
                          <CardTitle className="text-center">Player Comparison</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {/* Player Profiles */}
                          <div className="grid grid-cols-2 gap-6 mb-6">
                            {playersWithStats.slice(0, 2).map((player, idx) => (
                              <div key={player.id} className="flex flex-col items-center">
                                <div className="relative w-32 h-32 rounded-lg overflow-hidden mb-3">
                                  <Image
                                    src={player.image}
                                    alt={player.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="text-lg font-bold mb-1">{player.name}</div>
                                <div className="text-sm text-muted-foreground mb-2">{player.team}</div>
                                <div className="text-xs text-muted-foreground">{player.league}</div>
                              </div>
                            ))}
                          </div>

                          {/* Stats Comparison Table */}
                          <div className="border rounded-lg overflow-hidden mb-6">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b bg-muted/50">
                                  <th className="px-4 py-3 text-left text-muted-foreground font-medium text-xs">Stat</th>
                                  <th className="px-4 py-3 text-center text-muted-foreground font-medium text-xs">
                                    {playersWithStats[0].name.split(' ').pop()}
                                  </th>
                                  <th className="px-4 py-3 text-center text-muted-foreground font-medium text-xs">
                                    {playersWithStats[1].name.split(' ').pop()}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b">
                                  <td className="px-4 py-3 text-foreground font-medium">Expected Goals</td>
                                  <td className="px-4 py-3 text-center text-foreground">{playersWithStats[0].expectedGoals.toFixed(2)}</td>
                                  <td className="px-4 py-3 text-center text-foreground">{playersWithStats[1].expectedGoals.toFixed(2)}</td>
                                </tr>
                                <tr className="border-b">
                                  <td className="px-4 py-3 text-foreground font-medium">Assists</td>
                                  <td className="px-4 py-3 text-center text-foreground">{playersWithStats[0].assists}</td>
                                  <td className="px-4 py-3 text-center text-foreground">{playersWithStats[1].assists}</td>
                                </tr>
                                <tr className="border-b">
                                  <td className="px-4 py-3 text-foreground font-medium">Goals</td>
                                  <td className="px-4 py-3 text-center text-foreground">{playersWithStats[0].goals}</td>
                                  <td className="px-4 py-3 text-center text-foreground">{playersWithStats[1].goals}</td>
                                </tr>
                                <tr className="border-b">
                                  <td className="px-4 py-3 text-foreground font-medium">Appearances</td>
                                  <td className="px-4 py-3 text-center text-foreground">{playersWithStats[0].appearances}</td>
                                  <td className="px-4 py-3 text-center text-foreground">{playersWithStats[1].appearances}</td>
                                </tr>
                                <tr className="border-b">
                                  <td className="px-4 py-3 text-foreground font-medium">Goal Involvements</td>
                                  <td className="px-4 py-3 text-center text-foreground">{playersWithStats[0].goalInvolvements}</td>
                                  <td className="px-4 py-3 text-center text-foreground">{playersWithStats[1].goalInvolvements}</td>
                                </tr>
                                <tr className="border-b">
                                  <td className="px-4 py-3 text-foreground font-medium">Avg Rating</td>
                                  <td className="px-4 py-3 text-center text-foreground">{playersWithStats[0].avgRating}</td>
                                  <td className="px-4 py-3 text-center text-foreground">{playersWithStats[1].avgRating}</td>
                                </tr>
                                <tr>
                                  <td className="px-4 py-3 text-foreground font-medium">Pass Acc</td>
                                  <td className="px-4 py-3 text-center text-foreground">{playersWithStats[0].passAcc}%</td>
                                  <td className="px-4 py-3 text-center text-foreground">{playersWithStats[1].passAcc}%</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          {/* Radar Charts */}
                          <div className="grid grid-cols-2 gap-6">
                            {playersWithStats.slice(0, 2).map((player, idx) => (
                              <div key={player.id} className="flex flex-col items-center">
                                <div className="text-sm font-medium mb-2">{player.name}</div>
                                <ResponsiveContainer width="100%" height={250}>
                                  <RadarChart data={player.radarData}>
                                    <PolarGrid />
                                    <PolarAngleAxis 
                                      dataKey="attribute" 
                                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                    />
                                    <PolarRadiusAxis 
                                      angle={90} 
                                      domain={[0, 10]} 
                                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                                    />
                                    <Radar
                                      name={player.name}
                                      dataKey="value"
                                      stroke={idx === 0 ? '#3b82f6' : '#22c55e'}
                                      fill={idx === 0 ? '#3b82f6' : '#22c55e'}
                                      fillOpacity={0.3}
                                    />
                                  </RadarChart>
                                </ResponsiveContainer>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  {message.content && (
                    <div
                      className={cn(
                        'rounded-lg px-4 py-2.5',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground ml-auto max-w-[45%]'
                          : 'bg-muted max-w-[50%]'
                      )}
                    >
                      {message.content}
                      {message.isStreaming && (
                        <span className="inline-block h-4 w-0.5 animate-pulse bg-current ml-1" />
                      )}
                    </div>
                  )}
                  {!message.content && message.isStreaming && (
                    <div
                      className={cn(
                        'rounded-lg px-4 py-2.5 bg-muted max-w-[50%]'
                      )}
                    >
                      <Loader />
                    </div>
                  )}
                </MessageContent>
              </Message>
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        {/* Input Area */}
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputTextarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything..."
            disabled={isTyping}
          />
          <PromptInputToolbar>
            <PromptInputTools>
              <PromptInputModelSelect
                value={selectedModel}
                onValueChange={setSelectedModel}
                disabled={isTyping}
              >
                <PromptInputModelSelectTrigger size="sm">
                  <PromptInputModelSelectValue />
                </PromptInputModelSelectTrigger>
                <PromptInputModelSelectContent>
                  {models.map((model) => (
                    <PromptInputModelSelectItem key={model.id} value={model.id}>
                      {model.name}
                    </PromptInputModelSelectItem>
                  ))}
                </PromptInputModelSelectContent>
              </PromptInputModelSelect>
              <PromptInputButton type="button" disabled={isTyping}>
                <PaperclipIcon className="size-4" />
                <span className="sr-only">Attach file</span>
              </PromptInputButton>
              <PromptInputButton type="button" disabled={isTyping}>
                <MicIcon className="size-4" />
                <span className="sr-only">Voice input</span>
              </PromptInputButton>
            </PromptInputTools>
            <PromptInputSubmit disabled={!inputValue.trim() || isTyping} />
          </PromptInputToolbar>
        </PromptInput>
        </div>
    </div>
  );
}

