import { GraphQLContext, requireAuth } from '../../auth/context';

export const projectResolvers = {
  Query: {
    projects: async (
      _: any,
      { featured, category, page = 1, perPage = 12 }: { featured?: boolean; category?: string; page?: number; perPage?: number },
      { dataSources }: GraphQLContext
    ) => {
      try {
        const response = await dataSources.projects.getProjects(featured, category, page, perPage);
        
        return {
          projects: response.projects,
          pageInfo: {
            hasNextPage: response.page < response.pages,
            hasPreviousPage: response.page > 1,
            startCursor: null,
            endCursor: null,
            page: response.page,
            perPage: response.perPage,
            totalPages: response.pages,
          },
          totalCount: response.total,
        };
      } catch (error) {
        console.warn('Failed to fetch projects from backend, returning empty result:', error);
        return {
          projects: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null,
            page: 1,
            perPage: perPage,
            totalPages: 0,
          },
          totalCount: 0,
        };
      }
    },

    project: async (
      _: any,
      { slug }: { slug: string },
      { dataSources }: GraphQLContext
    ) => {
      try {
        return await dataSources.projects.getProject(slug);
      } catch (error) {
        console.warn(`Failed to fetch project ${slug} from backend:`, error);
        return null;
      }
    },

    featuredProjects: async (
      _: any,
      { perPage = 6 }: { perPage?: number },
      { dataSources }: GraphQLContext
    ) => {
      try {
        const response = await dataSources.projects.getProjects(true, undefined, 1, perPage);
        return response.projects;
      } catch (error) {
        console.warn('Failed to fetch featured projects from backend, returning empty array:', error);
        return [];
      }
    },
  },

  Mutation: {
    createProject: async (
      _: any,
      { input }: { input: any },
      context: GraphQLContext
    ) => {
      const currentUser = requireAuth(context);

      return context.dataSources.projects.createProject(input, currentUser.uid);
    },
  },
};
