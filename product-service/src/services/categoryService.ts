import axios from 'axios';

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

class CategoryServiceClient {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.CATEGORY_SERVICE_URL || 'http://localhost:4002/graphql';
  }

  async getCategoryById(id: string): Promise<Category | null> {
    const query = `
      query GetCategory($id: ID!) {
        category(id: $id) {
          id
          name
          description
          createdAt
          updatedAt
        }
      }
    `;

    try {
      const response = await axios.post(this.baseURL, {
        query,
        variables: { id }
      });

      if (response.data.errors) {
        console.error('GraphQL errors:', response.data.errors);
        return null;
      }

      return response.data.data.category;
    } catch (error) {
      console.error('Error fetching category:', error);
      return null;
    }
  }

  async getCategories(): Promise<Category[]> {
    const query = `
      query GetCategories {
        categories {
          id
          name
          description
          createdAt
          updatedAt
        }
      }
    `;

    try {
      const response = await axios.post(this.baseURL, {
        query
      });

      if (response.data.errors) {
        console.error('GraphQL errors:', response.data.errors);
        return [];
      }

      return response.data.data.categories || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  async getCategoriesByIds(ids: string[]): Promise<Category[]> {
    const query = `
      query GetCategoriesByIds($ids: [ID!]!) {
        categoriesByIds(ids: $ids) {
          id
          name
          description
          createdAt
          updatedAt
        }
      }
    `;

    try {
      const response = await axios.post(this.baseURL, {
        query,
        variables: { ids }
      });

      if (response.data.errors) {
        console.error('GraphQL errors:', response.data.errors);
        return [];
      }

      return response.data.data.categoriesByIds || [];
    } catch (error) {
      console.error('Error fetching categories by IDs:', error);
      return [];
    }
  }
}

export default CategoryServiceClient;
