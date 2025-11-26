import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Trophy, Flame, Target, Award, Plus, Zap, Activity, X, Check, History, BarChart3, Download, Calendar, Filter } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import CustomSelect from '../components/CustomSelect';
import { usePageTitle } from '../hooks/usePageTitle';
import { useMetaTags } from '../hooks/useMetaTags';

interface Workout {
  id: string;
  type: string;
  duration: number; // in minutes
  intensity: 'low' | 'medium' | 'high';
  date: string;
  points: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
}

const WORKOUT_TYPES = [
  'Cardio',
  'Strength Training',
  'Yoga',
  'Running',
  'Cycling',
  'Swimming',
  'HIIT',
  'Walking',
  'Dance',
  'Other'
];

const INTENSITY_POINTS = {
  low: 10,
  medium: 20,
  high: 30
};

const WORKOUT_TEMPLATES = [
  { name: 'Quick Cardio', type: 'Cardio', duration: 20, intensity: 'medium' as const },
  { name: 'Morning Run', type: 'Running', duration: 30, intensity: 'medium' as const },
  { name: 'Strength Session', type: 'Strength Training', duration: 45, intensity: 'high' as const },
  { name: 'Yoga Flow', type: 'Yoga', duration: 30, intensity: 'low' as const },
  { name: 'HIIT Workout', type: 'HIIT', duration: 20, intensity: 'high' as const },
  { name: 'Evening Walk', type: 'Walking', duration: 30, intensity: 'low' as const },
  { name: 'Cycling', type: 'Cycling', duration: 45, intensity: 'medium' as const },
  { name: 'Swimming', type: 'Swimming', duration: 30, intensity: 'high' as const }
];

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first', name: 'First Steps', description: 'Complete your first workout', icon: '🎯', unlocked: false },
  { id: 'streak3', name: 'On Fire', description: '3-day workout streak', icon: '🔥', unlocked: false },
  { id: 'streak7', name: 'Week Warrior', description: '7-day workout streak', icon: '💪', unlocked: false },
  { id: 'streak30', name: 'Month Master', description: '30-day workout streak', icon: '👑', unlocked: false },
  { id: 'workouts10', name: 'Getting Started', description: 'Complete 10 workouts', icon: '⭐', unlocked: false },
  { id: 'workouts50', name: 'Dedicated', description: 'Complete 50 workouts', icon: '🏆', unlocked: false },
  { id: 'workouts100', name: 'Centurion', description: 'Complete 100 workouts', icon: '💎', unlocked: false },
  { id: 'level5', name: 'Rising Star', description: 'Reach Level 5', icon: '🌟', unlocked: false },
  { id: 'level10', name: 'Elite', description: 'Reach Level 10', icon: '⚡', unlocked: false },
  { id: 'points1000', name: 'Point Collector', description: 'Earn 1000 points', icon: '💰', unlocked: false }
];

function calculateLevel(points: number): number {
  return Math.floor(points / 100) + 1;
}

function calculatePointsToNextLevel(points: number): number {
  const currentLevel = calculateLevel(points);
  const pointsForNextLevel = currentLevel * 100;
  return Math.max(0, pointsForNextLevel - points);
}

function calculateProgressPercentage(points: number): number {
  const pointsInCurrentLevel = points % 100;
  return (pointsInCurrentLevel / 100) * 100;
}

function calculateStreak(workouts: Workout[]): number {
  if (workouts.length === 0) return 0;
  
  const sortedWorkouts = [...workouts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let checkDate = new Date(today);
  
  for (const workout of sortedWorkouts) {
    const workoutDate = new Date(workout.date);
    workoutDate.setHours(0, 0, 0, 0);
    
    if (workoutDate.getTime() === checkDate.getTime()) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (workoutDate.getTime() < checkDate.getTime()) {
      break;
    }
  }
  
  return streak;
}

export default function FitQuest() {
  usePageTitle('FitQuest - Gamified Fitness Tracker');
  
  useMetaTags({
    title: 'FitQuest - Gamified Fitness Tracker | ShalConnects',
    description: 'Track your workouts, earn points, level up, and unlock achievements with FitQuest. A free gamified fitness tracker that makes working out fun and engaging.',
    keywords: 'fitness tracker, workout tracker, gamified fitness, exercise tracker, fitness app, workout app, fitness gamification',
    ogTitle: 'FitQuest - Gamified Fitness Tracker',
    ogDescription: 'Track your workouts, earn points, level up, and unlock achievements. Make fitness fun with FitQuest.',
    ogImage: '/logo.png',
    twitterTitle: 'FitQuest - Gamified Fitness Tracker',
    twitterDescription: 'Track your workouts, earn points, level up, and unlock achievements. Make fitness fun with FitQuest.',
    twitterImage: '/logo.png'
  });
  
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [newAchievement, setNewAchievement] = useState<string | null>(null);
  const [newWorkout, setNewWorkout] = useState({
    type: 'Cardio',
    duration: 30,
    intensity: 'medium' as 'low' | 'medium' | 'high'
  });
  const [formErrors, setFormErrors] = useState<{ duration?: string }>({});
  const [showHistory, setShowHistory] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'week' | 'month' | 'year'>('all');
  const [historyTypeFilter, setHistoryTypeFilter] = useState<string>('all');
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedWorkouts = localStorage.getItem('fitquest-workouts');
    const savedAchievements = localStorage.getItem('fitquest-achievements');
    
    if (savedWorkouts) {
      setWorkouts(JSON.parse(savedWorkouts));
    }
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    }
  }, []);

  // Memoize calculations
  const totalPoints = useMemo(() => workouts.reduce((sum, w) => sum + w.points, 0), [workouts]);
  const level = useMemo(() => calculateLevel(totalPoints), [totalPoints]);
  const pointsToNext = useMemo(() => calculatePointsToNextLevel(totalPoints), [totalPoints]);
  const streak = useMemo(() => calculateStreak(workouts), [workouts]);
  const unlockedAchievements = useMemo(() => achievements.filter(a => a.unlocked).length, [achievements]);
  const recentWorkouts = useMemo(() => workouts.slice(0, 5), [workouts]);
  const progressPercentage = useMemo(() => calculateProgressPercentage(totalPoints), [totalPoints]);

  useEffect(() => {
    if (workouts.length > 0) {
      localStorage.setItem('fitquest-workouts', JSON.stringify(workouts));
    }
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('fitquest-achievements', JSON.stringify(achievements));
  }, [achievements]);

  // Define cancelEdit before useEffects that use it
  const cancelEdit = useCallback(() => {
    setEditingWorkout(null);
    setShowAddWorkout(false);
    setNewWorkout({ type: 'Cardio', duration: 30, intensity: 'medium' });
    setFormErrors({});
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showAddWorkout) {
        cancelEdit();
      }
    };

    if (showAddWorkout) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [showAddWorkout, cancelEdit]);

  useEffect(() => {
    if (workouts.length === 0) return;
    
    const totalPoints = workouts.reduce((sum, w) => sum + w.points, 0);
    const totalWorkouts = workouts.length;
    const currentStreak = calculateStreak(workouts);
    const currentLevel = calculateLevel(totalPoints);
    
    setAchievements(prev => {
      const previousUnlocked = prev.filter(a => a.unlocked).length;
      let newlyUnlockedId: string | null = null;
      
      const updated = prev.map(ach => {
        if (ach.unlocked) return ach;
        
        let shouldUnlock = false;
        
        switch (ach.id) {
          case 'first':
            shouldUnlock = totalWorkouts >= 1;
            break;
          case 'streak3':
            shouldUnlock = currentStreak >= 3;
            break;
          case 'streak7':
            shouldUnlock = currentStreak >= 7;
            break;
          case 'streak30':
            shouldUnlock = currentStreak >= 30;
            break;
          case 'workouts10':
            shouldUnlock = totalWorkouts >= 10;
            break;
          case 'workouts50':
            shouldUnlock = totalWorkouts >= 50;
            break;
          case 'workouts100':
            shouldUnlock = totalWorkouts >= 100;
            break;
          case 'level5':
            shouldUnlock = currentLevel >= 5;
            break;
          case 'level10':
            shouldUnlock = currentLevel >= 10;
            break;
          case 'points1000':
            shouldUnlock = totalPoints >= 1000;
            break;
        }
        
        if (shouldUnlock) {
          newlyUnlockedId = ach.id;
          return {
            ...ach,
            unlocked: true,
            unlockedDate: new Date().toISOString()
          };
        }
        
        return ach;
      });
      
      const currentUnlocked = updated.filter(a => a.unlocked).length;
      if (currentUnlocked > previousUnlocked && newlyUnlockedId) {
        setNewAchievement(newlyUnlockedId);
        setTimeout(() => setNewAchievement(null), 3000);
      }
      
      return updated;
    });
  }, [workouts]);

  const validateForm = (): boolean => {
    const errors: { duration?: string } = {};
    if (newWorkout.duration < 1) {
      errors.duration = 'Duration must be at least 1 minute';
    } else if (newWorkout.duration > 600) {
      errors.duration = 'Duration cannot exceed 600 minutes';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addWorkout = () => {
    if (!validateForm()) return;
    
    const points = INTENSITY_POINTS[newWorkout.intensity] + Math.floor(newWorkout.duration / 10);
    const workout: Workout = {
      id: Date.now().toString(),
      type: newWorkout.type,
      duration: newWorkout.duration,
      intensity: newWorkout.intensity,
      date: new Date().toISOString().split('T')[0],
      points
    };
    
    const previousLevel = level;
    setWorkouts([workout, ...workouts]);
    setShowAddWorkout(false);
    setNewWorkout({ type: 'Cardio', duration: 30, intensity: 'medium' });
    setFormErrors({});
    
    // Check for level up
    setTimeout(() => {
      const newLevel = calculateLevel(totalPoints + points);
      if (newLevel > previousLevel) {
        // Level up animation handled by progress bar
      }
    }, 100);
  };

  const updateWorkout = (id: string) => {
    if (!validateForm()) return;
    
    const points = INTENSITY_POINTS[newWorkout.intensity] + Math.floor(newWorkout.duration / 10);
    setWorkouts(workouts.map(w => 
      w.id === id 
        ? { ...w, ...newWorkout, points }
        : w
    ));
    setEditingWorkout(null);
    setNewWorkout({ type: 'Cardio', duration: 30, intensity: 'medium' });
    setFormErrors({});
  };

  const startEditWorkout = (workout: Workout) => {
    setEditingWorkout(workout.id);
    setNewWorkout({
      type: workout.type,
      duration: workout.duration,
      intensity: workout.intensity
    });
    setShowAddWorkout(true);
  };

  const confirmDeleteWorkout = (id: string) => {
    setWorkouts(workouts.filter(w => w.id !== id));
    setDeleteConfirmId(null);
  };

  const useTemplate = (template: typeof WORKOUT_TEMPLATES[0]) => {
    setNewWorkout({
      type: template.type,
      duration: template.duration,
      intensity: template.intensity
    });
    setShowAddWorkout(true);
  };

  const exportData = (format: 'json' | 'csv') => {
    if (format === 'json') {
      const data = {
        workouts,
        achievements,
        exportDate: new Date().toISOString(),
        stats: {
          totalPoints,
          level,
          streak,
          totalWorkouts: workouts.length
        }
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fitquest-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const headers = ['Date', 'Type', 'Duration (min)', 'Intensity', 'Points'];
      const rows = workouts.map(w => [
        w.date,
        w.type,
        w.duration.toString(),
        w.intensity,
        w.points.toString()
      ]);
      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fitquest-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const getFilteredWorkouts = useMemo(() => {
    let filtered = [...workouts];
    
    // Date filter
    const now = new Date();
    if (historyFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(w => new Date(w.date) >= weekAgo);
    } else if (historyFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(w => new Date(w.date) >= monthAgo);
    } else if (historyFilter === 'year') {
      const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(w => new Date(w.date) >= yearAgo);
    }
    
    // Type filter
    if (historyTypeFilter !== 'all') {
      filtered = filtered.filter(w => w.type === historyTypeFilter);
    }
    
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [workouts, historyFilter, historyTypeFilter]);

  // Format filter labels for display
  const timeFilterOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' },
    { value: 'year', label: 'Last Year' }
  ];
  
  const workoutTypeFilterOptions = [
    { value: 'all', label: 'All Types' },
    ...WORKOUT_TYPES.map(type => ({ value: type, label: type }))
  ];
  
  const getTimeFilterLabel = (value: string) => {
    return timeFilterOptions.find(opt => opt.value === value)?.label || value;
  };
  
  const getWorkoutTypeFilterLabel = (value: string) => {
    return workoutTypeFilterOptions.find(opt => opt.value === value)?.label || value;
  };

  const getStatistics = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const weekly = workouts.filter(w => new Date(w.date) >= weekAgo);
    const monthly = workouts.filter(w => new Date(w.date) >= monthAgo);
    
    const weeklyStats = {
      workouts: weekly.length,
      totalPoints: weekly.reduce((sum, w) => sum + w.points, 0),
      totalDuration: weekly.reduce((sum, w) => sum + w.duration, 0),
      avgDuration: weekly.length > 0 ? Math.round(weekly.reduce((sum, w) => sum + w.duration, 0) / weekly.length) : 0
    };
    
    const monthlyStats = {
      workouts: monthly.length,
      totalPoints: monthly.reduce((sum, w) => sum + w.points, 0),
      totalDuration: monthly.reduce((sum, w) => sum + w.duration, 0),
      avgDuration: monthly.length > 0 ? Math.round(monthly.reduce((sum, w) => sum + w.duration, 0) / monthly.length) : 0
    };
    
    // Workout type distribution
    const typeDistribution = workouts.reduce((acc, w) => {
      acc[w.type] = (acc[w.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return { weekly: weeklyStats, monthly: monthlyStats, typeDistribution };
  }, [workouts]);

  return (
    <PageLayout title="FitQuest">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            FitQuest
          </h1>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg px-2">
            Gamify your fitness journey with points, levels, and achievements
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6">
          <div className="bg-gray-800/50 p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" />
              <h3 className="text-sm sm:text-base font-semibold truncate">Level {level}</h3>
            </div>
            <p className="text-gray-400 text-xs mb-1 sm:mb-1.5 line-clamp-2">{pointsToNext} points to next level</p>
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="bg-gray-800/50 p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
              <h3 className="text-sm sm:text-base font-semibold truncate">{totalPoints}</h3>
            </div>
            <p className="text-gray-400 text-xs">Total Points</p>
          </div>

          <div className="bg-gray-800/50 p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border border-gray-700/50 hover:border-orange-500/50 transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 flex-shrink-0" />
              <h3 className="text-sm sm:text-base font-semibold truncate">{streak}</h3>
            </div>
            <p className="text-gray-400 text-xs">Day Streak</p>
          </div>

          <div className="bg-gray-800/50 p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
              <h3 className="text-sm sm:text-base font-semibold truncate">{unlockedAchievements}/{achievements.length}</h3>
            </div>
            <p className="text-gray-400 text-xs">Achievements</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-4 sm:mb-6 md:mb-8 flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center">
          <button
            onClick={() => setShowAddWorkout(true)}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-2 sm:py-2.5 md:py-3 px-4 sm:px-5 md:px-6 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base"
            aria-label="Add new workout"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
            <span className="hidden sm:inline">Add Workout</span>
            <span className="sm:hidden">Add</span>
          </button>
          <button
            onClick={() => { setShowHistory(!showHistory); setShowStats(false); }}
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 sm:py-2.5 md:py-3 px-4 sm:px-5 md:px-6 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base"
            aria-label="View workout history"
            aria-expanded={showHistory}
          >
            <History className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
            History
          </button>
          <button
            onClick={() => { setShowStats(!showStats); setShowHistory(false); }}
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 sm:py-2.5 md:py-3 px-4 sm:px-5 md:px-6 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base"
            aria-label="View statistics"
            aria-expanded={showStats}
          >
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
            <span className="hidden sm:inline">Statistics</span>
            <span className="sm:hidden">Stats</span>
          </button>
          <div className="relative group">
            <button
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 sm:py-2.5 md:py-3 px-4 sm:px-5 md:px-6 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              Export
            </button>
            <div className="absolute top-full left-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={() => exportData('json')}
                className="block w-full text-left px-4 py-2 hover:bg-gray-700 text-white text-sm whitespace-nowrap"
              >
                Export as JSON
              </button>
              <button
                onClick={() => exportData('csv')}
                className="block w-full text-left px-4 py-2 hover:bg-gray-700 text-white text-sm whitespace-nowrap"
              >
                Export as CSV
              </button>
            </div>
          </div>
        </div>


        {/* Achievement Unlock Notification */}
        {newAchievement && (
          <div className="fixed top-16 sm:top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down px-4 w-full max-w-sm">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl shadow-2xl border-2 border-green-400 flex items-center gap-2 sm:gap-3">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 animate-bounce flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-bold text-sm sm:text-base">Achievement Unlocked!</div>
                <div className="text-xs sm:text-sm opacity-90 truncate">
                  {achievements.find(a => a.id === newAchievement)?.name}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Dialog for Add/Edit Workout */}
        {showAddWorkout && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4" onClick={cancelEdit}>
            <div 
              className="bg-gray-800 border border-gray-700 rounded-lg sm:rounded-xl shadow-2xl w-full max-w-md animate-fade-in max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              ref={popoverRef}
            >
              <div className="p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {editingWorkout ? 'Edit Workout' : 'Log New Workout'}
                  </h3>
                  <button
                    onClick={cancelEdit}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Close form"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <CustomSelect
                      label="Workout Type"
                      value={newWorkout.type}
                      onChange={(value) => setNewWorkout({ ...newWorkout, type: value })}
                      options={WORKOUT_TYPES}
                      ariaLabel="Workout type"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-gray-300">Duration (minutes)</label>
                    <input
                      type="number"
                      min="1"
                      max="600"
                      value={newWorkout.duration}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        if (value >= 0 && value <= 600) {
                          setNewWorkout({ ...newWorkout, duration: value });
                          setFormErrors({});
                        }
                      }}
                      className={`w-full bg-gray-700 border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 ${
                        formErrors.duration 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-600 focus:ring-green-500'
                      }`}
                      aria-label="Workout duration in minutes"
                      aria-invalid={!!formErrors.duration}
                      aria-describedby={formErrors.duration ? 'duration-error' : undefined}
                    />
                    {formErrors.duration && (
                      <p id="duration-error" className="text-red-400 text-sm mt-1" role="alert">{formErrors.duration}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-gray-300">Intensity</label>
                    <div className="flex gap-2 sm:gap-3">
                      {(['low', 'medium', 'high'] as const).map(intensity => {
                        const colors = {
                          low: 'bg-green-500/20 border-green-500/50 text-green-400',
                          medium: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
                          high: 'bg-red-500/20 border-red-500/50 text-red-400'
                        };
                        return (
                          <label 
                            key={intensity} 
                            className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 cursor-pointer px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 rounded-lg border-2 transition-all text-xs sm:text-sm ${
                              newWorkout.intensity === intensity 
                                ? colors[intensity] 
                                : 'border-gray-600 text-gray-400 hover:border-gray-500'
                            }`}
                          >
                            <input
                              type="radio"
                              name="intensity"
                              value={intensity}
                              checked={newWorkout.intensity === intensity}
                              onChange={() => setNewWorkout({ ...newWorkout, intensity })}
                              className="w-3 h-3 sm:w-4 sm:h-4"
                            />
                            <span className="capitalize font-medium">{intensity}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex gap-2 sm:gap-3 pt-2">
                    <button
                      onClick={editingWorkout ? () => updateWorkout(editingWorkout) : addWorkout}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg transition-colors flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base"
                    >
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">{editingWorkout ? 'Update Workout' : 'Save Workout'}</span>
                      <span className="sm:hidden">{editingWorkout ? 'Update' : 'Save'}</span>
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg transition-colors flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base"
                    >
                      <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History View */}
        {showHistory && (
          <div className="bg-gray-800/50 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border border-gray-700/50 mb-4 sm:mb-6 md:mb-8">
            <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-1.5 sm:gap-2">
                <History className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-400" />
                <span className="hidden sm:inline">Workout History</span>
                <span className="sm:hidden">History</span>
              </h2>
              <button
                onClick={() => setShowHistory(false)}
                className="text-gray-400 hover:text-white p-1"
                aria-label="Close history"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0 sm:min-w-[200px]">
                <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-400 whitespace-nowrap">Time:</span>
                <div className="flex-1 min-w-0">
                  <CustomSelect
                    value={getTimeFilterLabel(historyFilter)}
                    onChange={(value) => {
                      const option = timeFilterOptions.find(opt => opt.label === value);
                      if (option) {
                        setHistoryFilter(option.value as any);
                      }
                    }}
                    options={timeFilterOptions.map(opt => opt.label)}
                    placeholder="Select time period"
                    className="w-full"
                    ariaLabel="Filter by time period"
                  />
                </div>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0 sm:min-w-[200px]">
                <span className="text-xs sm:text-sm text-gray-400 whitespace-nowrap">Type:</span>
                <div className="flex-1 min-w-0">
                  <CustomSelect
                    value={getWorkoutTypeFilterLabel(historyTypeFilter)}
                    onChange={(value) => {
                      const option = workoutTypeFilterOptions.find(opt => opt.label === value);
                      if (option) {
                        setHistoryTypeFilter(option.value);
                      }
                    }}
                    options={workoutTypeFilterOptions.map(opt => opt.label)}
                    placeholder="Select workout type"
                    className="w-full"
                    ariaLabel="Filter by workout type"
                  />
                </div>
              </div>
            </div>

            {/* Workout List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {getFilteredWorkouts.length === 0 ? (
                <div className="text-center py-12">
                  <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
                  <p className="text-gray-400 text-lg">No workouts found</p>
                </div>
              ) : (
                getFilteredWorkouts.map(workout => {
                  const intensityColors = {
                    low: 'bg-green-500/20 text-green-400 border-green-500/30',
                    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
                    high: 'bg-red-500/20 text-red-400 border-red-500/30'
                  };
                  return (
                    <div 
                      key={workout.id} 
                      className="bg-gray-700/50 p-4 rounded-lg flex items-center justify-between hover:bg-gray-700/70 transition-all duration-200 group border border-gray-600/50"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-white mb-1">{workout.type}</div>
                        <div className="flex items-center gap-3 text-sm text-gray-400 mb-1">
                          <span>{workout.duration} min</span>
                          <span>•</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${intensityColors[workout.intensity]}`}>
                            {workout.intensity}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">{new Date(workout.date).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <div className="text-green-400 font-bold">+{workout.points}</div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => { startEditWorkout(workout); setShowHistory(false); }}
                            className="text-blue-400 hover:text-blue-300 p-1.5 hover:bg-blue-500/10 rounded transition-colors"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(workout.id)}
                            className="text-red-400 hover:text-red-300 p-1.5 hover:bg-red-500/10 rounded transition-colors"
                            title="Delete"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Statistics View */}
        {showStats && (
          <div className="bg-gray-800/50 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border border-gray-700/50 mb-4 sm:mb-6 md:mb-8">
            <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-1.5 sm:gap-2">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-400" />
                Statistics
              </h2>
              <button
                onClick={() => setShowStats(false)}
                className="text-gray-400 hover:text-white p-1"
                aria-label="Close statistics"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
              {/* Weekly Stats */}
              <div className="bg-gray-700/50 p-4 sm:p-5 md:p-6 rounded-lg border border-gray-600/50">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  Last 7 Days
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Workouts:</span>
                    <span className="font-semibold text-white">{getStatistics.weekly.workouts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Points:</span>
                    <span className="font-semibold text-green-400">{getStatistics.weekly.totalPoints}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Duration:</span>
                    <span className="font-semibold text-white">{getStatistics.weekly.totalDuration} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg Duration:</span>
                    <span className="font-semibold text-white">{getStatistics.weekly.avgDuration} min</span>
                  </div>
                </div>
              </div>

              {/* Monthly Stats */}
              <div className="bg-gray-700/50 p-4 sm:p-5 md:p-6 rounded-lg border border-gray-600/50">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                  Last 30 Days
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Workouts:</span>
                    <span className="font-semibold text-white">{getStatistics.monthly.workouts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Points:</span>
                    <span className="font-semibold text-green-400">{getStatistics.monthly.totalPoints}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Duration:</span>
                    <span className="font-semibold text-white">{getStatistics.monthly.totalDuration} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg Duration:</span>
                    <span className="font-semibold text-white">{getStatistics.monthly.avgDuration} min</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Workout Type Distribution */}
            <div className="bg-gray-700/50 p-4 sm:p-5 md:p-6 rounded-lg border border-gray-600/50">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Workout Type Distribution</h3>
              <div className="space-y-2 sm:space-y-3">
                {Object.entries(getStatistics.typeDistribution)
                  .sort(([, a], [, b]) => b - a)
                  .map(([type, count]) => {
                    const percentage = (count / workouts.length) * 100;
                    return (
                      <div key={type}>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-300">{type}</span>
                          <span className="text-gray-400">{count} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {!showHistory && !showStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {/* Recent Workouts */}
          <div className="bg-gray-800/50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-700/50 flex flex-col h-[400px] sm:h-[450px] md:h-[500px]">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <Activity className="w-4 h-4 text-green-400 flex-shrink-0" />
              <h2 className="text-base sm:text-lg font-bold">Recent Workouts</h2>
            </div>
            {recentWorkouts.length === 0 ? (
              <div className="text-center py-8 flex-1 flex flex-col items-center justify-center">
                <Activity className="w-12 h-12 text-gray-600 mb-3 opacity-50" />
                <p className="text-gray-400 text-sm font-medium mb-1">No workouts yet</p>
                <p className="text-gray-500 text-xs">Add your first workout to start!</p>
              </div>
            ) : (
              <div className="space-y-2 flex-1 overflow-y-auto">
                {recentWorkouts.map(workout => {
                  const intensityColors = {
                    low: 'bg-green-500/20 text-green-400 border-green-500/30',
                    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
                    high: 'bg-red-500/20 text-red-400 border-red-500/30'
                  };
                  return (
                    <div 
                      key={workout.id} 
                      className="bg-gray-700/50 p-2.5 rounded-lg flex items-center justify-between hover:bg-gray-700/70 transition-all duration-200 group border border-gray-600/50 hover:border-gray-500"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white text-sm mb-0.5 truncate">{workout.type}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-0.5">
                          <span>{workout.duration} min</span>
                          <span>•</span>
                          <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium border ${intensityColors[workout.intensity]}`}>
                            {workout.intensity}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">{new Date(workout.date).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right flex items-center gap-2 ml-2">
                        <div className="text-green-400 font-bold text-sm">+{workout.points}</div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEditWorkout(workout)}
                            className="text-blue-400 hover:text-blue-300 p-1 hover:bg-blue-500/10 rounded transition-colors"
                            title="Edit workout"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(workout.id)}
                            className="text-red-400 hover:text-red-300 p-1 hover:bg-red-500/10 rounded transition-colors"
                            title="Delete workout"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* Delete Confirmation Modal */}
            {deleteConfirmId && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
                <div className="bg-gray-800 border border-gray-700 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 max-w-md w-full animate-fade-in">
                  <h3 className="text-lg sm:text-xl font-bold mb-2">Delete Workout?</h3>
                  <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-5 md:mb-6">
                    Are you sure you want to delete this workout? This action cannot be undone.
                  </p>
                  <div className="flex gap-2 sm:gap-3 md:gap-4">
                    <button
                      onClick={() => confirmDeleteWorkout(deleteConfirmId)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg transition-colors text-sm sm:text-base"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg transition-colors text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Achievements */}
          <div className="bg-gray-800/50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-700/50 flex flex-col h-[400px] sm:h-[450px] md:h-[500px]">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <Target className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <h2 className="text-base sm:text-lg font-bold">Achievements</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-1.5 sm:gap-2 flex-1 overflow-y-auto">
              {achievements.map(achievement => (
                <div
                  key={achievement.id}
                  className={`p-2.5 rounded-lg border-2 transition-all cursor-default ${
                    achievement.unlocked
                      ? 'bg-green-500/10 border-green-500/50 hover:bg-green-500/20 hover:scale-105 hover:shadow-lg'
                      : 'bg-gray-700/30 border-gray-600/50 opacity-60'
                  } ${newAchievement === achievement.id ? 'animate-pulse ring-2 ring-green-400' : ''}`}
                >
                  <div className={`text-2xl mb-1 ${achievement.unlocked ? '' : 'grayscale'}`}>
                    {achievement.icon}
                  </div>
                  <div className={`font-semibold text-xs ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`}>
                    {achievement.name}
                  </div>
                  <div className="text-xs text-gray-400 leading-tight">{achievement.description}</div>
                  {achievement.unlocked && achievement.unlockedDate && (
                    <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
                      <Check className="w-2.5 h-2.5" />
                      {new Date(achievement.unlockedDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        )}
      </div>
    </PageLayout>
  );
}

