'use client';

import { useState, useEffect, useCallback } from 'react';
import type { TimeBlock } from '@/types';

export default function TimeBlocksPage() {
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchTimeBlocks = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/time-blocks');
    const data = await res.json();
    setTimeBlocks(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTimeBlocks();
  }, [fetchTimeBlocks]);

  const resetForm = () => {
    setName('');
    setStartTime('');
    setEndTime('');
    setEditId(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const body = { name, startTime, endTime };
    const url = editId ? `/api/time-blocks/${editId}` : '/api/time-blocks';
    const method = editId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? 'Something went wrong');
      return;
    }

    resetForm();
    await fetchTimeBlocks();
  };

  const handleEdit = (tb: TimeBlock) => {
    setEditId(tb.id);
    setName(tb.name);
    setStartTime(tb.startTime);
    setEndTime(tb.endTime);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this time block?')) return;

    const res = await fetch(`/api/time-blocks/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? 'Failed to delete');
      return;
    }
    await fetchTimeBlocks();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Time Blocks</h1>

      {/* Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {editId ? 'Edit Time Block' : 'Create Time Block'}
        </h2>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Morning"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time (HH:MM)
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time (HH:MM)
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving…' : editId ? 'Update' : 'Create'}
            </button>
            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-gray-500 text-sm">Loading…</p>
      ) : timeBlocks.length === 0 ? (
        <p className="text-gray-500 text-sm">No time blocks yet.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Start</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">End</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Created</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {timeBlocks.map((tb) => (
                <tr key={tb.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{tb.name}</td>
                  <td className="px-4 py-3 text-gray-600">{tb.startTime}</td>
                  <td className="px-4 py-3 text-gray-600">{tb.endTime}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(tb.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(tb)}
                      className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tb.id)}
                      className="px-3 py-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
