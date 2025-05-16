
export interface Criterion {
  name: string;
  weight: number;
  description?: string;
}

export interface Job {
  id?: string;
  title: string;
  description: string;
  department: string;
  location: string;
  usesMultipleHR: boolean;
  criteria: Criterion[];
  finalWeights?: Record<string, number>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Evaluator {
  id: string;
  name: string;
  email: string;
  weights: Record<string, number>;
  submitted: boolean;
  submittedAt?: Date;
}

export interface JobWithEvaluations extends Job {
  evaluators?: Evaluator[];
}
