"use client";

import { useState } from "react";

export function VitalsForm({ data, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(
    data || {
      blood_pressure: "",
      heart_rate: "",
      temperature: "",
      respiratory_rate: "",
      oxygen_saturation: "",
      weight: "",
      height: "",
      bmi: "",
      notes: "",
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Blood Pressure
          </label>
          <input
            type="text"
            value={formData.blood_pressure}
            onChange={(e) =>
              setFormData({ ...formData, blood_pressure: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="120/80"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Heart Rate
          </label>
          <input
            type="number"
            value={formData.heart_rate}
            onChange={(e) =>
              setFormData({ ...formData, heart_rate: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Temperature (°C)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.temperature}
            onChange={(e) =>
              setFormData({ ...formData, temperature: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Respiratory Rate
          </label>
          <input
            type="number"
            value={formData.respiratory_rate}
            onChange={(e) =>
              setFormData({ ...formData, respiratory_rate: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            O2 Saturation (%)
          </label>
          <input
            type="number"
            value={formData.oxygen_saturation}
            onChange={(e) =>
              setFormData({ ...formData, oxygen_saturation: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Weight (kg)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.weight}
            onChange={(e) =>
              setFormData({ ...formData, weight: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Height (cm)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.height}
            onChange={(e) =>
              setFormData({ ...formData, height: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          rows={3}
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
