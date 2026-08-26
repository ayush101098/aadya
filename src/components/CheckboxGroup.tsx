export function CheckboxGroup({
  name,
  options,
  selected,
  columns = "sm:grid-cols-3",
}: {
  name: string;
  options: readonly string[];
  selected: string[];
  columns?: string;
}) {
  return (
    <div className={`grid grid-cols-2 gap-x-4 gap-y-1.5 ${columns}`}>
      {options.map((option) => (
        <label key={option} className="flex items-center gap-2 text-sm text-ink-700">
          <input
            type="checkbox"
            name={name}
            value={option}
            defaultChecked={selected.includes(option)}
            className="h-4 w-4 rounded border-ink-300 text-accent-600 focus:ring-accent-300"
          />
          <span className="truncate">{option}</span>
        </label>
      ))}
    </div>
  );
}
