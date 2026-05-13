import React, { useState, useRef, useCallback, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Search, Download, ChevronDown } from "lucide-react";
import { useApp } from "../../context/AppContext";
import StatusBadge from "./StatusBadge";
import CandidateDetailDrawer from "./CandidateDetailDrawer";
import { useSearchParams } from "react-router-dom";

// Score cell renderer
const ScoreCellRenderer = ({ value }) => {
  const color = value >= 75 ? "#22C55E" : value >= 50 ? "#F59E0B" : "#EF4444";
  const bgColor = value >= 75 ? "bg-green-500" : value >= 50 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2 h-full">
      <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${bgColor} score-fill rounded-full`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="font-mono text-xs font-semibold w-10 text-right" style={{ color }}>
        {value}/100
      </span>
    </div>
  );
};

const StatusCellRenderer = ({ value }) => <StatusBadge status={value} />;

const ActionCellRenderer = ({ data, context }) => (
  <button
    onClick={() => context.onViewDetails(data)}
    className="px-3 py-1 text-xs font-medium bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-500/20 transition-colors"
  >
    View Details
  </button>
);

export default function CandidateTable() {
  const { candidates, isDark } = useApp();
  const [filter, setFilter] = useState("All");
  const [quickFilter, setQuickFilter] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const gridRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const filteredData = useMemo(() => {
    if (filter === "All") return candidates;
    return candidates.filter((c) => c.status === filter);
  }, [candidates, filter]);

  const columnDefs = useMemo(() => [
    {
      headerName: "#",
      valueGetter: "node.rowIndex + 1",
      width: 60,
      sortable: false,
      filter: false,
      cellClass: "font-mono text-slate-500 text-xs",
      hide: false,
    },
    {
      headerName: "Candidate Name",
      field: "name",
      flex: 1.5,
      minWidth: 150,
      cellClass: "font-medium text-slate-200 text-sm",
    },
    {
      headerName: "Applied Role",
      field: "role",
      flex: 1,
      minWidth: 120,
      cellClass: "text-slate-400 text-sm",
      hide: false,
    },
    {
      headerName: "Screening Score",
      field: "score",
      flex: 1.5,
      minWidth: 180,
      cellRenderer: ScoreCellRenderer,
      sortable: true,
    },
    {
      headerName: "Status",
      field: "status",
      width: 130,
      cellRenderer: StatusCellRenderer,
      sortable: true,
    },
    {
      headerName: "Action",
      field: "action",
      width: 130,
      sortable: false,
      filter: false,
      cellRenderer: ActionCellRenderer,
    },
  ], []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
    filter: true,
  }), []);

  const onViewDetails = useCallback((candidate) => {
    setSelectedCandidate(candidate);
    setSearchParams({ candidate: candidate.id });
  }, [setSearchParams]);

  const handleExport = () => {
    gridRef.current?.api?.exportDataAsCsv({ fileName: "hireiq-candidates.csv" });
  };

  const filterBtns = ["All", "Selected", "Rejected"];

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name or role..."
            value={quickFilter}
            onChange={(e) => {
              setQuickFilter(e.target.value);
              gridRef.current?.api?.setQuickFilter(e.target.value);
            }}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-800/60 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex gap-2">
          {filterBtns.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                filter === f
                  ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/30"
                  : "text-slate-400 border-slate-700 hover:border-slate-600"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 border border-slate-700 rounded-xl hover:border-slate-600 hover:text-slate-200 transition-colors"
        >
          <Download size={13} />
          Export CSV
        </button>
      </div>
      <div
        className={`${isDark ? "ag-theme-alpine-dark" : "ag-theme-alpine"} w-full rounded-xl overflow-hidden border border-slate-800`}
        style={{ height: "500px" }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={filteredData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection="single"
          animateRows={true}
          pagination={true}
          paginationPageSize={15}
          domLayout="normal"
          context={{ onViewDetails }}
          rowClass="cursor-pointer"
          suppressCellFocus={false}
          aria-label="Candidates table"
        />
      </div>
      <p className="text-xs text-slate-500 mt-2 font-mono">
        Showing {filteredData.length} candidates
      </p>
      {selectedCandidate && (
        <CandidateDetailDrawer
          candidate={selectedCandidate}
          onClose={() => {
            setSelectedCandidate(null);
            setSearchParams({});
          }}
        />
      )}
    </div>
  );
}
