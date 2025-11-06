import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Note {
  _id: string;
  title: string;
  content: string;
  summary?: string;
  createdAt: string;
  updatedAt: string;
}

interface NotesState {
  notes: Note[];
  currentNote: Note | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

const initialState: NotesState = {
  notes: [],
  currentNote: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get token from localStorage
const getToken = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user).token : null;
};

// Get all notes
export const getNotes = createAsyncThunk(
  'notes/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await axios.get('http://localhost:5000/api/notes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error fetching notes'
      );
    }
  }
);

// Create a note
export const createNote = createAsyncThunk(
  'notes/create',
  async (noteData: { title: string; content: string }, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await axios.post(
        'http://localhost:5000/api/notes',
        noteData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error creating note'
      );
    }
  }
);

// Update a note
export const updateNote = createAsyncThunk(
  'notes/update',
  async (
    { id, noteData }: { id: string; noteData: { title: string; content: string } },
    { rejectWithValue }
  ) => {
    try {
      const token = getToken();
      const response = await axios.put(
        `http://localhost:5000/api/notes/${id}`,
        noteData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error updating note'
      );
    }
  }
);

// Delete a note
export const deleteNote = createAsyncThunk(
  'notes/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const token = getToken();
      await axios.delete(`http://localhost:5000/api/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error deleting note'
      );
    }
  }
);

// Generate summary
export const generateSummary = createAsyncThunk(
  'notes/generateSummary',
  async (id: string, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await axios.post(
        `http://localhost:5000/api/notes/${id}/summarize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { id, summary: response.data.summary };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error generating summary'
      );
    }
  }
);

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    setCurrentNote: (state, action: PayloadAction<Note | null>) => {
      state.currentNote = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Notes
      .addCase(getNotes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNotes.fulfilled, (state, action: PayloadAction<Note[]>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notes = action.payload;
      })
      .addCase(getNotes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Create Note
      .addCase(createNote.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNote.fulfilled, (state, action: PayloadAction<Note>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notes.push(action.payload);
      })
      .addCase(createNote.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Update Note
      .addCase(updateNote.fulfilled, (state, action: PayloadAction<Note>) => {
        state.isLoading = false;
        state.notes = state.notes.map((note) =>
          note._id === action.payload._id ? action.payload : note
        );
        state.currentNote = action.payload;
      })
      // Delete Note
      .addCase(deleteNote.fulfilled, (state, action: PayloadAction<string>) => {
        state.notes = state.notes.filter((note) => note._id !== action.payload);
        if (state.currentNote?._id === action.payload) {
          state.currentNote = null;
        }
      })
      // Generate Summary
      .addCase(
        generateSummary.fulfilled,
        (state, action: PayloadAction<{ id: string; summary: string }>) => {
          const { id, summary } = action.payload;
          state.notes = state.notes.map((note) =>
            note._id === id ? { ...note, summary } : note
          );
          if (state.currentNote?._id === id) {
            state.currentNote = {
              ...state.currentNote,
              summary,
            };
          }
        }
      );
  },
});

export const { reset, setCurrentNote } = notesSlice.actions;
export default notesSlice.reducer;
