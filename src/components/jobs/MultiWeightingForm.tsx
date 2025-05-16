
import { useState } from 'react';
import { Evaluator, Job } from '@/types/job';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Save, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MultiWeightingFormProps {
  job: Job;
  onSave: (finalWeights: Record<string, number>) => void;
}

// Mock evaluator data (would come from API)
const mockEvaluators: Evaluator[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@candidai.com',
    weights: {
      'React Experience': 0.5,
      'UI/UX Skills': 0.3,
      'Problem Solving': 0.2,
    },
    submitted: true,
    submittedAt: new Date(2023, 6, 15),
  },
  {
    id: '2',
    name: 'Alice Johnson',
    email: 'alice.johnson@candidai.com',
    weights: {
      'React Experience': 0.4,
      'UI/UX Skills': 0.4,
      'Problem Solving': 0.2,
    },
    submitted: true,
    submittedAt: new Date(2023, 6, 16),
  },
];

const MultiWeightingForm = ({ job, onSave }: MultiWeightingFormProps) => {
  const [evaluators, setEvaluators] = useState<Evaluator[]>(mockEvaluators);
  const [newEvaluator, setNewEvaluator] = useState({ name: '', email: '' });
  const { toast } = useToast();

  // Calculate aggregated weights
  const aggregatedWeights = job.criteria.reduce((acc, criterion) => {
    // Get all weights for this criterion from all evaluators
    const weights = evaluators
      .filter(e => e.submitted)
      .map(e => e.weights[criterion.name] || 0);
    
    // Calculate average if there are any submissions
    const average = weights.length > 0
      ? weights.reduce((sum, w) => sum + w, 0) / weights.length
      : criterion.weight;
    
    acc[criterion.name] = parseFloat(average.toFixed(2));
    return acc;
  }, {} as Record<string, number>);

  // Check if weights sum to 1
  const totalWeight = Object.values(aggregatedWeights).reduce((sum, w) => sum + w, 0);
  const isWeightValid = Math.abs(totalWeight - 1) < 0.01;

  // Auto-normalize the aggregated weights
  const normalizeWeights = () => {
    const sum = Object.values(aggregatedWeights).reduce((sum, w) => sum + w, 0);
    if (sum === 0) return aggregatedWeights;
    
    const normalized = Object.entries(aggregatedWeights).reduce((acc, [name, weight]) => {
      acc[name] = parseFloat((weight / sum).toFixed(2));
      return acc;
    }, {} as Record<string, number>);
    
    return normalized;
  };

  // Add a new evaluator
  const handleAddEvaluator = () => {
    if (!newEvaluator.name || !newEvaluator.email) return;
    
    // Initialize weights with equal distribution
    const initialWeights = job.criteria.reduce((acc, criterion) => {
      acc[criterion.name] = 1 / job.criteria.length;
      return acc;
    }, {} as Record<string, number>);
    
    const newEvaluatorEntry: Evaluator = {
      id: `new-${Date.now()}`,
      name: newEvaluator.name,
      email: newEvaluator.email,
      weights: initialWeights,
      submitted: false,
    };
    
    setEvaluators([...evaluators, newEvaluatorEntry]);
    setNewEvaluator({ name: '', email: '' });
    
    toast({
      title: "Evaluator added",
      description: `${newEvaluator.name} has been added as an evaluator.`,
    });
  };

  // Send invitation to evaluator
  const sendInvitation = (evaluator: Evaluator) => {
    // This would be replaced with an API call to send the invitation
    toast({
      title: "Invitation sent",
      description: `Invitation sent to ${evaluator.email}.`,
    });
  };

  // Save final weights
  const handleSaveFinalWeights = () => {
    // Normalize weights before saving if needed
    const finalWeights = isWeightValid ? aggregatedWeights : normalizeWeights();
    onSave(finalWeights);
    
    toast({
      title: "Weights finalized",
      description: "The final weights have been saved.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Multi-HR Weighting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Add Evaluator</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Name"
                value={newEvaluator.name}
                onChange={(e) => setNewEvaluator({ ...newEvaluator, name: e.target.value })}
              />
              <Input
                placeholder="Email"
                value={newEvaluator.email}
                onChange={(e) => setNewEvaluator({ ...newEvaluator, email: e.target.value })}
              />
              <Button onClick={handleAddEvaluator} disabled={!newEvaluator.name || !newEvaluator.email}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Evaluators</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evaluators.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      No evaluators added yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  evaluators.map((evaluator) => (
                    <TableRow key={evaluator.id}>
                      <TableCell>{evaluator.name}</TableCell>
                      <TableCell>{evaluator.email}</TableCell>
                      <TableCell>
                        {evaluator.submitted ? (
                          <span className="text-green-500">
                            Submitted {evaluator.submittedAt?.toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-amber-500">Pending</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {!evaluator.submitted && (
                          <Button size="sm" variant="ghost" onClick={() => sendInvitation(evaluator)}>
                            <Mail className="h-4 w-4 mr-1" />
                            Send Invitation
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Aggregated Weights</h3>
            <p className="text-sm text-muted-foreground mb-4">
              The final weights are calculated by averaging all submitted evaluations.
            </p>
            
            {!isWeightValid && (
              <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded mb-4 flex justify-between items-center">
                <span>Total weight: {totalWeight.toFixed(2)} (should equal 1.00)</span>
              </div>
            )}
            
            <div className="space-y-4">
              {job.criteria.map((criterion, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{criterion.name}</span>
                    <span>{(aggregatedWeights[criterion.name] * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Slider
                        disabled
                        value={[aggregatedWeights[criterion.name] || 0]}
                        max={1}
                        step={0.01}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-6 border-t flex justify-end">
            <Button onClick={handleSaveFinalWeights}>
              <Save className="h-4 w-4 mr-2" />
              Finalize Weights
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiWeightingForm;
