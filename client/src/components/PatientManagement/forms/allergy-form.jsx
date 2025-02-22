"use client";

import { useState } from "react";

export function AllergyForm({ data, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(
    data || {
      allergen: "",
      severity: "Mild",
      reaction: "",
      diagnosed_date: "",
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
          Allergen
        </label>
        <input
          type="text"
          value={formData.allergen}
          onChange={(e) =>
            setFormData({ ...formData, allergen: e.target.value })
          }
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Severity
        </label>
        <select
          value={formData.severity}
          onChange={(e) =>
            setFormData({ ...formData, severity: e.target.value })
          }
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        >
          <option>Mild</option>
          <option>Moderate</option>
          <option>Severe</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Reaction
        </label>
        <input
          type="text"
          value={formData.reaction}
          onChange={(e) =>
            setFormData({ ...formData, reaction: e.target.value })
          }
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Diagnosed Date
        </label>
        <input
          type="date"
          value={formData.diagnosed_date?.split("T")[0]}
          onChange={(e) =>
            setFormData({ ...formData, diagnosed_date: e.target.value })
          }
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
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
