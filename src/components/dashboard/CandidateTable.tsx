import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Filter, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Candidate, statusColors, statusLabels } from '@/lib/data';

interface CandidateTableProps {
  candidates: Candidate[];
  onFilter?: (filtered: Candidate[]) => void;
}

const CandidateTable = ({ candidates, onFilter }: CandidateTableProps) => {
  const [sortBy, setSortBy] = useState<keyof Candidate>('finalScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSort = (column: keyof Candidate) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };
  
  const filteredCandidates = candidates.filter(candidate => 
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });
  
  const SortIndicator = ({ column }: { column: keyof Candidate }) => {
    if (sortBy !== column) return null;
    
    return sortOrder === 'asc' 
      ? <ChevronUp className="h-4 w-4 ml-1" /> 
      : <ChevronDown className="h-4 w-4 ml-1" />;
  };
  
  return (
    <div className="glass-card overflow-hidden animate-fade-in">
      <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative">
          <Input
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4 pr-10 py-2 w-full sm:w-80"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <span className="mr-2">Sort by</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              <DropdownMenuItem onClick={() => handleSort('name')}>Name</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('role')}>Role</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('status')}>Status</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('experience')}>Experience</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('finalScore')}>Final Score</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/30">
              <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button 
                  onClick={() => handleSort('name')}
                  className="flex items-center focus:outline-none"
                >
                  Candidate
                  <SortIndicator column="name" />
                </button>
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button 
                  onClick={() => handleSort('role')}
                  className="flex items-center focus:outline-none"
                >
                  Role
                  <SortIndicator column="role" />
                </button>
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button 
                  onClick={() => handleSort('status')}
                  className="flex items-center focus:outline-none"
                >
                  Status
                  <SortIndicator column="status" />
                </button>
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button 
                  onClick={() => handleSort('experience')}
                  className="flex items-center focus:outline-none"
                >
                  Exp
                  <SortIndicator column="experience" />
                </button>
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button 
                  onClick={() => handleSort('finalScore')}
                  className="flex items-center focus:outline-none"
                >
                  Score
                  <SortIndicator column="finalScore" />
                </button>
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {sortedCandidates.map((candidate) => (
              <tr 
                key={candidate.id} 
                className="hover:bg-muted/20 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link to={`/candidates/${candidate.id}`} className="group">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium group-hover:text-primary transition-colors">
                          {candidate.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Applied {new Date(candidate.applied).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">{candidate.role}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                    statusColors[candidate.status]
                  )}>
                    {statusLabels[candidate.status]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {candidate.experience} yrs
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-muted h-2 rounded-full mr-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${candidate.score}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{candidate.score}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Link to={`/candidates/${candidate.id}`} className="w-full">
                          View Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Send Message</DropdownMenuItem>
                      <DropdownMenuItem>Move to Next Stage</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Reject</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {sortedCandidates.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-muted-foreground">No candidates found</p>
        </div>
      )}
      
      <div className="px-6 py-4 border-t border-border/50 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{sortedCandidates.length}</span> of{' '}
          <span className="font-medium">{candidates.length}</span> candidates
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CandidateTable;
