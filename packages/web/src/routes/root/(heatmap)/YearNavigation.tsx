type YearNavigationProps = {
  selectedYear: number
  minYear: number
  maxYear: number
  onYearChange: (year: number) => void
}

export function YearNavigation({
  selectedYear,
  minYear,
  maxYear,
  onYearChange,
}: YearNavigationProps) {
  const canGoBack = selectedYear > minYear
  const canGoForward = selectedYear < maxYear

  return (
    <div className='inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-900 px-2 py-1'>
      <button
        onClick={() => onYearChange(selectedYear - 1)}
        disabled={!canGoBack}
        className={`rounded p-1 transition-colors ${
          canGoBack
            ? 'cursor-pointer text-gray-400 hover:bg-gray-800 hover:text-white'
            : 'cursor-not-allowed text-gray-600'
        }`}
        aria-label='Previous year'
      >
        <svg
          className='h-4 w-4'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M15 19l-7-7 7-7'
          />
        </svg>
      </button>

      <div className='min-w-max px-2 text-sm font-semibold text-white'>
        {selectedYear}
      </div>

      <button
        onClick={() => onYearChange(selectedYear + 1)}
        disabled={!canGoForward}
        className={`rounded p-1 transition-colors ${
          canGoForward
            ? 'cursor-pointer text-gray-400 hover:bg-gray-800 hover:text-white'
            : 'cursor-not-allowed text-gray-600'
        }`}
        aria-label='Next year'
      >
        <svg
          className='h-4 w-4'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 5l7 7-7 7'
          />
        </svg>
      </button>
    </div>
  )
}
