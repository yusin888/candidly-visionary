
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Pencil, Plus, Save, Trash, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip, Legend } from 'recharts';
import { useToast } from '@/hooks/use-toast';

// Form validation schema
const jobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  department: z.string().min(1, 'Department is required'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().min(1, 'Description is required'),
  usesMultipleHR: z.boolean().default(false),
  criteria: z.array(
    z.object({
      name: z.string().min(1, 'Criterion name is required'),
      weight: z.number().min(0).max(1),
      description: z.string().optional(),
    })
  ).min(1, 'At least one criterion is required'),
});

type JobFormValues = z.infer<typeof jobSchema>;

// Sample colors for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6B6B', '#4DB380', '#B266FF'];

const JobForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = id !== 'new';

  // Form methods
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: '',
      department: '',
      location: '',
      description: '',
      usesMultipleHR: false,
      criteria: [
        { name: '', weight: 0.5, description: '' },
      ],
    },
  });

  const { control, reset, watch, setValue, formState: { isValid, isDirty } } = form;
  const watchedCriteria = watch('criteria');
  
  // Calculate the sum of weights
  const totalWeight = watchedCriteria.reduce((acc, criterion) => acc + criterion.weight, 0);
  const isWeightValid = Math.abs(totalWeight - 1) < 0.01; // Allow small rounding errors

  // Format criteria data for the pie chart
  const chartData = watchedCriteria.map((criterion, index) => ({
    name: criterion.name || `Criterion ${index + 1}`,
    value: criterion.weight,
  }));

  // Mock function to load job data (would be replaced with API call)
  useEffect(() => {
    if (isEditMode) {
      // This would be replaced with an API call to get the job details
      const mockJob = {
        title: 'Senior Frontend Developer',
        department: 'Engineering',
        location: 'Remote',
        description: 'We are looking for an experienced Frontend Developer to join our team.',
        usesMultipleHR: true,
        criteria: [
          { name: 'React Experience', weight: 0.4, description: 'Experience with React and related ecosystem' },
          { name: 'UI/UX Skills', weight: 0.3, description: 'Ability to implement beautiful and functional interfaces' },
          { name: 'Problem Solving', weight: 0.3, description: 'Ability to solve complex technical problems' },
        ],
      };
      
      reset(mockJob);
    }
  }, [isEditMode, reset, id]);

  // Add a new criterion
  const addCriterion = () => {
    const currentCriteria = form.getValues('criteria');
    setValue('criteria', [...currentCriteria, { name: '', weight: 0.1, description: '' }], { 
      shouldDirty: true, 
      shouldValidate: true 
    });
  };

  // Remove a criterion
  const removeCriterion = (index: number) => {
    const currentCriteria = form.getValues('criteria');
    setValue('criteria', currentCriteria.filter((_, i) => i !== index), { 
      shouldDirty: true, 
      shouldValidate: true 
    });
  };

  // Auto-normalize weights to sum to 1
  const normalizeWeights = () => {
    if (watchedCriteria.length === 0) return;
    
    const sum = watchedCriteria.reduce((acc, criterion) => acc + criterion.weight, 0);
    if (sum === 0) {
      const equalWeight = 1 / watchedCriteria.length;
      const normalizedCriteria = watchedCriteria.map(c => ({ ...c, weight: equalWeight }));
      setValue('criteria', normalizedCriteria, { shouldDirty: true, shouldValidate: true });
    } else {
      const normalizedCriteria = watchedCriteria.map(c => ({
        ...c,
        weight: Number((c.weight / sum).toFixed(2)),
      }));
      setValue('criteria', normalizedCriteria, { shouldDirty: true, shouldValidate: true });
    }
  };

  // Form submission handler
  const onSubmit = (data: JobFormValues) => {
    // This would be replaced with an API call to create or update the job
    console.log(data);
    
    toast({
      title: isEditMode ? "Job updated" : "Job created",
      description: `The job '${data.title}' has been ${isEditMode ? 'updated' : 'created'} successfully.`,
    });
    
    navigate('/jobs');
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>{isEditMode ? 'Edit Job' : 'Create New Job'}</CardTitle>
          <Button variant="outline" size="sm" onClick={() => navigate('/jobs')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Job Details */}
                <div className="space-y-6">
                  <FormField
                    control={control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title*</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Senior Frontend Developer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department*</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Engineering" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location*</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Remote, San Francisco, CA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="usesMultipleHR"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Multiple HR Evaluators</FormLabel>
                          <FormDescription>
                            Enable if multiple HR professionals will evaluate candidates
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-6">
                  <FormField
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Description*</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the job responsibilities, requirements, and qualifications..."
                            className="min-h-[150px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Weight Distribution Chart */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-4">Weight Distribution</h3>
                    <div className="h-[200px]">
                      {watchedCriteria.length > 0 && watchedCriteria.some(c => c.name && c.weight > 0) ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={chartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              fill="#8884d8"
                              paddingAngle={2}
                              dataKey="value"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${(Number(value) * 100).toFixed(0)}%`} />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground">
                          Add criteria to see weight distribution
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Criteria Section */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Evaluation Criteria</h3>
                  <Button 
                    type="button" 
                    size="sm" 
                    onClick={addCriterion}
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Criterion
                  </Button>
                </div>

                {!isWeightValid && (
                  <Alert>
                    <AlertDescription className="flex justify-between items-center">
                      <span>Total weight: <strong>{totalWeight.toFixed(2)}</strong> (should equal 1.00)</span>
                      <Button 
                        type="button"
                        variant="secondary"
                        size="sm" 
                        onClick={normalizeWeights}
                      >
                        Auto-normalize
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  {watchedCriteria.map((criterion, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6 pb-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <FormField
                            control={control}
                            name={`criteria.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{`Criterion ${index + 1} Name*`}</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Technical Skills" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={control}
                            name={`criteria.${index}.weight`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Weight* ({(field.value * 100).toFixed(0)}%)
                                </FormLabel>
                                <FormControl>
                                  <div className="flex items-center space-x-4">
                                    <Slider
                                      min={0}
                                      max={1}
                                      step={0.01}
                                      value={[field.value]}
                                      onValueChange={([value]) => field.onChange(value)}
                                    />
                                    <span className="w-12 text-center">{(field.value * 100).toFixed(0)}%</span>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={control}
                            name={`criteria.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex justify-between items-center">
                                  <FormLabel>Description (Optional)</FormLabel>
                                  {watchedCriteria.length > 1 && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeCriterion(index)}
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                                <FormControl>
                                  <Input placeholder="Brief description of this criterion" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between border-t p-6">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => navigate('/jobs')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={!isValid || !isDirty || !isWeightValid}
              >
                <Save className="h-4 w-4 mr-2" />
                {isEditMode ? 'Update Job' : 'Create Job'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default JobForm;
