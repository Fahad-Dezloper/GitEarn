"use client";

import { useState, useEffect } from "react";

type Props = {
  repositories: string[];
  labels: string[];
  filters: {
    search: string;
    repo: string;
    label: string;
    date: string;
  };
  onFilterChange: (filters: Props["filters"]) => void;
};

export default function IssueFilter({
  repositories,
  labels,
  filters,
  onFilterChange,
}: Props) {
  const handleChange = (field: string, value: string) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      {/* Search */}
      <input
        className="border px-3 py-2 rounded text-sm w-full md:w-64"
        placeholder="Search issue..."
        value={filters.search}
        onChange={(e) => handleChange("search", e.target.value)}
      />

      {/* Repository Filter */}
      <select
        className="border px-3 py-2 rounded text-sm"
        value={filters.repo}
        onChange={(e) => handleChange("repo", e.target.value)}
      >
        <option value="">All Repositories</option>
        {repositories.map((repo) => (
          <option key={repo} value={repo}>
            {repo}
          </option>
        ))}
      </select>

      {/* Label Filter */}
      <select
        className="border px-3 py-2 rounded text-sm"
        value={filters.label}
        onChange={(e) => handleChange("label", e.target.value)}
      >
        <option value="">All Labels</option>
        {labels.map((label) => (
          <option key={label} value={label}>
            {label}
          </option>
        ))}
      </select>

      {/* Date Filter */}
      <input
        type="date"
        className="border px-3 py-2 rounded text-sm"
        value={filters.date}
        onChange={(e) => handleChange("date", e.target.value)}
      />
    </div>
  );
}
