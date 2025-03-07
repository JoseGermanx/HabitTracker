import React from 'react';

const Statistics = ({ habits }) => {
  const calculateCompletionRate = () => {
    if (habits.length === 0) return 0;
    const completedHabits = habits.filter(habit => habit.progress >= habit.target);
    return (completedHabits.length / habits.length) * 100;
  };

  const calculateAverageProgress = () => {
    if (habits.length === 0) return 0;
    const totalProgress = habits.reduce((sum, habit) => {
      const progressPercentage = (habit.progress / habit.target) * 100;
      return sum + progressPercentage;
    }, 0);
    return totalProgress / habits.length;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Statistics</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Total Habits</h3>
          <p className="text-3xl font-bold text-indigo-600">{habits.length}</p>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Completion Rate</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {calculateCompletionRate().toFixed(1)}%
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Average Progress</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {calculateAverageProgress().toFixed(1)}%
          </p>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Habit Breakdown</h3>
          <div className="space-y-4">
            {habits.map(habit => (
              <div key={habit.id} className="flex items-center justify-between">
                <span className="text-gray-600">{habit.name}</span>
                <span className="text-indigo-600 font-medium">
                  {((habit.progress / habit.target) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;