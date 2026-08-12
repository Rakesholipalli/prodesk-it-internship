# TaskMatrix System Architecture

## 🏗️ Architecture Overview

TaskMatrix follows a **fullstack monolithic architecture** (Phase 1 MVP) with a clear migration path to microservices architecture (Phase 2 scaling). The application is built on Next.js 14 with integrated API routes, providing both server-side rendering for the frontend and RESTful APIs for data operations.

---

## 📐 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER (Browser)                        │
├─────────────────────────────────────────────────────────────────────┤
│  Next.js 14 App (TypeScript + React)                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  UI Components│  │ State Layer  │  │  API Client  │              │
│  │  (Shadcn UI) │  │  (Zustand +  │  │ (React Query)│              │
│  │  + Tailwind  │  │ React Query) │  │              │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│         │                  │                  │                      │
│         └──────────────────┴──────────────────┘                      │
│                            │                                         │
└────────────────────────────┼─────────────────────────────────────────┘
                             │
                    ┌────────▼─────────┐
                    │   HTTPS/WSS      │
                    └────────┬─────────┘
                             │
┌────────────────────────────┼─────────────────────────────────────────┐
│                    SERVER LAYER                                       │
├────────────────────────────┼─────────────────────────────────────────┤
│  ┌─────────────────────────▼──────────────────────────────┐         │
│  │        Next.js Server (Node.js Runtime)                 │         │
│  │  ┌─────────────────┐         ┌─────────────────┐       │         │
│  │  │  API Routes     │         │  Socket.io      │       │         │
│  │  │  (REST APIs)    │         │  Server         │       │         │
│  │  │  /api/*         │         │  (WebSocket)    │       │         │
│  │  └────────┬────────┘         └────────┬────────┘       │         │
│  │           │                           │                │         │
│  │  ┌────────▼───────────────────────────▼────────┐       │         │
│  │  │     Business Logic Layer                    │       │         │
│  │  │  - Controllers  - Services                  │       │         │
│  │  │  - Middleware   - Validation                │       │         │
│  │  └────────┬─────────────────────────────────────┘       │         │
│  └───────────┼──────────────────────────────────────────────┘         │
│              │                                                        │
└──────────────┼────────────────────────────────────────────────────────┘
               │
    ┌──────────▼───────────┐
    │   MongoDB Driver      │
    │   (Mongoose ODM)      │
    └──────────┬───────────┘
               │
┌──────────────▼────────────────────────────────────────────────────────┐
│                       DATA LAYER                                      │
├───────────────────────────────────────────────────────────────────────┤
│  MongoDB Atlas Cluster                                                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │  Users   │ │ Projects │ │  Tasks   │ │ Comments │               │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                            │
│  │ Sprints  │ │Activities│ │Notifications│                           │
│  └──────────┘ └──────────┘ └──────────┘                            │
└───────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                                  │
├───────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  Cloudinary  │  │    Sentry    │  │  Email       │              │
│  │  (File CDN)  │  │ (Error Track)│  │  Service     │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Database Entity Relationship Diagram


### Visual ERD

![TaskMatrix Entity Relationship Diagram](./erd-diagram.png)

### Database Schema Description

The TaskMatrix database consists of **5 primary collections** with clearly defined relationships:

#### Collection Overview

1. **users** (Root entity)
   - Stores user authentication data, profile information, and preferences
   - Indexes: email (unique), role, createdAt

2. **projects** (Organizational unit)
   - Contains project metadata, settings, and member associations
   - Embeds member array with user references and project-specific roles
   - Indexes: key (unique), name, owner, status

3. **tasks** (Core entity)
   - Central entity containing all task information
   - References: project, assignee, reporter
   - Sprint stored as string field for MVP simplicity
   - Embeds: subtasks array, attachments array, labels array
   - Indexes: taskId (unique), compound (project + status), assignee, dueDate

4. **comments** (Communication)
   - Separate collection for scalability (tasks can have 100+ comments)
   - References: task, author
   - Supports @mentions and attachments

5. **activities** (Audit log)
   - Records all system changes for activity feed
   - TTL index: auto-delete after 90 days
   - Indexes: compound (user + createdAt), project, task

#### Key Relationships

```
users (1) ─────owns────────> (M) projects
users (M) ────member_of────> (M) projects  [embedded in projects.members]
projects (1) ───has────────> (M) tasks
users (1) ────assigned_to──> (M) tasks
users (1) ────reported─────> (M) tasks
tasks (1) ────has──────────> (M) comments
users (1) ────wrote────────> (M) comments
users (1) ────performed────> (M) activities
```

**Note**: Sprints handled as string field in tasks collection for MVP. Notifications handled via activities feed.

---

## 🔄 Data Flow Architecture

### 1. Task Creation Flow


```
User Action → Client Component (TaskForm)
    ↓
Zustand Store (Optimistic Update)
    ↓
React Query Mutation → POST /api/projects/:id/tasks
    ↓
API Route → Validation (Zod)
    ↓
Service Layer → Business Logic
    ↓
MongoDB (Insert Task Document)
    ↓
Socket.io Broadcast → task:created event
    ↓
All Connected Clients Receive Update
    ↓
React Query Cache Invalidation
    ↓
UI Re-renders with New Data
```

### 2. Real-time Task Update Flow

```
User A drags task card
    ↓
Client optimistic update (instant visual feedback)
    ↓
PATCH /api/tasks/:id → { status: 'in_progress', position: 2 }
    ↓
MongoDB Update + Activity Log Creation
    ↓
Socket.io Broadcast to Project Room
    ↓
User B receives WebSocket event
    ↓
React Query invalidates cache
    ↓
User B's board auto-updates
```

### 3. Authentication Flow

```
User submits login form
    ↓
POST /api/auth/login → { email, password }
    ↓
Validate credentials (bcrypt compare)
    ↓
Generate JWT tokens:
  - Access Token (15 min)
  - Refresh Token (7 days)
    ↓
Set httpOnly cookies
    ↓
Return user data to client
    ↓
Zustand Auth Store updated
    ↓
Redirect to dashboard
```

---

## 🛡️ Security Architecture

### Authentication & Authorization

#### JWT Token Strategy
- **Access Token**: 15-minute expiry, stored in httpOnly cookie
- **Refresh Token**: 7-day expiry, stored in secure httpOnly cookie
- **Token Rotation**: Refresh endpoint issues new access token

#### Role-Based Access Control (RBAC)

**System Roles**:
- `admin`: Full system access
- `project_manager`: Can create projects, manage teams
- `developer`: Can create tasks, update assignments
- `viewer`: Read-only access

**Project Roles** (embedded in projects.members):
- `owner`: Full project control
- `admin`: Manage members, settings
- `member`: Create/edit tasks
- `viewer`: Read-only project access

#### Middleware Chain


```typescript
Request → validateAuth() → requireRole(['admin']) → requireProjectAccess(project, 'member') → Handler
```

### Input Validation

All API inputs validated using **Zod** schemas:

```typescript
const createTaskSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(5000).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  assigneeId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  dueDate: z.string().datetime().optional()
});
```

### Security Headers

```typescript
// Next.js config
headers: {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline';"
}
```

### File Upload Security

- **Allowed types**: images (jpg, png, gif), documents (pdf, docx)
- **Max size**: 10MB per file
- **Storage**: Cloudinary with signed uploads
- **Virus scanning**: ClamAV integration (future)

---

## ⚡ Performance Architecture

### Frontend Optimization

#### Code Splitting
```typescript
// Dynamic imports for heavy components
const TaskDetailModal = dynamic(() => import('@/components/tasks/TaskDetailModal'), {
  ssr: false,
  loading: () => <Skeleton />
});
```

#### Image Optimization
```typescript
// Next.js Image for auto optimization
<Image 
  src={user.avatar} 
  alt={user.name}
  width={40}
  height={40}
  loading="lazy"
/>
```

#### Virtualization
```typescript
// react-window for large lists (50+ tasks)
<FixedSizeList
  height={600}
  itemCount={tasks.length}
  itemSize={80}
  width="100%"
>
  {TaskCard}
</FixedSizeList>
```

### Backend Optimization

#### Database Indexing Strategy


```javascript
// Compound index for common query
tasks.index({ project: 1, status: 1 });

// User assigned tasks
tasks.index({ assignee: 1, dueDate: 1 });

// Search index
tasks.index({ title: 'text', description: 'text' });
```

#### Query Optimization
```javascript
// Fetch only needed fields
Task.find({ project: projectId })
  .select('taskId title status priority assignee dueDate')
  .populate('assignee', 'fullName avatar')
  .lean(); // faster than full docs
```

#### Caching Strategy

**React Query (Client-side)**:
```typescript
{
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  refetchOnWindowFocus: false
}
```

**Redis (Server-side - Phase 2)**:
- Session store (replace memory store)
- Hot data cache (project members, user profiles)
- Rate limiting counters

### API Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| API Response Time (p50) | < 100ms | New Relic |
| API Response Time (p95) | < 200ms | New Relic |
| Database Query Time (p95) | < 50ms | MongoDB Atlas |
| Page Load Time (FCP) | < 1.5s | Lighthouse |
| Time to Interactive (TTI) | < 3s | Lighthouse |
| WebSocket Latency | < 1s | Custom metrics |

---

## 🌐 Deployment Architecture

### Phase 1: MVP Deployment (Monolith)

```
┌─────────────────────────────────────────┐
│           Vercel Platform               │
│  ┌───────────────────────────────────┐  │
│  │  Next.js App (Frontend + API)    │  │
│  │  - SSR Pages                      │  │
│  │  - API Routes (Serverless)        │  │
│  │  - Edge Functions                 │  │
│  └───────────────┬───────────────────┘  │
│                  │                       │
└──────────────────┼───────────────────────┘
                   │
                   ├──> MongoDB Atlas (Database)
                   ├──> Cloudinary (File Storage)
                   ├──> Sentry (Error Tracking)
                   └──> SendGrid (Email)

┌─────────────────────────────────────────┐
│        Railway Platform                 │
│  ┌───────────────────────────────────┐  │
│  │  Socket.io Server (WebSocket)    │  │
│  │  - Persistent connection          │  │
│  │  - Room-based broadcasting        │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Environment Configuration

```bash
# .env.production
DATABASE_URL=mongodb+srv://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
NEXT_PUBLIC_API_URL=https://taskmatrix.vercel.app
NEXT_PUBLIC_SOCKET_URL=https://taskmatrix-ws.railway.app
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
SENTRY_DSN=...
SENDGRID_API_KEY=...
```

### CI/CD Pipeline (GitHub Actions)

```yaml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```


---

## 📡 Real-time Architecture (Socket.io)

### Connection Management

```typescript
// Server-side
io.on('connection', (socket) => {
  const userId = socket.handshake.auth.userId;
  
  // Join user room
  socket.join(`user:${userId}`);
  
  // Join project rooms
  socket.on('join:project', (projectId) => {
    socket.join(`project:${projectId}`);
  });
  
  socket.on('disconnect', () => {
    // update status
  });
});
```

### Event Types

| Event | Direction | Purpose | Payload |
|-------|-----------|---------|---------|
| `task:created` | Server → Client | New task added | Task object |
| `task:updated` | Server → Client | Task modified | Task ID + changed fields |
| `task:moved` | Server → Client | Status/position changed | Task ID + new status/position |
| `task:deleted` | Server → Client | Task removed | Task ID |
| `comment:added` | Server → Client | New comment | Comment object |
| `user:online` | Server → Client | User status change | User ID + status |
| `notification:new` | Server → User | Personal notification | Notification object |

### Room-based Broadcasting

```typescript
// Broadcast update to project
io.to(`project:${projectId}`).emit('task:updated', {
  taskId: task._id,
  changes: { status: 'done', completedAt: new Date() }
});

// Send to specific user
io.to(`user:${userId}`).emit('notification:new', notification);
```

### Client-side Integration

```typescript
// React hook for Socket.io
function useSocket(projectId: string) {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    socket.emit('join:project', projectId);
    
    socket.on('task:updated', (data) => {
      // invalidate cache
      queryClient.invalidateQueries(['projects', projectId, 'tasks']);
    });
    
    return () => {
      socket.emit('leave:project', projectId);
      socket.off('task:updated');
    };
  }, [projectId]);
}
```

---

## 🧩 Component Architecture

### Atomic Design Structure

```
components/
├── ui/ (Atoms - Shadcn base components)
│   ├── button.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── avatar.tsx
│   └── badge.tsx
│
├── forms/ (Molecules - Form compositions)
│   ├── TaskForm.tsx
│   ├── ProjectForm.tsx
│   └── CommentForm.tsx
│
├── kanban/ (Organisms - Complex components)
│   ├── Board.tsx (Container)
│   ├── Column.tsx (Status column)
│   ├── Card.tsx (Task card)
│   └── CardActions.tsx (Quick actions)
│
├── tasks/
│   ├── TaskDetailModal.tsx (Full task view)
│   ├── TaskList.tsx (List view)
│   └── TaskFilters.tsx (Filter UI)
│
├── layout/ (Templates)
│   ├── DashboardLayout.tsx
│   ├── Sidebar.tsx
│   ├── Navbar.tsx
│   └── Footer.tsx
│
└── features/ (Feature-specific)
    ├── analytics/
    │   └── ProjectDashboard.tsx
    └── notifications/
        └── NotificationCenter.tsx
```

### Server vs. Client Components

**Server Components** (Default in Next.js 14 App Router):
```typescript
// app/projects/[id]/page.tsx
export default async function ProjectPage({ params }: Props) {
  // server-side fetch
  const project = await getProject(params.id);
  
  return (
    <div>
      <h1>{project.name}</h1>
      {/* client component */}
      <KanbanBoard initialData={project.tasks} />
    </div>
  );
}
```

**Client Components** (Interactive, use hooks):
```typescript
'use client';

export function KanbanBoard({ initialData }: Props) {
  const [tasks, setTasks] = useState(initialData);
  // hooks, events, browser APIs
  
  return <DndContext>...</DndContext>;
}
```

---

## 📊 State Management Architecture

### Zustand Stores


```typescript
// stores/authStore.ts
interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginDto) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UpdateProfileDto) => Promise<void>;
}

// stores/uiStore.ts
interface UIStore {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  notifications: Notification[];
  toggleSidebar: () => void;
  setTheme: (theme: Theme) => void;
  addNotification: (notification: Notification) => void;
}

// stores/taskStore.ts (Minimal - React Query handles most)
interface TaskStore {
  selectedTaskId: string | null;
  filters: TaskFilters;
  viewMode: 'board' | 'list';
  setSelectedTask: (id: string | null) => void;
  setFilters: (filters: TaskFilters) => void;
  setViewMode: (mode: ViewMode) => void;
}
```

### React Query Cache Structure

```typescript
// Query keys structure
const queryKeys = {
  auth: ['auth', 'me'] as const,
  projects: {
    all: ['projects'] as const,
    detail: (id: string) => ['projects', id] as const,
    tasks: (id: string) => ['projects', id, 'tasks'] as const,
    members: (id: string) => ['projects', id, 'members'] as const,
  },
  tasks: {
    detail: (id: string) => ['tasks', id] as const,
    comments: (id: string) => ['tasks', id, 'comments'] as const,
  },
  sprints: {
    all: (projectId: string) => ['projects', projectId, 'sprints'] as const,
    detail: (id: string) => ['sprints', id] as const,
  },
};
```

### State Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      User Interaction                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │   UI Component (React)        │
         │   - Button click              │
         │   - Form submit               │
         │   - Drag-drop                 │
         └───────────┬───────────────────┘
                     │
        ┌────────────┴─────────────┐
        │                          │
        ▼                          ▼
┌───────────────┐         ┌──────────────────┐
│ Zustand Store │         │  React Query     │
│ (UI State)    │         │  Mutation        │
│ - theme       │         │  - POST/PUT      │
│ - sidebar     │         │  - DELETE        │
│ - filters     │         │  - API call      │
└───────────────┘         └────────┬─────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │  API Route      │
                          │  /api/*         │
                          └────────┬────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
                    ▼                             ▼
          ┌──────────────────┐         ┌──────────────────┐
          │   MongoDB        │         │   Socket.io      │
          │   (Persist)      │         │   (Broadcast)    │
          └──────────────────┘         └────────┬─────────┘
                                                 │
                                                 ▼
                                    ┌─────────────────────────┐
                                    │  All Connected Clients  │
                                    │  (Real-time Update)     │
                                    └────────────┬────────────┘
                                                 │
                                                 ▼
                                    ┌─────────────────────────┐
                                    │  React Query            │
                                    │  Cache Invalidation     │
                                    └────────────┬────────────┘
                                                 │
                                                 ▼
                                    ┌─────────────────────────┐
                                    │  UI Re-render           │
                                    │  (Automatic)            │
                                    └─────────────────────────┘
```

---

## 🧪 Testing Architecture

### Testing Pyramid


```
           /\
          /  \
         /E2E \ ────── 10% (Critical user flows)
        /──────\
       /        \
      /Integration\ ── 20% (API + DB operations)
     /────────────\
    /              \
   /  Unit Tests   \ ── 70% (Functions, utils, hooks)
  /────────────────\
```

### Test Structure

```
__tests__/
├── unit/
│   ├── utils/
│   │   ├── auth.test.ts (JWT helpers)
│   │   ├── validation.test.ts (Zod schemas)
│   │   └── formatting.test.ts (Date, string utils)
│   ├── hooks/
│   │   ├── useAuth.test.tsx
│   │   └── useSocket.test.tsx
│   └── components/
│       ├── Button.test.tsx
│       └── TaskCard.test.tsx
│
├── integration/
│   ├── api/
│   │   ├── auth.test.ts (Register → Login → Get user)
│   │   ├── projects.test.ts (CRUD operations)
│   │   └── tasks.test.ts (Task workflows)
│   └── database/
│       └── models.test.ts (Mongoose model validation)
│
└── e2e/
    ├── auth.spec.ts (Complete auth flow)
    ├── kanban.spec.ts (Drag-drop tasks)
    └── realtime.spec.ts (Multi-user updates)
```

### Example Tests

**Unit Test (Vitest + React Testing Library)**:
```typescript
// __tests__/unit/components/TaskCard.test.tsx
import { render, screen } from '@testing-library/react';
import { TaskCard } from '@/components/kanban/Card';

describe('TaskCard', () => {
  it('renders task information correctly', () => {
    const task = {
      taskId: 'TASK-1',
      title: 'Test task',
      priority: 'high',
    };
    
    render(<TaskCard task={task} />);
    
    expect(screen.getByText('TASK-1')).toBeInTheDocument();
    expect(screen.getByText('Test task')).toBeInTheDocument();
  });
});
```

**Integration Test (Supertest)**:
```typescript
// __tests__/integration/api/tasks.test.ts
describe('Task API', () => {
  it('should create a task and retrieve it', async () => {
    const project = await createTestProject();
    
    const response = await request(app)
      .post(`/api/projects/${project._id}/tasks`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'New task',
        priority: 'medium',
      });
    
    expect(response.status).toBe(201);
    expect(response.body.title).toBe('New task');
  });
});
```

**E2E Test (Playwright)**:
```typescript
// __tests__/e2e/kanban.spec.ts
test('drag task between columns', async ({ page }) => {
  await page.goto('/projects/123/board');
  
  const task = page.locator('[data-testid="task-TASK-1"]');
  const doneColumn = page.locator('[data-testid="column-done"]');
  
  await task.dragTo(doneColumn);
  
  await expect(doneColumn).toContainText('TASK-1');
});
```

---

## 🔍 Monitoring & Observability

### Error Tracking (Sentry)
```typescript
// sentry.config.ts
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  beforeSend(event, hint) {
    // filter sensitive data
    if (event.request) {
      delete event.request.cookies;
    }
    return event;
  },
});
```

### Performance Monitoring
- **Vercel Analytics**: Real User Monitoring (RUM)
- **MongoDB Atlas**: Query performance insights
- **Custom Metrics**: Socket.io connection count, message latency

### Logging Strategy
```typescript
// utils/logger.ts
export const logger = {
  info: (message: string, meta?: object) => {
    console.log(JSON.stringify({ level: 'info', message, ...meta, timestamp: new Date() }));
  },
  error: (message: string, error: Error, meta?: object) => {
    console.error(JSON.stringify({ level: 'error', message, error: error.stack, ...meta, timestamp: new Date() }));
    Sentry.captureException(error);
  },
};
```

---

## 🚀 Scalability Considerations

### Horizontal Scaling
- **Frontend**: Vercel Edge Network (global CDN)
- **API**: Serverless functions (auto-scale)
- **WebSocket**: Sticky sessions (Railway) or Redis adapter (multi-instance)

### Database Scaling
- **Read Replicas**: MongoDB Atlas supports read-preferred connections
- **Sharding**: Shard by projectId for horizontal partitioning (future)

### Caching Layers
```
Browser Cache (Static assets)
    ↓
CDN Cache (Vercel Edge)
    ↓
React Query Cache (5 min)
    ↓
Redis Cache (Session, hot data) - Phase 2
    ↓
MongoDB (Source of truth)
```

---

## 📚 Technology Decisions Summary

| Category | Technology | Justification |
|----------|------------|---------------|
| **Frontend Framework** | Next.js 14 | SSR, API routes, optimal Vercel integration |
| **Language** | TypeScript | Type safety, better DX, refactoring confidence |
| **Styling** | Tailwind + Shadcn | Rapid development, consistency, accessibility |
| **State Management** | Zustand + React Query | Minimal boilerplate, clear server/client separation |
| **Backend** | Next.js API Routes | Unified codebase, simpler deployment (MVP) |
| **Database** | MongoDB Atlas | Flexible schema, managed service, free tier |
| **ODM** | Mongoose | Schema validation, middleware, TypeScript support |
| **Real-time** | Socket.io | Robust reconnection, room support, fallbacks |
| **File Storage** | Cloudinary | Free tier, CDN, image transformations |
| **Drag-Drop** | @dnd-kit/core | Modern, accessible, touch support |
| **Forms** | React Hook Form | Performance, minimal re-renders |
| **Validation** | Zod | Type inference, composable schemas |
| **Testing** | Vitest + Playwright | Fast, modern, full coverage |
| **Deployment** | Vercel + Railway | Automatic CI/CD, easy scaling |
| **Monitoring** | Sentry | Excellent error tracking, free tier |

---

**Last Updated**: August 11, 2026  
**Version**: 1.0.0  
**Status**: Architecture Finalized ✅
