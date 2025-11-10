frontend/src/
├── app/
│   ├── store.ts                 # Redux store configuration
│   └── hooks.ts                 # Typed Redux hooks
├── features/
│   ├── auth/
│   │   ├── authSlice.ts        # Auth state slice
│   │   └── authApi.ts          # Auth RTK Query API
│   ├── turbines/
│   │   ├── turbinesApi.ts      # Turbines RTK Query API
│   │   └── turbinesSlice.ts    # Optional: local UI state
│   ├── inspections/
│   │   └── inspectionsApi.ts
│   └── repairPlans/
│       └── repairPlansApi.ts
├── services/
│   └── api.ts                   # Base RTK Query API
├── components/
│   ├── ui/                      # shadcn components
│   ├── Layout.tsx
│   └── ProtectedRoute.tsx
├── pages/
│   ├── Login.tsx
│   ├── Turbines.tsx
│   ├── Inspections.tsx
│   └── ...
├── types/
│   └── index.ts
├── lib/
│   └── utils.ts
├── main.tsx
└── index.css