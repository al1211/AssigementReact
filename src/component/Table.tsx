import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';

const styleFix = `
    /* Hides the duplicate SVG icon bug in v10.6+ */
    .p-checkbox .p-checkbox-box .p-checkbox-icon + svg,
    .p-selection-column .p-checkbox + svg {
        display: none !important;
    }
    /* Standard Centering */
    .p-checkbox .p-checkbox-box .p-checkbox-icon {
        position: absolute;
        left: -50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
`;

interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

export default function Table() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [limit,setLimit]=useState<Number>(0);
  const [firstPage,setFirstPage]=useState<Number>(1);
  const [page,setPage]=useState<Number>(1);
  // Use array for selection to support multiple mode correctly
  const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);
  const [rowClick, setRowClick] = useState<boolean>(false); 
  const [total,setTotal]=useState<Number>(0);

  useEffect(() => {
    const fetchArtworks = async () => {
      const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}`);
      const data = await response.json();

      setFirstPage(((data.pagination.current_page-1)*data.pagination.limit) +1)
      setLimit(data.pagination.limit * +page);
      setTotal(data.pagination.total * +page);

      setArtworks(data.data);
    };
    fetchArtworks();
  }, []);

  return (
   
    <div className="h-screen w-full  bg-gray-50 flex flex-col">
        <style>{styleFix}</style>
     
        <div className="flex-1  bg-white shadow-md rounded-lg overflow-hidden p-8">
            <DataTable
              value={artworks}
              rows={12}
              paginator
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate={` Showing ${firstPage} to ${limit} of ${total}`}
             
              // Use "multiple" to avoid the SVG bug caused by "checkbox"
              selectionMode={rowClick ? "single" : "multiple"}
              selection={selectedArtworks}
              onSelectionChange={(e: any) => setSelectedArtworks(e.value)} 
              dataKey="id"
              
              tableStyle={{ minWidth: "50rem" }}
              className="h-full"
            >
              <Column selectionMode="multiple" headerStyle={{ width: '3rem', }} />
              <Column field="title" header="TITLE" style={{ width: '20rem',}} />
              <Column field="place_of_origin" header="PLACE OF ORIGIN" style={{ width: "10rem" }} />
              <Column field="artist_display" header="ARTIST" style={{ width: "25rem" }} body={(data) => {
                const text = data.artist_display || "";
                return text.length > 40 ? text.substring(0, 40) + "..." : text;
              }} />
              <Column field="inscriptions" header="INSCRIPTIONS" body={(data) =>
                data.inscriptions ? data.inscriptions : "N/A"
              } />
              <Column field="date_start" header="START DATE" />
              <Column field="date_end" header="END DATE" />
              <Paginator template={template3} first={first[2]} rows={rows[2]} totalRecords={120} onPageChange={(e) => onPageChange(e, 2)} className="justify-content-start" />
            </DataTable>
        </div>
    </div>
  );
}
