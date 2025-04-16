Set up the page structure according to the following prompt:
   
<page-structure-prompt>
Next.js route structure based on navigation menu items (excluding main route). Make sure to wrap all routes with the component:

Routes:
- /chat-history
- /your-documents

Page Implementations:
/chat-history:
Core Purpose: Display user's previous chat conversations and allow resuming

/reviewing past interactions
Key Components:
- ChatHistoryList: Scrollable list of past conversations
- ChatPreview: Condensed view of each chat showing date, topic, and snippet
- SearchBar: Filter conversations by date

/text
Layout Structure:
- Responsive grid layout
- Left sidebar for filters

/your-documents:
Core Purpose: Manage and organize uploaded

/created documents for chat reference
Key Components:
- DocumentGrid: Visual display of document cards
- UploadZone: Drag-and-drop file upload area
- DocumentCard: Preview with title, date, size, type
- FolderStructure: Organize documents in categories
- DocumentActions: Share, delete, download options
- SearchAndFilter: Find documents by name

/date
Layout Structure:
- Grid layout for desktop (3-4 columns)
- List view for mobile
- Collapsible folder sidebar
- Action toolbar at top
- Upload progress indicator

Layouts:
DashboardLayout:
Applicable routes
- /chat-history
- /your-documents
Core components
- TopNavBar: Navigation and user profile
- SideNav: Main menu items
- ContentArea: Main page content
- ActionBar: Context-specific actions
Responsive behavior
- Desktop: Full sidebar, horizontal top nav
- Tablet: Collapsible sidebar, horizontal top nav
- Mobile: Bottom navigation, hidden sidebar
- Adjustable content area width
- Responsive padding/margins
</page-structure-prompt>