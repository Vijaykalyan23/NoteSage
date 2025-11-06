const Note = require('../models/Note');
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// @desc    Get user's notes
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = new Note({
      userId: req.user.id,
      title,
      content,
    });

    const createdNote = await note.save();
    res.status(201).json(createdNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check if user owns the note
    if (note.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this note' });
    }

    note.title = title || note.title;
    note.content = content || note.content;
    note.updatedAt = Date.now();

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check if user owns the note
    if (note.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this note' });
    }

    await note.remove();
    res.json({ id: req.params.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Generate AI summary for a note
// @route   POST /api/notes/:id/summarize
// @access  Private
const generateSummary = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check if user owns the note
    if (note.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to access this note' });
    }

    // Generate summary using OpenAI
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes text."
        },
        {
          role: "user",
          content: `Please provide a concise summary of the following text in 2-3 sentences:\n\n${note.content}`
        }
      ],
      temperature: 0.5,
      max_tokens: 150,
    });

    const summary = response.data.choices[0].message.content.trim();
    
    // Update the note with the generated summary
    note.summary = summary;
    await note.save();

    res.json({ summary });
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Error generating summary',
      error: error.response?.data?.error?.message || error.message 
    });
  }
};

module.exports = {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  generateSummary,
};
