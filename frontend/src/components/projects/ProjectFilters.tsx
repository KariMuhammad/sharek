@@ .. @@
 'use client';

-import { useState } from 'react';
+import { useTranslations } from 'next-intl';
 import { Filter, X } from 'lucide-react';
 import Button from '@/components/ui/Button';
 import Badge from '@/components/ui/Badge';

 interface ProjectFiltersProps {
-  onFilterChange: (filters: any) => void;
+  filters: {
+    search: string;
+    status: string;
+    technologies: string[];
+    page: number;
+    limit: number;
+  };
+  onFilterChange: (filters: Partial<ProjectFiltersProps['filters']>) => void;
 }

-export default function ProjectFilters({ onFilterChange }: ProjectFiltersProps) {
-  const [selectedStatus, setSelectedStatus] = useState('');
-  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
-  const [priceRange, setPriceRange] = useState([0, 1000]);
+export default function ProjectFilters({ filters, onFilterChange }: ProjectFiltersProps) {
+  const t = useTranslations('projects.filters');

   const statusOptions = [
-    { value: '', label: 'All' },
-    { value: 'pending', label: 'Pending' },
-    { value: 'active', label: 'Active' },
-    { value: 'completed', label: 'Completed' },
+    { value: '', label: t('all') },
+    { value: 'PENDING', label: t('pending') },
+    { value: 'ACTIVE', label: t('active') },
+    { value: 'FULFILLED', label: t('fulfilled') },
   ];

   const technologyOptions = [
     'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Django',
     'Express', 'MongoDB', 'PostgreSQL', 'MySQL', 'TypeScript',
     'JavaScript', 'PHP', 'Laravel', 'Ruby', 'Rails', 'Java',
     'Spring', 'C#', '.NET', 'Go', 'Rust', 'Swift', 'Kotlin'
   ];

   const handleStatusChange = (status: string) => {
-    setSelectedStatus(status);
-    onFilterChange({ status });
+    onFilterChange({ status });
   };

   const handleTechnologyToggle = (tech: string) => {
-    const newTechnologies = selectedTechnologies.includes(tech)
-      ? selectedTechnologies.filter(t => t !== tech)
-      : [...selectedTechnologies, tech];
-    
-    setSelectedTechnologies(newTechnologies);
-    onFilterChange({ technologies: newTechnologies });
+    const newTechnologies = filters.technologies.includes(tech)
+      ? filters.technologies.filter(t => t !== tech)
+      : [...filters.technologies, tech];
+    
+    onFilterChange({ technologies: newTechnologies });
   };

   const clearFilters = () => {
-    setSelectedStatus('');
-    setSelectedTechnologies([]);
-    setPriceRange([0, 1000]);
-    onFilterChange({ status: '', technologies: [], priceRange: [0, 1000] });
+    onFilterChange({ 
+      status: '', 
+      technologies: [],
+      search: ''
+    });
   };

   return (
     <div className="bg-white rounded-xl p-6 shadow-sm">
       <div className="flex items-center justify-between mb-6">
         <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
           <Filter className="w-5 h-5" />
-          Filters
+          {t('filter')}
         </h3>
         <Button variant="ghost" size="sm" onClick={clearFilters}>
-          Clear All
+          {t('clear')}
         </Button>
       </div>

       {/* Status Filter */}
       <div className="mb-6">
-        <h4 className="text-sm font-medium text-gray-900 mb-3">Status</h4>
+        <h4 className="text-sm font-medium text-gray-900 mb-3">{t('status')}</h4>
         <div className="space-y-2">
           {statusOptions.map((option) => (
             <label key={option.value} className="flex items-center">
               <input
                 type="radio"
                 name="status"
                 value={option.value}
-                checked={selectedStatus === option.value}
+                checked={filters.status === option.value}
                 onChange={() => handleStatusChange(option.value)}
                 className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
               />
               <span className="ml-2 text-sm text-gray-700">{option.label}</span>
             </label>
           ))}
         </div>
       </div>

       {/* Technologies Filter */}
       <div className="mb-6">
-        <h4 className="text-sm font-medium text-gray-900 mb-3">Technologies</h4>
+        <h4 className="text-sm font-medium text-gray-900 mb-3">{t('technologies')}</h4>
         <div className="max-h-48 overflow-y-auto space-y-2">
           {technologyOptions.map((tech) => (
             <label key={tech} className="flex items-center">
               <input
                 type="checkbox"
-                checked={selectedTechnologies.includes(tech)}
+                checked={filters.technologies.includes(tech)}
                 onChange={() => handleTechnologyToggle(tech)}
                 className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
               />
               <span className="ml-2 text-sm text-gray-700">{tech}</span>
             </label>
           ))}
         </div>
       </div>

-      {/* Price Range Filter */}
-      <div className="mb-6">
-        <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range</h4>
-        <div className="space-y-3">
-          <div className="flex items-center gap-2">
-            <input
-              type="number"
-              placeholder="Min"
-              value={priceRange[0]}
-              onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
-              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
-            />
-            <span className="text-gray-500">-</span>
-            <input
-              type="number"
-              placeholder="Max"
-              value={priceRange[1]}
-              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
-              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
-            />
-          </div>
-        </div>
-      </div>

       {/* Active Filters */}
-      {(selectedStatus || selectedTechnologies.length > 0) && (
+      {(filters.status || filters.technologies.length > 0) && (
         <div>
           <h4 className="text-sm font-medium text-gray-900 mb-3">Active Filters</h4>
           <div className="flex flex-wrap gap-2">
-            {selectedStatus && (
+            {filters.status && (
               <Badge variant="secondary" className="flex items-center gap-1">
-                Status: {statusOptions.find(s => s.value === selectedStatus)?.label}
+                {t('status')}: {statusOptions.find(s => s.value === filters.status)?.label}
                 <button
                   onClick={() => handleStatusChange('')}
                   className="ml-1 hover:text-red-600"
                 >
                   <X className="w-3 h-3" />
                 </button>
               </Badge>
             )}
-            {selectedTechnologies.map((tech) => (
+            {filters.technologies.map((tech) => (
               <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                 {tech}
                 <button
                   onClick={() => handleTechnologyToggle(tech)}
                   className="ml-1 hover:text-red-600"
                 >
                   <X className="w-3 h-3" />
                 </button>
               </Badge>
             ))}
           </div>
         </div>
       )}
     </div>