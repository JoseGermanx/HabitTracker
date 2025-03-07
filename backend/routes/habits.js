const express = require('express');
const Habit = require('../models/Habit');
const auth = require('../middleware/auth');
const router = express.Router();

// Create a new habit
router.post('/', auth, async (req, res) => {
  try {
    const habit = new Habit({
      ...req.body,
      user: req.user._id
    });
    await habit.save();
    res.status(201).json(habit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all habits for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific habit by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a habit
router.patch('/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'description', 'frequency', 'targetDays', 'reminderTime', 'active'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates' });
  }

  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    updates.forEach(update => habit[update] = req.body[update]);
    await habit.save();
    res.json(habit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a habit
router.delete('/:id', auth, async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    res.json({ message: 'Habit deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update habit progress
router.post('/:id/progress', auth, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const { date, completed, notes } = req.body;
    const progressDate = new Date(date);
    
    // Find existing progress entry for the date
    const existingProgress = habit.progress.find(p => 
      p.date.toDateString() === progressDate.toDateString()
    );

    if (existingProgress) {
      existingProgress.completed = completed;
      existingProgress.notes = notes;
    } else {
      habit.progress.push({ date: progressDate, completed, notes });
    }

    await habit.save();
    res.json(habit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get habit statistics
router.get('/:id/stats', auth, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const currentStreak = habit.getCurrentStreak();
    const totalCompletions = habit.progress.filter(p => p.completed).length;
    const completionRate = totalCompletions / habit.progress.length || 0;

    res.json({
      currentStreak,
      totalCompletions,
      completionRate: Math.round(completionRate * 100) / 100
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;