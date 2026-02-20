import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

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
  // Use array for selection to support multiple mode correctly
  const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);
  const [rowClick, setRowClick] = useState<boolean>(false); 

  useEffect(() => {
    const fetchArtworks = async () => {
      const response = await fetch("https://api.artic.edu/api/v1/artworks?page=1");
      const data = await response.json();
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
            //   paginator
             
              // Use "multiple" to avoid the SVG bug caused by "checkbox"
              selectionMode={rowClick ? "single" : "multiple"}
              selection={selectedArtworks}
              onSelectionChange={(e: any) => setSelectedArtworks(e.value)} 
              dataKey="id"
              // scrollable + scrollHeight="flex" allows table to fill container height
              scrollable 
              scrollHeight="flex"
              tableStyle={{ minWidth: "50rem" }}
              className="h-full"
            >
              <Column selectionMode="multiple" headerStyle={{ width: '3rem', }} />
              <Column field="title" header="Title" style={{ width: '20rem',}} />
              <Column field="place_of_origin" header="Origin" style={{ width: "10rem" }} />
              <Column field="artist_display" header="Artist" style={{ width: "25rem" }} body={(data) => {
                const text = data.artist_display || "";
                return text.length > 40 ? text.substring(0, 40) + "..." : text;
              }} />
              <Column field="inscriptions" header="INSCRIPTIONS" body={(data) =>
                data.inscriptions ? data.inscriptions : "N/A"
              } />
              <Column field="date_start" header="Start" />
              <Column field="date_end" header="End" />
            </DataTable>
        </div>
    </div>
  );
}
