interface FrameProps {
  data: {
    address: string;
    poolBalance: string;
  } | null;
}

export function YourExistingFrameComponent({ data }: FrameProps) {
  // Modify your existing component to use the passed data
  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Your existing Frame UI */}
      {/* Use data.address and data.poolBalance where needed */}
    </div>
  );
} 