
import { Job } from '@/types/job';

// Base API URL - would come from environment variables in a real app
const API_URL = '/api/jobs';

// Get all jobs
export const getAllJobs = async (): Promise<Job[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

// Get a specific job
export const getJob = async (id: string): Promise<Job> => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch job with ID: ${id}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching job ${id}:`, error);
    throw error;
  }
};

// Create a new job
export const createJob = async (job: Omit<Job, 'id'>): Promise<Job> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(job),
    });
    if (!response.ok) {
      throw new Error('Failed to create job');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

// Update an existing job
export const updateJob = async (id: string, job: Omit<Job, 'id'>): Promise<Job> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(job),
    });
    if (!response.ok) {
      throw new Error(`Failed to update job with ID: ${id}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating job ${id}:`, error);
    throw error;
  }
};

// Delete a job
export const deleteJob = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete job with ID: ${id}`);
    }
  } catch (error) {
    console.error(`Error deleting job ${id}:`, error);
    throw error;
  }
};

// Update job weights
export const refineWeights = async (id: string, hrWeights: Record<string, number>[]): Promise<Job> => {
  try {
    const response = await fetch(`${API_URL}/${id}/refine-weights`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ hrWeights }),
    });
    if (!response.ok) {
      throw new Error(`Failed to refine weights for job with ID: ${id}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error refining weights for job ${id}:`, error);
    throw error;
  }
};

// Finalize job weights
export const finalizeWeights = async (id: string, weights: Record<string, number>): Promise<Job> => {
  try {
    const response = await fetch(`${API_URL}/${id}/finalize-weights`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ weights }),
    });
    if (!response.ok) {
      throw new Error(`Failed to finalize weights for job with ID: ${id}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error finalizing weights for job ${id}:`, error);
    throw error;
  }
};
