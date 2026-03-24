# Copilot Instructions

## Commands

```bash
pnpm dev          # Dev server at http://localhost:3000
pnpm build        # Production build
pnpm preview      # Preview production build
pnpm lint         # ESLint check (.js, .ts, .vue)
pnpm lint:fix     # Auto-fix lint issues
```

No test runner is configured in this project.

## Architecture

The app follows a layered architecture: **Services → Stores → Composables → Pages/Components**

- **`app/services/`** — Raw `fetch` wrappers for the backend REST API (`http://localhost:8003/api`). Each service function accepts a JWT token and returns parsed JSON. Services throw on non-OK responses or when `result.status === false`.
- **`app/stores/`** — Two Pinia stores (Composition API style):
  - `useAuthStore` — JWT token, user object, login/logout/register/fetchProfile actions. Persists token to `localStorage`.
  - `useTeamStore` — Team data, tasks, members, invitations, and the `activeSection` ref. Uses a `loadedSections` Set for lazy loading — each sidebar section is only fetched once per team init.
- **`app/composables/`** — Thin wrappers over stores (`useAuth`, `useTeams`) that expose reactive state and actions. Pages should use composables rather than calling stores directly.
- **`app/layouts/`** — Three layouts: `auth` (centered, for login/register), `default` (header + sidebar with team links), `team` (header + sidebar with section nav). Set via `definePageMeta({ layout: 'name' })`.
- **`app/pages/`** — File-based routing. Route groups `(auth)/` and `(invite)/` apply layouts without adding URL segments.

## Key Conventions

### File & Code Style
- **File names**: `kebab-case` enforced by ESLint (e.g., `task-table.vue`, `use-auth.js`)
- **TypeScript types**: Use `type`, not `interface` (`ts/consistent-type-definitions: type`)
- **Quotes**: Double quotes; **semicolons**: required; **indent**: 2 spaces
- **`console.log`**: ESLint warns — remove before committing
- **`process.env`**: Do not access directly (`node/no-process-env` is an error). Use Nuxt runtime config instead.
- All existing source files use `.js`, not `.ts`, despite TypeScript being configured.

### API Calls
All service functions follow this pattern:
```js
const BASE_URL = 'http://192.168.10.46:8003/api'

export async function doSomething(token, data) {
  if (!token) throw new Error('Token required')
  const response = await fetch(`${BASE_URL}/endpoint`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const result = await response.json()
  if (!result.status) throw new Error(result.message || 'Request failed')
  return result.data ?? result
}
```

Backend responses have shape: `{ status: boolean, message: string, data: any }`.

### Authentication
- JWT token stored in `localStorage` under the key `'token'`
- Restored on app init by `app/plugins/auth.client.js` (client-only plugin)
- Token passed explicitly to every service call (not via a global interceptor)

### State (Pinia)
- Use Composition API style stores (`defineStore('name', () => { ... })`)
- Use `storeToRefs(store)` to destructure reactive state from a store
- `useTeamStore.init(teamId)` must be called before accessing team data; it resets state and triggers section loading via `loadSectionData(section)`

### Forms & Validation
Use Zod schemas with Nuxt UI's `<UForm>`:
```js
const schema = z.object({
  email: z.string().email(),
  name: z.string().min(3),
})
const state = reactive({ email: '', name: '' })
```
```html
<UForm :schema="schema" :state="state" @submit="onSubmit">
  <UFormField label="Email" name="email">
    <UInput v-model="state.email" />
  </UFormField>
</UForm>
```

### UI Components
Use **Nuxt UI** components (`UButton`, `UInput`, `UCard`, `UModal`, `UForm`, etc.) with Tailwind utility classes for layout and spacing. Customise component internals via the `:ui` prop. Primary brand color is `#003f88` (set as `--ui-primary` in `app/assets/css/main.css`).

### Task & Team Data Shapes
```js
// Task
{ id, title, description, priority: 'high'|'medium'|'low',
  category: 'feature'|'bug_fix'|'enhancement',
  status: 'pending'|'in progress'|'completed',
  assigned_to, team_id }

// Team
{ id, name, owner: { id, name, avatar }, members_count }
```
"Today's Tasks" are tasks filtered by `status: 'in progress'`; "Issues" are tasks filtered by `category: 'bug_fix'`.
