import { useEffect, useState } from 'react';
import HabitList from '../habits/HabitList';
import HabitForm from '../habits/HabitForm';
import Statistics from '../statistics/Statistics';
import { useAuth } from '../../contexts/AuthContext';
import { habitsService } from '../../services/api';
import { useNavigate } from 'react-router'

const Dashboard = () => {
  const [habits, setHabits] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const { logout } = useAuth()
  const navigate = useNavigate()
  const fetchHabits = async () => {
    try {
      const response = await habitsService.getAll()
      setHabits(response);
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
  };

  const addHabit = (habit) => {
    setHabits([...habits, { ...habit, id: Date.now(), progress: 0 }]);
    setShowForm(false);
  };

  const updateHabitProgress = (habitId, body) => {
   habitsService.toggleComplete(habitId, body).then(()=> {
    alert("Bien hecho")
   })
  };

  const deleteHabit = (habitId) => {
    habitsService.delete(habitId).then(()=> {
      alert("Habit ", habitId, " eliminado.")
      navigate(0)
    })
    
  };

useEffect(() => {
    fetchHabits();
}, []);
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-4 sm:p-6 lg:p-8">
      <button className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" onClick={logout} >Logout</button>
      <div className="container mx-auto bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 transition-all duration-300 hover:shadow-3xl">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">Your Habits</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            {showForm ? 'Close' : '✨ Add New Habit'}
          </button>
        </div>

        {showForm && (
          <div className="mb-8 transform transition-all duration-300 ease-in-out">
            <HabitForm onSubmit={addHabit} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-white/60">
            <HabitList
              habits={habits}
              onToggle={updateHabitProgress}
              onDelete={deleteHabit}
            />
          </div>
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-white/60">
            <Statistics habits={habits} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;