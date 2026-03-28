import SearchInput from '../../../shared/components/ui/SearchInput';

interface PatientFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function PatientFilters({ search, onSearchChange }: PatientFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder="Buscar por nombre..."
      />
    </div>
  );
}
