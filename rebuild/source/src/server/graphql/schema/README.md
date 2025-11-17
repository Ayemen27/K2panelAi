# GraphQL Schema

## Structure

This directory contains all GraphQL schema definitions split by domain:

### Schema Files

1. **common.graphql**
   - Shared types used across all domains
   - `PageInfo` - Pagination metadata

2. **user.graphql**
   - User type and authentication
   - Queries: `me`
   - Mutations: `signup`, `login`

3. **category.graphql**
   - Category types
   - Queries: `categories`, `category(slug)`

4. **project.graphql**
   - Project types and operations
   - Queries: `projects`, `project(slug)`, `featuredProjects`
   - Mutations: `createProject`

5. **form.graphql**
   - Form submission
   - Mutations: `submitForm`

### Usage

The `index.ts` file combines all schema files into a single `typeDefs` string:

```typescript
import { typeDefs } from './schema';

// typeDefs contains all schemas combined
```

## Schema Design Principles

1. **Domain Separation**: Each domain has its own `.graphql` file
2. **REST Alignment**: All types match REST API responses (with field name transformations)
3. **Type Safety**: All fields are strongly typed
4. **Documentation**: Schema files include comments explaining each type
5. **GraphQL Conventions**: Using camelCase for field names (GraphQL best practice)

### Field Name Transformations

GraphQL follows camelCase convention while REST uses snake_case:

| GraphQL (camelCase) | REST (snake_case) | Resolver Transforms |
|---------------------|-------------------|---------------------|
| createdAt | created_at | ✅ Yes |
| viewsCount | views_count | ✅ Yes |
| likesCount | likes_count | ✅ Yes |
| imageUrl | image_url | ✅ Yes |
| demoUrl | demo_url | ✅ Yes |
| replUrl | repl_url | ✅ Yes |
| isFeatured | is_featured | ✅ Yes |
| isPublished | is_published | ✅ Yes |
| profileImageUrl | profile_image_url | ✅ Yes |
| isActive | is_active | ✅ Yes |
| formType | form_type | ✅ Yes |
| extraData | extra_data | ✅ Yes |

Resolvers will handle these transformations automatically using a mapping function.

## REST → GraphQL Mapping

All GraphQL operations are backed by existing Flask REST endpoints:

- `projects` → `GET /api/projects`
- `project(slug)` → `GET /api/projects/:slug`
- `categories` → `GET /api/categories`
- `me` → `GET /auth/me`
- `signup` → `POST /auth/signup`
- `login` → `POST /auth/login`
- `createProject` → `POST /api/projects`
- `submitForm` → `POST /api/forms/submit`

## Next Steps

1. Create Data Sources (Task 2.3)
2. Implement Resolvers (Task 2.3)
3. Create GraphQL API route (Task 2.4)
