export default function Dashboard() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold">Total Users</h2>
          <p className="text-4xl font-bold">100</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold">Total Expenses</h2>
          <p className="text-4xl font-bold">$1000</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold">Total Income</h2>
          <p className="text-4xl font-bold">$500</p>
        </div>
      </div>
    </div>
  );
}