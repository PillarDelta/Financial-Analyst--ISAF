Initialize Next.js in current directory:
```bash
mkdir temp; cd temp; npx create-next-app@latest . -y --typescript --tailwind --eslint --app --use-npm --src-dir --import-alias "@/*" -no --turbo
```

Now let's move back to the parent directory and move all files except prompt.md.

For Windows (PowerShell):
```powershell
cd ..; Move-Item -Path "temp*" -Destination . -Force; Remove-Item -Path "temp" -Recurse -Force
```

For Mac/Linux (bash):
```bash
cd .. && mv temp/* temp/.* . 2>/dev/null || true && rm -rf temp
```

Set up the frontend according to the following prompt:
<frontend-prompt>
Create detailed components with these requirements:
1. Use 'use client' directive for client-side components
2. Make sure to concatenate strings correctly using backslash
3. Style with Tailwind CSS utility classes for responsive design
4. Use Lucide React for icons (from lucide-react package). Do NOT use other UI libraries unless requested
5. Use stock photos from picsum.photos where appropriate, only valid URLs you know exist
6. Configure next.config.js image remotePatterns to enable stock photos from picsum.photos
7. Create root layout.tsx page that wraps necessary navigation items to all pages
8. MUST implement the navigation elements items in their rightful place i.e. Left sidebar, Top header
9. Accurately implement necessary grid layouts
10. Follow proper import practices:
   - Use @/ path aliases
   - Keep component imports organized
   - Update current src/app/page.tsx with new comprehensive code
   - Don't forget root route (page.tsx) handling
   - You MUST complete the entire prompt before stopping

<summary_title>
Financial Analyst Chat Interface with Document Management
</summary_title>

<image_analysis>

1. Navigation Elements:
- Left sidebar with: Chat History, Your Documents
- Top header with: ANALYST logo and menu toggle
- Bottom action buttons for: New Chat, Clear Chat, Clear Documents, Dashboard


2. Layout Components:
- Left sidebar: 200px width, full height
- Main content area: Flexible width (calc(100% - 200px))
- Chat input area: 100% width, fixed height at bottom
- Empty states for both chat and documents sections


3. Content Sections:
- Chat history section (empty state: "No chats yet")
- Documents section (empty state: "No documents yet")
- Main chat area with "Ask me a question" prompt
- Analysis type selector tabs: Risk Analysis, Z-Score, Company Health


4. Interactive Controls:
- Text input field with placeholder "Ask something..."
- "SEND IT" button with hover state
- Share/export button in top-right of input
- Tab selection system for analysis types
- Menu toggle button in header


5. Colors:
- Primary Blue: #007BFF (buttons, links)
- Background Dark: #1E1E1E
- Secondary Gray: #333333
- Text Light: #FFFFFF
- Accent Yellow: #FFD700 (clear buttons)


6. Grid/Layout Structure:
- Two-column layout (sidebar + main)
- Vertical stack in sidebar
- Flexible main content area
- Fixed-position bottom controls
</image_analysis>

<development_planning>

1. Project Structure:
```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── ChatLayout.tsx
│   ├── features/
│   │   ├── chat/
│   │   ├── documents/
│   │   └── analysis/
│   └── shared/
├── assets/
├── styles/
├── hooks/
└── utils/
```


2. Key Features:
- Real-time chat functionality
- Document management system
- Multiple analysis type support
- Export/share capabilities
- History management


3. State Management:
```typescript
interface AppState {
├── chat: {
│   ├── messages: Message[]
│   ├── activeAnalysisType: string
│   └── isLoading: boolean
├── }
├── documents: {
│   ├── list: Document[]
│   └── activeDocument: string
├── }
└── ui: {
├── sidebarOpen: boolean
└── activeTab: string
}
```


4. Routes:
```typescript
const routes = [
├── '/',
├── '/chat/:id',
├── '/documents/*',
└── '/dashboard'
]
```


5. Component Architecture:
- ChatContainer (manages chat state)
- DocumentManager (handles document operations)
- AnalysisSelector (manages analysis types)
- MessageInput (handles user input)
- SharedComponents (buttons, inputs, tabs)


6. Responsive Breakpoints:
```scss
$breakpoints: (
├── 'mobile': 320px,
├── 'tablet': 768px,
├── 'desktop': 1024px,
└── 'wide': 1440px
);
```
</development_planning>
</frontend-prompt>

IMPORTANT: Please ensure that (1) all KEY COMPONENTS and (2) the LAYOUT STRUCTURE are fully implemented as specified in the requirements. Ensure that the color hex code specified in image_analysis are fully implemented as specified in the requirements.