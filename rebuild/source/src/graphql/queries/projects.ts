import { gql } from '@apollo/client';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  demoUrl?: string;
  replUrl?: string;
  author?: User;
  category?: Category;
  isFeatured: boolean;
  viewsCount: number;
  likesCount: number;
  createdAt: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  totalPages: number;
}

export interface ProjectConnection {
  projects: Project[];
  pageInfo: PageInfo;
  totalCount: number;
}

export interface GetProjectsData {
  projects: ProjectConnection;
}

export interface GetProjectsVariables {
  featured?: boolean;
  category?: string;
  page?: number;
  perPage?: number;
}

export interface GetProjectData {
  project: Project | null;
}

export interface GetProjectVariables {
  slug: string;
}

export interface GetFeaturedProjectsData {
  featuredProjects: Project[];
}

export interface GetFeaturedProjectsVariables {
  perPage?: number;
}

export const GET_PROJECTS = gql`
  query GetProjects(
    $featured: Boolean
    $category: String
    $page: Int
    $perPage: Int
  ) {
    projects(
      featured: $featured
      category: $category
      page: $page
      perPage: $perPage
    ) {
      projects {
        id
        title
        slug
        description
        imageUrl
        demoUrl
        replUrl
        isFeatured
        viewsCount
        likesCount
        createdAt
        author {
          id
          name
          avatarUrl
        }
        category {
          id
          name
          slug
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        currentPage
        totalPages
      }
      totalCount
    }
  }
`;

export const GET_PROJECT = gql`
  query GetProject($slug: String!) {
    project(slug: $slug) {
      id
      title
      slug
      description
      imageUrl
      demoUrl
      replUrl
      isFeatured
      viewsCount
      likesCount
      createdAt
      author {
        id
        name
        email
        avatarUrl
      }
      category {
        id
        name
        slug
        description
      }
    }
  }
`;

export const GET_FEATURED_PROJECTS = gql`
  query GetFeaturedProjects($perPage: Int) {
    featuredProjects(perPage: $perPage) {
      id
      title
      slug
      description
      imageUrl
      demoUrl
      replUrl
      isFeatured
      viewsCount
      likesCount
      createdAt
      author {
        id
        name
        avatarUrl
      }
      category {
        id
        name
        slug
      }
    }
  }
`;
