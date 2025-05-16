
import MainLayout from '@/components/layout/MainLayout';
import Header from '@/components/layout/Header';
import JobForm from '@/components/jobs/JobForm';
import { useParams } from 'react-router-dom';

const JobDetail = () => {
  const { id } = useParams();
  const isEditMode = id !== undefined && id !== 'new';

  return (
    <MainLayout>
      <Header 
        title={isEditMode ? 'Edit Job' : 'Create Job'} 
        subtitle={isEditMode 
          ? 'Update job details and evaluation criteria' 
          : 'Define a new job posting and evaluation criteria'
        }
      />
      
      <JobForm />
    </MainLayout>
  );
};

export default JobDetail;
