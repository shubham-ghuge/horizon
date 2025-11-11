import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
}

interface NotificationsState {
  items: AppNotification[];
}

const initialState: NotificationsState = {
  items: [],
};

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    pushNotification: {
      reducer: (state, action: PayloadAction<AppNotification>) => {
        state.items.push(action.payload);
      },
      prepare: (payload: { type: NotificationType; title?: string; message: string; id?: string }) => {
        return {
          payload: {
            id: payload.id ?? nanoid(),
            type: payload.type,
            title: payload.title,
            message: payload.message,
          } as AppNotification,
        };
      },
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((n) => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.items = [];
    },
  },
});

export const { pushNotification, removeNotification, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;


