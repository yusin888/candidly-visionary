
import Header from '@/components/layout/Header';
import MainLayout from '@/components/layout/MainLayout';
import CandidateTable from '@/components/dashboard/CandidateTable';
import { candidates } from '@/lib/data';

const CandidatePool = () => {
  return (
    <MainLayout>
      <Header 
        title="Candidate Pool" 
        subtitle="View and manage all candidates in the recruitment pipeline." 
      />
      
      <CandidateTable candidates={candidates} />
    </MainLayout>
  );
};

export default CandidatePool;
