import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { tableApi } from "@/app/lib/api/tableApi";
import { sessionApi } from "@/app/lib/api/sessionApi";
import { orderApi } from "@/app/lib/api/orderApi";
import type { Table, TableSession, TableStatus } from "@/app/types";

interface TableState {
  list: Table[];
  sessions: Record<string, TableSession>;
  isLoading: boolean;
  error: string | null;
}

const initialState: TableState = {
  list: [],
  sessions: {},
  isLoading: false,
  error: null,
};

const tableSlice = createSlice({
  name: "tables",
  initialState,
  reducers: {
    setTables: (state, action: PayloadAction<Table[]>) => {
      state.list = action.payload;
    },
    updateTableStatus: (state, action: PayloadAction<{ id: string; status: TableStatus }>) => {
      const table = state.list.find((t) => t.id === action.payload.id);
      if (table) {
        table.status = action.payload.status;
      }
    },
    setTableSession: (state, action: PayloadAction<{ tableId: string; session: TableSession }>) => {
      state.sessions[action.payload.tableId] = action.payload.session;
    },
    clearTableSession: (state, action: PayloadAction<string>) => {
      delete state.sessions[action.payload];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    // Legacy actions for backward compatibility
    markTableWaiting: (state, action: PayloadAction<string>) => {
      const table = state.list.find((t) => t.id === action.payload);
      if (table) table.status = "waiting";
    },
    markTableTaken: (state, action: PayloadAction<string>) => {
      const table = state.list.find((t) => t.id === action.payload);
      if (table) table.status = "taken";
    },
    markTableServed: (state, action: PayloadAction<string>) => {
      const table = state.list.find((t) => t.id === action.payload);
      if (table) table.status = "served";
    },
    markTableFree: (state, action: PayloadAction<string>) => {
      const table = state.list.find((t) => t.id === action.payload);
      if (table) {
        table.status = "free";
        table.assignedWaiter = undefined;
        table.assignedWaiterId = undefined;
      }
    },
    markTableFinished: (state, action: PayloadAction<string>) => {
      const table = state.list.find((t) => t.id === action.payload);
      if (table) table.status = "finished";
    },
  },
  extraReducers: (builder) => {
    // Handle getTables query
    builder
      .addMatcher(tableApi.endpoints.getTables.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(tableApi.endpoints.getTables.matchFulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success && action.payload.data) {
          state.list = action.payload.data;
        }
      })
      .addMatcher(tableApi.endpoints.getTables.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch tables";
      });

    // Handle getFreeTables query
    builder
      .addMatcher(tableApi.endpoints.getFreeTables.matchFulfilled, (state, action) => {
        if (action.payload.success && action.payload.data) {
          // Update only free tables in the list
          action.payload.data.forEach((freeTable) => {
            const index = state.list.findIndex(t => t.id === freeTable.id);
            if (index !== -1) {
              state.list[index] = freeTable;
            }
          });
        }
      });

    // Handle updateTableStatus mutation
    builder
      .addMatcher(tableApi.endpoints.updateTableStatus.matchFulfilled, (state, action) => {
        if (action.payload.success && action.payload.data) {
          const index = state.list.findIndex(t => t.id === action.payload.data!.id);
          if (index !== -1) {
            state.list[index] = action.payload.data;
          }
        }
      });

    // Handle assignWaiter mutation
    builder
      .addMatcher(tableApi.endpoints.assignWaiter.matchFulfilled, (state, action) => {
        if (action.payload.success && action.payload.data) {
          const index = state.list.findIndex(t => t.id === action.payload.data!.id);
          if (index !== -1) {
            state.list[index] = action.payload.data;
          }
        }
      });

    // Handle startSession mutation
    builder
      .addMatcher(sessionApi.endpoints.startSession.matchFulfilled, (state, action) => {
        if (action.payload.success && action.payload.data) {
          const session = action.payload.data;
          state.sessions[session.tableId] = session;
          // Update table status
          const table = state.list.find(t => t.id === session.tableId);
          if (table) {
            table.status = session.status;
            table.currentSessionId = session.id;
          }
        }
      });

    // Handle endSession mutation
    builder
      .addMatcher(sessionApi.endpoints.endSession.matchFulfilled, (state, action) => {
        if (action.payload.success && action.payload.data) {
          const session = action.payload.data;
          delete state.sessions[session.tableId];
          // Update table status
          const table = state.list.find(t => t.id === session.tableId);
          if (table) {
            table.status = "free";
            table.currentSessionId = undefined;
          }
        }
      });
  },
});

export const {
  setTables,
  updateTableStatus,
  setTableSession,
  clearTableSession,
  setLoading,
  setError,
  markTableWaiting,
  markTableTaken,
  markTableServed,
  markTableFree,
  markTableFinished,
} = tableSlice.actions;

export default tableSlice.reducer;
