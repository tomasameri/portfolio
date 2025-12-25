This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Anonymous Pro](https://fonts.google.com/specimen/Anonymous+Pro) from Google Fonts.

## Infrastructure

This project uses [Appwrite](https://appwrite.io) as its backend infrastructure. Appwrite provides:

- **Authentication**: User authentication with email/password
- **Database**: NoSQL database for storing cards and blog posts
- **Storage**: File storage for images and assets
- **Cloud Functions**: Serverless functions (available for future use)
- **Deployments**: CI/CD integration (available for future use)

Appwrite offers a generous free tier that covers all the needs of this portfolio project.

### Appwrite Setup

1. Create an account at [Appwrite Cloud](https://cloud.appwrite.io) or set up a self-hosted instance
2. Create a new project
3. Create a database and two collections:
   - `cards`: For managing social media cards
   - `blogPosts`: For blog posts

#### Database Schema

**Collection: `cards`**
- `id` (string, auto-generated)
- `type` (string, enum: social, youtube, custom, link, image, text)
- `size` (string, enum: small, medium, large, wide, tall)
- `title` (string)
- `description` (string, optional)
- `url` (string)
- `socialPlatform` (string, optional, enum: github, linkedin, twitter, instagram, tiktok, youtube)
- `image` (string, optional, file ID)
- `icon` (string, optional)
- `order` (integer, for sorting)
- `createdAt` (datetime)
- `updatedAt` (datetime)

**Collection: `blogPosts`**
- `id` (string, auto-generated)
- `title` (string)
- `slug` (string, unique)
- `excerpt` (string)
- `content` (string, markdown)
- `published` (boolean)
- `publishedAt` (datetime, optional)
- `authorId` (string, user ID)
- `createdAt` (datetime)
- `updatedAt` (datetime)

**Permissions:**
- Cards: Read for everyone, Write for authenticated users
- Blog Posts: Read for published posts, Write for authenticated users

4. Create a Storage bucket for images and files (optional but recommended)
5. Configure environment variables in `.env.local`:

```bash
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your-database-id
NEXT_PUBLIC_APPWRITE_CARDS_COLLECTION_ID=your-cards-collection-id
NEXT_PUBLIC_APPWRITE_BLOG_COLLECTION_ID=your-blog-collection-id
NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID=your-storage-bucket-id
```

See `.env.local.example` for reference.

**⚠️ Important for Production/Deploy:**

### Appwrite Sites Deployment

This project is configured for deployment on **Appwrite Sites**. The configuration is in `appwrite.json`.

**⚠️ IMPORTANT: Setup Steps**

1. **Complete Platform Setup in Appwrite Console**:
   - Go to Appwrite Console → Get Started
   - Click on "Connect your platform" → Select "Web"
   - **Click "Skip, go to dashboard"** (you already have a project, no need to clone starter kit)
   - This just marks the platform as configured - you don't need to clone anything

2. **Create a Site**:
   - In Appwrite Console → Your Project → **Deploy** → **Sites**
   - Click **Create Site**
   - Enter a name (e.g., "portfolio-site")
   - Connect your Git repository (GitHub, GitLab, Bitbucket, etc.)

3. **Configure Environment Variables in Appwrite Sites**:
   - Go to your Site → **Settings** → **Environment Variables**
   - Add all these variables (copy from your `.env.local`):
     ```
     NEXT_PUBLIC_APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
     NEXT_PUBLIC_APPWRITE_PROJECT_ID=693323540020aab7b045
     NEXT_PUBLIC_APPWRITE_DATABASE_ID=694d8c8c00144fb71a7b
     NEXT_PUBLIC_APPWRITE_CARDS_COLLECTION_ID=cards
     NEXT_PUBLIC_APPWRITE_BLOG_COLLECTION_ID=blogposts
     NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID=694d8d5500037f02535b
     APPWRITE_API_KEY=your-api-key-here
     ```
   - **Important**: Use the full Collection IDs (not just names like "cards")
   - **Important**: `APPWRITE_API_KEY` does NOT have `NEXT_PUBLIC_` prefix

4. **Deploy Settings** (auto-detected from `appwrite.json`):
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
   - Framework: `nextjs`

5. **Add Production Domain to Appwrite Project** (⚠️ CRITICAL for CORS):
   - Go to Appwrite Console → Your Project → **Settings** → **Platforms**
   - Click **Add Platform** → Select **Web**
   - Enter your production domain:
     - For Appwrite Sites: `https://your-site-name.appwrite.network` (the URL provided by Appwrite Sites)
     - For custom domains: `https://yourdomain.com`
   - Click **Save**
   - **Important**: Without this step, you'll get CORS errors when trying to authenticate or access Appwrite APIs from production

6. **Deploy**:
   - Push your code to the connected Git repository
   - Appwrite will automatically trigger a build
   - Check deployment logs if there are issues
   - Once deployed, your site will be available at the provided URL

### Other Hosting Platforms

For other platforms (Vercel, Netlify, etc.), you **MUST** configure these environment variables in your hosting platform's dashboard:

1. **Vercel**: Go to Project Settings → Environment Variables
2. **Netlify**: Go to Site Settings → Environment Variables
3. **Other platforms**: Check their documentation for environment variable configuration

**Do NOT** commit `.env.local` to git (it should be in `.gitignore`). Instead, configure the variables directly in your hosting platform.

The variables needed are:
- `NEXT_PUBLIC_APPWRITE_ENDPOINT`
- `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
- `NEXT_PUBLIC_APPWRITE_DATABASE_ID`
- `NEXT_PUBLIC_APPWRITE_CARDS_COLLECTION_ID`
- `NEXT_PUBLIC_APPWRITE_BLOG_COLLECTION_ID`
- `NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID`
- `APPWRITE_API_KEY` (optional, for server-side operations)

**Important Notes:**
- Variables starting with `NEXT_PUBLIC_` are exposed to the browser. This is safe for Appwrite as it uses permissions for security.
- `APPWRITE_API_KEY` does NOT have `NEXT_PUBLIC_` prefix because it's a secret key. It's only available server-side.
- The API key bypasses permissions and should only be used in API routes or Server Components, never in client components.

### Migrating Data

After setting up Appwrite, you can migrate the default cards and blog posts:

```bash
# Migrate cards
npx tsx scripts/migrateCards.ts

# Migrate blog posts (requires authentication)
# First, log in through the admin panel, then:
npx tsx scripts/migrateBlogPosts.ts
```

## Admin Panel

The project includes a fully functional admin panel for managing content.

### Accessing the Admin Panel

1. Navigate to `/admin/login`
2. Create an account or log in with your credentials
3. Access the dashboard at `/admin`

### Features

#### Cards Management (`/admin/cards`)
- View all social media cards
- Create new cards with customizable types and sizes
- Edit existing cards (title, description, URL, size)
- Delete cards
- Reorder cards using drag & drop
- Real-time preview of cards

#### Blog Management (`/admin/blog`)
- View all blog posts (published and drafts)
- Create new blog posts with Markdown editor
- Edit existing posts
- Publish/unpublish posts
- Delete posts
- Markdown preview while editing
- Automatic slug generation from title

### Admin Panel UI

The admin panel features:
- Clean, modern interface matching the portfolio design
- Dark/light theme support
- Responsive design for mobile and desktop
- Intuitive drag & drop for card reordering
- Real-time previews
- Form validation and error handling

## Color Palette

This project uses the following color palette:

### CSS HEX
```css
--alice-blue: #e8eef2ff;
--dust-grey: #d6c9c9ff;
--pale-sky: #c7d3ddff;    /* Light/Claro */
--cool-sky: #77b6eaff;
--gunmetal: #37393aff;    /* Dark/Oscuro */
```

### CSS HSL
```css
--alice-blue: hsla(204, 28%, 93%, 1);
--dust-grey: hsla(0, 14%, 81%, 1);
--pale-sky: hsla(207, 24%, 82%, 1);
--cool-sky: hsla(207, 73%, 69%, 1);
--gunmetal: hsla(200, 3%, 22%, 1);
```

### SCSS HEX
```scss
$alice-blue: #e8eef2ff;
$dust-grey: #d6c9c9ff;
$pale-sky: #c7d3ddff;
$cool-sky: #77b6eaff;
$gunmetal: #37393aff;
```

### SCSS HSL
```scss
$alice-blue: hsla(204, 28%, 93%, 1);
$dust-grey: hsla(0, 14%, 81%, 1);
$pale-sky: hsla(207, 24%, 82%, 1);
$cool-sky: hsla(207, 73%, 69%, 1);
$gunmetal: hsla(200, 3%, 22%, 1);
```

### SCSS RGB
```scss
$alice-blue: rgba(232, 238, 242, 1);
$dust-grey: rgba(214, 201, 201, 1);
$pale-sky: rgba(199, 211, 221, 1);
$cool-sky: rgba(119, 182, 234, 1);
$gunmetal: rgba(55, 57, 58, 1);
```

### SCSS Gradient
```scss
$gradient-top: linear-gradient(0deg, #e8eef2ff, #d6c9c9ff, #c7d3ddff, #77b6eaff, #37393aff);
$gradient-right: linear-gradient(90deg, #e8eef2ff, #d6c9c9ff, #c7d3ddff, #77b6eaff, #37393aff);
$gradient-bottom: linear-gradient(180deg, #e8eef2ff, #d6c9c9ff, #c7d3ddff, #77b6eaff, #37393aff);
$gradient-left: linear-gradient(270deg, #e8eef2ff, #d6c9c9ff, #c7d3ddff, #77b6eaff, #37393aff);
$gradient-top-right: linear-gradient(45deg, #e8eef2ff, #d6c9c9ff, #c7d3ddff, #77b6eaff, #37393aff);
$gradient-bottom-right: linear-gradient(135deg, #e8eef2ff, #d6c9c9ff, #c7d3ddff, #77b6eaff, #37393aff);
$gradient-top-left: linear-gradient(225deg, #e8eef2ff, #d6c9c9ff, #c7d3ddff, #77b6eaff, #37393aff);
$gradient-bottom-left: linear-gradient(315deg, #e8eef2ff, #d6c9c9ff, #c7d3ddff, #77b6eaff, #37393aff);
$gradient-radial: radial-gradient(#e8eef2ff, #d6c9c9ff, #c7d3ddff, #77b6eaff, #37393aff);
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
