'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface Transaction {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  date: string;
  category?: string;
  notes?: string;
}

export default function Expenses() {
  const { data: session, status } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/transactions')
        .then(res => res.json())
        .then(data => {
          setTransactions(data);
          setLoading(false);
        });
    }
  }, [status]);

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'unauthenticated') return <div>Please sign in to view expenses</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Expenses</h1>
      
      {/* Add Transaction Form */}
      <form onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const transaction = {
          type: formData.get('type'),
          amount: Number(formData.get('amount')),
          date: formData.get('date'),
          category: formData.get('category'),
          notes: formData.get('notes')
        };

        const response = await fetch('/api/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(transaction),
        });

        if (response.ok) {
          const newTransaction = await response.json();
          setTransactions([...transactions, newTransaction]);
        }
      }} className="space-y-4">
        <div>
          <label htmlFor="type" className="block mb-2">Type</label>
          <select 
            id="type" 
            name="type" 
            className="w-full p-2 border rounded"
            required
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="block mb-2">Amount</label>
          <input 
            type="number" 
            id="amount" 
            name="amount" 
            className="w-full p-2 border rounded"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label htmlFor="date" className="block mb-2">Date</label>
          <input 
            type="date" 
            id="date" 
            name="date" 
            className="w-full p-2 border rounded"
            required
            defaultValue={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div>
          <label htmlFor="category" className="block mb-2">Category</label>
          <input 
            type="text" 
            id="category" 
            name="category" 
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="notes" className="block mb-2">Notes</label>
          <textarea 
            id="notes" 
            name="notes" 
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Transaction
        </button>
      </form>

      {loading ? (
        <div>Loading transactions...</div>
      ) : (
        <div className="mt-4">
          {transactions.map(transaction => (
            <div key={transaction._id} className="p-2 border-b">
              <p>Amount: {transaction.amount}</p>
              <p>Type: {transaction.type}</p>
              <p>Date: {new Date(transaction.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}