import React, { useState, useEffect } from 'react';
import { habitsService } from '../../services/api';

const HabitForm = ({ onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'daily',
    targetDays: []
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDayChange = (dayValue) => {
    setFormData(prevState => {
      const currentDays = prevState.targetDays || [];
      const updatedDays = currentDays.includes(dayValue)
        ? currentDays.filter(day => day !== dayValue)
        : [...currentDays, dayValue].sort((a, b) => a - b);

      return {
        ...prevState,
        targetDays: updatedDays
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    habitsService.create(formData).then(
      () => alert("Habit submit.😻")
    );
    onSubmit(formData);
    if (!initialData) {
      setFormData({
        name: '',
        description: '',
        frequency: 'daily',
        targetDays: []
      });
    }
  };

  const daysOfWeek = [
    { value: 'Lunes', label: 'Lunes' },
    { value: 'Martes', label: 'Martes' },
    { value: 'Miércoles', label: 'Miércoles' },
    { value: 'Jueves', label: 'Jueves' },
    { value: 'Viernes', label: 'Viernes' },
    { value: 'Sábado', label: 'Sábado' },
    { value: 'Domingo', label: 'Domingo' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          New Habit
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter habit"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Describe your habit"
        />
      </div>

      <div>
        <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
          Frequency
        </label>
        <select
          id="frequency"
          name="frequency"
          value={formData.frequency}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Days of the Week
        </label>
        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="select-all-days"
              checked={formData.targetDays.length === daysOfWeek.length}
              onChange={() => {
                const allDayValues = daysOfWeek.map(day => day.value);
                setFormData(prevState => ({
                  ...prevState,
                  targetDays: prevState.targetDays.length === daysOfWeek.length ? [] : allDayValues
                }));
              }}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="select-all-days"
              className="ml-2 block text-sm text-gray-900 font-medium"
            >
              Select All Days
            </label>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {daysOfWeek.map(day => (
            <div key={day.value} className="flex items-center">
              <input
                type="checkbox"
                id={`day-${day.value}`}
                checked={formData.targetDays.includes(day.value)}
                onChange={() => handleDayChange(day.value)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor={`day-${day.value}`}
                className="ml-2 block text-sm text-gray-900"
              >
                {day.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {initialData ? 'Update Habit' : 'Create Habit'}
        </button>
      </div>
    </form>
  );
};

export default HabitForm;