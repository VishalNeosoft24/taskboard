"use client";
import { Fragment } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { XCircle, Loader2 } from "lucide-react";
import { useProjectSearch } from "../../hooks/useProjectSearch";
import { useDebounce } from "../../hooks/useDebounce";

export default function SearchableProjectSelect({
  value,
  searchText,
  onSearchTextChange,
  onChange,
  defaultProjects = [],
  placeholder = "Search projects...",
}: any) {
  const debouncedQuery = useDebounce(searchText, 400);
  const { data, isLoading } = useProjectSearch(debouncedQuery);

  const searchResults = data?.results?.projects || [];
  const projects = [...defaultProjects, ...searchResults].filter(
    (p, i, arr) => arr.findIndex((x) => x.id === p.id) === i
  );

  const filtered =
    searchText === ""
      ? projects
      : projects.filter((p: any) =>
          p.name.toLowerCase().includes(searchText.toLowerCase())
        );

  const clearSelection = () => {
    onChange("");
    onSearchTextChange("");
  };

  return (
    <div className="relative">
      <Combobox
        value={value}
        onChange={(val: string) => {
          const selected = projects.find((p) => p.id === val);
          onChange(val);
          onSearchTextChange(selected?.name || "");
        }}
      >
        <div className="relative">
          <Combobox.Input
            className="border w-full rounded-xl bg-gray-100 p-3 outline-none pr-10"
            value={searchText}
            onChange={(e) => onSearchTextChange(e.target.value)}
            placeholder={placeholder}
          />

          {value && (
            <XCircle
              size={18}
              onClick={clearSelection}
              className="absolute right-3 top-3 text-gray-500 cursor-pointer hover:text-red-500"
            />
          )}
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-150"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Combobox.Options className="absolute w-full bg-white border mt-1 rounded-xl shadow z-20 max-h-56 overflow-y-auto">
            {isLoading && (
              <div className="p-3 flex gap-2 text-gray-500">
                <Loader2 size={18} className="animate-spin" />
                Searching...
              </div>
            )}

            {!isLoading && filtered.length === 0 && (
              <div className="p-3 text-sm text-gray-500">
                No projects found
              </div>
            )}

            {filtered.map((p: any) => (
              <Combobox.Option
                key={p.id}
                value={p.id}
                className="cursor-pointer select-none p-3 hover:bg-blue-100"
              >
                {p.name}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Transition>
      </Combobox>
    </div>
  );
}


// ============================================================================================================================
// Future reference - implements a searchable dropdown for selecting projects with debounced search input and loading state.
// ============================================================================================================================

// "use client";
// import { useState, useEffect, useRef } from "react";
// import { XCircle, Loader2, ChevronDown } from "lucide-react";
// import { useProjectSearch } from "../../hooks/useProjectSearch";
// import { useDebounce } from "../../hooks/useDebounce";

// export default function SearchableProjectSelect({
//   value,
//   onChange,
//   defaultProjects = [],
//   placeholder = "Search projects...",
// }) {
//   const [query, setQuery] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   const [highlightedIndex, setHighlightedIndex] = useState(0);
//   const dropdownRef = useRef(null);
//   const inputRef = useRef(null);
  
//   const debouncedQuery = useDebounce(query, 400);
  
//   // Only search when there's actual query text
//   const { data, isLoading } = useProjectSearch(debouncedQuery);
//   const searchResults = data?.results?.projects || [];

//   // Merge + remove duplicates
//   const allProjects = [...defaultProjects, ...searchResults].filter(
//     (p, i, arr) => arr.findIndex((x) => x.id === p.id) === i
//   );

//   // Filter projects: only apply filter when typing in open dropdown
//   const filtered = isOpen && query.trim()
//     ? allProjects.filter((p) =>
//         p.name.toLowerCase().includes(query.toLowerCase())
//       )
//     : allProjects;

//   // Set display value when selection changes and dropdown is closed
//   useEffect(() => {
//     if (value && !isOpen) {
//       const selectedProject = allProjects.find((p) => p.id === value);
//       if (selectedProject) {
//         setQuery(selectedProject.name);
//       }
//     }
//   }, [value, allProjects, isOpen]);

//   // Initialize query with selected project name on mount
//   useEffect(() => {
//     if (value && defaultProjects.length > 0) {
//       const selectedProject = defaultProjects.find((p) => p.id === value);
//       if (selectedProject && !query) {
//         setQuery(selectedProject.name);
//       }
//     }
//   }, [value, defaultProjects]);

//   // Click outside handler
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//         // Restore selected project name when closing
//         if (value) {
//           const selectedProject = allProjects.find((p) => p.id === value);
//           if (selectedProject) {
//             setQuery(selectedProject.name);
//           } else {
//             setQuery("");
//           }
//         } else {
//           setQuery("");
//         }
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [value, allProjects]);

//   // Keyboard navigation
//   const handleKeyDown = (e) => {
//     if (!isOpen) {
//       if (e.key === "ArrowDown" || e.key === "Enter") {
//         setIsOpen(true);
//         e.preventDefault();
//       }
//       return;
//     }

//     switch (e.key) {
//       case "ArrowDown":
//         e.preventDefault();
//         setHighlightedIndex((prev) => 
//           prev < filtered.length - 1 ? prev + 1 : prev
//         );
//         break;
//       case "ArrowUp":
//         e.preventDefault();
//         setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
//         break;
//       case "Enter":
//         e.preventDefault();
//         if (filtered[highlightedIndex]) {
//           handleSelect(filtered[highlightedIndex]);
//         }
//         break;
//       case "Escape":
//         e.preventDefault();
//         setIsOpen(false);
//         if (value) {
//           const selectedProject = allProjects.find((p) => p.id === value);
//           if (selectedProject) {
//             setQuery(selectedProject.name);
//           }
//         } else {
//           setQuery("");
//         }
//         break;
//     }
//   };

//   const handleSelect = (project) => {
//     onChange(project.id);
//     setQuery(project.name);
//     setIsOpen(false);
//     setHighlightedIndex(0);
//   };

//   const clearSelection = (e) => {
//     e.stopPropagation();
//     onChange("");
//     setQuery("");
//     setIsOpen(false);
//     inputRef.current?.focus();
//   };

//   const getHighlightedText = (text, highlight) => {
//     if (!highlight || !highlight.trim()) return text;
    
//     const matchIndex = text.toLowerCase().indexOf(highlight.toLowerCase());
//     if (matchIndex === -1) return text;

//     const before = text.slice(0, matchIndex);
//     const match = text.slice(matchIndex, matchIndex + highlight.length);
//     const after = text.slice(matchIndex + highlight.length);

//     return (
//       <>
//         {before}
//         <span className="font-semibold text-blue-600">{match}</span>
//         {after}
//       </>
//     );
//   };

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <div className="relative w-full">
//         <input
//           ref={inputRef}
//           type="text"
//           className="border rounded-xl w-full p-3 bg-gray-100 outline-none pr-20"
//           value={query}
//           onChange={(e) => {
//             setQuery(e.target.value);
//             if (!isOpen) setIsOpen(true);
//             setHighlightedIndex(0);
//           }}
//           onFocus={() => setIsOpen(true)}
//           onClick={() => setIsOpen(true)}
//           onKeyDown={handleKeyDown}
//           placeholder={placeholder}
//         />

//         <div className="absolute right-3 top-3 flex items-center gap-1">
//           {value && (
//             <XCircle
//               size={18}
//               onClick={clearSelection}
//               className="text-gray-500 cursor-pointer hover:text-red-500 z-10"
//             />
//           )}
//           <ChevronDown
//             size={18}
//             onClick={() => setIsOpen(!isOpen)}
//             className={`text-gray-500 transition-transform cursor-pointer ${
//               isOpen ? "rotate-180" : ""
//             }`}
//           />
//         </div>
//       </div>

//       {isOpen && (
//         <div className="absolute w-full border rounded-xl bg-white mt-1 max-h-56 overflow-y-auto shadow-lg z-20">
//           {isLoading && debouncedQuery && (
//             <div className="flex items-center gap-2 text-gray-500 p-3">
//               <Loader2 className="animate-spin" size={18} /> Searching...
//             </div>
//           )}

//           {!isLoading && filtered.length === 0 && (
//             <div className="text-sm text-gray-500 p-3">
//               {query ? "No projects found" : "No projects available"}
//             </div>
//           )}

//           {filtered.map((project, index) => (
//             <div
//               key={project.id}
//               onClick={() => handleSelect(project)}
//               className={`cursor-pointer select-none p-3 flex items-center justify-between ${
//                 index === highlightedIndex
//                   ? "bg-blue-100"
//                   : "hover:bg-gray-50"
//               } ${value === project.id ? "bg-blue-50" : ""}`}
//               onMouseEnter={() => setHighlightedIndex(index)}
//             >
//               <span>{getHighlightedText(project.name, query)}</span>
//               {value === project.id && (
//                 <span className="text-blue-600 text-sm">✓</span>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }