"use client";

import { useState } from "react";

export function DoctorNoteForm({ data, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(
    data || {
      note_type: "Assessment",
      notes: "",
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Note Type
        </label>
        <select
          value={formData.note_type}
          onChange={(e) =>
            setFormData({ ...formData, note_type: e.target.value })
          }
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        >
          <option>Assessment</option>
          <option>Progress</option>
          <option>Treatment Plan</option>
          <option>Follow-up</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          rows={5}
          required
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </form>
  );
}
