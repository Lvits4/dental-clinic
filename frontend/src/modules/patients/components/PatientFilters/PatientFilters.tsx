import SearchInput from '../../../../common/components/SearchInput/SearchInput';

interface PatientFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
}

const PatientFilters = ({ search, onSearchChange }: PatientFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder="Buscar por nombre..."
      />
    </div>
  );
};

export default PatientFilters;
