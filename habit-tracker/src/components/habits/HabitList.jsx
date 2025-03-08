import React from 'react';
import { FaCheck, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const HabitList = ({ habits, onToggle, onEdit, onDelete }) => {
  const isToday = (targetDays) => {
    const weekdays = {
      'Mon': 'Lunes',
      'Tue': 'Martes',
      'Wed': 'Miércoles',
      'Thu': 'Jueves',
      'Fri': 'Viernes',
      'Sat': 'Sábado',
      'Sun': 'Domingo'
    };
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    return targetDays.includes(weekdays[today]);
  };

  const isTodayCompleted = (progress) => {
    const today = new Date();
    return progress.some(p => 
      new Date(p.date).toDateString() === today.toDateString() && p.completed
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      {habits.map((habit) => (
        <div
          key={habit._id}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{habit.name}</h3>
              <p className="text-sm text-gray-600">{habit.description}</p>
            </div>
            <div className="flex space-x-2">
              {isToday(habit.targetDays) && (
                <button
                  onClick={() => onToggle(habit._id, {
                      date: new Date().toISOString(),
                      completed: !isTodayCompleted(habit.progress),
                      notes: ""
                    
                  })}
                  className={`p-2 rounded-full ${isTodayCompleted(habit.progress)
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-600'
                  } hover:bg-opacity-80 transition-colors`}
                  title={isTodayCompleted(habit.progress) ? "Completed today" : "Mark as completed for today"}
                >
                  {isTodayCompleted(habit.progress) ? <FaCheck /> : <FaPlus />}
                </button>
              )}
              <button
                onClick={() => onEdit(habit)}
                className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-opacity-80 transition-colors"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => onDelete(habit._id)}
                className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-opacity-80 transition-colors"
              >
                <FaTrash />
              </button>
            </div>
          </div>
          <div className=" flex flex-col text-sm text-gray-500">
            <div className='flex'>
              <span className="font-medium">Frequency: </span><strong className='mx-1'>{habit.frequency}</strong>
            </div>
            <div className='flex'>
              <span className="font-medium">Target:</span>
              <div className='flex flex-wrap'>
                {habit.targetDays && habit.targetDays.map((day, index) => (
                  <p className='mx-0.5' key={index}>{day}</p>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{
                width: `${(habit.progress / habit.target) * 100}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default HabitList;