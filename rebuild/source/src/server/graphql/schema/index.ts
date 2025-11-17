import { readFileSync } from 'fs';
import { join } from 'path';

const loadSchemaFile = (filename: string): string => {
  return readFileSync(join(__dirname, filename), 'utf-8');
};

const commonSchema = loadSchemaFile('common.graphql');
const userSchema = loadSchemaFile('user.graphql');
const categorySchema = loadSchemaFile('category.graphql');
const projectSchema = loadSchemaFile('project.graphql');
const formSchema = loadSchemaFile('form.graphql');

export const typeDefs = `
${commonSchema}
${userSchema}
${categorySchema}
${projectSchema}
${formSchema}
`;

export default typeDefs;
